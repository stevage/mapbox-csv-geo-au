<template lang="pug">
#map.absolute.absolute--fill
</template>

<script>
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-dev.js';
import U from 'mapbox-gl-utils';
import { sheets2geojson } from 'sheets2geojson';
import { EventBus } from '../EventBus';
import { addCsvByUrl } from './csv-geo-au';
export default {
    async mounted() {
        // replace this Mapbox access token with your own
        // mapboxgl.accessToken = 'pk.eyJ1Ijoic3RldmFnZSIsImEiOiJGcW03aExzIn0.QUkUmTGIO3gGt83HiRIjQw';
        mapboxgl.accessToken = 'pk.eyJ1Ijoic2JjaGVycmUiLCJhIjoiY2s2cTkxcHVxMXVnNzNsbDl2bTN1Mm83dyJ9.sU2NJpziux-m0MCCkm41iQ';
        const map = new mapboxgl.Map({
            container: 'map',
            center: [144.96, -37.81],

            zoom: 5,
            style: 'mapbox://styles/mapbox/light-v9',
            // style: { version: 8, sources: {}, layers: []},
            hash: true
        });
        U.init(map, mapboxgl);
        window.map = map;
        window.app.Map = this;

        map.U.onLoad(() => {
            // addCsvByUrl(map, 'https://raw.githubusercontent.com/TerriaJS/terriajs/master/wwwroot/test/csv/CED_2018_CED_CODE18.csv');
            // addCsvByUrl(map, 'https://raw.githubusercontent.com/TerriaJS/terriajs/master/wwwroot/test/csv/SED_2016_SED_CODE16.csv');
            // addCsvByUrl(map, 'https://raw.githubusercontent.com/TerriaJS/terriajs/master/wwwroot/test/csv/55k-SA1s.csv', 'Random');
            // addCsvByUrl(map, '55k-SA1s.csv', 'Random');
            addCsvByUrl(map, 'https://raw.githubusercontent.com/TerriaJS/nationalmap/master/wwwroot/test/csv-geo-au/sos.csv');
            // addCsvByUrl(map, 'https://raw.githubusercontent.com/TerriaJS/nationalmap/master/wwwroot/test/csv-geo-au/phn.csv');
            // addCsvByUrl(map, 'https://raw.githubusercontent.com/TerriaJS/terriajs/master/wwwroot/test/csv/3000s.csv', 'Value');
        });
        EventBus.$on('load-csv', csvUrl => {
            // const rawUrl = csvUrl.replace('https://github.com/TerriaJS/nationalmap/blob/master/wwwroot/test/csv-geo-au/sos.csv', https://raw.githubusercontent.com/TerriaJS/nationalmap/master/wwwroot/test/csv-geo-au/sos.csv
            const rawUrl = csvUrl.replace(/github\.com/, 'raw.githubusercontent.com').replace(/blob\//, '');
            map.U.removeSource('choropleth');
            addCsvByUrl(map, rawUrl)
        });
        
    }
}
import 'mapbox-gl/dist/mapbox-gl.css';

</script>

<style scoped>
</style>