var eventKeywordEl = document.querySelector("#event-search");
var eventFormEl = document.querySelector("#event-form");
var searchResultsContainer = $("#event-search-results");
var eventPgNum = 1;
var querySize = 30;
var jsonObj = {};

// called by formSubmitHandler, takes in keyword and makes API call to get events.
function searchEvents(eventKeywordEl) {
    var TMAPIKey = "AlQWhpNMj9NUx0BGdXyvOErADkNSGKNs";

    var TMAPIURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + eventKeywordEl + `&size=${querySize}&apikey=` + TMAPIKey;

    fetch(TMAPIURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
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

// function called on form submit, takes in event keyword and calls searchEvents function. also clears form and resets page number.
function formSubmitHandler(event) {
    event.preventDefault();
    eventPgNum = 1;
    let keyword = eventKeywordEl.value.trim();

    if (keyword) {
        searchEvents(keyword);
        let storedKeyword = keyword;
        eventKeywordEl.value = "";
        return storedKeyword;
    } else {
        alert("Please enter a search keyword");
    }
}

// function called after successful API call, takes in data and displays events. also generates page buttons.
function displayEvents(data) {
    searchResultsContainer.html("");
    for (let i = 0; i < 5; i++) {
        let eventIndex = i + (eventPgNum - 1) * 5;
        if (eventIndex == data._embedded.events.length) return generatePgBtns();
        jsonObj = data._embedded.events;
        let eventObj = jsonObj[eventIndex];
        let eventName = eventObj.name;
        let eventDate = eventObj.dates.start.localDate;
        let eventVenue = eventObj._embedded.venues[0];
        let eventURL = eventObj.url;

        let eventCard = document.createElement("div");
        eventCard.classList.add("event-card");
        eventCard.classList.add("card");
        eventCard.setAttribute("id", eventIndex);

        let eventNameEl = document.createElement("h2");
        eventNameEl.textContent = eventName;
        eventNameEl.classList.add("event-name");
        eventNameEl.classList.add("card-header-title");

        let eventVenueName = document.createElement("p");
        eventVenueName.textContent = eventVenue.name;
        eventVenueName.classList.add("content");

        let eventDateEl = document.createElement("p");
        eventDateEl.textContent = eventDate;
        eventDateEl.classList.add("content");

        let eventVenueEl = document.createElement("p");
        eventVenueEl.textContent = `${eventVenue.city.name}, ${eventVenue.state.stateCode}`;
        eventVenueEl.classList.add("content");

        let eventURLEl = document.createElement("a");
        eventURLEl.textContent = "Buy Tickets";
        eventURLEl.href = eventURL;
        eventURLEl.classList.add("content");

        eventCard.appendChild(eventNameEl);
        eventCard.appendChild(eventDateEl);
        eventCard.appendChild(eventVenueEl);
        eventCard.appendChild(eventVenueName);
        eventCard.appendChild(eventURLEl);

        searchResultsContainer.append(eventCard);
    }

    generatePgBtns();
    // page button event listeners
    $("#next-pg-btn").click(function () {
        eventPgNum++;
        displayEvents(data);
    });

    $("#prev-pg-btn").click(function () {
        eventPgNum--;
        displayEvents(data);
    });
}
// function that generates page buttons. doesn't generate previous page button if first page and doesn't generate next page button if last page.
function generatePgBtns() {
    if (eventPgNum > 1) {
        let prevPgBtn = document.createElement("button");
        prevPgBtn.setAttribute("type", "button");
        prevPgBtn.setAttribute("id", "prev-pg-btn");
        prevPgBtn.classList.add("pg-btn");
        prevPgBtn.classList.add("button");
        prevPgBtn.classList.add("is-primary");
        prevPgBtn.textContent = "Previous Page";
        searchResultsContainer.append(prevPgBtn);
    }

    if (eventPgNum < querySize / 5) {
        let nextPgBtn = document.createElement("button");
        nextPgBtn.setAttribute("type", "button");
        nextPgBtn.setAttribute("id", "next-pg-btn");
        nextPgBtn.classList.add("pg-btn");
        nextPgBtn.classList.add("button");
        nextPgBtn.classList.add("is-primary");
        nextPgBtn.textContent = "Previous Page";
        nextPgBtn.textContent = "Next Page";
        searchResultsContainer.append(nextPgBtn);
    }
    // click listener for event cards
    $(".event-card").click(function () {
        let sessionObj = jsonObj[this.id];
        sessionStorage.setItem("sessionObj", JSON.stringify(sessionObj));
        window.location.href = "single-event.html";
    });
}
// event listener for form submit
eventFormEl.addEventListener("submit", formSubmitHandler);
