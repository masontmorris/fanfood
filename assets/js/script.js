var eventKeywordEl = document.querySelector("#event-search");
var eventFormEl = document.querySelector("#event-form");

function searchEvents(eventKeywordEl) {
    console.log(eventKeywordEl);

    var TMAPIKey = "AlQWhpNMj9NUx0BGdXyvOErADkNSGKNs";

    var TMAPIURL = "http://app.ticketmaster.com/discovery/v2/events.json?keyword=" + eventKeywordEl + "&size=5&apikey=" + TMAPIKey;

    fetch(TMAPIURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayEvents(data);
                });
            } else {
                alert("Error: Keyword did not return results");
            }
        })
        .catch(function (error) {
            alert("Unable to connect to server");
        });
}

function formSubmitHandler(event) {
    event.preventDefault();

    let keyword = eventKeywordEl.value.trim();

    if (keyword) {
        searchEvents(keyword);
        eventKeywordEl.value = "";
    } else {
        alert("Please enter a search keyword");
    }
    console.log(event);
}

function displayEvents(data) {
    console.log(data);
    let eventContainerEl = $("#event-search-results");

    eventContainerEl.empty();

    for (let i = 0; i < data._embedded.events.length; i++) {
        let event = data._embedded.events[i];
        console.log(event._embedded);
        let eventName = event.name;
        let eventDate = event.dates.start.localDate;
        let eventVenue = event._embedded.venues[0];
        let eventURL = event.url;
        let eventImage = event.images[0].url;
        let venueLat = eventVenue.location.latitude;
        let venueLng = eventVenue.location.longitude;
        console.log(venueLat, venueLng);
        let eventCard = document.createElement("div");
        eventCard.classList.add("event-card");

        let eventNameEl = document.createElement("h2");
        eventNameEl.textContent = eventName;

        let eventDateEl = document.createElement("p");
        eventDateEl.textContent = eventDate;

        let eventVenueEl = document.createElement("p");
        eventVenueEl.textContent = `${eventVenue.city.name}, ${eventVenue.state.stateCode}`;

        let eventURLEl = document.createElement("a");
        eventURLEl.textContent = eventURL;
        eventURLEl.href = eventURL;

        let eventImageEl = document.createElement("img");
        eventImageEl.src = eventImage;

        eventCard.appendChild(eventNameEl);
        eventCard.appendChild(eventDateEl);
        eventCard.appendChild(eventVenueEl);
        eventCard.appendChild(eventURLEl);
        eventCard.appendChild(eventImageEl);

    
        eventContainerEl.append(eventCard);

        testFS(venueLat, venueLng);
    }
}

async function testFS(lat, lng) {
    let fsBaseURL = "https://api.foursquare.com/v3/places/search";
    let fsAPIKey = "fsq33tA/HPjKRDhV2MuuWp+nKpzNssXSc9zq7A7NH+Qrx30=";
    let fsQuery = `?ll=${lat},${lng}&radius=500&limit=10`;
    try {
        let response = await fetch(fsBaseURL + fsQuery, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: fsAPIKey,
            },
        });
        let data = await response.json();
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}

eventFormEl.addEventListener("submit", formSubmitHandler);
