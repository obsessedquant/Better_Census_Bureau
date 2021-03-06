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
      x.properties.E_MINRTY = +x.properties.E_MINRTY;
      x.properties.mPop = (x.properties.E_MINRTY / x.properties.E_TOTPOP) * 100;
    });
    
    console.log("geoJsonLocation jsonData: ", jsonData.features);

    // Layer definition declarations
    var pop_per_sq_mile = new L.LayerGroup();
    var populationz = new L.LayerGroup();
    var per_mpop = new L.LayerGroup();
  
    geojson_mpop = L.choropleth(jsonData, {
      valueProperty: "mPop",

      scale: ["#ffffb2", "#06b100"],

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
            "<br><br>Percent of Minority<br>" +
            Math.round(feature.properties.mPop)
        );
      },
      // }).addTo(myMap);
    }).addTo(per_mpop);

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
    var per_mpop_legend = L.control({ position: "bottomright" });

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

    per_mpop_legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson_mpop.options.limits;
      var colors = geojson_mpop.options.colors;
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
      "Percent of Minorities": per_mpop,
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
      "Percent of Minorities": per_mpop_legend,
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

// Hover feature
  // function highlightFeature(e){
  //   var layer = e.target;

  //   layer.setStyle({
  //     weight: 5,
  //     color: '#666',
  //     dashArray: '',
  //     fillOpacity: 0.7
  //   });

  //   if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
  //     layer.bringToFront();
  //   }
  // }

  // function resetHignLight(e){
  //   jsonData.resetStyle(e.target);
  // }

  // function zoomToFeature(e){
  //   map.fitBounds(e.target.getBonunds());
  // }

  // function onEachFeature(feature, layer){
  //   layer.on({
  //     mouseover: highlightFeature,
  //     mouseout: resetHignLight,
  //     click: zoomToFeature,
  //   });
  // }

  // geojson = L.geoJson(jsonData, {
  //   style: style,
  //   onEachFeature: onEachFeature
  // }).addTo(map);

  // var info = L.control();

  // info.onAdd = function (map) {
  //   this._div = L.DomUtil.create('div', 'info');
  //   this.update();
  //   return this._div;
  // }

  // info.update = function(props){
  //   this._div.innerHTML = '<h4>Texas Population Census</h4>' + (props ?
  //     '<b>' + props.LOCATION + '</b><b />' + props.mPop + 'people / mi<sup>2</sup>'
  //     : 'Hover over an Area')
  // };

  // info.addTo(map)

  // function highlightFeature(e){
  //   info.update(layer.feature.properties);
  // }

  // function resetHignLight (e){
  //   info.update();
  // }