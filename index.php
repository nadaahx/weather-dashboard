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
        <?php if (isset($_SESSION['user_id'])): ?>
            <h3 class="section-title">📍 Saved Cities</h3>
            <ul id="savedCities" class="city-list" aria-live="polite">
                <li class="city-placeholder">No cities saved yet.</li>
            </ul>
        <?php else: ?>
            <div class="login-prompt">
                <p>🔒 <a href="#" id="promptLoginBtn">Login</a> or <a href="#" id="promptSignupBtn">sign up</a> to save cities and access them anytime.</p>
            </div>
        <?php endif; ?>
    </section>

</main>

<!-- ── SCRIPTS ─────────────────────────────────────────── -->
<script src="API_Ops.js"></script>
<script src="script.js"></script>
<script src="auth.js"></script>

<?php include 'footer.php'; ?>
