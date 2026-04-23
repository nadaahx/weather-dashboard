function searchWeather() {
    const city    = document.getElementById("cityInput").value.trim();
    const errorEl = document.getElementById("inputError");
    const card    = document.getElementById("weatherResult");

    // Client-side validation
    if (!city) {
        errorEl.textContent = "⚠️ Please enter a city name.";
        return;
    }
    if (!/^[a-zA-Z\s\-'\.]+$/.test(city)) {
        errorEl.textContent = "⚠️ City name can only contain letters, spaces, or hyphens.";
        return;
    }

    errorEl.textContent = "";
    card.classList.add("hidden");
    card.innerHTML = "";

    fetch(`API_Ops.php?city=${encodeURIComponent(city)}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                errorEl.textContent = "❌ " + data.error.message;
                return;
            }
            displayWeather(data);
        })
        .catch(err => {
            errorEl.textContent = "❌ Could not fetch weather. Please try again.";
            console.error("Weather fetch error:", err);
        });
}

// ═══════════════════════════════════════
// DISPLAY WEATHER CARD
// ═══════════════════════════════════════
function displayWeather(data) {
    const card = document.getElementById("weatherResult");

    const name      = data.location.name;
    const country   = data.location.country;
    const tempC     = data.current.temp_c;
    const tempF     = data.current.temp_f;
    const condition = data.current.condition.text;
    const icon      = data.current.condition.icon;
    const humidity  = data.current.humidity;
    const windKph   = data.current.wind_kph;
    const feelsC    = data.current.feelslike_c;
    const uv        = data.current.uv;

    card.className = "weather-card";
    card.innerHTML = `
        <div class="weather-location">📍 ${escapeHtml(name)}, ${escapeHtml(country)}</div>

        <div>
            <div class="weather-temp">${tempC}°C</div>
            <div class="weather-condition">${escapeHtml(condition)}</div>
        </div>

        <img src="https:${icon}" alt="${escapeHtml(condition)}" class="weather-icon">

        <div class="weather-details">
            <span class="detail-chip">🌡️ Feels like <strong>${feelsC}°C</strong></span>
            <span class="detail-chip">💧 Humidity <strong>${humidity}%</strong></span>
            <span class="detail-chip">💨 Wind <strong>${windKph} km/h</strong></span>
            <span class="detail-chip">☀️ UV Index <strong>${uv}</strong></span>
            <span class="detail-chip">🌡️ ${tempF}°F</span>
        </div>

        <button class="btn-save" onclick="saveCity('${escapeHtml(name)}')">
            + Save City
        </button>
    `;
}
