document.addEventListener("DOMContentLoaded", function () {

    window.mostrarDatos = function () {
        let nombre = document.getElementById("nombre").value;
        let ciudad = document.getElementById("ciudad").value;
        let correo = document.getElementById("correo").value;

        document.getElementById("resultados").innerHTML =
            `<div class='card'>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Ciudad:</strong> ${ciudad}</p>
                <p><strong>Correo:</strong> ${correo}</p>
            </div>`;
    };

    var map = L.map('map').setView([19.4326, -99.1332], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    window.consultarClima = function () {
        const apiKey = "1e3b8d4f0f3b53186077b15700e674b2";
        let ciudad = document.getElementById("ciudad").value;

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`)
            .then(res => res.json())
            .then(data => {

                if (data.cod !== 200) {
                    document.getElementById("clima").innerHTML = "<p>No se pudo obtener el clima. Verifica la ciudad.</p>";
                    return;
                }

                document.getElementById("clima").innerHTML = `
                    <div class='card'>
                        <h3>${data.name}</h3>
                        <p><strong>Temperatura:</strong> ${data.main.temp}°C</p>
                        <p><strong>Clima:</strong> ${data.weather[0].description}</p>
                        <p><strong>Humedad:</strong> ${data.main.humidity}%</p>
                    </div>`;
            })
            .catch(() => {
                document.getElementById("clima").innerHTML = "Error al conectar con la API.";
            });
    };

    window.consultarGPS = function () {
        const apiKey = "1e3b8d4f0f3b53186077b15700e674b2";

        if (!navigator.geolocation) {
            document.getElementById("clima").innerHTML = "Tu navegador no soporta GPS.";
            return;
        }

        document.getElementById("clima").innerHTML = "<p>Obteniendo ubicación...</p>";

        navigator.geolocation.getCurrentPosition(
            function (pos) {
                let lat = pos.coords.latitude;
                let lon = pos.coords.longitude;

                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`)
                    .then(res => res.json())
                    .then(data => {
                        document.getElementById("clima").innerHTML = `
                            <div class='card'>
                                <h3>${data.name}</h3>
                                <p><strong>Temperatura:</strong> ${data.main.temp}°C</p>
                                <p><strong>Clima:</strong> ${data.weather[0].description}</p>
                                <p><strong>Humedad:</strong> ${data.main.humidity}%</p>
                                <p><strong>Ubicación GPS:</strong> ${lat.toFixed(4)}, ${lon.toFixed(4)}</p>
                            </div>`;
                    })
                    .catch(() => {
                        document.getElementById("clima").innerHTML = "No se pudo obtener el clima.";
                    });
            },
            function () {
                document.getElementById("clima").innerHTML = "Debes permitir acceso al GPS.";
            }
        );
    };

});
