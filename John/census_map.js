// Store our API endpoint as queryUrl.

var myMap = L.map("map", {
  center: [29.7604, -95.3698],
  zoom: 12
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

var geoJsonLocation = "48.geojson";
var csvLocation = "SVI2018_US_small.csv";


d3.csv(csvLocation).Promise.then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  console.log("csvLocation", data);
  d3.json(geoJsonLocation).Promise.then(function (jsonData) {
    console.log("geoJsonLocation jsonData: ", jsonData);
    // Once we get a response, send the data.features object to the createFeatures function.
    // createFeatures(jsonData.features);
    All_Data = [];
    var id = "";
    var csvId = "";
    jsonData.features.forEach(x => {
      id = x.properties.GEOID;
      // if(id==="48201542301"){
      csvId = data.filter(y => y.FIPS === id);
      x.properties.EXTRA = csvId[0];
      // console.log(x);
      // console.log(csvId);
      All_Data.push(x);

      // }

    });
    console.log("all_data", All_Data);

    var Geojson;

    // d3.json(all_data).then(function (data) {

    Geojson = L.choropleth(All_Data, {

      valueProperty: "E_TOTPOP",

      scale: ["#ffffb2", "#b10026"],

      steps: 10,

      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },

      onEachFeature: function (feature, layer) {
        layer.bindPopup("Census location: " + feature.properties.EXTRA.E_TOTPOP + "<br>E_TOTPOP:<br>" + "$" + parseInt(feature.properties.EXTRA.E_TOTPOP));
      }
    }).addTo(myMap);


    d3.csv(csvLocation).then(function (data) {
      // Once we get a response, read the data into variables

      // console.log("csvLocation", data);
      d3.json(geoJsonLocation).then(function (jsonData) {

        jsonData.features.forEach(x => {
          id = x.properties.GEOID;
          csvId = data.filter(y => y.FIPS === id);
          x.properties.EXTRA = csvId[0];
        });


        console.log("geoJsonLocation jsonData: ", jsonData);

        L.geoJson(jsonData, {
          style: {},
          onEachFeature: function (feature, layer) {

          }

        }).addTo(myMap);
        //   all_data = [];
        //   var id = "";
        //   var csvId = "";

        //    jsonData.features.forEach(x => 
        //      {

        //       id = x.properties.GEOID;
        //      // console.log("id",id)
        //       csvId = data.filter(y => y.FIPS === id);
        //     //  console.log("csvID",csvId)
        //       x.properties.EXTRA = csvId[0];
        //     //  console.log("x",x)
        //       all_data.push(x);
        //      });

        // // console.log("all_data",all_data);
        // // the all_data list should have the data that we need to bind to the map
        //   createFeatures(all_data);


      });

      // console.log("geoJsonLocation jsonData: ", jsonData);
      all_data = [];
      var id = "";
      var csvId = "";

      jsonData.features.forEach(x => {

        id = x.properties.GEOID;
        // console.log("id",id)
        csvId = data.filter(y => y.FIPS === id);
        //  console.log("csvID",csvId)
        x.properties.EXTRA = csvId[0];
        //  console.log("x",x)
        all_data.push(x);
      });

      // console.log("all_data",all_data);
      // the all_data list should have the data that we need to bind to the map
      createFeatures(all_data);


    });

  });

  // end census_map.js




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
    console.log("coordinates are: ", houstonData[0].geometry.coordinates[0][0][1]);
    console.log("E_TOTPOP is: ", houstonData[0].properties.EXTRA.E_TOTPOP);
    console.log("E_TOTPOP is: ", parseInt(houstonData[0].properties.EXTRA.E_TOTPOP));
    var geojson;

    // d3.json(all_data).then(function (data) {

    geojson = L.choropleth(all_data,
      {

        valueProperty: "E_TOTPOP",

        scale: ["#ffffb2", "#b10026"],

        steps: 10,

        mode: "q",
        style: {
          // Border color
          color: "#fff",
          weight: 1,
          fillOpacity: 0.8
        },

        onEachFeature: function (feature, layer) {
          layer.bindPopup("Census location: " + feature.properties.EXTRA.E_TOTPOP + "<br>E_TOTPOP:<br>" + "$" +
            parseInt(feature.properties.EXTRA.E_TOTPOP));
        }
      }).addTo(myMap);
  };

}
);