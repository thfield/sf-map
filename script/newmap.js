/**
* Converts GeoJSON to TopoJSON and outputs some analysis on the shapefile
* Run from cmd line as `$ node newmap.js geojson idprop`
* Does not run simplification, use the command line topojson to simplify
*
* @param {string} geojson - a geojson file saved in "../data/geo"
* @param {string} idprop - the geography feature property to use as the idprop
* @param {boolean} save - save the output or not, defaults to false
*/

"use strict";
const fs = require('fs')
const turf = require('turf')
const topojson = require('topojson')

let path = '../data/geo/'
let metaFile = '../data/geometa.json'

let file = process.argv[2] // realtor-neighborhoods.geo.json
let idprop = process.argv[3] // nbrhood
let save = process.argv[4] || false

analyze(path + file, idprop)

function analyze (file, idprop) {
  let inputFile = '' + file
  let outputFile = '' + file.replace('.geo', '.topo')

  let geoJson = JSON.parse(fs.readFileSync(inputFile, 'utf8'))
  let metaData = JSON.parse(fs.readFileSync(metaFile, 'utf8'))

  //do turf analysis first; topojson modifies the object geoJson
  let info = {}
  info.file = file.replace(path, '').replace('.geo.json','')
  info.geoproperty = idprop
  info.ids = geoJson.features.map((el)=>{
    return el.properties[idprop]
  })
  info.center = turf.center(geoJson).geometry.coordinates
  info.centroid = turf.centroid(geoJson).geometry.coordinates
  info.bbox = turf.bbox(geoJson)//.geometry.coordinates
  // info.west = info.bounding[0]
  // info.east = info.bounding[2]
  // info.scale = 360/Math.abs(info.east - info.west)

  metaData.data.push(info)


  let topoJson = topojson.topology({ collection: geoJson }, {
    id: function(d) {
      return d.properties["nbrhood"]
    },
    "property-transform": function(feature) {
      return feature.properties
    }
  })

  if (save){
    saveToFile(topoJson,outputFile)
    saveToFile(metaData, metaFile)
  }
}

function saveToFile (json, filename) {
    fs.writeFile(filename, JSON.stringify(json),
    function(err) {
      if (err) { return console.log(err); }
      console.log("The file was saved as", filename);
    }
  )
}