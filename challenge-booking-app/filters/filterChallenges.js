let debounceTimeout;
export function applyFilters(challenges, selectedRating, selectedTags, sortBy) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        const filteredChallenges = challenges.filter(challenge => {
            const matchesRating = selectedRating ? (challenge.rating >= selectedRating.min && challenge.rating <= selectedRating.max) : true;
            const matchesTags = selectedTags.length ? selectedTags.every(tag => challenge.labels.includes(tag)) : true;
            return matchesRating && matchesTags;
        });

        if (sortBy === 'highestRating') {
            filteredChallenges.sort((a, b) => b.rating - a.rating);
        }

        displayChallenges(filteredChallenges);
    }, 300);
}

function displayChallenges(challenges) {
    const container = document.getElementById('challenge-container');
    container.innerHTML = '';

    if (challenges.length === 0) {
        container.innerHTML = '<p class="no-challenges-message">No challenges match the selected filters.</p>';
        return;
    }

    challenges.forEach(challenge => {
        const challengeDiv = document.createElement('div');
        challengeDiv.className = 'challenge-card';

        const imageUrl = challenge.image?.trim() || 'public/image3168-hrc2-300h.png';
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
    const bookingModal = document.getElementById('booking-modal');
    if (bookingModal) {
        bookingModal.style.display = 'block';
        bookingModal.dataset.challengeId = challengeId;
        bookingModal.querySelector('.loading-indicator').style.display = 'none';
        bookingModal.querySelector('.error-message').textContent = '';
        bookingModal.querySelector('.success-message').style.display = 'none';
    }
}

window.closeBookingModal = function () {
    const bookingModal = document.getElementById('booking-modal');
    if (bookingModal) {
        bookingModal.style.display = 'none';
    }
};