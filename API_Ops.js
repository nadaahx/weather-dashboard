



function searchWeather() {
    let city = document.getElementById("cityInput").value;

    if (!city.trim()) {
        alert("Please enter a city");
        return;
    }

    fetch(`API_Ops.php?city=${encodeURIComponent(city)}`)
        .then(res => res.json())
        .then(data => {
            console.log("API response:", data); // debugging
            displayWeather(data);
        })
        .catch(err => {
            console.error("Fetch error:", err);
        });
}

function displayWeather(data) {

    let box = document.getElementById("weatherResult");

    // Handle errors
    if (data.error) {
        box.innerHTML = `<p style="color:red;">${data.error}</p>`;
        return;
    }

    box.innerHTML = `
        <h3>${data.location.name}, ${data.location.country}</h3>
        <p>🌡️ Temp: ${data.current.temp_c} °C</p>
        <p>🌤️ ${data.current.condition.text}</p>
        <img src="${data.current.condition.icon}">
        <br><br>
        <button onclick="saveCity('${data.location.name}')">Save City</button>
    `;
}
