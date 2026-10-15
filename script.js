async function getWeather() {
    let city = document.getElementById("city").value.trim();
    let message = document.getElementById("message");
    if (city === "") {
        message.innerText = "Please enter a city name!";
        return;
    }
    message.innerText = "Loading weather...";
    try {
        let locationURL =
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(city) + "&count=1";

        let locationResponse = await fetch(locationURL);
        let locationData = await locationResponse.json();

        if (!locationData.results) {
            message.innerText = "City not found!";
            return;
        }

        let place = locationData.results[0];
        let latitude = place.latitude;
        let longitude = place.longitude;

        let weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

        let weatherResponse = await fetch(weatherURL);
        let weatherData = await weatherResponse.json();

        let current = weatherData.current;

        document.getElementById("cityName").innerText =
            place.name + ", " + place.country;

        document.getElementById("temperature").innerText =
            current.temperature_2m + " °C";

        document.getElementById("humidity").innerText =
            current.relative_humidity_2m;

        document.getElementById("wind").innerText =
            current.wind_speed_10m;

        document.getElementById("condition").innerText =
            getCondition(current.weather_code);

        message.innerText = "";

    } catch (error) {
        message.innerText = "Unable to fetch weather. Try again!";
    }
}

function getCondition(code) {
    if (code === 0) {
        return "☀️ Clear Sky";
    } else if (code <= 3) {
        return "⛅ Partly Cloudy";
    } else if (code <= 48) {
        return "🌫️ Foggy";
    } else if (code <= 67) {
        return "🌧️ Rainy";
    } else if (code <= 77) {
        return "❄️ Snowy";
    } else if (code <= 82) {
        return "🌦️ Rain Showers";
    } else if (code <= 86) {
        return "❄️ Snow Showers";
    } else if (code >= 95) {
        return "⛈️ Thunderstorm";
    } else {
        return "🌤️ Mixed Weather";
    }
}
