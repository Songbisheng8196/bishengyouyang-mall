const fs = require('fs')
const c = fs.readFileSync('D:\\bisheng-youyang\\build-log.txt', 'utf8')
const re = /([A-Z]:\\[^\s]+\.scss) doesn't exist/g
const files = new Set()
let m
while ((m = re.exec(c)) !== null) {
  files.add(m[1])
}
console.log('Missing SCSS files:')
files.forEach(f => console.log(f))
