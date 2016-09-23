# sf-maps
Mapping San Francisco

## Make Choropleths by:
- census tracts
- ~~city assessor lots (blocklots)~~ (not yet!)
- election precincts
- neighborhoods
- supervisor districts
- zip codes

Data from [DataSF](https://data.sfgov.org/)

### Libraries
[D3](http://d3js.org)  
[Colorbrewer](http://colorbrewer2.org)  
[d3-legend](http://d3-legend.susielu.com/)  

# Use
This code uses the pattern from [Towards Reusable Charts](https://bost.ocks.org/mike/chart/).  
First, you need to have somewhere for the map to go.  Add an element to your html file:  
```javascript
<div id="map_container"></div>
```
The tooltip needs styles from `css/stylesheet.css`, specifically those for `#tooltip` and `.hidden`
You need to include d3.v3, topojson, d3-queue, d3-legend, and choropleth.js in the `<head>`:
```javascript
<script src="vendor/d3.min.js"></script>
<script src="vendor/topojson.js"></script>
<script src="vendor/d3-queue.js"></script>
<script src="vendor/d3-legend.js"></script>
<script src="js/choropleth.js"></script>
```
In your JS file, declare some user-set variables:

- `whatMap` determines the geography drawn  
- `theDataFile` path to the csv of data to be rendered  
- `idProperty` the column from the csv that corresponds to the geographic id  
- `dataProperty` the column of interesting data associated with the geography   
- `mapElement` DOM element for the map to be drawn in

The `choropleth` variable is where all the magic happens:
```javascript
var choropleth = Choropleth()
...
d3.select(mapElement).call(choropleth)
```

# Options
## Before initial render
The following string variables determine how the choropleth gets drawn.
- `whatMap` determines the geography drawn  
- `theDataFile` path to the csv of data to be rendered  
- `idProperty` the column from the csv that corresponds to the geographic id  
- `dataProperty` the column of interesting data associated with the geography   
- `mapElement` DOM element for the map to be drawn in

### whatMap
- Supervisor Districts: `Supervisor_Districts_April_2012`
- Census Tracts: `censustracts`
- Election Precincts: `elect_precincts`
- Zip Codes: `zipcodes`
- Neighborhoods designated by:
 - [Department of Public Health](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Analysis-Neighborhoods/p5b7-5n3h): `neighborhoods_analysis`
 - [Planning Department](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Planning-Neighborhood-Groups-Map/iacs-ws63): `neighborhoods_planning`
 - [Office of Neighborhood Services](https://data.sfgov.org/Geographic-Locations-and-Boundaries/SF-Find-Neighborhoods/pty2-tcw4): `neighborhoods_sffind`

### theDataFile
Needs to be a csv file with column headers. One column, identified as `idProperty`, required to match values from `data/geometa.json`

### idProperty
See required ID values in `data/geometa.json`

### dataProperty
The column heading from your data csv

### mapElement
CSS-style selector, default `#map_container`

## After initial render
Use the following JS functions to make changes on the fly

### choropleth.quanta( *number* )  
Change number of "Color Buckets". Can also be set before rendering.  
Where *number* is between 3 and 9. See `vendor/colorbrewer/colorbrewer.css` for available sets  
Example: `choropleth.quanta(3)`

### choropleth.colorScheme( *string* )  
Change color scheme. Can also be set before rendering.  
Where *string* is a colorbrewer scale. See `vendor/colorbrewer/colorbrewer.css` for available colors  
Example: `choropleth.colorScheme('Reds')`  

### changeData( *string* )  
Change the data color encoded initially as `dataProperty`  
Where *string* is the property of the csv dataset you want mapped.  
Example: `changeData('population')`

