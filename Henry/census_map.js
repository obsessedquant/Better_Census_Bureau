// Store our API endpoint as queryUrl.

var myMap = L.map("map", {
  center: [29.7604, -95.3698],
  zoom: 12,
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

var geoJsonLocation = "48.geojson";
var csvLocation = "SVI2018_US_small.csv";

d3.csv(csvLocation).then(function (data) {
  // Once we get a response, read the data into variables

  // console.log("csvLocation", data);
  d3.json(geoJsonLocation).then(function (jsonData) {
    jsonData.features.forEach((x) => {
      id = x.properties.GEOID;
      csvId = data.filter((y) => y.FIPS === id);
      // console.log(csvId[0].E_TOTPOP);
      x.properties = Object.assign(x.properties, csvId[0]);
      // x.properties.EXTRA = csvId[0];
    });

    jsonData.features.forEach((x) => {
      x.properties.E_TOTPOP = +x.properties.E_TOTPOP;
    });

    console.log("geoJsonLocation jsonData: ", jsonData.features);

    // createFeatures(jsonData);

    // L.geoJson(jsonData.features, {
    //   style: {},
    //   onEachFeature: function (feature, layer) {

    //   },
    // }).addTo(myMap);

    geojson = L.choropleth(jsonData, {
      valueProperty: "E_TOTPOP",

      scale: ["#ffffb2", "#b10026"],

      steps: 10,

      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8,
      },

      // L.geoJson(jsonData, {
      //   style: {},
      //   onEachFeature: function (feature, layer) {},
      // }).addTo(myMap);

      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "Census location: " +
            feature.properties.E_TOTPOP +
            "<br>E_TOTPOP:<br>" +
            "$" +
            parseInt(feature.properties.E_TOTPOP)
        );
      },
    }).addTo(myMap);
  });
});

// var street = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenS...',
//   maxZoom: 18,
//   id: 'mapbox/streets-v11',
//   tileSize: 512,
//   zoomOffset: -1,
//   accessToken: 'pk.eyJ1Ijoic3JvYmluc29uMjI2IiwiYSI6ImNrdmh4OGczdWFrMmsydW9mdGViZjB4enYifQ.M7SwNQspK272zHmaVqumdA'
// }).addTo(myMap);

// will bind features to the map
function createFeatures(houstonData) {
  console.log("houstonData is: ", houstonData);
  console.log(
    "coordinates are: ",
    houstonData.features[0].geometry.coordinates[0][0][1]
  );
  console.log(
    "E_TOTPOP is: ",
    houstonData.features[0].properties.EXTRA.E_TOTPOP
  );
  console.log(
    "E_TOTPOP is: ",
    parseInt(houstonData.features[0].properties.EXTRA.E_TOTPOP)
  );
  var geojson;

  // d3.json(all_data).then(function (data) {

  console.log("houstonData.features is: ", houstonData.features);

  geojson = L.choropleth(houstonData.features, {
    valueProperty: "E_TOTPOP",

    scale: ["#ffffb2", "#b10026"],

    steps: 10,

    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8,
    },

    // L.geoJson(jsonData, {
    //   style: {},
    //   onEachFeature: function (feature, layer) {},
    // }).addTo(myMap);

    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Census location: " +
          houstonData.features.properties.EXTRA.E_TOTPOP +
          "<br>E_TOTPOP:<br>" +
          "$" +
          parseInt(feature.features.properties.EXTRA.E_TOTPOP)
      );
    },
  }).addTo(myMap);
}

// d3.json(geoData).then(function(data) {

//   // Create a new choropleth layer.
//   geojson = L.choropleth(data, {

//     // Define which property in the features to use.
//     valueProperty: "MHI2016",

//     // Set the color scale.
//     scale: ["#ffffb2", "#b10026"],

//     // The number of breaks in the step range
//     steps: 10,

//     // q for quartile, e for equidistant, k for k-means
//     mode: "q",
//     style: {
//       // Border color
//       color: "#fff",
//       weight: 1,
//       fillOpacity: 0.8
//     },

//     // Binding a popup to each layer
//     onEachFeature: function(feature, layer) {
//       layer.bindPopup("Zip Code: " + feature.properties.ZIP + "<br>Median Household Income:<br>" +
//         "$" + feature.properties.MHI2016);
//     }
//   }).addTo(myMap);

//   var geojson;

//   geojson = L.choropleth(houstonData, {

//     valueProperty: "E_TOTPOP",

//     scale: ["#ffffb2", "#b10026"],

//     steps: 10,

//     mode: "q",
//     style: {
//       // Border color
//       color: "#fff",
//       weight: 1,
//       fillOpacity: 0.8
//     },

//     onEachFeature: function (feature, layer) {
//       layer.bindPopup("Census location: " + feature.properties.EXTRA.E_TOTPOP + "<br>E_TOTPOP:<br>" + "$" + parseInt(feature.properties.EXTRA.E_TOTPOP));
//     }
//   }).addTo(myMap);

// houstonData.forEach(x => {
//   // heatArray.push([x.geometry.coordinates[0][0][1],x.geometry.coordinates[0][0][1],parseInt(x.properties.EXTRA.E_TOTPOP)]);
//   heatArray.push([x.geometry.coordinates[0][0][1], x.geometry.coordinates[0][0][0], (Math.floor(Math.random() * 9) + 1) / 10]);
// });

// console.log("heat array is: ", heatArray);

// var heatArray = [];

// var heat = L.heatLayer(heatArray, {
//   radius: 20,
//   blur: 35
// }).addTo(myMap);

//   function chooseColor(size) {
//       if (size > 90) color = "rgb(255,95,102)";
//       else if (size > 70) color = "rgb(255,164,101)";
//       else if (size > 50) color = "rgb(250,220,66)";
//       else if (size > 30) color = "rgb(250,220,66)";
//       else if (size > 10) color = "rgb(218,245,70)";
//       else color = "rgb(153,247,69)";
//       return color;
//   }

//   var list_of_earthquakes = [];
//   var locationz = [];

//   // Add circles to the map.
//   earthquakeData.forEach(x => {
//       locationz = [];
//       locationz = [x.geometry.coordinates[1], x.geometry.coordinates[0]];
//       list_of_earthquakes.push(L.circle(locationz, {
//           fillOpacity: 0.75,
//           color: "black",
//           weight: 0.5,
//           fillColor: chooseColor(x.geometry.coordinates[2]),
//           radius: x.properties.mag * 100000
//       }).bindPopup(`<h3>${x.properties.place}</h3><hr><p>${new Date(x.properties.time)}</p>`));
//   });

//   console.log("list of earthquakes is: ", list_of_earthquakes);

//   var earthquakes_0 = L.layerGroup(list_of_earthquakes);

//   return earthquakes_0

// function updateLegend() {
//   console.log('updateLegend called')
//   document.querySelector(".legend").innerHTML = [
//       "<div style='font-size:14px'><div class='box green'></div>&nbsp;-10 - 10</div>",
//       "<div style='font-size:14px'><div class='box lightgreen'></div>&nbsp;10 - 30</div>",
//       "<div style='font-size:14px'><div class='box gold'></div>&nbsp;30 - 50</div>",
//       "<div style='font-size:14px'><div class='box lightorange'></div>&nbsp;50 - 70</div>",
//       "<div style='font-size:14px'><div class='box orange'></div>&nbsp;70 - 59</div>",
//       "<div style='font-size:14px'><div class='box red'></div>&nbsp;90+</div>"
//   ].join("");
// }

// function createMap(earthquakes) {

//   console.log("createMap has been called with this data: ", earthquakes)

//   // Create the base layers.
//   var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//   });

//   var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//       attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
//   });

//   // Use this link to get the GeoJSON data.
//   var tectonic_plates = "GeoJSON/PB2002_boundaries.json";

//   // Getting our GeoJSON data
//   function getTectonic(tectonic_plates) {
//       d3.json(tectonic_plates).then(function (data) {
//           var tect_plates = L.geoJson(data);
//           console.log("tect_plates is: ", tect_plates);
//           tect_plates.addTo(myMap);
//           return tect_plates
//       })
//   }

//   var tect_platez = getTectonic(tectonic_plates);

//   var layers = {
//       quakes: new L.LayerGroup(earthquakes),
//       plates: new L.LayerGroup(tect_platez)
//   }

//   // Create our map, giving it the streetmap and earthquakes layers to display on load.
//   var myMap = L.map("map", {
//       center: [15.5994, -28.6731],
//       zoom: 3,
//       layers: [layers.quakes, layers.plates, street, earthquakes]
//   });

//   street.addTo(myMap);

//   // Create a baseMaps object.
//   var baseMaps = {
//       "Street Map": street,
//       "Topographic Map": topo
//   };

//   // Create an overlay object to hold our overlay.
//   var overlayMaps = {
//       "Earthquakes": earthquakes
//       // "Earthquakes": layers.quakes
//       // "Tectonic Plates": layers.plates
//   };

//   var info = L.control({
//       position: "bottomright"
//   });

//   info.onAdd = function () {
//       var div = L.DomUtil.create("div", "legend");
//       return div;
//   };
//   // Add the info legend to the map.
//   info.addTo(myMap);

//   // Create a layer control.
//   // Pass it our baseMaps and overlayMaps.
//   // Add the layer control to the map.
//   L.control.layers(baseMaps, overlayMaps, {
//       collapsed: false
//   }).addTo(myMap);

//   updateLegend();