var map = L.map( 'map', {
    center: [-37.8, 145.0],
    minZoom: 2,
    zoom: 11,
    zoomControl: false
});

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c'],
}).addTo( map );

L.control.zoom({
     position:'topright'
}).addTo(map);
