$(function () {

    var map;
    var ajaxRequest;
    var plotlist;
    var plotlayers = [];

    // set up the map
    map = new L.Map('map');

    // create the tile layer with correct attribution
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {
        minZoom: 8,
        attribution: osmAttrib
    });

    // start the map in phoenix
    map.setView(new L.LatLng(33.5, -112.03), 10);
    map.addLayer(osm);

    var marker = L.marker([33.5, -112.03]).addTo(map);

    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }

    map.on('click', onMapClick);
});
