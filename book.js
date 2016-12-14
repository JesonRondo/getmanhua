const id = process.argv[2]

const distPath = `dist/${id}`
const superagent = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')
const spawn = require('child_process').spawn

const reptile = {
  fetch (url) {
    return new Promise((resolve, reject) => {
      superagent
        .get(url)
        .end(function (err, res) {
          if (err || !res) {
            console.log(err)
            reject(err)
          } else if (res.ok) {
            res.text
            resolve(res.text)
          }
        })
    })
  },
  getBook: async (url) => {
    const page = await reptile.fetch(url)
    const $ = cheerio.load(page)

    const as = $('#play_0 a')
    let fwIndex = 1
    for (let i = 0; i < as.length; i++) {
      let title = as[i].attribs.title.replace(/\W*/img, '')
      if (!title) {
        if (fwIndex < 10) {
          title = `fw00${fwIndex++}`
        } else if (title < 100) {
          title = `fw0${fwIndex++}`
        } else {
          title = `fw${fwIndex++}`
        }
      } else {
        title = +title
        if (title < 10) {
          title = `0000${title}`
        } else if (title < 100) {
          title = `000${title}`
        } else if (title < 1000) {
          title = `00${title}`
        } else if (title < 10000) {
          title = `0${title}`
        }
      }

      spawn(`node`, [
            '--harmony-async-await',
            'chapters.js',
            as[i].attribs.href,
            `${title}`,
            distPath
          ], {
            stdio: 'inherit'
          })
    }
  }
}

if (!fs.existsSync(distPath)) {
  spawn(`mkdir`, ['-p', distPath], {
    stdio: 'inherit'
  })
}

reptile.getBook(`http://www.dangniao.com/mh/${id}/`)
