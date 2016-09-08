//TODO add percent of registered voters voting for this candidate

/* init values */
var theMap  = 'data/geo/elect_precincts_combined.topo.json' // map file needs to be in topojson format
var theDataFile = 'data/pres-dem.csv' // csv file containing data to be mapped

var geometry = 'precincts' // the property in the topojson map file (theMap.objects[geometry])
var geoClass = 'precinct' // css class assigned to map opjects
var geoColor = 'blue' // css class assigning color

var idProperty = 'precinct'  // geometry-identifying property in csv datafile
var dataProperty = 'registered_voters' // property in csv datafile containing data of interest
/* end init values */


/* global vars for loaded data */
var theData = {}
var mapDict = {}

/* page setup */
var width = parseInt(d3.select('#map_container').style('width')),
    height = width,
    active = d3.select(null)

var svg = d3.select("#map_container").append("svg")
    .style('width', width + 'px')
    .style('height', height + 'px');
    // .on("click", stopped, true)

var projection = d3.geo.mercator()
    .center([-122.433701, 37.767683])
    .scale(350 * width)
    .translate([width / 2, height / 2])

var path = d3.geo.path()
    .projection(projection)

var bins = rangeArray(9)
var colorScale = d3.scale.quantize()
colorScale.range(bins)

svg.append("g").attr("class", "legendQuant")
var legend = d3.legend.color()
  .labelFormat(d3.format("f"))
  .useClass(true)
/* end setup */

/* tooltip dispatcher */
// var tt = d3.dispatch('init', 'follow', 'hide')
// tt.on('init', function(element){
//   d3.select(element).append('div')
//       .attr('id', 'tooltip')
//       .attr('class', 'hidden')
//     .append('span')
//       .attr('class', 'value')
// })
// tt.on('follow', function(element, caption){
//   element.on('mousemove', null);
//   element.on('mousemove', function() {
//     var position = d3.mouse(document.body);
//     d3.select('#tooltip')
//       .style('top', ( (position[1] + 30)) + "px")
//       .style('left', ( position[0]) + "px");
//     d3.select('#tooltip .value')
//       .text(caption)
//   });
//   d3.select('#tooltip').classed('hidden', false);
// })
// tt.on('hide', function(){
//   d3.select('#tooltip').classed('hidden', true);
// })
// tt.init('body')
/* end tooltip dispatcher */

/* ui dispatcher */
var ui = d3.dispatch('clickedGeo', 'mouseOver', 'mouseOut')
ui.on('clickedGeo', function(geoId){
})
ui.on('mouseOver', function(d, el) {
  // // populateInfobox(d.id)
  // var me = d3.select(el),
  // thisText = geoClass + ': ' + d.id
  // return tt.follow(me, thisText)
})
ui.on('mouseOut', function() {
  // var table = $('#infobox table')
  // table.empty()
})
/* end ui dispatcher */

var q = d3.queue()
q.defer(d3.csv, theDataFile)
q.defer(d3.json, theMap)
q.await(renderMap)

function renderMap (error, data, mapdata) {
  if (error) throw error
  theData = data

  mapDict = dataToDict(theData, idProperty, dataProperty)
  //TODO colorScale should be fed extent of voting for both, here and in redrawMap
  var exten = [minOfObjDict(mapDict), maxOfObjDict(mapDict)]
  colorScale.domain(exten)

  svg.append('g')
      .attr('class', geoClass + '-container')
    .selectAll('.'+ geoClass)
      .data(topojson.feature(mapdata, mapdata.objects[geometry]).features)
    .enter().append('path')
      // .attr('class', geoClass)
      .attr('d', path)
      // .on('click', function(d){ return ui.clickedGeo(d.id) })
      // .on('mouseover', function(d){ return ui.mouseOver(d, this) })
      // .on("mouseout", ui.mouseOut )
      .attr('class', function(d){
        var obj = mapDict[d.id] || ''
        var colorBin = colorScale(obj)
        if (d.id === undefined) colorBin = 'white'
        return colorBin + ' ' + geoClass + ' ' + geoColor
      })

  // legend.scale(colorScale)
  // svg.select(".legendQuant")
  //   .call(legend)
  // svg.selectAll('.legendCells .swatch')
  //   .classed(geoColor, true)

}

function dataToDict (data, idProp, dataProp) {
  var nested = d3.nest()
        .key(function(d) { return d[idProp] })
        .rollup(function(p) {
          //TODO this shouldn't have to sum?
          return d3.sum(p, function(d) { return d[dataProp] })
         })
        .map(data)

  return nested
}

function preload (obj) {
  for (prop in obj){
    // make sure numbers that were read as strings are changed to numbers
    if(!isNaN(+obj[prop])) obj[prop] = +obj[prop]
    // if a value is an empty string, assume it should be 0
    if(obj[prop] === "") obj[prop] = 0
  }
  return obj
}

function rangeArray (bins) {
  //TODO: i think there is a native d3 function that does this
  var result = [],
      max = bins - 1
  for (var i = 0; i <= max; i++) {
   result.push('q'+ i + '-' + bins);
  }
  return result
}

function minOfObjDict (obj) {
  var result = Object.keys(obj).reduce(function(a, b){ return obj[a] < obj[b] ? a : b });
  return obj[result]
}
function maxOfObjDict (obj) {
  var result = Object.keys(obj).reduce(function(a, b){ return +obj[a] > +obj[b] ? a : b });
  return obj[result]
}
function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
function roundToHundredth(num){
  return Math.round(100*num)/100
}



d3.select(window).on('resize', resize);
function resize() {
  // adjust things when the window size changes
  width = parseInt(d3.select('#map_container').style('width'))
  height = width
  // update projection
  projection
    .translate([width / 2, height / 2])
    .scale(350 * width)
  // resize the map container
  svg
      .style('width', width + 'px')
      .style('height', height + 'px')
  // resize the map
  svg.selectAll('.'+geoClass).attr('d', path);
  // map.selectAll('.state').attr('d', path);
}

