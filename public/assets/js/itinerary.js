// From app.js
localStorage.setItem('timeGiven', timetoWaste);
localStorage.setItem('budgetGiven', budget);

localStorage.setItem('savedItinerary', itineraryArray);

$(document).ready(getStorage());

// Itinerary storage
var itineraryArray = []; // full itinerary
var itineraryObject = { 'number': 0, 'place': placeName, 'time': convertedTime }; // one itinerary object

localStorage.setItem('itinerary', JSON.stringify(itineraryArray));

var retrieveArray = localStorage.getItem(JSON.parse(itineraryArray));

// Get storage
function getStorage() {
    itineraryArray = localStorage.getItem('savedItinerary');
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

// Add and remove
$('button .additem').on('click', addItem());
$('button .removeitem').on('click', removeItem());

// Define add
function addItem() {

    itineraryObject[0] = this.val();
    itineraryObject[1] = placeName;
    itineraryObject[2] = convertedTime;

    itineraryArray.push(itineraryObject);

    let itemAdd = `'<tr class="item" data-id="0"><td>${placeName}</td><td>${convertedTime}</td><td><i class="material-icons removeitem right">remove_circle_outline</i></td></tr>'`;

    $('trbody').add(itemAdd).show('highlight', 250);

    calculateTime();

}

// Define remove
function removeItem() {

    // get the item data-id from parent tr
    var getItem = this.parents('tr').dataset.id;

    // remove the tr
    getItem.effect('drop', 250, function() {
        this.remove();
    });

    calculateTime();

}