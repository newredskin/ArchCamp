// tell mbx to render the map in the "map" div

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v11', // style URL
center: building.geometry.coordinates, // starting position [lng, lat]
zoom: 6, // starting zoom
});

// add navigation markers
map.addControl(new mapboxgl.NavigationControl(), "bottom-left");

// add pins on map
new mapboxgl.Marker({ color: 'rgb(255, 35, 127)' })
    .setLngLat(building.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h6 class="mt-2">${building.name}</h6><p>${building.location}</p>`
        )
    )
    .addTo(map);