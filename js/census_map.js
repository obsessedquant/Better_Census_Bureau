// Store our API endpoint as queryUrl.

var myMap = L.map("map", {
  center: [29.7604, -95.3698],
  zoom: 12
});

// Using this method requires an access token with mapbox.com
var street = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenS...',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  // accessToken: 'your.mapbox.access.token.here'
  accessToken: 'pk.eyJ1Ijoic3JvYmluc29uMjI2IiwiYSI6ImNrdmh4OGczdWFrMmsydW9mdGViZjB4enYifQ.M7SwNQspK272zHmaVqumdA'
}).addTo(myMap);

// var topo = L.tileLayer('https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token={accessToken}', {
//   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenS...',
//   maxZoom: 18,
//   id: 'mapbox/streets-v11',
//   tileSize: 512,
//   zoomOffset: -1,
//   // accessToken: 'your.mapbox.access.token.here'
//   accessToken: 'pk.eyJ1Ijoic3JvYmluc29uMjI2IiwiYSI6ImNrdmh4OGczdWFrMmsydW9mdGViZjB4enYifQ.M7SwNQspK272zHmaVqumdA'
// }).addTo(myMap);

var geoJsonLocation = "48.geojson";
var csvLocation = "SVI2018_US.csv";

d3.csv(csvLocation).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  console.log("csvLocation", data);
  d3.json(geoJsonLocation).then(function (jsonData) {
    console.log("geoJsonLocation", jsonData);
    // Once we get a response, send the data.features object to the createFeatures function.
    // createFeatures(jsonData.features);
    all_data = [];
    var id = "";
    var csvId = "";
    jsonData.features.forEach(x => {
      id = x.properties.GEOID;
      // if(id==="48201542301"){
      csvId = data.filter(y => y.FIPS === id);
      x.properties.EXTRA = csvId[0];
      // console.log(x);
      // console.log(csvId);
      all_data.push(x);

      // }

    });
    console.log("all_data", all_data);
    // 
  });
  // createFeatures(data.features);
});


