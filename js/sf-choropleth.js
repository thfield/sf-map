function sfChoropleth() {

  var margin = {top: 5, right: 5, bottom: 30, left: 25},
      width = 300,
      height = width,
      active = d3.select(null)

  var projection = d3.geo.mercator()
      .center([-122.433701, 37.767683])
      .scale(350 * width)
      .translate([width / 2, height / 2])

  var path = d3.geo.path()
      .projection(projection)

  var colorScale = d3.scale.quantize()
  colorScale.range(rangeArray(9))
  colorScale.domain([0,1])

  var data = {}
  var geo = "districts" // objects key in topojson file
  var cssClass = 'blues'

  function chart(selection) {
    selection.each(function(topodata) {
      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([topojson.feature(topodata, topodata.objects[geo]).features])

      // Otherwise, create the skeletal map.
      var gEnter = svg.enter().append("svg").append("g")
      gEnter.append("g").attr('class', 'boundaries-container')

      // Update the outer dimensions.
      svg .attr("width", width)
          .attr("height", height)

      // Update the inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var boundary = g.selectAll('.boundary').data(topojson.feature(topodata, topodata.objects[geo]).features)
      boundary.enter().append('path').attr('d', path)
      boundary.exit().transition().duration(1000).attr('fill', '#fff' ).remove()
      boundary.attr('class', function(d){
          var obj = data[d.id] || ''
          var colorBin = colorScale(obj)
          if (d.id === undefined) colorBin = 'white'
          return geo + ' ' + cssClass + ' ' + colorBin
        })

      var legendEl = svg.append("g").attr("class", "legendQuant")
      var legend = d3.legend.color()
        .labelFormat(d3.format("f"))
        .useClass(true)
        .scale(colorScale)
        legendEl.call(legend)
        svg.selectAll('.legendCells .swatch')
          .classed(cssClass, true)
    });
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

  // height is set by width
  // chart.height = function(_) {
  //   if (!arguments.length) return height;
  //   height = _;
  //   return chart;
  // };

  chart.colorRange = function(_) {
    if (!arguments.length) return color.range();
    colorScale.range(_);
    return chart;
  };

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

  chart.data = function(_) {
    if (!arguments.length) return data;
    data = _;
    return chart;
  };

  chart.cssClass = function(_) {
    if (!arguments.length) return cssClass;
    cssClass = _;
    return chart;
  };

  return chart;
}