// ─────────────────────────────────────────────────────────
// Laravel Weather Dashboard – app.js
// Replaces API_Ops.js + script.js, targets /api/* routes
// ─────────────────────────────────────────────────────────

// Read CSRF token from the meta tag injected by the Blade layout
const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]')?.content ?? '';

// ─────────────────────────────────────────
// Weather search & display
// ─────────────────────────────────────────
function searchWeather() {
    const city = document.getElementById('cityInput').value.trim();

    const oldError = document.getElementById("clientError");
    if (oldError) oldError.remove();

    if (!city) {
        showError(" Please enter a city name.");
        return;
    }

    if (!/^[a-zA-Z\s\-'\.]+$/.test(city)) {
        showError(" City name can only contain letters, spaces, or hyphens.");
        return;
    }

    if (city.length > 100) {
        showError(" City name is too long (max 100 characters).");
        return;
    }

    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
        .then(res => res.json())
        .then(data => {
            console.log('Weather API response:', data);
            displayWeather(data);
        })
        .catch(err => console.error('Fetch error:', err));
}

function displayWeather(data) {
    const box = document.getElementById('weatherResult');
    box.classList.remove('hidden');

    if (data.error) {
        box.innerHTML = `<p style="color:#f87171;">⚠️ ${data.error}</p>`;
        return;
    }

    box.innerHTML = `
        <h3>${data.location.name}, ${data.location.country}</h3>
        <p>🌡️ Temp: ${data.current.temp_c} °C</p>
        <p>🌤️ ${data.current.condition.text}</p>
        <img src="${data.current.condition.icon}" alt="Weather icon">
        <br><br>
        <button onclick="saveCity('${data.location.name}')">Save City</button>
    `;
}

// ─────────────────────────────────────────
// Save city
// ─────────────────────────────────────────
function saveCity(city) {
    // Client-side validation
    if (!city || city.length > 100) {
        alert('Invalid city name.');
        return;
    }

    fetch('/api/cities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': CSRF_TOKEN,
        },
        body: JSON.stringify({ city }),
    })
        .then(res => res.json())
        .then(data => {
            const btn = document.querySelector('#weatherResult button');
            if (data.error) {
                if (btn) btn.textContent = '⚠️ ' + data.error;
            } else {
                if (btn) {
                    btn.textContent = '✅ Saved!';
                    btn.disabled = true;
                }
                loadCities();
            }
        })
        .catch(err => console.error('Save error:', err));
}

// ─────────────────────────────────────────
// Load saved cities
// ─────────────────────────────────────────
function loadCities() {
    fetch('/api/cities')
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('savedCities');

            if (!data.length) {
                list.innerHTML = '<li class="city-placeholder">No cities saved yet.</li>';
                return;
            }

            list.innerHTML = data.map(city => {
                const noteText = city.note
                    ? `<br><small style="color:#94a3b8;">Note: ${city.note}</small>`
                    : '';
                const safeNote = (city.note || '').replace(/'/g, "\\'");

                return `
                <li id="city-row-${city.id}" style="flex-direction:column; align-items:flex-start;">
                    <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                        <span class="city-item" onclick="selectCity('${city.city_name}')" style="cursor:pointer;">
                            <b>${city.city_name}</b>${noteText}
                        </span>
                        <div class="actions">
                            <button onclick="showInlineEditor(${city.id}, '${safeNote}')">Edit</button>
                            <button onclick="deleteCity(${city.id})" class="delete-btn">X</button>
                        </div>
                    </div>
                    <div id="editor-${city.id}" style="width:100%;"></div>
                </li>`;
            }).join('');
        })
        .catch(err => console.error('Load error:', err));
}

// ─────────────────────────────────────────
// Select city from saved list
// ─────────────────────────────────────────
function selectCity(city) {
    document.getElementById('cityInput').value = city;
    searchWeather();
}

// ─────────────────────────────────────────
// Inline note editor
// ─────────────────────────────────────────
function showInlineEditor(id, currentNote) {
    document.getElementById(`editor-${id}`).innerHTML = `
        <div class="note-editor-container">
            <textarea id="textarea-${id}" class="note-textarea" rows="3">${currentNote}</textarea>
            <div class="editor-actions">
                <button class="cancel-note-btn" onclick="closeEditor(${id})">Cancel</button>
                <button class="save-note-btn" onclick="saveInlineNote(${id})">Save Note</button>
            </div>
        </div>`;
}

function closeEditor(id) {
    document.getElementById(`editor-${id}`).innerHTML = '';
}

// ─────────────────────────────────────────
// Update note (PATCH)
// ─────────────────────────────────────────
function saveInlineNote(id) {
    const textarea = document.getElementById(`textarea-${id}`);
    const newNote = textarea.value.trim();

    // Client-side validation
    if (newNote.length > 255) {
        alert('Note is too long (max 255 characters).');
        return;
    }

    fetch(`/api/cities/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': CSRF_TOKEN,
        },
        body: JSON.stringify({ note: newNote }),
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                loadCities();
            } else {
                alert(data.error || 'Failed to update note.');
            }
        })
        .catch(err => console.error('Update error:', err));
}

// ─────────────────────────────────────────
// Delete city (DELETE)
// ─────────────────────────────────────────
function deleteCity(id) {
    fetch(`/api/cities/${id}`, {
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': CSRF_TOKEN,
        },
    })
        .then(res => res.json())
        .then(() => loadCities())
        .catch(err => console.error('Delete error:', err));
}
function showError(message) {
    const cityInput = document.getElementById("cityInput");
    const originalValue = cityInput.value;
    
    cityInput.value = "";
    cityInput.placeholder = message;
    cityInput.style.setProperty('--placeholder-color', '#fb923c');
    cityInput.classList.add('error-placeholder');
    
    setTimeout(() => {
        cityInput.placeholder = "Search City...";
        cityInput.classList.remove('error-placeholder');
        cityInput.value = originalValue;
    }, 3000);
}
// ─────────────────────────────────────────
// DOM Ready
// ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    // Search button
    document.getElementById('searchBtn')?.addEventListener('click', searchWeather);

    // Enter key on input
    document.getElementById('cityInput')?.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') searchWeather();
    });

    // Load cities on page load
    loadCities();

    // Autocomplete with debounce
    const cityInput = document.getElementById('cityInput');
    const suggestionBox = document.getElementById('suggestions');
    let debounceTimer;

    cityInput.addEventListener('input', function () {
        const query = this.value.trim();
        suggestionBox.innerHTML = '';
        suggestionBox.style.display = 'none';

        if (query.length < 2) return;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            fetch(`/api/weather/search?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(cities => {
                    if (!cities.length) return;

                    cities.forEach(c => {
                        const li = document.createElement('li');
                        li.textContent = `${c.name}, ${c.region}, ${c.country}`;
                        li.addEventListener('click', () => {
                            cityInput.value = c.name;
                            suggestionBox.innerHTML = '';
                            suggestionBox.style.display = 'none';
                            searchWeather();
                        });
                        suggestionBox.appendChild(li);
                    });

                    suggestionBox.style.display = 'block';
                })
                .catch(err => console.error('Suggestion error:', err));
        }, 300);
    });

    document.addEventListener('click', function (e) {
        if (e.target !== cityInput) {
            suggestionBox.innerHTML = '';
            suggestionBox.style.display = 'none';
        }
    });
});