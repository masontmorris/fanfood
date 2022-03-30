var eventKeywordEl = document.querySelector("#event-search");
var eventFormEl = document.querySelector("#event-form");
var searchResultsContainer = $("#event-search-results");
var eventPgNum = 1;
var querySize = 30;

function searchEvents(eventKeywordEl) {
    console.log(eventKeywordEl);

    var TMAPIKey = "AlQWhpNMj9NUx0BGdXyvOErADkNSGKNs";

    var TMAPIURL = "http://app.ticketmaster.com/discovery/v2/events.json?keyword=" + eventKeywordEl + `&size=${querySize}&apikey=` + TMAPIKey;

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
    eventPgNum = 1;
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
    searchResultsContainer.html("");


    for (let i = 0; i < 5; i++) {
        let eventIndex = i + (eventPgNum - 1) * 5;
        if (eventIndex > querySize) return generatePgBtns();
        console.log(eventIndex);
        let event = data._embedded.events[eventIndex];
        let eventName = event.name;
        let eventDate = event.dates.start.localDate;
        let eventVenue = event._embedded.venues[0];
        let venueName = event._embedded.venues[0].name;
        let eventURL = event.url;
        let venueLat = eventVenue.location.latitude;
        let venueLng = eventVenue.location.longitude;
        console.log(venueLat, venueLng);
        let eventCard = document.createElement("a");
        eventCard.classList.add("event-card");
        eventCard.setAttribute("href", "./single-event.html?event=" + eventName);

        let eventNameEl = document.createElement("h2");
        eventNameEl.textContent = eventName;

        let venueNameEl = document.createElement("h4");
        venueNameEl.textContent = venueName;

        let eventDateEl = document.createElement("p");
        eventDateEl.textContent = eventDate;

        let eventVenueEl = document.createElement("p");
        eventVenueEl.textContent = `${eventVenue.city.name}, ${eventVenue.state.stateCode}`;

        let eventURLEl = document.createElement("a");
        eventURLEl.textContent = "Buy Tickets";
        eventURLEl.href = eventURL;

        eventCard.appendChild(eventNameEl);
        eventCard.appendChild(venueNameEl);
        eventCard.appendChild(eventDateEl);
        eventCard.appendChild(eventVenueEl);
        eventCard.appendChild(eventURLEl);

        searchResultsContainer.append(eventCard);
    }
    generatePgBtns();
    $("#next-pg-btn").click(function () {
        eventPgNum++;
        displayEvents(data);
    });

    $("#prev-pg-btn").click(function () {
        eventPgNum--;
        displayEvents(data);
    });
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

function generatePgBtns() {
    if (eventPgNum > 1) {
        let prevPgBtn = document.createElement("button");
        prevPgBtn.setAttribute("type", "button");
        prevPgBtn.setAttribute("id", "prev-pg-btn");
        prevPgBtn.textContent = "Previous Page";
        searchResultsContainer.append(prevPgBtn);
    }

    if (eventPgNum < querySize / 5) {
        let nextPgBtn = document.createElement("button");
        nextPgBtn.setAttribute("type", "button");
        nextPgBtn.setAttribute("id", "next-pg-btn");
        nextPgBtn.textContent = "Next Page";
        searchResultsContainer.append(nextPgBtn);
    }
}

eventFormEl.addEventListener("submit", formSubmitHandler);
