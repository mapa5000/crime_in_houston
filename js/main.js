require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapGallery",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend"

  ], function(esriConfig,Map,MapView,BasemapGallery,FeatureLayer,Legend) {

    esriConfig.apiKey = "AAPKf17e12c2a82648b5a870176ef6d66b88m-VeahPjL09FKe7Ipq3PR0iC18FdHxxfrJUiYk-GOpfhqPRXLAl2SURlhC0sVQdt";

    const map = new Map({
      basemap: "dark-gray" // Basemap layer service
    });

    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-95.39,29.94], // Longitude, latitude
      zoom: 9
    });
    var basemapGallery = new BasemapGallery({
      view: view
    });

    // Create a UI with the filter expressions
    const sqlExpressions = ["Choose a SQL where clause...", "YEAR=2011", "YEAR=2013", "YEAR=2015", "YEAR=2018"];

    // UI
    const selectFilter = document.createElement("select");
    selectFilter.setAttribute("class", "esri-widget esri-select");
    selectFilter.setAttribute("style", "width: 275px; font-family: courier; font-size: 1em;");

    sqlExpressions.forEach(function(sql){
      let option = document.createElement("option");
      option.value = sql;
      option.innerHTML = sql;
      selectFilter.appendChild(option);
    });

    view.ui.add(selectFilter, "top-right");

    // Add a feature layer to map with all features visible on client (no filter)
    const featureLayer = new FeatureLayer({
      url: "https://services.arcgis.com/aY6P1IjnU1hzETf0/arcgis/rest/services/HPD_RecentCrime/FeatureServer",
      outFields: ["*"],
      popupTemplate: {
        title: "Crime Details",
        content:[
                    {
                    type: "fields",
                    fieldInfos: [
                        {
                        fieldName: "OffenseDes",
                        label: "Crime"
                        },
                        {
                        fieldName: "Match_addr",
                        label: "Address",
                        },
                        {
                        fieldName: "ARC_City",
                        label: "City"
                        },
                        {
                        fieldName: "ARC_State",
                        label: "State"
                        },
                        {
                        fieldName: "YEAR",
                        label: "Year",
                        format: {
                            digitSeparator: true,
                            places: 0
                            }
                        }
                    ]
                }
            ]
        },
      definitionExpression: "1=0"
    });
    map.add(featureLayer);

    // Server-side filter
    function setFeatureLayerFilter(expression) {
      featureLayer.definitionExpression = expression;
    }

    // Event listener
    selectFilter.addEventListener('change', function (event) {
      setFeatureLayerFilter(event.target.value);
    });
    var legend = new Legend({
      view: view,
      layerInfos: [{
        layer: featureLayer,
        title: "Crime Points"
      }]
    });
    view.ui.add(legend, "bottom-left");
    const infoDiv = document.getElementById("infoDiv");
    view.ui.add(infoDiv, "top-right");
    view.ui.add(basemapGallery,"top-left");
  });