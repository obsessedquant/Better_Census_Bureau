// Store our API endpoint as queryUrl.

var street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  // }).addTo(myMap);
});

var topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  attribution:
    'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
});

var geoJsonLocation = "48.geojson";
var csvLocation = "SVI2018_US_small.csv";

d3.csv(csvLocation).then(function (data) {
  // console.log("csvLocation", data);

  // Read dataset, put into variable, filter
  d3.json(geoJsonLocation).then(function (jsonData) {
    jsonData.features.forEach((x) => {
      id = x.properties.GEOID;
      csvId = data.filter((y) => y.FIPS === id);
      // console.log(csvId[0].E_TOTPOP);
      x.properties = Object.assign(x.properties, csvId[0]);
      // x.properties.EXTRA = csvId[0];
    });

    // Convert data from string to number
    jsonData.features.forEach((x) => {
      x.properties.E_TOTPOP = +x.properties.E_TOTPOP;
      x.properties.AREA_SQMI = +x.properties.AREA_SQMI;
      x.properties.zPop = x.properties.E_TOTPOP / x.properties.AREA_SQMI;
    });

    console.log("geoJsonLocation jsonData: ", jsonData.features);

    // Layer definition declarations
    var pop_per_sq_mile = new L.LayerGroup();
    var populationz = new L.LayerGroup();

    // Collect geojson depending on which layer is selected
    geojson_pop_per_sq_mi = L.choropleth(jsonData, {
      valueProperty: "zPop",

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
          "Location:<br>" +
            feature.properties.LOCATION +
            "<br><br>Population per Sq Mile:<br>" +
            Math.round(feature.properties.zPop)
        );
      },
      onEachFeature: function (feature, layer) {
        layer.on({
          mouseover: function (event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.9,
            });
          },
          mouseout: function (event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.5,
            });
          },
        });
      },
      // }).addTo(myMap);
    }).addTo(pop_per_sq_mile);

    // Second layer
    geojson_pop = L.choropleth(jsonData, {
      valueProperty: "E_TOTPOP",

      scale: ["#e7feff", "#4169e1"],

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
          "Location:<br>" +
            feature.properties.LOCATION +
            "<br><br>Population:<br>" +
            Math.round(feature.properties.E_TOTPOP)
        );
      },
      // }).addTo(myMap);
    }).addTo(populationz);

    // Legends

    var pop_legend = L.control({ position: "bottomright" });
    var pop_per_sq_mi_legend = L.control({ position: "bottomright" });

    pop_legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson_pop.options.limits;
      var colors = geojson_pop.options.colors;
      var labels = [];

      // Add the minimum and maximum.
      var legendInfo =
        "<h1>Population</h1>" +
        '<div class="labels">' +
        '<div class="min">' +
        limits[0] +
        "</div>" +
        '<div class="max">' +
        Math.round(limits[limits.length - 1]) +
        "</div>" +
        "</div>";

      div.innerHTML = legendInfo;

      limits.forEach(function (limit, index) {
        labels.push(
          '<li style="background-color: ' + colors[index] + '"></li>'
        );
      });

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };

    pop_per_sq_mi_legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson_pop_per_sq_mi.options.limits;
      var colors = geojson_pop_per_sq_mi.options.colors;
      var labels = [];

      // Add the minimum and maximum.
      var legendInfo =
        "<h1>Population per Sq Mi</h1>" +
        '<div class="labels">' +
        '<div class="min">' +
        limits[0] +
        "</div>" +
        '<div class="max">' +
        Math.round(limits[limits.length - 1]) +
        "</div>" +
        "</div>";

      div.innerHTML = legendInfo;

      limits.forEach(function (limit, index) {
        labels.push(
          '<li style="background-color: ' + colors[index] + '"></li>'
        );
      });

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };

    var myMap = L.map("map", {
      center: [29.7604, -95.3698],
      zoom: 12,
      layers: [street, pop_per_sq_mile],
    });

    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo,
    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      // Earthquakes: earthquakes,
      //"Earthquakes": layers.quakes,
      Population: populationz,
      "Population per sq mi": pop_per_sq_mile,
    };

    L.control
      .layers(baseMaps, overlayMaps, {
        collapsed: false,
      })
      .addTo(myMap);

    // Adding the legend to the map
    pop_per_sq_mi_legend.addTo(myMap);

    var layerToLegendMapping = {
      Population: pop_legend,
      "Population per sq mi": pop_per_sq_mi_legend,
    };
    function legendAdd(event) {
      var layername = event.name;
      myMap.addControl(layerToLegendMapping[layername]);
    }
    function legendRemove(event) {
      var layername = event.name;
      myMap.removeControl(layerToLegendMapping[layername]);
    }
    myMap.on("overlayadd", legendAdd);
    myMap.on("overlayremove", legendRemove);
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
