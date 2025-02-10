<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hacker Escape Rooms</title>
    <link rel="stylesheet" href="styling.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <script type="module" src="./app.js"></script>
    <style>
        .spinner {
            border: 16px solid #f3f3f3;
            border-top: 16px solid var(--primary-color);
            border-radius: 50%;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
 </head>
<body>
    <header class="navbar">
        <div class="logo">
            <img src="public/4.png" alt="ESC Logo">
            <span>Hacker Escape Rooms</span>
        </div>
        <ul class="nav-links">
            <li><a href="#">Play online</a></li>
            <li><a href="#">Play on-site</a></li>
            <li><a href="#">The story</a></li>
            <li><a href="#">Contact us</a></li>
        </ul>
    </header>

    <main>
        <section class="hero">
            <h1>Our challenges</h1>
            <button id="filter-button" class="button-primary">Filter Challenges</button>
        </section>

        <div id="filter-modal" class="modal1" style="display: none;">
            <div class="modal-content">
                <span id="close-modal" class="close">&times;</span>
                <h2>Filter Challenges</h2>

                <div class="filter-content">
                    <div class="filter-section">
                        <h3>By type</h3>
                        <label><input type="checkbox" name="type" value="online"> Online challenges</label>
                        <label><input type="checkbox" name="type" value="onsite"> On-site challenges</label>
                    </div>

                    <div class="filter-section">
                        <h3>By rating</h3>
                        <div class="rate">
                            <span>Min:</span>
                            <input type="radio" id="min-star5" name="min-rate" value="5">
                            <label for="min-star5" title="5 stars">★</label>
                            <input type="radio" id="min-star4" name="min-rate" value="4">
                            <label for="min-star4" title="4 stars">★</label>
                            <input type="radio" id="min-star3" name="min-rate" value="3">
                            <label for="min-star3" title="3 stars">★</label>
                            <input type="radio" id="min-star2" name="min-rate" value="2">
                            <label for="min-star2" title="2 stars">★</label>
                            <input type="radio" id="min-star1" name="min-rate" value="1">
                            <label for="min-star1" title="1 star">★</label>
                        </div>
                        <div class="rate">
                            <span>Max:</span>
                            <input type="radio" id="max-star5" name="max-rate" value="5">
                            <label for="max-star5" title="5 stars">★</label>
                            <input type="radio" id="max-star4" name="max-rate" value="4">
                            <label for="max-star4" title="4 stars">★</label>
                            <input type="radio" id="max-star3" name="max-rate" value="3">
                            <label for="max-star3" title="3 stars">★</label>
                            <input type="radio" id="max-star2" name="max-rate" value="2">
                            <label for="max-star2" title="2 stars">★</label>
                            <input type="radio" id="max-star1" name="max-rate" value="1">
                            <label for="max-star1" title="1 star">★</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3>By tags</h3>
                        <div class="tags-container">
                            <span class="tag">Web</span>
                            <span class="tag">Linux</span>
                            <span class="tag">Cryptography</span>
                            <span class="tag">Coding</span>
                            <span class="tag">SSH</span>
                            <span class="tag">CTF</span>
                            <span class="tag">Hacking</span>
                            <span class="tag">Bash</span>
                            <span class="tag">Javascript</span>
                            <span class="tag">Electronics</span>
                            <span class="tag">Phreaking</span>
                        </div>
                    </div>
                </div>

                <div class="search-container">
                    <h3>Search for keyword</h3>
                    <input type="text" id="keyword-search" placeholder="Type to filter">
                </div>

                <button id="clear-filters" class="button-secondary">Clear Filters</button>
            </div>
        </div>

        <div id="booking-modal" class="modal" style="display: none;">
            <div class="modal-content">
                <span class="close" onclick="closeBookingModal()">&times;</span>
                <div class="step1">
                    <h2>Book a room</h2>
                    <form id="booking-form-step1">
                        <label for="booking-date">Select a date:</label>
                        <input type="date" id="booking-date" name="booking-date" required>
                        <button type="button" id="search-times">Search available times</button>
                    </form>
                </div>

                <div class="step2" style="display: none;">
                    <h2>Confirm Booking</h2>
                    <form id="booking-form-step2">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>

                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>

                        <label for="time">Select time</label>
                        <select id="time" name="time"></select>

                        <label for="participants">Number of participants</label>
                        <select id="participants" name="participants">
                            <option value="2">2 participants</option>
                            <option value="3">3 participants</option>
                            <option value="4">4 participants</option>
                            <option value="5">5 participants</option>
                            <option value="6">6 participants</option>
                        </select>

                        <button type="button" id="submit-booking">Submit booking</button>
                    </form>
                </div>

                <div class="step3" style="display: none;">
                    <h2>Thank you for booking!</h2>
                    <a href="#" onclick="closeBookingModal()">Back to challenges</a>
                </div>
            </div>
        </div>

        <div id="spinner" class="spinner" style="display: none;"></div>

        <section id="challenge-container" class="challenges">
            <h2>Challenges</h2>
        </section>
    </main>

    <footer>
        <div class="footer-content">
            <div class="footer-column">
                <h3>[Esc] Hacker Escape Rooms</h3>
                <p>Quodsi haberent magnalia inter potentiam et divitias,<br>
                    t non illam quidem haec eo spectant haec quoque vos <br>
                    nino desit illud quo solo felicitatis libertatisque perficiuntur.
            </div>
            <div class="footer-column">
                <h3>Site map</h3>
                <ul>
                    <li><a href="#">The story</a></li>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">Legal</a></li>
                    <li><a href="#">Play online</a></li>
                    <li><a href="#">Play on-site</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Follow us</h3>
                <ul>
                    <li><a href="#">Facebook</a></li>
                    <li><a href="#">Instagram</a></li>
                    <li><a href="#">Twitter</a></li>
                </ul>
            </div>
        </div>
    </footer>
    <script>
        function fetchAvailableTimes() {
            console.log("Fetching available times...");
        }
    </script>
</body>
</html>
