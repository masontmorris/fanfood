var eventObj = JSON.parse(sessionStorage.getItem("eventObj"));
console.log(eventObj);
var lat = eventObj._embedded.venues[0].location.latitude;
var lng = eventObj._embedded.venues[0].location.longitude;
console.log(lat, lng);

testFS(lat, lng);

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
