var myLat = 0;
var myLong = 0;
var events = [];
var eventLoc = [];
var markers = [];
var map;


$.ajax({
    type: "GET",
    //url: 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=LsnXngGMPvh119GAmqLkACcXZfGcJQ3g&latlong=44.9837029,-93.1801801&radius=1000',
    url: 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=LsnXngGMPvh119GAmqLkACcXZfGcJQ3g&postalCode=55415&startDateTime=2018-04-28T13:31:00Z&endDateTime=2018-04-30T13:31:00Z&countryCode=US',
    async: true,
    dataType: "JSON",
    success: function (json) {
        events = json._embedded.events;
        console.log(events);
        console.log(events[0]._embedded.venues[0].location);
        
        //remember to clear out eventLoc on new zip
        for (i = 0; i < events.length; i ++) {
            eventLoc.push({lat : parseFloat(events[i]._embedded.venues[0].location.latitude), lng: parseFloat(events[i]._embedded.venues[0].location.longitude)});
        }
        console.log(eventLoc);

    },
    error: function (xhr, status, err) {
        // This time, we do not end up here!
    }
});

function markerWindow(marker,content,infowindow){ 
    return function() {
        infowindow.setContent(content);
        infowindow.open(map,marker);
    };
}

function closeWindow(marker,infowindow){ 
    return function() {
        infowindow.close();
    };
}

function setMarkers(locations) {

    for (var i = 0; i < locations.length; i++) {
    
        var marker = new google.maps.Marker({
            position: locations[i],
            map: map,
            animation: google.maps.Animation.DROP
        });

        var infowindow = new google.maps.InfoWindow();
        
        console.log(i);
        console.log(events.length);
        console.log(events[i]);


        var priceRange = "";
        if (events[i].priceRanges) {
            priceRange = events[i].priceRanges[0].min + " to " + events[i].priceRanges[0].max + " " + events[i].priceRanges[0].currency;
        }
        else {
           priceRange = 'Not available';
        }

        var content = `<p>Venue: ${events[i]._embedded.venues[0].name}</p>
        <p>Event: ${events[i].name}</p>
        <p>Price Range: ${priceRange}</p>
        <p><a href='${events[i].url}'> Buy tickets here</a></p>`;
        

        //google.maps.event.addListener(marker,'click', markerWindow(marker,content,infowindow));  
        google.maps.event.addListener(marker,'mouseover', markerWindow(marker,content,infowindow));  
        google.maps.event.addListener(marker,'mousedown', markerWindow(marker,content,infowindow));  
        google.maps.event.addListener(marker,'mouseout', closeWindow(marker, infowindow));  
        // Push marker to markers array
        markers.push(marker);
        marker.setMap(map);
    
    }
}

function reloadMarkers() {

    // Loop through markers and set map to null for each
    for (var i=0; i<markers.length; i++) {

        markers[i].setMap(null);
    }

    // Reset the markers array
    markers = [];

    // Call set markers to re-add markers
    setMarkers(eventLoc);
}


function initMap() {

    var myLocation = { lat: myLat, lng: myLong };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: myLocation
    });

    var marker = new google.maps.Marker({
        position: myLocation,
        map: map,
        animation: google.maps.Animation.DROP
    });

    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');

    setMarkers(eventLoc);


    navigator.geolocation.getCurrentPosition(function (position) {
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(latlng);

        marker.setPosition(latlng);
    });

    $("#reload").click(reloadMarkers);
    
}

//https://app.ticketmaster.com/discovery/v2/events.json?apikey=LsnXngGMPvh119GAmqLkACcXZfGcJQ3g&amp;latlong=44.9837029,-93.1801801&amp;radius=20




/*
var map;

function initMap() {
    // Create the map.
    var pyrmont = { lat: -33.866, lng: 151.196 };
    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 17
    });

    // Create the places service.
    var service = new google.maps.places.PlacesService(map);
    var getNextPage = null;
    var moreButton = document.getElementById('more');
    moreButton.onclick = function () {
        moreButton.disabled = true;
        if (getNextPage) getNextPage();
    };

    // Perform a nearby search.
    service.nearbySearch(
        { location: pyrmont, radius: 500, type: ['store'] },
        function (results, status, pagination) {
            if (status !== 'OK') return;

            createMarkers(results);
            moreButton.disabled = !pagination.hasNextPage;
            getNextPage = pagination.hasNextPage && function () {
                pagination.nextPage();
            };
        });
}

function createMarkers(places) {
    var bounds = new google.maps.LatLngBounds();
    var placesList = document.getElementById('places');

    for (var i = 0, place; place = places[i]; i++) {
        var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
        });

        var li = document.createElement('li');
        li.textContent = place.name;
        placesList.appendChild(li);

        bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
}
*/
