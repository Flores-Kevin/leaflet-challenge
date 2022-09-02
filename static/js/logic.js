//Declares URL for tectonic plate json
let tectonicplates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();
// Create the tectonic layer for our map
let tectonicPlates = new L.layerGroup();

// Create a style for the lines.
let myLineStyle = {
	color: "red",
	weight: 2
};
// Retrieve tectonic plate GeoJSON data
d3.json(tectonicplates).then(function(data){
	// Create a GeoJSON layer with retrieved data
	L.geoJson(data,{
		style: myLineStyle
	}).addTo(tectonicPlates);
});
// Retrieve GeoJSON data for earthquakes
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"
d3.json(url).then((data) => {
    // Creating a GeoJSON layer with the retrieved data.
  	L.geoJson(data, {
        // Make markers and popup strings
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: style,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }}).addTo(earthquakes);
    // Declares styles for earthquake markers
    function style(feature) {
        return {
            radius: 8,
            fillColor: color(feature.properties.mag),
            radius: radius(feature.properties.mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
        };
    };
    // This function determines size of markers by radius.
    function radius(magnitude) {
    	if (magnitude === 0) {
    	return 1};
    	return magnitude * 2;
    };
    // This function determines the color of the circle based on the given magnitude of the earthquake.
    function color(magnitude) {
    	if (magnitude > 5) {
    	return "#ea2c2c";}
    	if (magnitude > 4) {
    	return "#ea822c";}
    	if (magnitude > 3) {
    	return "#ee9c00";}
    	if (magnitude > 2) {
    	return "#eecc00";}
    	if (magnitude > 1) {
    	return "#d4ee00";}
    	return "#98ee00";
    };
    // Adding the tile layer
    var tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    // Adding the satellite layer
    var satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        // maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });
    // Creating the map object
    var myMap = L.map("map", {
        center: [38.50,-95.00],
        zoom: 4,
        layers: [tile,tectonicPlates]
    });

    // Creating group of baseMaps
    var baseMaps = {
        "Grayscale": tile,
        "Satellite": satellite
    };
    // Creating group of overlayers
    var overlayMaps = {

        "Earthquakes": earthquakes,
        "Tectonic Plates": tectonicPlates
    };
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);

  // Set up the legend.
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = [1,2,3,4,5];
        const colors = [
            "#98ee00",
        	"#d4ee00",
        	"#eecc00",
        	"#ee9c00",
        	"#ea822c",
        	"#ea2c2c"]

		// For loop to add color squares and strings to legend
		for (var i = 0; i < limits.length; i++) {
			div.innerHTML +=
			"<i style='background: " + colors[i] + "'></i> " +
			limits[i] + (limits[i + 1] ? "&ndash;" + limits[i + 1] + "<br>" : "+");
        };
		return div;
    };
    // Adding the legend to the map
    legend.addTo(myMap);

});