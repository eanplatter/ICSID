const fs = require('fs')
const request = require('tinyreq')
const cheerio = require('cheerio')
const cases = require('./cases')
let DONE = 0
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
const mainUrl =
  'https://wbwcfe.worldbank.org/icsidext/service.svc/getcasedetailsbyid/json?caseno='
const testCaseNo = 'ARB/18/44'

const fetchCase = async function(url, caseNo) {
  console.log('fetching case', caseNo)
  try {
    const caseData = await request(`${url}${caseNo}`)
    console.log(caseData)
    return caseData
  } catch (e) {
    console.log('error', e)
    return e
  }
}

const fetchCases = async function(url, caseArr) {
  try {
    const caseDataArray = await caseArr.map(c => fetchCase(url, c.caseno))
    return caseDataArray
  } catch (e) {
    console.log('error', e)
    return e
  }
}

const fetchAndSave = async function(caseArr) {
  try {
    const data = await fetchCases(mainUrl, caseArr)
    data.forEach(async d => {
      const resolved = await d
      console.log('saving', d)
      fs.appendFileSync(
        './caseData.js',
        JSON.stringify(JSON.parse(resolved)['GetCaseDetailsByIdResult']),
      )
      fs.appendFileSync('./caseData.js', '\n')
    })
  } catch (e) {
    console.log('error', e)
    return e
  }
}

module.exports = function() {
  setInterval(() => {
    fetchAndSave(cases.slice(DONE, DONE + 10))
    DONE = DONE + 10
  }, 30000)
}
