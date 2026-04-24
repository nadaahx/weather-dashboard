// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

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

        if (query.length < 2) return; 

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
                ? `<br><small style="color: #94a3b8;">Note: ${city.note}</small>`
                : "";

            let safeNote = (city.note || "").replace(/'/g, "\\'");

            html += `
            <li id="city-row-${city.id}" style="flex-direction: column; align-items: flex-start;">
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <span class="city-item" onclick="selectCity('${city.city_name}')" style="cursor:pointer;">
                        <b>${city.city_name}</b> ${noteText}
                    </span>
                    <div class="actions">
                        <button onclick="showInlineEditor(${city.id}, '${safeNote}')">Edit</button>
                        <button onclick="deleteCity(${city.id})" class="delete-btn">X</button>
                    </div>
                </div>
                <div id="editor-${city.id}" style="width: 100%;"></div>
            </li>
        `;
        });

        list.innerHTML = html || '<li class="city-placeholder">No cities saved yet.</li>';
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
// Show Inline Editor
// =========================
function showInlineEditor(id, currentNote) {
    const container = document.getElementById(`editor-${id}`);

    container.innerHTML = `
        <div class="note-editor-container">
            <textarea id="textarea-${id}" class="note-textarea" rows="3">${currentNote}</textarea>
            <div class="editor-actions">
                <button class="cancel-note-btn" onclick="closeEditor(${id})">Cancel</button>
                <button class="save-note-btn" onclick="saveInlineNote(${id})">Save Note</button>
            </div>
        </div>
    `;
}

function closeEditor(id) {
    document.getElementById(`editor-${id}`).innerHTML = "";
}

// =========================
// Save Inline Note (Update)
// =========================
function saveInlineNote(id) {
    const textarea = document.getElementById(`textarea-${id}`);
    const newNote = textarea.value.trim();

    // Client-side validation 
    if (newNote.length > 255) {
        alert("Note is too long (max 255 characters)");
        return;
    }

    fetch("DB_Ops.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=update&id=${id}&note=${encodeURIComponent(newNote)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.success || data.success === true) {
            loadCities(); // Refresh list to show new note
        } else {
            alert(data.error || "Failed to update");
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