/**
 * Created by elis on 07.09.2015.
 */

// google maps and marker
var map;
var marker;

// flat ui style
var style = [
    /*{
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
    }];
// flat marker image
var image = {
    url: 'https://dl.dropboxusercontent.com/u/814783/fiddle/marker.png',
    scaledSize: new google.maps.Size(20, 40),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(10, 45)
};
// flat marker shadow image
var shadow = {
        url: 'https://dl.dropboxusercontent.com/u/814783/fiddle/shadow.png',
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(-2, 36)
    };

$(function(){

    // resize map due to map opening
    /*function resizeMap() {
     if (typeof map == "undefined") return;
     var center = map.getCenter();
     google.maps.event.trigger(map, "resize");
     map.setCenter(center);
     }*/

    // add load and resize event handlers
    google.maps.event.addDomListener(window, "load", initMap());
    google.maps.event.addDomListener(window, "resize", resizeMap());
});

// creates the map
/**
 * Function visualize Google Maps and marker on it.
 * */
function initMap() {

    var currentLat = '52.3877833';
    var currentLng = '13.0831297';
    var latlng = new google.maps.LatLng(currentLat, currentLng);

    var lngInputDiv = $("#divMaps").prev();
    var latInputDiv = $(lngInputDiv).prev();

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

    // create new map object
    map = new google.maps.Map($('#maps')[0], myOptions);
    map.setOptions({
        styles: style,
        linksControl: false,
        panControl: false,
        mapTypeControl: true,
        streetViewControl: false
    });

    // create marker
    marker = new google.maps.Marker({
        position: latlng,
        map: map,
        icon: image,
        shadow: shadow
    });
    // marker not set on map per default
    marker.setMap(null);


    /* add search box */

    // Create the search box and link it to the UI element.
    var inputElement = $("#pac-input");
    // add input to map
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputElement);
    var searchBox = new google.maps.places.SearchBox(inputElement);
    //var autocomplete = new google.maps.places.Autocomplete(inputElement);


    /* add event handlers */

    // set new marker if user clicked into the map
    google.maps.event.addListener(map, "click", function(e) {
        replaceMarker(e.latLng);
        $(latInputDiv).children("input")[0].value = e.latLng.lat();
        $(lngInputDiv).children("input")[0].value = e.latLng.lng();
    });


    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    var markers = [];
    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length == 0)
            return;
        // get markers for found places and place them on map
        getPlacesOnMap(places, markers);
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


// When search box has been used to find a number of places, place markers on (resized) map
function getPlacesOnMap(places, markers) {

    // Clear out the old markers (which are registered with map).
    markers.forEach(function(marker) {
        marker.setMap(null);
    });
    markers = [];

    var bounds = new google.maps.LatLngBounds();

    // For each place, get the icon, place name, and location.
    for (var i in places) {
        var place = places[i];

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
        }));

        bounds.extend(place.geometry.location);

        // set input fields with coordinates
        $(latInputDiv).children("input")[0].value = place.geometry.location["k"];
        $(lngInputDiv).children("input")[0].value = place.geometry.location["D"];
    }

    map.fitBounds(bounds);
    map.setOptions({zoom: 15});
}


// resize map due to map opening
/**
 * Function resize map if it becomes visible.
 * */
function resizeMap() {
    // if window is resized before map was initialized (very unlikely)
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
function replaceMarker(location) {

    // clean map and delete marker
    marker.setMap(null);

    // set new marker
    marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: image,
        shadow: shadow
    });
}