/**
* returns the area of each feature in square meters
*/

"use strict";
const fs = require('fs')
const turf = require('turf')

let path = '../data/geo/'
let file = 'realtor-neighborhoods.geo.json'

let nameProperty = 'nbrhood'

let inputFile = path + file
let outputFile = 'area-result.json'




let geoJson = JSON.parse(fs.readFileSync(inputFile, 'utf8'))

let areas = geoJson.features.map(function(feature,index){
  return {
    name: feature.properties[nameProperty],
    area: turf.area(feature)
  }
})
saveToFile(areas,outputFile)

function saveToFile (json, filename) {
    fs.writeFile(filename, JSON.stringify(json),
    function(err) {
      if (err) { return console.log(err); }
      console.log("The file was saved as", filename);
    }
  )
}