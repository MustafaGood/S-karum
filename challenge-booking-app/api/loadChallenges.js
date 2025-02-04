export async function fetchChallenges() {
    const apiUrl = 'https://lernia-sjj-assignments.vercel.app/api/challenges';
    const cachedChallenges = localStorage.getItem('cachedChallenges');
    if (cachedChallenges) {
        return JSON.parse(cachedChallenges);
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch challenges. HTTP Status: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data.challenges)) {
            throw new Error("Invalid data format: Expected an array of challenges.");
        }

        const challenges = data.challenges.map(challenge => ({
            type: challenge.type,
            title: challenge.title,
            description: challenge.description,
            minParticipants: challenge.minParticipants,
            maxParticipants: challenge.maxParticipants,
            rating: challenge.rating,
            image: challenge.image,
            labels: challenge.labels
        }));

        localStorage.setItem('cachedChallenges', JSON.stringify(challenges));
        return challenges;
    } catch (error) {
        console.error("API Error:", error.message);
        document.getElementById('challenge-container').innerHTML = 
            `<p class="error-message">Could not load challenges. Please try again later.</p>`;
        return [];
    }
}