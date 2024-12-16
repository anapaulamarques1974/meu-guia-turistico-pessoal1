let map;
let service;
let infowindow;

document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById("map");
    const searchButton = document.getElementById("searchButton");
    const localInput = document.getElementById("localInput");

    // Inicializar o mapa
    function initMap(location) {
        const userLocation = location || { lat: -14.235, lng: -51.925 }; // Local padrão (Brasil)
        map = new google.maps.Map(mapElement, {
            center: userLocation,
            zoom: 15,
        });

        new google.maps.Marker({
            position: userLocation,
            map,
            title: "Você está aqui!",
        });

        infowindow = new google.maps.InfoWindow();
    }

    // Obter a localização atual do usuário
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    initMap(userLocation);
                },
                () => alert("Não foi possível obter sua localização.")
            );
        } else {
            alert("Geolocalização não é suportada pelo seu navegador.");
        }
    }

    // Buscar locais próximos com base no tipo
    function searchNearby(type) {
        const request = {
            location: map.getCenter(),
            radius: 1000,
            type: [type],
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                results.forEach((place) => {
                    const marker = new google.maps.Marker({
                        position: place.geometry.location,
                        map,
                        title: place.name,
                    });

                    google.maps.event.addListener(marker, "click", () => {
                        infowindow.setContent(place.name);
                        infowindow.open(map, marker);
                    });
                });
            }
        });
    }

    // Eventos
    searchButton.addEventListener("click", () => {
        const address = localInput.value;
        if (address) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    const location = results[0].geometry.location;
                    map.setCenter(location);
                    new google.maps.Marker({
                        position: location,
                        map,
                        title: "Localização buscada!",
                    });
                } else {
                    alert("Endereço não encontrado.");
                }
            });
        } else {
            getUserLocation();
        }
    });

    document.querySelectorAll(".filter-button").forEach((button) =>
        button.addEventListener("click", () => {
            const type = button.getAttribute("data-type");
            searchNearby(type);
        })
    );

    // Inicializar com a localização padrão ou do usuário
    getUserLocation();
});