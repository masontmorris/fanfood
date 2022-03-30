var eventObj = JSON.parse(sessionStorage.getItem("sessionObj"));
var lat = eventObj._embedded.venues[0].location.latitude;
var lng = eventObj._embedded.venues[0].location.longitude;
var container = $("#container");
var eventPgNum = 1;
callFS(lat, lng);
// function fetches data from foursquare API using lat and lng of event venue.
async function callFS(lat, lng) {
    let fsBaseURL = "https://api.foursquare.com/v3/places/search";
    let fsAPIKey = "fsq33tA/HPjKRDhV2MuuWp+nKpzNssXSc9zq7A7NH+Qrx30=";
    let fsQuery = `?ll=${lat},${lng}&radius=500&categories=13000&limit=50`;
    try {
        let response = await fetch(fsBaseURL + fsQuery, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: fsAPIKey,
            },
        });
        let data = await response.json();
        data = data.results;
        displayResults(data);
    } catch (err) {
        console.log(err);
    }
}
// function called after successful API call, takes in data and displays events.
function displayResults(data) {
    $("#event-name").text(`${eventObj.name} in ${eventObj._embedded.venues[0].city.name}`);
    container.html("");
    for (let i = 0; i < 5; i++) {
        let eventIndex = i + (eventPgNum - 1) * 5;
        if (eventIndex == data.length) return generatePgBtns(data);
        let venue = data[eventIndex];
        let venueName = venue.name;
        let venueAddress = venue.location.formatted_address;
        let venueCategories = venue.categories;

        let venueCategoriesNames = [];
        for (let j = 0; j < venueCategories.length; j++) {
            venueCategoriesNames.push(venueCategories[j].name);
        }

        let venueCategoriesIcon = [];
        for (let j = 0; j < venueCategories.length; j++) {
            venueCategoriesIcon.push(venueCategories[j].icon.prefix + "bg_32" + venueCategories[j].icon.suffix);
        }

        let restaurantCard = document.createElement("div");
        restaurantCard.classList.add("restaurant-card");

        let nameEl = document.createElement("h3");
        nameEl.textContent = venueName;
        nameEl.classList.add("venue-name");

        let addressEl = document.createElement("p");
        addressEl.textContent = venueAddress;
        addressEl.classList.add("venue-address");

        restaurantCard.append(nameEl, addressEl);
        container.append(restaurantCard);
    }
    generatePgBtns(data);
}
// function called after displaying events, generates page buttons.
function generatePgBtns(data) {
    if (eventPgNum > 1) {
        let prevPgBtn = document.createElement("button");
        prevPgBtn.setAttribute("type", "button");
        prevPgBtn.setAttribute("id", "prev-pg-btn");
        prevPgBtn.textContent = "Previous Page";
        prevPgBtn.setAttribute("class", "button is-primary");
        container.append(prevPgBtn);
    }
    if (eventPgNum < data.length / 5) {
        let nextPgBtn = document.createElement("button");
        nextPgBtn.setAttribute("type", "button");
        nextPgBtn.setAttribute("id", "next-pg-btn");
        nextPgBtn.textContent = "Next Page";
        nextPgBtn.setAttribute("class", "button is-primary");
        container.append(nextPgBtn);
    }
    // page button functionality
    $("#next-pg-btn").click(function () {
        eventPgNum++;
        displayResults(data);
    });
    $("#prev-pg-btn").click(function () {
        eventPgNum--;
        displayResults(data);
    });
}
