<?php include 'header.php'; ?>

<main class="main-content">

    <!-- ── SEARCH SECTION ─────────────────────────────── -->
    <section class="search-section">
        <div class="search-wrapper">
            <h1 class="hero-title">What's the weather<br><em>where you are?</em></h1>
            <div class="search-bar">
                <input
                    type="text"
                    id="cityInput"
                    placeholder="Enter a city name…"
                    autocomplete="off"
                    maxlength="100"
                />
                <button id="searchBtn" class="btn-search">
                    <span class="btn-icon">🔍</span>
                    <span>Search</span>
                </button>
            </div>
            <p id="inputError" class="input-error" aria-live="polite"></p>
        </div>
    </section>

    <!-- ── WEATHER RESULT ──────────────────────────────── -->
    <section class="result-section">
        <div id="weatherResult" class="weather-card hidden" aria-live="polite"></div>
    </section>


    <!-- ── SAVED CITIES ────────────────────────────────── -->
    <section class="saved-section">
        <h3 class="section-title">📍 Saved Cities</h3>
        <ul id="savedCities" class="city-list" aria-live="polite">
            <li class="city-placeholder">No cities saved yet.</li>
        </ul>
    </section>

</main>

<!-- ── SCRIPTS ─────────────────────────────────────────── -->
<script src="API_Ops.js"></script>
<script src="script.js"></script>

<!-- Upload script (inline to keep Upload.php logic separate) -->
<script>
document.getElementById("profilePic").addEventListener("change", function () {
    const name = this.files[0] ? this.files[0].name : "No file chosen";
    document.getElementById("fileName").textContent = name;
});

document.getElementById("uploadBtn").addEventListener("click", function () {
    const fileInput = document.getElementById("profilePic");
    const msgEl    = document.getElementById("uploadMsg");
    const preview  = document.getElementById("profilePreview");

    // Client-side validation
    if (!fileInput.files[0]) {
        msgEl.textContent  = "⚠️ Please choose a file first.";
        msgEl.className    = "upload-msg error";
        return;
    }


    

    
});
</script>

<?php include 'footer.php'; ?>
