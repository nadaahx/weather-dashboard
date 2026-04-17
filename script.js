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
// function loadCities() {
//     fetch("DB_Ops.php", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded"
//         },
//         body: "action=get"
//     })
//     .then(res => res.json())
//     .then(data => {
//         let list = document.getElementById("savedCities");
//         list.innerHTML = "";

//         data.forEach(city => {
//             list.innerHTML += `
//                 <li>
//                     ${city.city_name}
//                     <button onclick="deleteCity(${city.id})">X</button>
//                 </li>
//             `;
//         });
//     });
// }

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

        data.forEach(city => {
            list.innerHTML += `
                <li>
                    <span class="city-item" onclick="selectCity('${city.city_name}')">
                        ${city.city_name}
                    </span>
                    <button onclick="deleteCity(${city.id})">X</button>
                </li>
            `;
        });
    });
}

function selectCity(city) {
    document.getElementById("cityInput").value = city;
    searchWeather(); // auto search immediately
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