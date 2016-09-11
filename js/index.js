/* user set variables */
var whatMap = 'Supervisor_Districts_April_2012' // which map, defined in geometa.json
var theDataFile = 'data/example/district-pop.csv' // csv file containing data to be mapped
var idProperty = 'district' // geometry-identifying property in csv datafile
var dataProperty = 'total' // property in csv datafile containing data of interest
var color = 'Blues' // color is set by css class, see styles.css for available colors
var mapElement = '#map_container'
/* end user set variables */

// var whatMap = 'zipcodes'
// var theDataFile = 'data/example/zip-pop.csv'
// var idProperty = 'zip'
// var dataProperty = 'population'

var theMetadata
var theMapFile
var topoKey
var csvData
var mapElement = d3.select(mapElement)

var choropleth = Choropleth()
.width(parseInt(mapElement.style('width')))
.colorScheme(color)

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
  setMap(whatMap)
  var q = d3.queue()
  q.defer(d3.csv, theDataFile)
  q.defer(d3.json, theMapFile)
  q.await(renderMap)
})


function setMap (whatMap) {
  /**
  * Set theMapFile and topoKey
  * @param {String} whatMap - the name of the map file
  */
  var dataobj = theMetadata.data.find(function(el){ return el.file === whatMap })
  theMapFile = theMetadata.path + dataobj.file + theMetadata.filetype
  topoKey = dataobj.geoproperty
  choropleth.geo(topoKey)
}

function renderMap (error, data, mapdata) {
  /**
    * Callback function after downloading csv data and topojson map
    * @param {Object} error error object
    * @param {Object} data csv data from d3.csv() call
    * @param {Object} mapdata topojson from d3.json() call
    */
  if (error) console.error(error)
  csvData = data
  var mapDict = dataToDict(csvData, idProperty, dataProperty)
  var exten = [minOfObjDict(mapDict), maxOfObjDict(mapDict)]
  choropleth.colorDomain(exten).data(mapDict)
  mapElement.datum(mapdata).call(choropleth)
  return null
}

function changeData(dataProperty){
  /**
   * Redraw map looking at new data value
   * @param {String} dataProperty column heading of data
   */
 var mapDict = dataToDict(csvData, idProperty, dataProperty)
 var exten = [minOfObjDict(mapDict), maxOfObjDict(mapDict)]
 choropleth.colorDomain(exten).data(mapDict)
 mapElement.call(choropleth)
}

function dataToDict (data, idProp, dataProp) {
  /**
   * Turn data object into key-value pair dictionary object
   * @param {Object} data - data from csv
   * @param {String} idProp - geometry-identifying property in csv datafile
   * @param {String} dataProp - property in csv datafile containing data of interest
   * @returns {Object} nested - dictionary key-value pairs
   */
  return d3.nest()
        .key(function(d) { return d[idProp] })
        .rollup(function(p) {
          //TODO this shouldn't have to sum?
          return d3.sum(p, function(d) { return d[dataProp] })
         })
        .map(data)
}

function minOfObjDict (obj) {
  /**
   * get minimum value of dictionary object
   * @param {Object} obj - dictionary object
   * @returns {Number} minimum value
   */
  var result = Object.keys(obj).reduce(function(a, b){ return obj[a] < obj[b] ? a : b });
  return obj[result]
}

function maxOfObjDict (obj) {
  /**
  * get maximum value of dictionary object
  * @param {Object} obj - dictionary object
  * @returns {Number} maximum value
  */
  var result = Object.keys(obj).reduce(function(a, b){ return +obj[a] > +obj[b] ? a : b });
  return obj[result]
}

d3.select(window).on('resize', function(){
  var newwidth = parseInt(d3.select('#map_container').style('width'))
  choropleth.width(newwidth).resize()
});
