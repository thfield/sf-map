// manipulate json files to save as csv sheets

// contains ES6 code
"use strict";
const fs = require('fs')
const json2csv = require('json2csv')
let path = '../data/'

let file = 'censustract.json'
foo(path + file)

function foo (file) {
  let inputFile = '' + file
  let outputFile = '' + file.replace('.json', '') + '.csv'

  let originalText = fs.readFileSync(inputFile, 'utf8')
  let processedText = JSON.parse(originalText)

  processedText = processedText.data.map((el)=>{
    return {tract:el.tract, population: el.population}
  })

  processedText = json2csv({data: processedText, fields: ['tract','population']})

  // output the file
  fs.writeFile(outputFile, processedText,
    function(err) {
      if (err) { return console.log(err); }
      console.log("The file was saved as", outputFile);
    }
  )
}