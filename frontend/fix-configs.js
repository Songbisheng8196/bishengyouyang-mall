const fs = require('fs')
const path = require('path')

function fixConfig(dir) {
  const files = []
  function walk(d) {
    for (const f of fs.readdirSync(d)) {
      const fp = path.join(d, f)
      const st = fs.statSync(fp)
      if (st.isDirectory()) walk(fp)
      else if (f.endsWith('.config.ts')) files.push(fp)
    }
  }
  walk(dir)
  
  let fixed = 0
  for (const fp of files) {
    let content = fs.readFileSync(fp, 'utf8')
    // Replace defineComponentConfig({...}) with {...}
    const newContent = content
      .replace(/export default defineComponentConfig\(/g, 'export default ')
      .replace(/export default defineAppConfig\(/g, 'export default ')
    if (newContent !== content) {
      // Remove trailing ) if it's the last non-whitespace char
      const trimmed = newContent.trimEnd()
      if (trimmed.endsWith(')')) {
        fs.writeFileSync(fp, trimmed.slice(0, -1) + '\n', 'utf8')
      } else {
        fs.writeFileSync(fp, newContent, 'utf8')
      }
      fixed++
    }
  }
  console.log(`Fixed ${fixed} config files out of ${files.length} total`)
}

fixConfig(path.join(__dirname, 'src'))
