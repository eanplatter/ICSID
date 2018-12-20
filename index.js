const fs = require('fs')
const data = require('./caseData')

fs.appendFileSync('./data.json', JSON.stringify(data))
