function test_address(address) {
    if (typeof address == 'undefined') {
        address = ''
    }
    return address;
}

$(function () {
    $('.carousel').carousel({
        interval: 5000 //changes the speed
    });


    var map;
    var marker;
    var latitude;
    var longitude;

    // set up the map
    map = new L.Map('map', {
        sleep: true,
        sleepTime: 750,
        wakeTime: 750,
        sleepNote: true,
        hoverToWake: true
    });

    // create the tile layer with correct attribution
    var osmUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    var osm = new L.TileLayer(osmUrl, {
        minZoom: 5
    });

    // start the map in phoenix
    map.setView(new L.LatLng(33.58, -112.0), 10);
    map.addLayer(osm);


    // add yuantian210's pheonix housing price layer
    var layerUrl = 'http://yuantian210.cartodb.com/api/v2/viz/13efed9a-6857-11e5-9859-0e787de82d45/viz.json';
    cartodb.createLayer(map, layerUrl)
        .addTo(map)
        .on('done', function (layer) {
            layer.setInteraction(true);
            //layer.on('featureOver', function (e, latlng, pos, data) {
            //    cartodb.log.log(e, latlng, pos, data);
            //});
            layer.on('error', function (err) {
                cartodb.log.log('error: ' + err);
            });
        }).on('error', function () {
            cartodb.log.log('some error occurred');
        });


    // Create an element to hold all text and markup
    var popup_container = $('<div><h5 id="display_address"> </h5><div class="alert alert-success" role="alert" id="prediction"></div><button type = "submit" id = "query" class = "btn btn-primary">Predict Sold Price</button> </div>');

    // set up popup on click
    var popup = L.popup();

    function onMapClick(e) {
        // if map has a marker, remove it first
        if (marker) {
            map.removeLayer(marker);
        }

        // reverse geocode user click
        latitude = e.latlng.lat.toString();
        longitude = e.latlng.lng.toString();

        $.ajax({
            url: 'http://nominatim.openstreetmap.org/reverse?format=json&lat=' + latitude + '&lon=' + longitude,
            type: 'post',
            success: function (data) {
                //console.log('success');
                //console.log(data);

                // create a marker
                marker = new L.Marker(e.latlng);
                map.addLayer(marker);

                // parse address info
                var address = data.address;
                var house_number = test_address(address.house_number);
                var road = test_address(address.road);
                var city = test_address(address.city);
                var state = test_address(address.state);
                var postcode = test_address(address.postcode);
                var display_address = house_number + ' ' + road + '<br/>' + city + ', ' + state + ' ' + postcode;

                // create popup
                marker.bindPopup(popup_container[0]).openPopup();

                // limit click only in phoenix
                if (data.address.city != 'Phoenix') {
                    $('#display_address').text('No enough data to make a' +
                        ' prediction for the selected address');
                    $('#query').hide();
                    $('#prediction').hide();
                }
                else {
                    $('#display_address').html(display_address);
                    $('#query').show();
                    $('#prediction').hide();
                }


            },
            error: function (xhr, textStatus, errorThrown) {
                alert(xhr.responseText);
                console.log(xhr.responseText);
            }
        });

    }


    // click map show marker and popup
    map.on('click', onMapClick);


    // click submit in the popup container to send user input to server
    $(document).on('click', '#query', function () {

        $('#housing_form')
            .formValidation({
                framework: 'bootstrap',
                excluded: ':disabled',
                fields: {
                    DwellingType: {
                        validators: {
                            notEmpty: {
                                message: 'Choose housing type'
                            }
                        }
                    },
                    LivingArea: {
                        validators: {
                            notEmpty: {
                                message: 'Enter housing size in sqft'
                            },
                            between: {
                                min: 100,
                                max: 20000,
                                message: 'Reasonable number only'
                            }
                        }
                    },
                    NumBedrooms: {
                        validators: {
                            notEmpty: {
                                message: 'Enter bedroom number'
                            },
                            regexp: {
                                regexp: /^([1-9]|1[0-5])$/,
                                message: 'Reasonable bedrooms number only'
                            }
                        }
                    },
                    NumBaths: {
                        validators: {
                            notEmpty: {
                                message: 'Enter bathroom number'
                            },
                            regexp: {
                                regexp: /^([0-9]|1[0-5])$/,
                                message: 'Reasonable bathrooms number only'
                            }
                        }
                    },
                    ExteriorStories: {
                        validators: {
                            notEmpty: {
                                message: 'Choose exterior story'
                            }
                        }
                    },
                    Pool: {
                        validators: {
                            notEmpty: {
                                message: 'Choose pool preference'
                            }
                        }
                    }
                }

            })
            .on('err.field.fv', function (e, data) {
                data.fv.disableSubmitButtons(false);
            })
            .on('success.field.fv', function (e, data) {
                data.fv.disableSubmitButtons(false);
            })
            .on('success.form.fv', function (e) {
                // Prevent form submission
                e.preventDefault();

                // combine user input to string
                user_input = $('.user_input').serialize();
                user_input = user_input + '&GeoLon=' + longitude + '&GeoLat=' + latitude;

                // process user submission
                $.ajax({
                    url: $SCRIPT_ROOT,
                    type: 'post',
                    data: user_input,
                    success: function (data) {
                        //console.log('success');
                        //console.log(data);
                        // create popup
                        $('#prediction').show();
                        $('#prediction').html('<h3>' + data + '</h3>');
                        //marker.bindPopup(popup_container[0]).openPopup();
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        alert(xhr.responseText);
                        console.log(xhr.responseText);
                    }
                });
            });

    });


});
