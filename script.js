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
});


// =========================
// Save city
// =========================
function saveCity(city) {
    fetch("DB_Ops.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `action=save&city=${encodeURIComponent(city)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
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
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
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

function selectCity(city) {
    document.getElementById("cityInput").value = city;
    searchWeather(); // auto search immediately
}



// =========================
// Edit Note (Update)
// =========================
function editNote(id, currentNote) {
    let newNote = prompt("Enter a note for this city:", currentNote);

    if (newNote === null) return; 

    fetch("DB_Ops.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
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
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `action=delete&id=${id}`
    })
    .then(res => res.json())
    .then(() => loadCities());
}
