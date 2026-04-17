<?php include 'header.php'; ?>

<div class="container">
    <h2>Weather Dashboard</h2>

    <!-- Search -->
    <input type="text" id="cityInput" placeholder="Enter city name">
    <button id="searchBtn">Search</button>

    <!-- Weather Result -->
    <div id="weatherResult"></div>

    <!-- Saved Cities -->
    <h3>Saved Cities</h3>
    <ul id="savedCities"></ul>
</div>

<!-- JS Files -->
<script src="API_Ops.js"></script>
<script src="script.js"></script>

<?php include 'footer.php'; ?>