var config = {
    apiKey: "AIzaSyCEePUc82AMEN6kanY-o9TRCZ1FU9NK2ns",
    authDomain: "daytripper-9eedb.firebaseapp.com",
    databaseURL: "https://daytripper-9eedb.firebaseio.com",
    projectId: "daytripper-9eedb",
    storageBucket: "daytripper-9eedb.firebaseapp.com",
    messagingSenderId: "1064588463387"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Initial Values
var location2;
var timeToWaste;
var budget;
var placeNameLink = "";
var placeName = "";
var distance;
var eventArray = [];
var linkArray = [];
var ratingArray = [];

var currentTime;
var endTime;
var randomFormat = "hh:mm";
var convertedTime = moment(timeToWaste, randomFormat);

var myLat = 0;
var myLong = 0;
var events = [];
var eventLoc = [];
var markers = [];
var events2 = [];
var eventLoc2 = [];
var markers2 = [];
var map;

// Button event listener
$(document).ready(function() {

    getStorage();
    
});

// Capture Button Click
$("#searchForm").on("submit", function (event) {
    event.preventDefault();
    eventLoc = [];

    // Show results UI
    $(".ui").removeClass("show").addClass("hide");
    $(".results").removeClass("hide").addClass("show");

    //var uid = firebase.auth().currentUser.uid;
    // Grabbed values from text boxes
    timeToWaste = $("#timeToWaste").val().trim();
    location2 = $("#location2").val().trim();
    budget = $("#budget").val().trim();
    //var newRef = ref.push();

    localStorage.setItem('timeGiven', timeToWaste);
    localStorage.setItem('budgetGiven', budget);

    localStorage.setItem('savedItinerary', itineraryArray);

    console.log(timeToWaste);
    console.log(budget);
    console.log(location2);

    // Code for handling the push
    database.ref().set({
        //id: newRef.key(),
        timeToWaste: timeToWaste,
        location2: location2,
        budget: budget,
        placeName: placeName,
        placeNameLink: placeNameLink,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    $("#location2,#budget,#timeToWaste").val("");

    var queryURL = 'api/https://app.ticketmaster.com/discovery/v2/events.json?apikey=LsnXngGMPvh119GAmqLkACcXZfGcJQ3g';

    var queryURL2 = "api/https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+" + location2 + "&key=AIzaSyDOfs17E2EBQGVcjAQQQO1-vtMh3BEULg8";

    //var queryURL2 = "https://api.yelp.com/v3/businesses/search?term=restaurants&"


    if (location2) {
        queryURL += '&postalCode=' + location2;
    }

    if (currentTime && endTime) {
        queryURL += '&startDateTime=' + currentTime + '&endDateTime=' + endTime;
    }



    console.log(queryURL);
    console.log(queryURL2);

    $.when(
        $.ajax({
            type: "GET",
            //url: 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=LsnXngGMPvh119GAmqLkACcXZfGcJQ3g&latlong=44.9837029,-93.1801801&radius=1000',
            //&startDateTime=2018-04-28T13:31:00Z&endDateTime=2018-04-30T13:31:00Z
            url: queryURL,
            async: true,
            dataType: "JSON",
            success: function (json) {
                console.log(json.hasOwnProperty('_embedded'));

                if (json.hasOwnProperty('_embedded')) {
                    events = json._embedded.events;
                    for (i = 0; i < events.length; i++) {
                        if (events[i].priceRanges) {
                            if (budget < events[i].priceRanges[0].min) {
                                events.splice(i, 1);
                            }
                        }
                    }

                    //remember to clear out eventLoc on new zip
                    for (i = 0; i < events.length; i++) {
                        eventArray.push(events[i].name);
                        linkArray.push(events[i].url);
                        eventLoc.push({ lat: parseFloat(events[i]._embedded.venues[0].location.latitude), lng: parseFloat(events[i]._embedded.venues[0].location.longitude) });
                    }
                    console.log(eventLoc);
                }
                else {
                    console.log("no events available");
                    events = [];
                }

                reloadMarkers();

            },
            error: function (xhr, status, err) {
                // This time, we do not end up here!
            }
        }),

        //Google places api
        $.ajax({
            type: "GET",
            url: queryURL2,
            async: true,
            dataType: "JSON",
            success: function (json) {
                events2 = json.results;
                console.log(events2);
                console.log(events2[0].name);
                console.log(parseFloat(events2[0].geometry.location.lat));

                //remember to clear out eventLoc on new zip
                for (i = 0; i < events2.length; i++) {

                    eventArray.push(events2[i].name);
                    linkArray.push(events2[i].photos[0].html_attributions[0]);

                    populateCards(events2[i], i); // send to cards

                    console.log(eventArray);
                    console.log(linkArray);

                    eventLoc.push({ lat: parseFloat(events2[i].geometry.location.lat), lng: parseFloat(events2[i].geometry.location.lng) });
                    
                }


                $('body button').on('click', function() {
                    console.log("Click.");
                });
            
                $('body .additem').on('click', function(event) {
                    console.log( $(event.target).parents('span').attr('data-uid') );
                });
                $('body .removeitem').on('click', function(event) {
                    removeItem(event.target);
                });

                console.log(eventLoc);
                //reloadMarkers();

            },
            error: function (xhr, status, err) {
                // This time, we do not end up here!
            }
        })).done(reloadMarkers);

});

database.ref().on("child_added", function (childSnapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = childSnapshot.val();

    //puts moment info for current time into proper fortmat for query
    currentTime = moment().format("YYYY-MM-DDTHH:mm:ss") + "Z";
    console.log(currentTime);
    //creates moment info for end time and puts into proper fortmat for query
    endTime = moment().add(sv.timeToWaste, "hours");
    endTime = moment(endTime).format("YYYY-MM-DDTHH:mm:ss") + "Z";

    //proper query syntax 2018-04-28T13:31:00Z

    //pushes firebase onto table

    $('.tableArea').append(`<tr><td>${sv.location2}</td>
     <td>${sv.timeToWaste}</td>
     <td class="numbers">${sv.budget}</td>
     <td class="numbers"><a href="${sv.placeNameLink}">${sv.placeName}</a></td></tr>`);


    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});







function markerWindow(marker, content, infowindow) {
    return function () {
        infowindow.setContent(content);
        infowindow.open(map, marker);
    };
}

function closeWindow(marker, infowindow) {
    return function () {
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
        console.log(events2.length);
        console.log(eventArray[i]);
        map.setCenter(locations[i]);
        console.log(eventLoc[i]);

        /*var priceRange = "";
        if (events[i].priceRanges) {
            priceRange = events[i].priceRanges[0].min + " to " + events[i].priceRanges[0].max + " " + events[i].priceRanges[0].currency;
        }
        else {
            priceRange = 'Not available'
        }
*/
        var content = `
        <p>Event: ${eventArray[i]}</p>
        <p>${linkArray[i]}</p>`;


        google.maps.event.addListener(marker,'click', markerWindow(marker,content,infowindow));  
        //google.maps.event.addListener(marker, 'mouseover', markerWindow(marker, content, infowindow));
        google.maps.event.addListener(marker, 'mousedown', markerWindow(marker, content, infowindow));
        //google.maps.event.addListener(marker, 'mouseout', closeWindow(marker, infowindow));
        // Push marker to markers array
        markers.push(marker);
        marker.setMap(map);

    }
}


function reloadMarkers() {
    console.log('markers');
    // Loop through markers and set map to null for each
    for (var i = 0; i < markers.length; i++) {

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
    var prevInvoke = false;

    function setPosition(position) {
        if (prevInvoke) return;
        prevInvoke = true;
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(latlng);
    
        marker.setPosition(latlng);
    }
    
    navigator.geolocation.getCurrentPosition(setPosition);
   
   setTimeout(function(){
    setPosition({coords:{latitude: 44.9835381, longitude: -93.1911284}});

   }, 5000);

    $("#submit").click(reloadMarkers);

}

/* ======================= */
/* ITINERARY DO NOT DELETE */
/* ======================= */

// Set permanent itinerary storage

// Itinerary temp storage
var itineraryArray = []; // full itinerary
var itineraryObject = { 'number': 0, 'place': placeName, 'time': convertedTime }; // one itinerary object

localStorage.setItem('itinerary', JSON.stringify(itineraryArray));

//var retrieveArray = localStorage.getItem(JSON.parse(itineraryArray));
var retrieveArray = JSON.parse(localStorage.getItem('itineraryArray'));


// Get storage
function getStorage() {
    itineraryArray = JSON.parse(localStorage.getItem('savedItinerary'));
}

// Populate cards
function populateCards(j, i) {

    

    console.log(j.name);

        $('.row .cardlist').append(`

        <div class="card">

            <span class="card-title" data-uid="${i}">${j.name}</span>
            <a class="btn-floating waves-effect waves-light light-blue">
                <button class="material-icons additem">add</button>
            </a>

            <div class="card-content">
                <p>${j.types}</p>
                <p>${j.formatted_address}</p>
            </div>

        </div>

        `);

}

// Time calculation
function calculateTime() {

    var calcedTime = 0;

    for (t = 0; itineraryArray.length < t; t++) {
        let addTime = itineraryObject[time];
        $('td .item-time').html(addTime);
        calcedTime += addTime;
    }

    console.log(calcedTime);

    $('span .total-est').html(calcedTime);

}

// Define add
function addItem(event) {

    console.log("Add item.");

    itineraryObject = { id: event.id, name: event.name };

    itineraryArray.push(itineraryObject);

    let itemAdd = `<tr class="item" data-id="${i}"><td class="placename">${placeName}</td><td>${convertedTime}</td><td><i class="material-icons removeitem right">remove_circle_outline</i></td></tr>`;

    $('trbody').add(itemAdd).show('highlight', 500);

    calculateTime();

}

// Define remove
function removeItem() {

    console.log("Remove item.");

    // get the item data-id from parent tr
    $(this).parents('tr').effect('fade', 500, function() {

        $(this).remove();

    });

    calculateTime();

}