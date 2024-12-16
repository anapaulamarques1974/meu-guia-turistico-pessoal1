document.addEventListener("DOMContentLoaded", () => {
    let map;
    let userMarker;

    // Inicializar o mapa
    function initMap(lat = -14.235, lng = -51.925) {
        const userLocation = [lat, lng]; // Latitude e Longitude padrão (Brasil)
        map = L.map("map").setView(userLocation, 13); // Zoom inicial 13

        // Adicionar camadas de mapa (OpenStreetMap)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        // Marcador inicial
        userMarker = L.marker(userLocation).addTo(map).bindPopup("Você está aqui!");
    }

    // Atualizar localização no mapa
    function updateMap(lat, lng, popupMessage = "Você está aqui!") {
        const newLocation = [lat, lng];
        map.setView(newLocation, 15);
        userMarker.setLatLng(newLocation).bindPopup(popupMessage).openPopup();
    }

    // Obter localização do usuário
    document.getElementById("getLocation").addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    updateMap(latitude, longitude);
                },
                () => alert("Não foi possível obter sua localização.")
            );
        } else {
            alert("Geolocalização não é suportada pelo seu navegador.");
        }
    });

    // Buscar localização por endereço
    document.getElementById("searchLocation").addEventListener("click", () => {
        const address = document.getElementById("localInput").value;
        if (address) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data && data[0]) {
                        const { lat, lon, display_name } = data[0];
                        updateMap(lat, lon, display_name);
                    } else {
                        alert("Endereço não encontrado.");
                    }
                })
                .catch(() => alert("Erro ao buscar o endereço."));
        }
    });

    // Filtrar locais próximos (simulação)
    document.querySelectorAll(".filter-button").forEach((button) => {
        button.addEventListener("click", () => {
            const type = button.getAttribute("data-type");
            alert(`Filtrar por: ${type}`);
            // Aqui, você pode simular marcadores no mapa com base no tipo
            // Exemplo:
            const mockLocations = [
                { lat: -14.235, lng: -51.925, name: "Local 1" },
                { lat: -14.240, lng: -51.930, name: "Local 2" },
            ];
            mockLocations.forEach((loc) => {
                L.marker([loc.lat, loc.lng])
                    .addTo(map)
                    .bindPopup(`${loc.name} (${type})`);
            });
        });
    });

    // Inicializar o mapa com a localização padrão
    initMap();
});