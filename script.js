// script.js – SkyScope Weather Dashboard
// IS333 Web-Based Information Systems · Spring 2026

document.addEventListener("DOMContentLoaded", function () {

    // ── Search button ───────────────────────────────────
    const btn = document.getElementById("searchBtn");
    if (btn) {
        btn.addEventListener("click", function () {
            if (typeof searchWeather === "function") {
                searchWeather();
            }
        });
    }

    // ── Allow pressing Enter to search ─────────────────
    const input = document.getElementById("cityInput");
    if (input) {
        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") searchWeather();
        });
    }

    // ── Load saved cities on page load ──────────────────
    loadCities();
});

// ═══════════════════════════════════════
// SAVE CITY
// ═══════════════════════════════════════
function saveCity(city) {
    fetch("DB_Ops.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=save&city=${encodeURIComponent(city)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert("⚠️ " + data.error);
        } else {
            loadCities();
        }
    })
    .catch(err => alert("❌ Save failed: " + err.message));
}

// ═══════════════════════════════════════
// LOAD CITIES
// ═══════════════════════════════════════
function loadCities() {
    fetch("DB_Ops.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "action=get"
    })
    .then(res => res.json())
    .then(data => {
        const list = document.getElementById("savedCities");
        list.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            list.innerHTML = `<li class="city-placeholder">No cities saved yet.</li>`;
            return;
        }

        data.forEach(city => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="city-item" onclick="selectCity('${escapeHtml(city.city_name)}')">
                    📍 ${escapeHtml(city.city_name)}
                </span>
                <button class="btn-delete" onclick="deleteCity(${parseInt(city.id)})">✕</button>
            `;
            list.appendChild(li);
        });
    })
    .catch(err => alert("❌ Could not load cities: " + err.message));
}

// ═══════════════════════════════════════
// SELECT CITY (click from saved list)
// ═══════════════════════════════════════
function selectCity(city) {
    document.getElementById("cityInput").value = city;
    searchWeather();
}

// DELETE CITY

function deleteCity(id) {
    fetch("DB_Ops.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=delete&id=${id}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert("⚠️ " + data.error);
        } else {
            loadCities();
        }
    })
    .catch(err => alert("❌ Delete failed: " + err.message));
}

// HELPER – escape HTML to prevent XSS
function escapeHtml(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}
