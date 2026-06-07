const fs = require('fs')
const path = require('path')

function fixAllConfigs(dir) {
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
    // Remove all occurrences of }) that are artifacts of defineComponentConfig removal
    let newContent = content.replace(/\}\)/g, '}')
    if (newContent !== content) {
      fs.writeFileSync(fp, newContent, 'utf8')
      fixed++
      console.log('Fixed:', fp)
    }
  }
  console.log(`Total fixed: ${fixed}`)
}

fixAllConfigs(path.join(__dirname, 'src'))
