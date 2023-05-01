document.addEventListener('DOMContentLoaded', function() {
    const findNpBtn = document.getElementById('find-np-btn');
    const hotBtn = document.getElementById('hot-btn');
    const coldBtn = document.getElementById('cold-btn');

    if (findNpBtn) {
        findNpBtn.addEventListener('click', function() {
            window.location.href = 'climate.html';
        });
    }

    if (hotBtn && coldBtn) {
        hotBtn.addEventListener('click', function() {
            window.location.href = 'results.html?climate=hot';
        });

        coldBtn.addEventListener('click', function() {
            window.location.href = 'results.html?climate=cold';
        });
    }

    if (window.location.pathname.includes('results.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const climate = urlParams.get('climate');

        // A function to get random national parks based on climate.
        (async () => {
            if (window.location.pathname.includes('results.html')) {
                const urlParams = new URLSearchParams(window.location.search);
                const climate = urlParams.get('climate');
        
                const selectedPark = await getRandomNationalPark(climate);
        
                if (selectedPark) {
                    const npImage = document.getElementById('np-image');
                    const npDescription = document.getElementById('np-description');
        
                    npImage.src = selectedPark.image;
                    npImage.alt = selectedPark.name;
                    npDescription.textContent = selectedPark.description;
                }
            }
        })();
        

            const filteredParks = nationalParks.filter(np => np.climate === climate);
            const randomIndex = Math.floor(Math.random() * filteredParks.length);
            return filteredParks[randomIndex];
        }

        const selectedPark = getRandomNationalPark(climate);

        if (selectedPark) {
            const npImage = document.getElementById('np-image');
            const npDescription = document.getElementById('np-description');

            npImage.src = selectedPark.image;
            npImage.alt = selectedPark.name;
            npDescription.textContent = selectedPark.description;
        }
    }
});

async function fetchWikipediaPage(title) {
    const url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=extracts|pageimages&exintro&explaintext&pithumbsize=300&titles=${encodeURIComponent(title)}`;

    const response = await fetch(url);
    const data = await response.json();
    const pageId = Object.keys(data.query.pages)[0];
    const pageInfo = data.query.pages[pageId];

    return {
        title: pageInfo.title,
        description: pageInfo.extract,
        image: pageInfo.thumbnail ? pageInfo.thumbnail.source : null
    };
}

async function getRandomNationalPark(climate) {
    // List of national park titles on Wikipedia based on climate.
    const hotNationalParks = [
        'Yosemite_National_Park',
        'Zion_National_Park'
    ];

    const coldNationalParks = [
        'Denali_National_Park_and_Preserve',
        'Glacier_National_Park_(U.S.)'
    ];

    const parkList = climate === 'hot' ? hotNationalParks : coldNationalParks;
    const randomIndex = Math.floor(Math.random() * parkList.length);
    const selectedPark = await fetchWikipediaPage(parkList[randomIndex]);

    return {
        name: selectedPark.title,
        image: selectedPark.image,
        description: selectedPark.description,
        climate
    };
}
