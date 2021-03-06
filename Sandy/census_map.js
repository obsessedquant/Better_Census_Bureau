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
// var csvLocation = "SVI2018_US_small.csv";
var csvLocation = "../Data/Texas_Houston.csv";

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
      x.properties.EP_POV = +x.properties.EP_POV;
      x.properties.EP_UNEMP = +x.properties.EP_UNEMP;
      x.properties.EP_PCI = +x.properties.EP_PCI;
      x.properties.EP_NOHSDP = +x.properties.EP_NOHSDP;
      x.properties.E_MINRTY = +x.properties.E_MINRTY;
      x.properties.mPop = (x.properties.E_MINRTY / x.properties.E_TOTPOP) * 100;
      x.properties.E_MUNIT = +x.properties.E_MUNIT;
      x.properties.E_MOBILE = +x.properties.E_MOBILE;
      x.properties.E_CROWD = +x.properties.E_CROWD;
      x.properties.E_NOVEH = +x.properties.E_NOVEH;
      x.properties.E_GROUPQ = +x.properties.E_GROUPQ;
    });

    console.log("geoJsonLocation jsonData: ", jsonData.features);

    // Layer definition declarations
    var pop_per_sq_mile = new L.LayerGroup();
    var populationz = new L.LayerGroup();
    var below_pov = new L.LayerGroup();
    var unemploy = new L.LayerGroup();
    var incomez = new L.LayerGroup();
    var hi_school = new L.LayerGroup();
    var per_mpop = new L.LayerGroup();
    var per_ten_or_more = new L.LayerGroup();
    var per_mob_est = new L.LayerGroup();
    var per_peo_per_rms = new L.LayerGroup();
    var per_no_veh = new L.LayerGroup();
    var per_group_qtr = new L.LayerGroup();

    geojson_ten_or_more = L.choropleth(jsonData, {
      valueProperty: "E_MUNIT",

      scale: ["#DDA0DD", "#C71585"],

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
            "<br><br>10 or More Units Estimate<br>" +
            Math.round(feature.properties.E_MUNIT)
        );
      },
      // }).addTo(myMap);
    }).addTo(per_ten_or_more);

    geojson_mob_est = L.choropleth(jsonData, {
      valueProperty: "E_MOBILE",

      scale: ["#9ACD32", "#808000"],

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
            "<br><br>Mobile Homes<br>" +
            Math.round(feature.properties.E_MOBILE)
        );
      },
      // }).addTo(myMap);
    }).addTo(per_mob_est);

    geojson_peo_per_rms = L.choropleth(jsonData, {
      valueProperty: "E_CROWD",

      scale: ["#FFC0CB", "#FA8072"],

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
            "<br><br>Occupied Housing Units<br>" +
            Math.round(feature.properties.E_CROWD)
        );
      },
      // }).addTo(myMap);
    }).addTo(per_peo_per_rms);

    geojson_no_veh = L.choropleth(jsonData, {
      valueProperty: "E_NOVEH",

      scale: ["#B0E0E6", "#20B2AA"],

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
            "<br><br>No Vehicle<br>" +
            Math.round(feature.properties.E_NOVEH)
        );
      },
      // }).addTo(myMap);
    }).addTo(per_no_veh);

    geojson_group_qtr = L.choropleth(jsonData, {
      valueProperty: "E_GROUPQ",

      scale: ["#FF7F50", "#FF4500"],

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
            "<br><br>Persons in Group Quarters<br>" +
            Math.round(feature.properties.E_GROUPQ)
        );
      },
      // }).addTo(myMap);
    }).addTo(per_group_qtr);

    geojson_below_pov = L.choropleth(jsonData, {
      valueProperty: "EP_POV",

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
            "<br><br>Percent Below Poverty<br>" +
            Math.round(feature.properties.EP_POV)
        );
      },
      // }).addTo(myMap);
    }).addTo(below_pov);

    geojson_unemploy = L.choropleth(jsonData, {
      valueProperty: "EP_UNEMP",

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
            "<br><br>Percent of Unemployed<br>" +
            Math.round(feature.properties.EP_UNEMP)
        );
      },
      // }).addTo(myMap);
    }).addTo(unemploy);

    geojson_income = L.choropleth(jsonData, {
      valueProperty: "EP_PCI",

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
            "<br><br>Percent of Income<br>" +
            Math.round(feature.properties.EP_PCI)
        );
      },
      // }).addTo(myMap);
    }).addTo(incomez);

    geojson_hi_school = L.choropleth(jsonData, {
      valueProperty: "EP_NOHSDP",

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
            "<br><br>Percent of No High School Diploma<br>" +
            Math.round(feature.properties.EP_NOHSDP)
        );
      },
      // }).addTo(myMap);
    }).addTo(hi_school);

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
    var below_pov_legend = L.control({ position: "bottomright" });
    var unemploy_legend = L.control({ position: "bottomright" });
    var income_legend = L.control({ position: "bottomright" });
    var hi_school_legend = L.control({ position: "bottomright" });
    var per_mpop_legend = L.control({ position: "bottomright" });
    var per_10_or_more_legend = L.control({ position: "bottomright" });
    var per_mob_est_legend = L.control({ position: "bottomright" });
    var per_peo_per_rms_legend = L.control({ position: "bottomright" });
    var per_no_veh_legend = L.control({ position: "bottomright" });
    var per_group_qtr_legend = L.control({ position: "bottomright" });

    per_10_or_more_legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson_ten_or_more.options.limits;
      var colors = geojson_ten_or_more.options.colors;
      var labels = [];

      // Add the minimum and maximum.
      var legendInfo =
        "<h1>10 =< Housing Units</h1>" +
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

    per_mob_est_legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson_mob_est.options.limits;
      var colors = geojson_mob_est.options.colors;
      var labels = [];

      // Add the minimum and maximum.
      var legendInfo =
        "<h1>10 =< Housing Units</h1>" +
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

    per_peo_per_rms_legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson_peo_per_rms.options.limits;
      var colors = geojson_peo_per_rms.options.colors;
      var labels = [];

      // Add the minimum and maximum.
      var legendInfo =
        "<h1>10 =< Housing Units</h1>" +
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

    per_no_veh_legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson_no_veh.options.limits;
      var colors = geojson_no_veh.options.colors;
      var labels = [];

      // Add the minimum and maximum.
      var legendInfo =
        "<h1>10 =< Housing Units</h1>" +
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

    per_group_qtr_legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson_group_qtr.options.limits;
      var colors = geojson_group_qtr.options.colors;
      var labels = [];

      // Add the minimum and maximum.
      var legendInfo =
        "<h1>10 =< Housing Units</h1>" +
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

    below_pov_legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson_below_pov.options.limits;
      var colors = geojson_below_pov.options.colors;
      var labels = [];

      // Add the minimum and maximum.
      var legendInfo =
        "<h1>Pct Below Poverty</h1>" +
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

    unemploy_legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson_unemploy.options.limits;
      var colors = geojson_unemploy.options.colors;
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

    income_legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson_income.options.limits;
      var colors = geojson_income.options.colors;
      var labels = [];

      // Add the minimum and maximum.
      var legendInfo =
        "<h1>Income</h1>" +
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

    hi_school_legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson_hi_school.options.limits;
      var colors = geojson_hi_school.options.colors;
      var labels = [];

      // Add the minimum and maximum.
      var legendInfo =
        "<h1>Pct No High School Diploma</h1>" +
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
      "Pct Below Poverty": below_pov,
      "Pct Unemployed": unemploy,
      Income: incomez,
      "Pct No High School Diploma": hi_school,
      "Percent of Minorities": per_mpop,
      "10 or more Housing Units": per_ten_or_more,
      "Mobile Homes": per_mob_est,
      "Occupied Housing Units": per_peo_per_rms,
      "No Vehicles": per_no_veh,
      "Group Quarters": per_group_qtr,
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
      "Pct Below Poverty": below_pov_legend,
      "Pct Unemployed": unemploy_legend,
      Income: income_legend,
      "Pct No High School Diploma": hi_school_legend,
      "Percent of Minorities": per_mpop_legend,
      "10 or more Housing Units": per_10_or_more_legend,
      "Mobile Homes": per_mob_est_legend,
      "Occupied Housing Units": per_peo_per_rms_legend,
      "No Vehicle": per_no_veh_legend,
      "Group Quarters": per_group_qtr_legend,
    };
    // .addTo(myMap);

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
