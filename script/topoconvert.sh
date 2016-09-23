#! /bin/bash
# convert FROM geojson TO topojson and simplify at the same time
# alter filenames, simplify-proportion, and id-property appropriately
topojson -o ../data/geo/neighborhoods_sffind-proc.topo.json --id-property name --simplify-proportion .5 ../data/geo/neighborhoods_sffind.geo.json