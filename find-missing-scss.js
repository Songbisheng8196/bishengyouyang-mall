const fs = require('fs')
const path = require('path')

const srcDir = 'D:\\bisheng-youyang\\frontend\\src'
const pagesDir = path.join(srcDir, 'pages')

function findMissingScss(dir) {
  const missing = []
  function walk(d) {
    for (const f of fs.readdirSync(d)) {
      const fp = path.join(d, f)
      const st = fs.statSync(fp)
      if (st.isDirectory()) {
        walk(fp)
      } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        const content = fs.readFileSync(fp, 'utf8')
        if (content.includes('./index.scss')) {
          const scssPath = path.join(path.dirname(fp), 'index.scss')
          if (!fs.existsSync(scssPath)) {
            missing.push(scssPath)
          }
        }
      }
    }
  }
  walk(dir)
  return missing
}

const missing = findMissingScss(pagesDir)
console.log('Missing SCSS files:')
missing.forEach(f => console.log(f))
