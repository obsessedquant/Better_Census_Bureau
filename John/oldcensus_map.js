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

var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
}

info.update = function(props) {
  this._div.innerHTML = '<h4>Texas Population</h4>'+ (props ?
    '<b>' + props.name + '</b><br />' + props.density + 'people / mi<sup>2</sup>'
    : 'Hover over area');
};

info.addTo(myMap)

function highlightFeature(e){
  info.update(layer.feature.properties);
}

function resetHighlight(e){
  info.update();
}

function getColor(d) {
  return d > 100000 ? '#ff3333' :
    d > 10000 ? '#ff6633' :
      d > 1000 ? '#ff9933' :
        d > 0 ? '#ffcc33' :
          '#ccff33';
}


var legend = L.control({ position: 'topright' });

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1000, 10000, 100000];
    labels = [];


  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + pickHex(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(myMap);
