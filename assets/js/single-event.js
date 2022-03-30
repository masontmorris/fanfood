var eventObj = JSON.parse(sessionStorage.getItem("sessionObj"));
var lat = eventObj._embedded.venues[0].location.latitude;
var lng = eventObj._embedded.venues[0].location.longitude;
var container = $("#container");
let goBackContainer = $("#back-container");
var eventPgNum = 1;
var fsq = "";
var fsBaseURL = "https://api.foursquare.com/v3/places/";
var queryObj = {
    search: `search?ll=${lat},${lng}&radius=500&categories=13000&limit=50`,
    url: "",
};
var fsAPIKey = "fsq33tA/HPjKRDhV2MuuWp+nKpzNssXSc9zq7A7NH+Qrx30=";

callFS("search");

// function fetches data from foursquare search api in search mode, and returns restaurants' websites in url mode
async function callFS(mode) {
    let query = queryObj[mode];
    let fetchURL = fsBaseURL + query;
    try {
        let response = await fetch(fetchURL, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: fsAPIKey,
            },
        });
        let data = await response.json();
        if (mode == "search") {
            data = data.results;
            displayResults(data);
        } else if (mode == "url") {
            return data.website;
        }
    } catch (err) {
        console.log(err);
    }
}
// function called after successful API call, takes in data and displays events.
async function displayResults(data) {
    $("#event-name").text(`${eventObj.name} in ${eventObj._embedded.venues[0].city.name}`);
    let restaurantList = document.createElement("div");
    restaurantList.classList.add("restaurant-list");
    restaurantList.setAttribute("id", `restaurant-list-${eventPgNum}`);
    for (let i = 0; i < 5; i++) {
        let eventIndex = i + (eventPgNum - 1) * 5;
        if (eventIndex == data.length) return generatePgBtns(data);
        let venue = data[eventIndex];
        let venueName = venue.name;
        let venueAddress = venue.location.formatted_address;
        let venueCategories = venue.categories;

        queryObj.url = `${venue.fsq_id}?fields=website`;
        let venueURL = await callFS("url");
        let venueCategoriesNames = [];
        for (let j = 0; j < venueCategories.length; j++) {
            venueCategoriesNames.push(venueCategories[j].name);
        }

        let venueCategoriesIcon = [];
        for (let j = 0; j < venueCategories.length; j++) {
            venueCategoriesIcon.push(venueCategories[j].icon.prefix + "bg_32" + venueCategories[j].icon.suffix);
        }

        restaurantCard = document.createElement("div");
        restaurantCard.classList.add("restaurant-card");

        let nameEl = document.createElement("h3");
        nameEl.textContent = venueName;
        nameEl.classList.add("venue-name");

        let addressEl = document.createElement("p");
        addressEl.textContent = venueAddress;
        addressEl.classList.add("venue-address");

        let urlEl = document.createElement("a");
        urlEl.setAttribute("href", venueURL);
        urlEl.setAttribute("target", "_blank");
        urlEl.textContent = "Visit Website";
        urlEl.classList.add("venue-url");

        restaurantCard.append(nameEl, addressEl, urlEl);
        restaurantList.append(restaurantCard);
    }
    $(`#restaurant-list-${eventPgNum - 1}`).remove();
    $(`#restaurant-list-${eventPgNum + 1}`).remove();
    container.append(restaurantList);
    generatePgBtns(data);
}
// function called after displaying events, generates page buttons.
function generatePgBtns(data) {
    $(".pg-btn").remove();
    if (eventPgNum > 1) {
        let prevPgBtn = document.createElement("button");
        prevPgBtn.setAttribute("type", "button");
        prevPgBtn.setAttribute("id", "prev-pg-btn");
        prevPgBtn.textContent = "Previous Page";
        prevPgBtn.classList.add("pg-btn");
        prevPgBtn.classList.add("button");
        prevPgBtn.classList.add("is-primary");
        container.append(prevPgBtn);
    }
    if (eventPgNum < data.length / 5) {
        let nextPgBtn = document.createElement("button");
        nextPgBtn.setAttribute("type", "button");
        nextPgBtn.setAttribute("id", "next-pg-btn");
        nextPgBtn.textContent = "Next Page";
        nextPgBtn.classList.add("pg-btn");
        nextPgBtn.classList.add("button");
        nextPgBtn.classList.add("is-primary");
        container.append(nextPgBtn);
    }
    goBackContainer.html("");
    let backBtn = document.createElement("button");
    backBtn.setAttribute("type", "button");
    backBtn.setAttribute("id", "back-button");
    backBtn.textContent = "Back to Event Search Page";
    backBtn.classList.add("button");
    backBtn.classList.add("is-primary");
    goBackContainer.append(backBtn);

    // page button functionality
    $("#next-pg-btn").click(function () {
        eventPgNum++;
        displayResults(data);
    });
    $("#prev-pg-btn").click(function () {
        eventPgNum--;
        displayResults(data);
    });
    // click listener for going back to main page
    $("#back-button").click(function () {
        console.log("Going Back");
        window.location.href = "index.html";
    });
}
