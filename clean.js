const fs = require('fs')
const path = require('path')
const distPath = process.argv[2]
const spawn = require('child_process').spawn

if (fs.existsSync(distPath)) {
  const ret = fs.readdirSync(distPath)
  for (let i = 0; i < ret.length; i++) {
    const fpath = path.join(distPath, ret[i])
    const f = fs.statSync(fpath)
    if (f.size < 75000) {
      spawn('rm', [fpath], {
        stdio: 'inherit'
      })
    }
  }
}
