// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    // Attach event to search button
    const btn = document.getElementById("searchBtn");
    if (btn) {
        btn.addEventListener("click", function () {
            if (typeof searchWeather === "function") {
                searchWeather();
            } else {
                console.error("searchWeather is not defined");
            }
        });
    }

    // Load saved cities on start
    loadCities();

    // =============================
    // Autocomplete while typing
    // =============================
    const cityInput = document.getElementById("cityInput");
    const suggestionBox = document.getElementById("suggestions");
    let debounceTimer;

    cityInput.addEventListener("input", function () {
        const query = this.value.trim();
        suggestionBox.innerHTML = "";
        suggestionBox.style.display = "none";

        if (query.length < 2) return; // start suggesting after 2 chars

        // Debounce: wait 300ms after user stops typing before calling API
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            fetch(`API_Ops.php?search=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(cities => {
                    if (!cities.length) return;

                    cities.forEach(c => {
                        const li = document.createElement("li");
                        li.textContent = `${c.name}, ${c.region}, ${c.country}`;
                        li.style.cssText = "padding: 8px 12px; cursor: pointer;";
                        li.addEventListener("mouseenter", () => li.style.background = "#f0f0f0");
                        li.addEventListener("mouseleave", () => li.style.background = "white");
                        li.addEventListener("click", () => {
                            cityInput.value = c.name;
                            suggestionBox.innerHTML = "";
                            suggestionBox.style.display = "none";
                            searchWeather();
                        });
                        suggestionBox.appendChild(li);
                    });

                    suggestionBox.style.display = "block";
                })
                .catch(err => console.error("Suggestion error:", err));
        }, 300);
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", function (e) {
        if (e.target !== cityInput) {
            suggestionBox.innerHTML = "";
            suggestionBox.style.display = "none";
        }
    });
});


// =========================
// Save city
// =========================
function saveCity(city) {
    fetch("DB_Ops.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=save&city=${encodeURIComponent(city)}`
    })
    .then(res => res.json())
    .then(data => {
        const btn = document.querySelector("#weatherResult button");
        if (data.error) {
            if (btn) btn.textContent = "⚠️ " + data.error;
        } else {
            if (btn) {
                btn.textContent = "✅ Saved!";
                btn.disabled = true;
            }
            loadCities();
        }
    });
}


// =========================
// Load cities
// =========================
function loadCities() {
    fetch("DB_Ops.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "action=get"
    })
    .then(res => res.json())
    .then(data => {
        let list = document.getElementById("savedCities");
        list.innerHTML = "";

        let html = "";

        data.forEach(city => {
            let noteText = city.note
                ? `<br><small style="color: gray;">Note: ${city.note}</small>`
                : "";

            let safeNote = (city.note || "").replace(/'/g, "\\'");

            html += `
            <li>
                <span class="city-item" onclick="selectCity('${city.city_name}')">
                    <b>${city.city_name}</b> ${noteText}
                </span>
                <div class="actions">
                    <button onclick="editNote(${city.id}, '${safeNote}')">Edit</button>
                    <button onclick="deleteCity(${city.id})" class="delete-btn">X</button>
                </div>
            </li>
        `;
        });

        list.innerHTML = html;
    });
}


// =========================
// Select city from list
// =========================
function selectCity(city) {
    document.getElementById("cityInput").value = city;
    searchWeather();
}


// =========================
// Edit Note (Update)
// =========================
function editNote(id, currentNote) {
    let newNote = prompt("Enter a note for this city:", currentNote);

    if (newNote === null) return;

    fetch("DB_Ops.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=update&id=${id}&note=${encodeURIComponent(newNote)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            loadCities();
        } else {
            alert(data.error);
        }
    })
    .catch(error => console.error("Error:", error));
}


// =========================
// Delete city
// =========================
function deleteCity(id) {
    fetch("DB_Ops.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=delete&id=${id}`
    })
    .then(res => res.json())
    .then(() => loadCities());
}