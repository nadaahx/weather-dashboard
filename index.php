<?php include 'header.php'; ?>

<main class="main-content">

    <section class="search-section">
            <div class="search-wrapper">
    <div style="position: relative; flex-grow: 1;">
        <input type="text" id="cityInput" placeholder="Search City..." autocomplete="off">
        <ul id="suggestions" class="glass-dropdown" style="display: none;"></ul>
    </div>
    <button id="searchBtn">SEARCH</button>
    </section>

    <section class="result-section">
        <div id="weatherResult" class="weather-card hidden" aria-live="polite"></div>
    </section>

    <section class="saved-section">
    <h3 class="section-title">📍 Saved Cities</h3>
    
    <div class="storage-info">
        <span>✨</span> 
        <em>Your favorites are magically tied to this browser!</em>
    </div>

    <ul id="savedCities" class="city-list" aria-live="polite">
        <li class="city-placeholder">No cities saved yet.</li>
    </ul>
</section>

</main>

<script src="API_Ops.js"></script>
<script src="script.js"></script>


<?php include 'footer.php'; ?>
