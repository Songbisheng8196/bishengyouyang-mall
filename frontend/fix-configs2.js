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
    // Pattern: export default { ... })  — remove trailing )
    // Also handle: export default { ... }\n)
    let newContent = content
      // Remove orphaned ) at end of object or on its own line
      .replace(/^(\s*})\s*\)\s*$/gm, '$1')
      .replace(/^(\s*})\s*\)\s*(\/\/.*)$/gm, '$1 $2')
    if (newContent !== content) {
      fs.writeFileSync(fp, newContent, 'utf8')
      fixed++
    }
  }
  console.log(`Fixed ${fixed} config files`)
}

fixConfig(path.join(__dirname, 'src'))
