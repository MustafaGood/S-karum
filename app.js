import { fetchChallenges } from './challenge-booking-app/api/loadChallenges.js';
import { applyFilters } from './challenge-booking-app/filters/filterChallenges.js';
import { submitBooking, fetchAvailableTimes } from './challenge-booking-app/booking/bookChallenges.js';

document.addEventListener('DOMContentLoaded', async function () {
    const container = document.getElementById('challenge-container');
    const bookingModal = document.getElementById('booking-modal');
    const filterModal = document.getElementById('filter-modal');
    const filterButton = document.getElementById('filter-button');
    const closeFilterBtn = document.getElementById('close-modal');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const submitBookingBtn = document.getElementById('submit-booking');
    const searchTimesBtn = document.getElementById('search-times');
    const spinner = document.getElementById('spinner');
    const minRatingInputs = document.querySelectorAll("input[name='min-rate']");
    const maxRatingInputs = document.querySelectorAll("input[name='max-rate']");
    const keywordSearchInput = document.getElementById('keyword-search');
    const typeInputs = document.querySelectorAll("input[name='type']");
    const tagsContainer = document.querySelector(".tags-container");
    let selectedTags = [];
    let selectedTypes = [];
    let minRating = 1;
    let maxRating = 5;
    let keyword = '';
    let challenges = [];

    async function loadChallenges() {
        try {
            showSpinner();
            challenges = await fetchChallenges();
            localStorage.setItem('challenges', JSON.stringify(challenges));
            displayChallenges(challenges);
        } catch (error) {
            console.error("API Error:", error);
            container.innerHTML = `<p class="error-message">Could not load challenges. Try again later.</p>`;
        } finally {
            hideSpinner();
        }
    }

    function displayChallenges(challenges) {
        container.innerHTML = '';
        if (challenges.length === 0) {
            container.innerHTML = '<p class="no-challenges-message">No challenges match the selected filters.</p>';
            return;
        }
        challenges.forEach(challenge => {
            const challengeDiv = document.createElement('div');
            challengeDiv.className = 'challenge-card';

            const imageUrl = challenge.image?.trim() || 'https://placecats.com/640/480';
            const tags = Array.isArray(challenge.labels) ? challenge.labels.join(', ') : '';
            const ratingStars = getRatingStars(challenge.rating);
            challengeDiv.innerHTML = `
                <img src="${imageUrl}" alt="${challenge.title}" class="challenge-image">
                <h3>${challenge.title}</h3>
                <p>${challenge.description}</p>
                <p>Type: ${challenge.type}</p>
                <p>Participants: ${challenge.minParticipants} - ${challenge.maxParticipants}</p>
                <p>Rating: ${ratingStars}</p>
                ${tags ? `<p>Tags: ${tags}</p>` : ''}
                <button class="challenge-button ${challenge.type}" data-id="${challenge.id}">Book Now</button>
            `;

            container.appendChild(challengeDiv);
        });

        setupBookingButtons();
    }

    function showSpinner() {
        document.getElementById("spinner").style.display = "block";
    }
    
    function hideSpinner() {
        document.getElementById("spinner").style.display = "none";
    }
    
    async function loadChallenges() {
        try {
            showSpinner();
            let challenges = await fetchChallenges();
            localStorage.setItem('challenges', JSON.stringify(challenges));
            displayChallenges(challenges);
        } catch (error) {
            console.error("API Error:", error);
            document.getElementById("challenge-container").innerHTML = 
                `<p class="error-message">Could not load challenges. Try again later.</p>`;
        } finally {
            hideSpinner();
        }
    }
    
    function getRatingStars(rating) {
        const fullStar = '<i class="fa fa-star"></i>';
        const halfStar = '<i class="fa fa-star-half-alt"></i>';
        const emptyStar = '<i class="fa fa-star-o"></i>';
        let stars = '';

        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += fullStar;
            } else if (i - rating === 0.5) {
                stars += halfStar;
            } else {
                stars += emptyStar;
            }
        }

        return stars;
    }

    function setupBookingButtons() {
        document.querySelectorAll('.challenge-button').forEach(button => {
            button.addEventListener('click', () => openBookingModal(button.dataset.id));
        });
    }

    function openBookingModal(challengeId) {
        if (bookingModal) {
            bookingModal.style.display = 'block';
            bookingModal.dataset.challengeId = challengeId;
        }
    }

    window.closeBookingModal = function () {
        if (bookingModal) {
            bookingModal.style.display = 'none';
        }
    };

    function openFilterModal() {
        if (filterModal) {
            filterModal.style.display = 'block';
        }
    }

    function closeFilterModal() {
        if (filterModal) {
            filterModal.style.display = 'none';
        }
    }

    function clearFilters() {
        selectedTags = [];
        selectedTypes = [];
        minRating = 1;
        maxRating = 5;
        keyword = '';
        document.querySelectorAll('.tag.selected').forEach(tag => tag.classList.remove('selected'));
        document.querySelectorAll("input[name='type']").forEach(input => input.checked = false);
        document.querySelectorAll("input[name='min-rate']").forEach(input => input.checked = false);
        document.querySelectorAll("input[name='max-rate']").forEach(input => input.checked = false);
        keywordSearchInput.value = '';
        filterChallenges();
    }

    if (filterButton) {
        filterButton.addEventListener('click', openFilterModal);
    }

    if (closeFilterBtn) {
        closeFilterBtn.addEventListener('click', closeFilterModal);
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }

    if (searchTimesBtn) {
        searchTimesBtn.addEventListener('click', fetchAvailableTimes);
    }

    window.addEventListener('click', function (event) {
        if (event.target === filterModal) closeFilterModal();
    });

    function showSpinner() {
        if (spinner) {
            spinner.style.display = 'block';
        }
    }

    function hideSpinner() {
        if (spinner) {
            spinner.style.display = 'none';
        }
    }

    function handleRatingStarClick() {
        document.querySelectorAll('.filter__starsMinRating i, .filter__starsMaxRating i').forEach(star => {
            star.addEventListener('click', function () {
                const rating = [...this.parentNode.children].indexOf(this) + 1;
                if (this.parentNode.classList.contains('filter__starsMinRating')) {
                    minRating = rating;
                } else {
                    maxRating = rating;
                }
                filterChallenges();
            });
        });
    }

    function handleTagClick() {
        document.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', function () {
                this.classList.toggle('selected');
                const tagText = this.innerText.trim();
                if (selectedTags.includes(tagText)) {
                    selectedTags = selectedTags.filter(t => t !== tagText);
                } else {
                    selectedTags.push(tagText);
                }
                filterChallenges();
            });
        });
    }

    function handleTypeClick() {
        typeInputs.forEach(input => {
            input.addEventListener('change', function () {
                selectedTypes = Array.from(typeInputs)
                    .filter(input => input.checked)
                    .map(input => input.value);
                filterChallenges();
            });
        });
    }

    function initializeEventListeners() {
        handleRatingStarClick();
        handleTagClick();
        handleTypeClick();
        document.getElementById('filter-modal')?.addEventListener('change', filterChallenges);
        keywordSearchInput?.addEventListener('input', (event) => {
            keyword = event.target.value.toLowerCase();
            filterChallenges();
        });
    }

    minRatingInputs.forEach(input => {
        input.addEventListener("change", (event) => {
            minRating = parseInt(event.target.value);
            filterChallenges();
        });
    });

    maxRatingInputs.forEach(input => {
        input.addEventListener("change", (event) => {
            maxRating = parseInt(event.target.value);
            filterChallenges();
        });
    });

    function filterChallenges() {
        const filteredChallenges = challenges.filter(challenge => {
            const matchesRating = challenge.rating >= minRating && challenge.rating <= maxRating;
            const matchesTags = selectedTags.length === 0 || (challenge.labels && selectedTags.every(tag => challenge.labels.includes(tag)));
            const matchesKeyword = keyword === '' || challenge.title.toLowerCase().includes(keyword) || challenge.description.toLowerCase().includes(keyword);
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(challenge.type);
            return matchesRating && matchesTags && matchesKeyword && matchesType;
        });

        displayChallenges(filteredChallenges);
    }

    loadChallenges();
    initializeEventListeners();

    if (submitBookingBtn) {
        submitBookingBtn.addEventListener('click', submitBooking);
    }

    const clearFiltersButton = document.getElementById("clear-filters");

    if (clearFiltersButton) {
        clearFiltersButton.addEventListener("click", () => {
            console.log("Clear Filters klickad!");
            document.querySelectorAll("input[type='checkbox'], input[type='radio']").forEach(input => input.checked = false);
            
            document.getElementById("keyword-search").value = "";

            document.querySelectorAll(".tag").forEach(tag => tag.classList.remove("active"));

            document.querySelectorAll(".challenge-card").forEach(challenge => {
                challenge.style.display = "block";
            });
        });
    }
    document.querySelectorAll(".tag").forEach(tag => {
        tag.addEventListener("click", () => {
            tag.classList.toggle("active");
        });
    });
});
