/* user set variables */
var whatMap = 'Supervisor_Districts_April_2012'
var mapElement = d3.select("#map_container")
var theDataFile = 'data/example/district-pop.csv' // csv file containing data to be mapped
var idProperty = 'district'  // geometry-identifying property in csv datafile
var dataProperty = 'total' // property in csv datafile containing data of interest
var color = 'Blues' // color is set by css class, see styles.css for available colors
/* end user set variables */

var theMetadata
var theMapFile
var topoKey
var csvData

var choropleth = sfChoropleth()
  .width(parseInt(mapElement.style('width')))
  .cssClass(color)

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
// var ui = d3.dispatch('clickedGeo', 'mouseOver', 'mouseOut')
// ui.on('clickedGeo', function(geoId){
// })
// ui.on('mouseOver', function(d, el) {
//   // // populateInfobox(d.id)
//   // var me = d3.select(el),
//   // thisText = geoClass + ': ' + d.id
//   // return tt.follow(me, thisText)
// })
// ui.on('mouseOut', function() {
//   // var table = $('#infobox table')
//   // table.empty()
// })
// /* end ui dispatcher */

d3.json('data/geometa.json', function(err, data){
  theMetadata = data
  dataobj = data.data.find(function(el){ return el.file === whatMap })
  theMapFile = data.path + dataobj.file + data.filetype
  topoKey = dataobj.geoproperty
  choropleth.geo(topoKey)
  var q = d3.queue()
  q.defer(d3.csv, theDataFile)
  q.defer(d3.json, theMapFile)
  q.await(renderMap)
})

function renderMap (error, data, mapdata) {
  if (error) console.error(error)
  csvData = data
  var mapDict = dataToDict(csvData, idProperty, dataProperty)
  var exten = [minOfObjDict(mapDict), maxOfObjDict(mapDict)]
  choropleth.colorDomain(exten).data(mapDict)
  mapElement.datum(mapdata).call(choropleth)
}

function changeData(dataProperty){
  var mapDict = dataToDict(csvData, idProperty, dataProperty)
  var exten = [minOfObjDict(mapDict), maxOfObjDict(mapDict)]
  choropleth.colorDomain(exten).data(mapDict)
  mapElement.call(choropleth)
}

function dataToDict (data, idProp, dataProp) {
  // data: data from csv
  // idProp: geometry-identifying property in csv datafile
  // dataProp: property in csv datafile containing data of interest
  var nested = d3.nest()
        .key(function(d) { return d[idProp] })
        .rollup(function(p) {
          //TODO this shouldn't have to sum?
          return d3.sum(p, function(d) { return d[dataProp] })
         })
        .map(data)
  return nested
}

function minOfObjDict (obj) {
  var result = Object.keys(obj).reduce(function(a, b){ return obj[a] < obj[b] ? a : b });
  return obj[result]
}
function maxOfObjDict (obj) {
  var result = Object.keys(obj).reduce(function(a, b){ return +obj[a] > +obj[b] ? a : b });
  return obj[result]
}

// function toTitleCase(str){
//     return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
// }
// function roundToHundredth(num){
//   return Math.round(100*num)/100
// }
// function preload (obj) {
//   for (prop in obj){
//     // make sure numbers that were read as strings are changed to numbers
//     if(!isNaN(+obj[prop])) obj[prop] = +obj[prop]
//     // if a value is an empty string, assume it should be 0
//     if(obj[prop] === "") obj[prop] = 0
//   }
//   return obj
// }


d3.select(window).on('resize', function(){
  var newwidth = parseInt(d3.select('#map_container').style('width'))
  choropleth.width(newwidth).resize()
});