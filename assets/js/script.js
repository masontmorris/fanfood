var eventKeywordEl = document.querySelector("#event-search");
var eventFormEl = document.querySelector("#event-form");
var eventObj = {};
var searchResultsContainer = $("#event-search-results");
var eventPgNum = 1;
var querySize = 30;
var jsonObj = {};

function searchEvents(eventKeywordEl) {
    console.log(eventKeywordEl);

    var TMAPIKey = "AlQWhpNMj9NUx0BGdXyvOErADkNSGKNs";

    var TMAPIURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + eventKeywordEl + `&size=${querySize}&apikey=` + TMAPIKey;

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
    console.log(data);
    searchResultsContainer.html("");
    for (let i = 0; i < 5; i++) {
        let eventIndex = i + (eventPgNum - 1) * 5;
        if (eventIndex == data._embedded.events.length) return generatePgBtns();
        jsonObj = data._embedded.events;
        eventObj = jsonObj[eventIndex];
        let eventName = eventObj.name;
        let eventDate = eventObj.dates.start.localDate;
        let eventVenue = eventObj._embedded.venues[0];
        let eventURL = eventObj.url;

        let venueLat = eventVenue.location.latitude;
        let venueLng = eventVenue.location.longitude;
        console.log(venueLat, venueLng);
        let eventCard = document.createElement("div");
        eventCard.classList.add("event-card");
        eventCard.setAttribute("id", eventIndex);

        let eventNameEl = document.createElement("h2");
        eventNameEl.textContent = eventName;
        eventNameEl.classList.add("event-name");

        let eventVenueName = document.createElement("p");
        eventVenueName.textContent = eventVenue.name;

        let eventDateEl = document.createElement("p");
        eventDateEl.textContent = eventDate;

        let eventVenueEl = document.createElement("p");
        eventVenueEl.textContent = `${eventVenue.city.name}, ${eventVenue.state.stateCode}`;

        let eventURLEl = document.createElement("a");
        eventURLEl.textContent = "Buy Tickets";
        eventURLEl.href = eventURL;

        eventCard.appendChild(eventNameEl);
        eventCard.appendChild(eventDateEl);
        eventCard.appendChild(eventVenueEl);
        eventCard.appendChild(eventVenueName);
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
    $(".event-card").click(function () {
        let sessionObj = jsonObj[this.id];
        console.log(this.id);
        sessionStorage.setItem("sessionObj", JSON.stringify(sessionObj));
        window.location.href = "single-event.html";
    });
}

eventFormEl.addEventListener("submit", formSubmitHandler);
