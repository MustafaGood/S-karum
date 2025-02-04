export async function submitBooking() {
    const bookingModal = document.getElementById('booking-modal');
    const submitButton = document.getElementById('submit-booking');
    submitButton.disabled = true;

    const bookingData = {
        challengeId: bookingModal.dataset.challengeId,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        time: document.getElementById('time').value,
        participants: document.getElementById('participants').value
    };

    if (!validateEmail(bookingData.email)) {
        bookingModal.querySelector('.error-message').textContent = 'Please enter a valid email address.';
        submitButton.disabled = false;
        return;
    }

    try {
        const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://lernia-sjj-assignments.vercel.app/api/bookings'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
            if (response.status === 405) {
                throw new Error("Booking failed: Method Not Allowed. Please check API settings.");
            } else {
                throw new Error("Booking failed. Server returned status: " + response.status);
            }
        }

        document.querySelector('.step2').style.display = 'none';
        document.querySelector('.step3').style.display = 'block';
    } catch (error) {
        console.error("Booking Error:", error);
        bookingModal.querySelector('.error-message').textContent = error.message;
    } finally {
        submitButton.disabled = false; 
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function fetchAvailableTimes() {
    const selectedDate = document.getElementById('booking-date')?.value;

    if (!selectedDate) {
        alert("Please select a date first!");
        return;
    }

    console.log(`Fetching available times for: ${selectedDate}`);

    const simulatedAvailableTimes = ["10:00 - 11:00", "12:00 - 13:00", "14:00 - 15:00"];

    const timeSelect = document.getElementById('time');
    timeSelect.innerHTML = '';

    simulatedAvailableTimes.forEach(time => {
        let option = document.createElement('option');
        option.value = time;
        option.text = time;
        timeSelect.appendChild(option);
    });

    document.querySelector('.step1').style.display = 'none';
    document.querySelector('.step2').style.display = 'block';
}