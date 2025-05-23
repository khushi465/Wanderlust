
    // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
    mapboxgl.accessToken = mapToken
    // this mapToken is the ejs saves in mapToken in script tag at start from env variable MAP_TOKEN
    // that script tag runs before this script tag so we have the token
    const map = new mapboxgl.Map({
        container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
                                });

// ejs se script chalaenge jisme hum env variables save kar lenge in js variables and un variables ko hum public/js ki files me access kar paenge
// BECAUSE PUBLIC FOLDER KI JS FILES KE PAS ENV VARIABLES KI ACCESS NAHI HAI

const marker=new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${listing.title}</h4><p>Exact Location provided after booking</p>`))
.addTo(map);
// console.log(coordinates);
