function Choropleth() {

  var margin = {top: 5, right: 5, bottom: 30, left: 25}
  var width = 300
  var height = width
  var quanta = 9
  // var active = d3.select(null)
  var data = {}
  var geo = "districts" // objects key in topojson file
  var cssClass = 'Blues' // colors from colorbrewer.css
  var centerpoint = [-122.433701, 37.767683]

  var projection = d3.geo.mercator()
      .center(centerpoint)
      .scale(350 * width)
      .translate([width / 2, height / 2])

  var path = d3.geo.path()
      .projection(projection)

  var colorScale = d3.scale.quantize()
      colorScale.range(rangeArray(quanta))
      colorScale.domain([0,1])

  var legend = d3.legend.color()
    .labelFormat(d3.format("f"))
    .useClass(true)

  function chart(selection) {
    selection.each(function(topodata) {
      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([topojson.feature(topodata, topodata.objects[geo]).features])

      // Otherwise, create the skeletal map.
      var gEnter = svg.enter().append("svg").append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
              .attr('class', 'boundaries-container ' + cssClass )

      // Update the outer dimensions.
      svg .attr("width", width)
          .attr("height", height)

      // Update the inner dimensions.
      var g = svg.select("g")

      var boundary = g.selectAll('.boundary').data(topojson.feature(topodata, topodata.objects[geo]).features)
      boundary.enter().append('path').attr('d', path)
      boundary.exit().transition().duration(1000).attr('fill', '#fff' ).remove()
      boundary.attr('class', setQuanta)

      svg.select('.legendQuant').remove() //hack to keep using d3.legend TODO lookup how to do redraw the correct way
      var legendEl = svg.append("g").attr("class", "legendQuant "+ cssClass)
      // var legendEl = d3.select(this).selectAll("svg").append("g").attr("class", "legendQuant "+ cssClass)
      legend.scale(colorScale)
      legendEl.call(legend)
    });
  }

  function setQuanta(d) {
    var obj = data[d.id] || ''
    var colorBin = colorScale(obj)
    if (d.id === undefined) colorBin = 'white'
    return geo + ' ' + colorBin
  }

  function rangeArray (bins) {
    //TODO: i think there is a native d3 function that does this?
    var result = [],
        max = bins - 1
    for (var i = 0; i <= max; i++) {
     result.push('q'+ i + '-' + bins);
    }
    return result
  }

  function updateProjection(){
    return projection
        .scale(350 * width)
        .translate([width / 2, height / 2])
  }

  function updatePath(){
    return path.projection(projection)
  }

  chart.resize = function() {
    updateProjection()
    updatePath()
    d3.selectAll('.'+geo).attr('d', path);
    return chart;
  };

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    for (prop in _) {
      margin[prop] = _[prop];
    }
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    height = _;
    updateProjection()
    updatePath()
    return chart;
  };

  // height is set by chart.width()
  // chart.height = function(_) {
  //   if (!arguments.length) return height;
  //   height = _;
  //   return chart;
  // };

  // range is set by chart.quanta()
  // chart.colorRange = function(_) {
  //   if (!arguments.length) return color.range();
  //   colorScale.range(_);
  //   return chart;
  // };

  chart.colorDomain = function(_) {
    if (!arguments.length) return color.domain();
    colorScale.domain(_);
    return chart;
  };

  chart.colorScale = function(_) {
    if (!arguments.length) return {domain: colorScale.domain(), range: colorScale.range()};
    colorScale = _;
    return chart;
  };

  chart.geo = function(_) {
    if (!arguments.length) return geo;
    geo = _;
    return chart;
  };

  chart.quanta = function(_) {
    if (!arguments.length) return quanta;
    quanta = _;
    colorScale.range(rangeArray(quanta))
    d3.selectAll('.' + geo).attr('class', setQuanta)
    legend.scale(colorScale)
    d3.select('.legendQuant').call(legend)
    return chart;
  };

  chart.data = function(_) {
    if (!arguments.length) return data;
    data = _;
    return chart;
  };

  chart.centerpoint = function(_) {
    if (!arguments.length) return centerpoint;
    centerpoint = _;
    return chart;
  };

  chart.cssClass = function(_) {
    if (!arguments.length) return cssClass;
    var oldClass = cssClass
    cssClass = _;
    d3.select('.boundaries-container').classed(oldClass, false).classed(cssClass, true)
    d3.select('.legendQuant').classed(oldClass, false).classed(cssClass, true)
    return chart;
  };

  return chart;
}