var eventKeywordEl = document.querySelector("#event-search");
var eventFormEl = document.querySelector("#event-form");
var eventObj = {};

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

    for (let i = 0; i < data._embedded.events.length; i++) {
        eventObj = data._embedded.events[i];
        console.log(eventObj._embedded);
        let eventName = eventObj.name;
        let eventDate = eventObj.dates.start.localDate;
        let eventVenue = eventObj._embedded.venues[0];
        let eventURL = eventObj.url;
        let eventImage = eventObj.images[0].url;
        let venueLat = eventVenue.location.latitude;
        let venueLng = eventVenue.location.longitude;
        console.log(venueLat, venueLng);
        let eventCard = document.createElement("div");
        eventCard.classList.add("event-card");

        let eventNameEl = document.createElement("h2");
        eventNameEl.textContent = eventName;
        eventNameEl.classList.add("event-name");
        eventNameEl.setAttribute("id", i);

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

        let eventContainer = $("#event-search-results");
        eventContainer.append(eventCard);
        testFS(venueLat, venueLng);
    }

    $(".event-name").click(function () {
        sessionStorage.setItem("eventObj", JSON.stringify(eventObj));
        window.location.href = "single-event.html";
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

eventFormEl.addEventListener("submit", formSubmitHandler);
