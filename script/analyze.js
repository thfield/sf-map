// contains ES6 code
"use strict";
const fs = require('fs')

let path = '../data/geo/'
let data = []

fs.readdir(path,function(err, files){
  files.forEach(file => {
      if ( file.search(/topo\.json/) > 0 ){
        data.push( metadata(path + file) )
      }
  })
  data = JSON.stringify(data)
  savemetadata(data)
})

function metadata (inputFile) {
  let originalText = fs.readFileSync(inputFile, 'utf8')
  let json = JSON.parse(originalText)

  // geoproperty is json.objects[(not 'arcs' or 'transform')]
  let geoproperty = Object.keys(json.objects).filter(el=>{return (el != 'arcs' && el != 'transform')})[0]

  let ids = json.objects[geoproperty].geometries.map(el=>{ return el.id }).sort()
  let filename = inputFile.replace(path,'').replace('.topo.json','')
  return { file: filename, geoproperty: geoproperty, ids: ids }
}

function savemetadata (input) {
  let outputFile = '../data/geometa.json'
  fs.writeFile(outputFile, input,
    function(err) {
      if (err) { return console.log(err); }
      console.log("The file was saved as", outputFile);
    }
  )
}