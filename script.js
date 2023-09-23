// Set up Mapbox and geolocation
mapboxgl.accessToken =
    "pk.eyJ1IjoiYXJ5YW4tc2FyYXN3YXQiLCJhIjoiY2xsdGJwamd3MTk1ZDNlcHBkbW12ZWE0eSJ9.e44OkTtJGyc4vyv5BO_q2Q";

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true
});

let profile = 'cycling'; // Set the default routing profile as a mutable variable
let minutes = 10; // Set the default duration as a mutable variable

function successLocation(position) {
    setupMap([position.coords.longitude, position.coords.latitude]);
}

function errorLocation() {
    setupMap([80.237617, 13.067439]);
}

function setupMap(center) {
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: center,
        zoom: 15
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

    var directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken
    });

    map.addControl(directions, "top-left");

    // Attach event listener to the button
    document.getElementById('fetchButton').addEventListener('click', async () => {
        try {
            const liveTrafficData = await fetchLiveTrafficData();
            processLiveTrafficData(liveTrafficData);
        } catch (error) {
            // Handle errors here
        }
    });

    // Create constants to use in getIso()
    const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
    const lon = -77.034;
    const lat = 38.899;

    // Create a function that sets up the Isochrone API query then makes a fetch call
    async function getIso() {
        const query = await fetch(
            `${urlBase}${profile}/${lon},${lat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`,
            { method: 'GET' }
        );
        const data = await query.json();
        map.getSource('iso').setData(data);
    }

    // Call the getIso function when the map loads
    map.on('load', () => {
        // When the map loads, add the source and layer
        map.addSource('iso', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: []
            }
        });

        map.addLayer(
            {
                id: 'isoLayer',
                type: 'fill',
                // Use "iso" as the data source for this layer
                source: 'iso',
                layout: {},
                paint: {
                    // The fill color for the layer is set to a light purple
                    'fill-color': '#5a3fc0',
                    'fill-opacity': 0.3
                }
            },
            'poi-label'
        );

        // Make the API call
        getIso();
    });

    // Target the "params" form in the HTML portion of your code
    const params = document.getElementById('params');

    // When a user changes the value of profile or duration by clicking a button, change the parameter's value and make the API query again
    params.addEventListener('change', (event) => {
        if (event.target.name === 'profile') {
            profile = event.target.value;
        } else if (event.target.name === 'duration') {
            minutes = event.target.value;
        }
        getIso();
    });
}
