const link = process.argv[2]
const title = process.argv[3]
const distPath = process.argv[4]

const superagent = require('superagent')
const fs = require('fs')
const decode = require('base64-lite').atob
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
  getPics: async (url) => {
    const page = await reptile.fetch(url)
    const match = page.match(/var\ qTcms_S_m_murl_e\ \=\ \"([\w|\=]*)\"/img)
    const pages = decode(match[0]
        .replace('var qTcms_S_m_murl_e = "', '')
        .replace('"', '')).split('$qingtiandy$')

    for (let i = 0; i < pages.length; i++) {
      let indexName = i + 1
      if (indexName < 10) {
        indexName = `0000${indexName}`
      } else if (indexName < 100) {
        indexName = `000${indexName}`
      } else if (indexName < 1000) {
        indexName = `00${indexName}`
      } else if (indexName < 10000) {
        indexName = `0${indexName}`
      }

      const filePath = `${distPath}/${title}_${indexName}.jpg`
      if (!fs.existsSync(filePath)) {
        spawn(`wget`, [
              pages[i],
              '-O',
              filePath
            ], {
              stdio: 'inherit'
            })
      }
    }
  }
}

reptile.getPics(link)
