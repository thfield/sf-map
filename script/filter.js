// manipulate geojson files 

// contains ES6 code
"use strict";
const fs = require('fs')

let path = '../data/geo/'

let file = 'zipcodes.geo.json'
foo(path + file)

function foo (file) {
  let inputFile = '' + file
  let outputFile = '' + file.replace('.geo.json', '') + '-justSF.geo.json'

  let originalText = fs.readFileSync(inputFile, 'utf8')
  let processedText = JSON.parse(originalText)

  processedText.features = processedText.features.filter((el)=>{
    return el.properties.po_name === 'SAN FRANCISCO'
  })

  processedText = JSON.stringify(processedText)

  // output the file
  fs.writeFile(outputFile, processedText,
    function(err) {
      if (err) { return console.log(err); }
      console.log("The file was saved as", outputFile);
    }
  )
}