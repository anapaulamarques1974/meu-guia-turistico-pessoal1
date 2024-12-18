document.addEventListener("DOMContentLoaded", () => {
    let map;
    let userMarker;

    // Inicializando o mapa
    function initMap(lat = -14.235, lng = -51.925) {
        const userLocation = [lat, lng];
        
        // Certifique-se de que o 'map' corresponde à div com id="map"
        map = L.map("map").setView(userLocation, 13); // A id 'map' deve corresponder ao ID da div

        // Adicionar camadas de mapa
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        // Adicionar marcador inicial
        userMarker = L.marker(userLocation).addTo(map)
            .bindPopup("Você está aqui!")
            .openPopup();
    }

    // Chamar a função para inicializar o mapa
    initMap();

    // Exemplo de como adicionar funcionalidade de geolocalização
    document.getElementById("getLocation").addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 13);
                L.marker([latitude, longitude]).addTo(map)
                    .bindPopup("Você está aqui!")
                    .openPopup();
            });
        } else {
            alert("Geolocalização não é suportada pelo seu navegador.");
        }
    });
});
