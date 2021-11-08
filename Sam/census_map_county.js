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

var geoJsonLocation = "US_by_County.json";
var csvLocation = "../Data/US_by_County.csv";

d3.csv(csvLocation).then(function (data) {
  console.log("csvLocation or data is: ", data);

  // Read dataset, put into variable, filter
  d3.json(geoJsonLocation).then(function (jsonData) {
    console.log("jsonData is: ", jsonData);

    jsonData.features.forEach((x) => {
      id = x.properties.NAME;
      // console.log("id is: ", id);
      csvId = data.filter((y) => y.COUNTY === id);
      // console.log("csvId is: ", csvId);
      // console.log("RPL_THEME1 is: ", x.properties.RPL_THEME1);
      x.properties = Object.assign(x.properties, csvId[0]);
      // x.properties.EXTRA = csvId[0];
    });

    // Convert data from string to number
    jsonData.features.forEach((x) => {
      x.properties.RPL_THEME1 = +x.properties.RPL_THEME1;
      x.properties.RPL_THEME2 = +x.properties.RPL_THEME2;
      x.properties.RPL_THEME3 = +x.properties.RPL_THEME3;
      x.properties.RPL_THEME4 = +x.properties.RPL_THEME4;
      x.properties.RPL_THEMES = +x.properties.RPL_THEMES;
    });

    console.log("geoJsonLocation jsonData: ", jsonData.features);

    // Layer definition declarations
    var RPL1 = new L.LayerGroup();
    var RPL2 = new L.LayerGroup();
    var RPL3 = new L.LayerGroup();
    var RPL4 = new L.LayerGroup();
    var RPLS = new L.LayerGroup();

    // Collect geojson depending on which layer is selected
    geojson_rpl1 = L.choropleth(jsonData, {
      valueProperty: "RPL_THEME1",

      scale: ["#ffffb2", "#00ff00"],

      steps: 5,

      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8,
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          // "Location:<br>" +
          feature.properties.NAME +
            "<br><br>RPL1:<br>" +
            Math.round(feature.properties.RPL_THEME1)
        );
      },
      // onEachFeature: function (feature, layer) {
      //   layer.on({
      //     mouseover: function (event) {
      //       layer = event.target;
      //       layer.setStyle({
      //         fillOpacity: 0.9,
      //       });
      //     },
      //     mouseout: function (event) {
      //       layer = event.target;
      //       layer.setStyle({
      //         fillOpacity: 0.5,
      //       });
      //     },
      //   });
      // },
      // }).addTo(myMap);
    }).addTo(RPL1);

    // Second layer
    geojson_rpl2 = L.choropleth(jsonData, {
      valueProperty: "RPL_THEME2",

      scale: ["#e7feff", "#ff6700"],

      steps: 5,

      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8,
      },

      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          // "Location:<br>" +
          feature.properties.NAME +
            "<br><br>RPL2:<br>" +
            Math.round(feature.properties.RPL_THEME2)
        );
      },
      // }).addTo(myMap);
    }).addTo(RPL2);

    geojson_rpl3 = L.choropleth(jsonData, {
      valueProperty: "RPL_THEME3",

      scale: ["#e7feff", "#5218fa"],

      steps: 5,

      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8,
      },

      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          // "Location:<br>" +
          feature.properties.NAME +
            "<br><br>RPL3:<br>" +
            Math.round(feature.properties.RPL_THEME3)
        );
      },
      // }).addTo(myMap);
    }).addTo(RPL3);

    geojson_rpl4 = L.choropleth(jsonData, {
      valueProperty: "RPL_THEME4",

      scale: ["#e7feff", "#4166f5"],

      steps: 5,

      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8,
      },

      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          // "Location:<br>" +
          feature.properties.NAME +
            "<br><br>RPL4:<br>" +
            Math.round(feature.properties.RPL_THEME4)
        );
      },
      // }).addTo(myMap);
    }).addTo(RPL4);

    geojson_rpls = L.choropleth(jsonData, {
      valueProperty: "RPL_THEMES",

      scale: ["#e7feff", "#e8000d"],

      steps: 5,

      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8,
      },

      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          // "Location:<br>" +
          feature.properties.NAME +
            "<br><br>RPLS:<br>" +
            Math.round(feature.properties.RPL_THEMES)
        );
      },
      // }).addTo(myMap);
    }).addTo(RPLS);

    // Legends

    var RPL1_legend = L.control({ position: "bottomright" });
    var RPL2_legend = L.control({ position: "bottomright" });
    var RPL3_legend = L.control({ position: "bottomright" });
    var RPL4_legend = L.control({ position: "bottomright" });
    var RPLS_legend = L.control({ position: "bottomright" });

    RPL1_legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson_rpl1.options.limits;
      var colors = geojson_rpl1.options.colors;
      var labels = [];

      console.log("geojson_rpl1.options is: ", geojson_rpl1.options);
      console.log("limits is: ", limits);
      console.log("limits[0] is: ", limits[0]);
      console.log("limits.length is: ", limits.length);
      console.log("limits.length-1 is: ", limits[limits.length - 1]);

      // Add the minimum and maximum.
      var legendInfo =
        "<h1>RPL1</h1>" +
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

    RPL2_legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson_rpl2.options.limits;
      var colors = geojson_rpl2.options.colors;
      var labels = [];

      // Add the minimum and maximum.
      var legendInfo =
        "<h1>RPL2</h1>" +
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

    RPL3_legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson_rpl3.options.limits;
      var colors = geojson_rpl3.options.colors;
      var labels = [];

      // Add the minimum and maximum.
      var legendInfo =
        "<h1>RPL3</h1>" +
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

    RPL4_legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson_rpl4.options.limits;
      var colors = geojson_rpl4.options.colors;
      var labels = [];

      // Add the minimum and maximum.
      var legendInfo =
        "<h1>RPL4</h1>" +
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

    RPLS_legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson_rpls.options.limits;
      var colors = geojson_rpls.options.colors;
      var labels = [];

      // Add the minimum and maximum.
      var legendInfo =
        "<h1>RPLS</h1>" +
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
      zoom: 4,
      layers: [street, RPL1],
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
      RPL1: RPL1,
      RPL2: RPL2,
      RPL3: RPL3,
      RPL4: RPL4,
      RPLS: RPLS,
    };

    L.control
      .layers(baseMaps, overlayMaps, {
        collapsed: false,
      })
      .addTo(myMap);

    // Adding the legend to the map
    RPL1_legend.addTo(myMap);

    var layerToLegendMapping = {
      RPL1: RPL1_legend,
      RPL2: RPL2_legend,
      RPL3: RPL3_legend,
      RPL4: RPL4_legend,
      RPLS: RPLS_legend,
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
