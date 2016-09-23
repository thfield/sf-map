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
// const json2csv = require('json2csv')
const turf = require('turf')
const topojson = require('topojson')

let path = '../data/geo/'

let file = process.argv[2] // realtor-neighborhoods.geo.json
let idprop = process.argv[3] // nbrhood
let save = process.argv[4] || false
analyze(path + file, idprop)

function analyze (file, idprop) {
  let inputFile = '' + file
  let outputFile = '' + file.replace('.geo', '.topo')

  let geoJson = JSON.parse(fs.readFileSync(inputFile, 'utf8'))
  //do turf analysis here; topojson modifies the object geoJson
  let info = {}
  info.center = turf.center(geoJson).geometry.coordinates
  info.centroid = turf.centroid(geoJson).geometry.coordinates
  info.bounding = turf.bbox(geoJson)//.geometry.coordinates
  info.west = info.bounding[0]
  info.east = info.bounding[2]
  info.scale = 360/Math.abs(info.east - info.west)
  info.ids = geoJson.features.map((el)=>{
    return el.properties[idprop]
  })


  console.log(0.000018704970563954454/0.000012430843125841072)

  let topoJson = topojson.topology({ collection: geoJson }, {
    id: function(d) {
      return d.properties["nbrhood"]
    // },
    // "property-transform": function(feature) {
    //   return feature.properties
    }
  })

  if (save)
    saveToFile(topoJson,outputFile)
}

function saveToFile (json, filename) {
    fs.writeFile(filename, JSON.stringify(json),
    function(err) {
      if (err) { return console.log(err); }
      console.log("The file was saved as", filename);
    }
  )
}