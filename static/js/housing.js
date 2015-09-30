
$(function () {

    var map;
    var ajaxRequest;
    var plotlist;
    var plotlayers = [];
    var marker;

    var latitude;
    var longitude;


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


    // Create an element to hold all text and markup
    var popup_container = $('<div />');

    // set up popup on click
    var popup = L.popup();
    var button='<br/><button type = "button" id = "submit" class = "btn btn-danger" data-loading-text = "Loading ...">Predict Sold Price</button>';

    function onMapClick(e) {
        // if map has a marker, remove it first
        if (marker) {
            map.removeLayer(marker);
        }

        // create a marker
        marker = new L.Marker(e.latlng);
        map.addLayer(marker);

        // create popup
        popup_container.html("<h4>You clicked the map at " + e.latlng.toString() + "</h4>" + button);
        marker.bindPopup(popup_container[0]).openPopup();

        // reverse geocode
        latitude = e.latlng.lat;
        longitude = e.latlng.lng;
    }



    // click map show marker and popup
    map.on('click', onMapClick);

    // click submit in the popup container to send user input to server
    popup_container.on("click","#submit" ,function (e) {
        // preventing default click action
        e.preventDefault();

        // show loading button
        var $btn = $(this);
        $btn.button("loading");

        // combine user input to string
        user_input=$(".user_input").serialize();
        user_input= user_input+'&GeoLon='+ longitude+'&GeoLat='+ latitude;

        // process user submission
        $.ajax({
            url: $SCRIPT_ROOT,
            type: "post",
            data: user_input,
            success: function (data) {
                console.log("success");
                console.log(data);
                //if ($.isEmptyObject(data)) {
                //    $("#bokeh_warning").removeClass("hidden");
                //    $("#bokeh_warning").addClass("show");
                //
                //    // reset loading button
                //    setTimeout(function () {
                //        $btn.button("reset");
                //    }, delay);
                //}
                //
                //$("#bokeh_plot").html(data.div + data.script);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert(xhr.responseText);
                console.log(xhr.responseText);
            }
        });
    });




});
