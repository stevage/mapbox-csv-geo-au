import Choropleth from 'mapbox-choropleth';
const regionMapping = require('./regionMapping.json').regionWmsMap;
const d3 = require('d3-fetch');

function lonColumn(columns) {
    return columns.find(c => ['lon','longitude', 'lng'].indexOf(c.toLowerCase()) >= 0);
}
function latColumn(columns) {
    return columns.find(c => ['lat','latitude'].indexOf(c.toLowerCase()) >= 0);
}
 
function addPoints(map, rows, lonColumn, latColumn) {
    map.U.removeSource('points');
    map.U.addGeoJSON('points', {
        type: 'FeatureCollection',
        features: rows.map(row => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [row[lonColumn], row[latColumn]],
            },
            properties: row
        }))
    });
    map.U.addCircle('points-circles', 'points', {
        circleColor: 'blue'
    });
}

async function addCsvByUrl(map, url, tableNumericField) {
    // const convertRow = row => ( row[this.tableNumericField] = +row[this.tableNumericField], row);
    const rows = await d3.csv(url, /*convertRow */)
    const columnNames = Object.keys(rows[0]);
    console.log(lonColumn(columnNames), latColumn(columnNames));
    if (lonColumn(columnNames) && latColumn(columnNames)) {
        // console.log(`Adding points with lon, lat: ${lonColumn}, ${latColumn}`);
        addPoints(map, rows, lonColumn(columnNames), latColumn(columnNames));
        return;
    }

    const regionTypeAliases = {};
    for (let rid of Object.keys(regionMapping)) {
        regionTypeAliases[rid.toLowerCase()] = rid;
        for (let alias of regionMapping[rid].aliases.map(a => a.toLowerCase())) {
            regionTypeAliases[alias] = regionTypeAliases[alias] || rid;
        }
    }
    console.log({regionTypeAliases});

    let regionTypeId;
    let tableIdField = columnNames
        .find(col => regionTypeId = regionTypeAliases[col.toLowerCase()]);

    
    
    if (!tableNumericField) {
        tableNumericField = columnNames.find(c => {
            if (regionTypeAliases[c.toLowerCase()]) {
                return false;
            }
            if (rows.find(r => !Number.isFinite(+r[c]))) {
                return false;
            }
            return true;
        })
        
        if (!tableNumericField) {
            console.log(`Couldn't find a numeric field out of ${columnNames}. Exiting.`);
            return;
            // tableNumericField = columnNames.find(c => !regionTypeAliases[c.toLowerCase()])
        }
    }

    if (!regionTypeId) {
        console.log(`Couldn't find region type for ${columnNames}.`);
        return;
    } else {
        console.log(`Matched region type ${regionTypeId}. Numeric field: ${tableNumericField}`);
    }
    
    const regionType = regionMapping[regionTypeId];




    window.choro = new Choropleth({ 
        tableUrl: url,
        tableNumericField,
        tableIdField, // TODO support aliases 'CED_CODE18',
        geometryTiles: [regionType.server],
        geometryIdField: regionType.regionProp, //'CED_CODE18',
        // useFeatureId: true,
        // useFeatureState: true,
        sourceLayer: regionType.layerName,//'CED_2018',
        binCount: 11,
        legendElement: document.querySelectorAll('#legend')[0],
        debug: true
    }).addTo(map);
}

export { addCsvByUrl }