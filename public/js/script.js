const socket = io();

// Check if the browser supports geolocation 
if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
} else {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit('send-Location', { latitude, longitude });
        }, 
        (error) => {
            console.log(error);
        },  
        {
            enableHighAccuracy: true, // true means more accurate but may take longer
            timeout: 5000, 
            maximumAge: 0  // 0 means no cache
        }
    );
}

const map = L.map("map").setView([0, 0], 16);  // 0,0 is the lat and long, 16 is the zoom level of the map 

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const markers = {};

socket.on('receive-location', (data) => {
    const { id, latitude, longitude } = data;
    console.log(`Received location for ${id}: ${latitude}, ${longitude}`);
    map.setView([latitude, longitude]);  // set the view of the map to the new location

    if (markers[id]) {
        // markers[id].setLatLng([latitude, longitude]);  // update the marker position
        map.removeLayer(markers[id]);
    }

    markers[id] = L.marker([latitude, longitude]).addTo(map);  // add the new marker to the map
});

socket.on('remove-location', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);  // remove the marker from the map
        delete markers[id];  // remove the marker from the markers object
    }
});
