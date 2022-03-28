var eventKeywordEl = document.querySelector('#event-search');
var eventFormEl = document.querySelector('#event-form');

function searchEvents(eventKeywordEl) {
    console.log(eventKeywordEl);

    var TMAPIKey = "AlQWhpNMj9NUx0BGdXyvOErADkNSGKNs";


    var TMAPIURL = "http://app.ticketmaster.com/discovery/v2/events.json?keyword=" + eventKeywordEl + "&size=5&apikey=" + TMAPIKey;

    fetch(TMAPIURL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
            });
        } else {
            alert("Error: Keyword did not return results");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to server");
    })

}

function formSubmitHandler(event) {
    event.preventDefault();

    let keyword = eventKeywordEl.value.trim();

    if (keyword) {
        searchEvents(keyword);
        eventKeywordEl.value = '';
    } else {
        alert('Please enter a search keyword');
    }
    console.log(event);
}

eventFormEl.addEventListener('submit', formSubmitHandler);
