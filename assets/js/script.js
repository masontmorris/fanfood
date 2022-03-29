var eventKeywordEl = document.querySelector("#event-search");
var eventFormEl = document.querySelector("#event-form");
var eventObj = {};
var eventContainer = $("#event-search-results");

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
    eventContainer.html("");
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

        eventContainer.append(eventCard);
        testFS(venueLat, venueLng);
    }

    $(".event-name").click(function () {
        sessionStorage.setItem("eventObj", JSON.stringify(eventObj));
        window.location.href = "single-event.html";
    });
}

eventFormEl.addEventListener("submit", formSubmitHandler);
