<?php include 'header.php'; ?>

<div class="container">
    <h2>Weather Dashboard</h2>

    <!-- Search -->
    <div style="position: relative; display: inline-block;">
        <input type="text" id="cityInput" placeholder="Enter city name" autocomplete="off">
        <ul id="suggestions" style="
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            border: 1px solid #ccc;
            list-style: none;
            margin: 0;
            padding: 0;
            width: 100%;
            z-index: 999;
            display: none;
        "></ul>
    </div>
    <button id="searchBtn">Search</button>

    <!-- Weather Result -->
    <div id="weatherResult"></div>

    <!-- Saved Cities -->
    <h3>Saved Cities</h3>
    <ul id="savedCities"></ul>
</div>

<script src="API_Ops.js"></script>
<script src="script.js"></script>

<?php include 'footer.php'; ?>