/**
 * Created by elis on 07.09.2015.
 */


// google maps
var map;
var image;
var shadow;
var marker;
var markers = [];
$(function(){

    var currentLat, currentLng;

    // central point of the map
    var latlng = new google.maps.LatLng('52.3877833', '13.0831297');

    // creates the map
    /**
     * Function visualize Google Maps and marker on it.
     * */
    function showMap() {

        markers = [];

        var myOptions = {
            zoom: 15,                                                   // set zoom factor
            center: latlng,                                             // center map at set coordinates
            mapTypeId: 'roadmap',                                       // set map type
            mapTypeControl: true,                                       // activate map control elements
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,   // set drop down menu for control element
                position: google.maps.ControlPosition.LEFT_BOTTOM       // set position of control element
            }
        };

        // flat ui style
        var style = [/*{
         "stylers": [{
         "visibility": "off"
         }]
         },*/ {
            "featureType": "road",      // streets are white
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#ffffff"
            }]
        }, {
            "featureType": "road.arterial",     // main streets are yellow
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#fee379"
            }]
        }, {
            "featureType": "road.highway",      // highways are yellow
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#fee379"
            }]
        }, {
            "featureType": "landscape",         // landscape is grey
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#f3f4f4"
            }]
        }, {
            "featureType": "water",             // water is blue
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#7fc8ed"
            }]
        }, {
            "featureType": "road",              // road labels are grey
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "on"
            }, {
                "weight": 1
            }, {
                "color": "#7A7A7A"
            }]
        }, {
            "featureType": "road.arterial",    // road labels are light grey
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#545454"
            }]
        }, {
            "featureType": "road.highway",     // road labels are light grey
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#545454"
            }]
        }, {
            "featureType": "poi.park",          // parks are light green
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#83cead"
            }]
        }, {
            "featureType": "water",
            "elementType": "labels.text",   // water labels are white
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#eeeeee"
            }, {
                "weight": 1
            }]
        }, /*{
         "featureType": "transit",
         "elementType": "labels.text",   // transit labels are grey
         "stylers": [{
         "visibility": "on"
         }, {
         "color": "#B8B8B8"
         }, {
         "weight": 1
         }]
         },*/ /*{
         "featureType": "poi",
         "elementType": "labels.text",   // poi labels are grey
         "stylers": [{
         "visibility": "on"
         }, {
         "color": "#B8B8B8"
         }, {
         "weight": 1
         }]
         },*/ /*{
         "featureType": "landscape",
         "elementType": "labels.text",   // landscape labels are grey
         "stylers": [{
         "visibility": "on"
         }, {
         "color": "#B8B8B8"
         }, {
         "weight": 1
         }]
         },*/ /*{
         "featureType": "administrative",
         "elementType": "labels.text",    // administrative labels are grey
         "stylers": [{
         "visibility": "on"
         }, {
         "color": "#333333"
         }, {
         "weight": 1
         }]
         },*/ {
            "featureType": "landscape.man_made",
            "elementType": "geometry",
            "stylers": [{
                "weight": 0.9
            }, {
                "visibility": "off"
            }]
        }]

        // create new map object
        map = new google.maps.Map($('#maps')[0], myOptions);
        map.setOptions({
            styles: style,
            linksControl: false,
            panControl: false,
            mapTypeControl: true,
            streetViewControl: false
        });

        // get flat marker image
        image = {
            url: 'https://dl.dropboxusercontent.com/u/814783/fiddle/marker.png',
            scaledSize: new google.maps.Size(20, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(10, 45)
        };
        // get flat marker shadow image
        shadow = {
            url: 'https://dl.dropboxusercontent.com/u/814783/fiddle/shadow.png',
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(-2, 36)
        };
        // create marker
        marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: image,
            shadow: shadow
        });
        // marker not set on map per default
        marker.setMap(null);

        // set new marker if user clicked into the map
        google.maps.event.addListener(map, "click", function(e) {
            replaceMarker(e.latLng);
            currentLat = e.latLng.lat();
            $("#inputContextParameter1")[0].value = currentLat;
            currentLng = e.latLng.lng();
            $("#inputContextParameter2")[0].value = currentLng;
        });

        // delete old and set new marker
        /**
         * Function deletes old and set new google maps marker.
         * @param {Object} location Contains location of a google maps marker.
         * */
        function replaceMarker(location) {
            // deletion
            marker.setMap(null);
            for (var i = 0, mark; mark = markers[i]; i++) {
                mark.setMap(null);
            }
            markers = [];

            // set new marker
            marker = new google.maps.Marker({
                position: location,
                map: map,
                icon: image,
                shadow: shadow
            });
        }

        /* add search box */
        // Create the search box and link it to the UI element.
        var input = /** @type {HTMLInputElement} */(
            document.getElementById('pac-input')
        );
        // add input to map
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var searchBox = new google.maps.places.SearchBox(
            /** @type {HTMLInputElement} */(input)
        );
        //var autocomplete = new google.maps.places.Autocomplete(input);

        // [START region_getplaces]
        // Listen for the event fired when the user selects an item from the
        // pick list. Retrieve the matching places for that item.
        google.maps.event.addListener(searchBox, 'places_changed', function() {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }
            for (var i = 0, mark; mark = markers[i]; i++) {
                mark.setMap(null);
            }

            // For each place, get the icon, place name, and location.
            markers = [];
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0, place; place = places[i]; i++) {

                // Create a marker for each place.
                var marker = new google.maps.Marker({
                    map: map,
                    icon: image,
                    title: place.name,
                    position: place.geometry.location
                });

                // add marker
                markers.push(marker);

                bounds.extend(place.geometry.location);

                // set input fields with coordinates
                $("#inputContextParameter1")[0].value = place.geometry.location["k"];
                $("#inputContextParameter2")[0].value = place.geometry.location["D"];
            }

            map.fitBounds(bounds);
            map.setOptions({zoom: 15});
        });
        // [END region_getplaces]

        // Bias the SearchBox results towards places that are within the bounds of the
        // current map's viewport.
        google.maps.event.addListener(map, 'bounds_changed', function() {
            var bounds = map.getBounds();
            searchBox.setBounds(bounds);
        });
        /* end search box */
    }

    // resize map due to map opening
    /*function resizeMap() {
     if (typeof map == "undefined") return;
     var center = map.getCenter();
     google.maps.event.trigger(map, "resize");
     map.setCenter(center);
     }*/

    // add event listeners showMap and resizeMap
    google.maps.event.addDomListener(window, 'load', showMap);
    google.maps.event.addDomListener(window, "resize", resizeMap());
});


// resize map due to map opening
/**
 * Function resize map if it becomes visible.
 * */
function resizeMap() {
    if (typeof map == "undefined") return;
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
    map.setOptions({mapTypeControl: true});
}


// delete old and set new marker
/**
 * Function deletes old and set new google maps marker.
 * @param {Object} location Contains location of a google maps marker.
 * */
function replaceMarker2(location) {

    // clean map and delete marker
    marker.setMap(null);
    for (var i = 0, mark; mark = markers[i]; i++) {
        mark.setMap(null);
    }

    // set new marker
    markers = [];
    marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: image,
        shadow: shadow
    });
}