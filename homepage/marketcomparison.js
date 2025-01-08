document.addEventListener('DOMContentLoaded', function() {
    initializeUI();

    fetch('knowledgejson/facilitylist.json')
        .then(response => response.json())
        .then(data => {
            const facilityList = document.getElementById('marketcomparison-facility-list');
            data.forEach(facility => {
                const listItem = document.createElement('li');
                listItem.textContent = facility.name;
                listItem.setAttribute('data-facility', facility.name);
                listItem.addEventListener('click', () => {
                    if (facility.name === "All Facilities") {
                        fetchCombinedPerformanceData();
                    } else {
                        fetchFacilityData(facility.name);
                    }
                    setActiveItem(listItem, '#marketcomparison-facility-list li');
                    resetProjectDetails();
                });
                facilityList.appendChild(listItem);

                // Select "All Facilities" by default
                if (facility.name === "All Facilities") {
                    listItem.click();
                }
            });
        })
        .catch(error => console.error('Error fetching facility list:', error));

    // Add event listeners for the buttons
    document.getElementById('mapbtn').addEventListener('click', function() {
        toggleContainer('marketcomparison-map-container');
    });

    document.getElementById('listbtn').addEventListener('click', function() {
        toggleContainer('marketcomparison-list-container');
    });

    document.getElementById('rateanalysisbtn').addEventListener('click', function() {
        toggleContainer('marketcomparison-rateanalysis-container');
    });
});

function toggleContainer(containerClass) {
    document.querySelectorAll('.marketcomparison-map-container, .marketcomparison-list-container, .marketcomparison-rateanalysis-container').forEach(function(container) {
        container.classList.remove('active');
    });
    document.querySelector('.' + containerClass).classList.add('active');
}