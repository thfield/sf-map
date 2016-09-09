#! /bin/bash
# convert from geojson to topojson and simplify at the same time
# this script won't work if you run from terminal:
# use text editor to alter filenames, cd into  data/geo/ and copy-paste into terminal 
topojson -o neighborhoods_sffind-proc.topo.json --id-property name --simplify-proportion .5 neighborhoods_sffind.geo.json