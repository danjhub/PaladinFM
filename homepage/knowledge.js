document.addEventListener('DOMContentLoaded', () => {
    // Load facility list
    loadFacilityList();

    // Hide the knowledge container initially
    document.getElementById('knowledge-container').style.display = 'none';
});

function loadFacilityList() {
    fetch('knowledgejson/facilitylist.json')
        .then(response => response.json())
        .then(facilityList => {
            const facilityListContainer = document.getElementById('knowledge-facility-list');
            facilityList.forEach(facility => {
                const listItem = document.createElement('li');
                listItem.textContent = facility.name;
                listItem.addEventListener('click', () => {
                    loadFacilityData(facility.name);
                    setActiveItem(listItem, '.knowledge-facility-list-container li');
                });
                facilityListContainer.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading facility list:', error));
}

function loadFacilityData(facilityName) {
    fetch(`knowledgejson/facilitydata/${facilityName}.json`)
        .then(response => response.json())
        .then(facilityData => {
            displayFacilityData(facilityData[0]);
            // Show the knowledge container when data is loaded
            document.getElementById('knowledge-container').style.display = 'block';
        })
        .catch(error => console.error('Error loading facility data:', error));
}

function displayFacilityData(data) {
    const facilityInfoContainer = document.querySelector('.knowledge-facility-info');
    const fieldDataContainer = document.querySelector('.knowledge-field-data');
    const softwareDataContainer = document.getElementById('knowledge-software-data');
    const vendorDataContainer = document.getElementById('knowledge-vendor-data');

    // Clear previous data
    facilityInfoContainer.innerHTML = '';
    fieldDataContainer.innerHTML = '';
    softwareDataContainer.innerHTML = '';
    vendorDataContainer.innerHTML = '';

    // Display facility info
    facilityInfoContainer.innerHTML = `
        <p><strong>Name:</strong> ${data.facility.name}</p>
        <p><strong>Type:</strong> ${data.facility.type}</p>
        <p><strong>Address:</strong> ${data.facility.address}</p>
        <p><strong>Phone:</strong> ${data.facility.phone}</p>
        <p><strong>Email:</strong> ${data.facility.email}</p>
        <p><strong>Website:</strong> <a href="${data.facility.website}" target="_blank">${data.facility.website}</a></p>
        <p><strong>Gate Hours:</strong> ${data.facility.gateHours}</p>
        <p><strong>Office Hours:</strong> ${data.facility.officeHours}</p>
        <p><strong>Call Center Hours:</strong> ${data.facility.callCenterHours}</p>
        <p><strong>Emergency Contact:</strong> ${data.facility.emergencyContact}</p>
        <p><strong>Notes:</strong> ${data.facility.notes}</p>
    `;

    // Display field data
    fieldDataContainer.innerHTML = `
        <p><strong>Manned or Unmanned:</strong> ${data.fieldData.mannedOrUnmanned}</p>
        <p><strong>Buildings:</strong> ${data.fieldData.buildings}</p>
        <p><strong>Office:</strong> ${data.fieldData.office}</p>
        <p><strong>Floors:</strong> ${data.fieldData.floors}</p>
        <p><strong>Doors:</strong> ${data.fieldData.doors}</p>
        <p><strong>Emergency Exits:</strong> ${data.fieldData.emergencyExits}</p>
        <p><strong>Emergency Lights:</strong> ${data.fieldData.emergencyLights}</p>
        <p><strong>Fire Extinguishers:</strong> ${data.fieldData.fireExtinguishers}</p>
        <p><strong>Total Units:</strong> ${data.fieldData.totalUnits}</p>
        <p><strong>CC Units:</strong> ${data.fieldData.ccUnits}</p>
        <p><strong>DU Units:</strong> ${data.fieldData.duUnits}</p>
        <p><strong>Interior Units:</strong> ${data.fieldData.interiorUnits}</p>
        <p><strong>Vacant Units:</strong> ${data.fieldData.vacantUnits}</p>
        <p><strong>Reserved Units:</strong> ${data.fieldData.reservedUnits}</p>
        <p><strong>Occupied Units:</strong> ${data.fieldData.occupiedUnits}</p>
        <p><strong>Commercial Units:</strong> ${data.fieldData.commercialUnits}</p>
        <p><strong>Outdoor Parking Spaces:</strong> ${data.fieldData.outdoorParkingSpaces}</p>
        <p><strong>Enclosed Parking Spaces:</strong> ${data.fieldData.enclosedParkingSpaces}</p>
        <p><strong>Gates:</strong> ${data.fieldData.gates}</p>
        <p><strong>Gate Type:</strong> ${data.fieldData.gateType}</p>
        <p><strong>Gate Operators:</strong> ${data.fieldData.gateOperators}</p>
        <p><strong>Gate Operator Model:</strong> ${data.fieldData.gateOperatorModel}</p>
        <p><strong>Gate Operator Serial:</strong> ${data.fieldData.gateOperatorSerial}</p>
        <p><strong>Key Pads:</strong> ${data.fieldData.keyPads}</p>
        <p><strong>Security Cameras:</strong> ${data.fieldData.securityCameras}</p>
        <p><strong>Security Camera Model:</strong> ${data.fieldData.securityCameraModel}</p>
        <p><strong>Security Camera Serial:</strong> ${data.fieldData.securityCameraSerial}</p>
    `;

    // Display software data
    data.softwareData.forEach(software => {
        const listItem = document.createElement('li');
        listItem.textContent = software['Select Software Category'];
        listItem.addEventListener('click', function() {
            const details = this.querySelector('.knowledge-software-details');
            if (details.style.display === 'none' || details.style.display === '') {
                details.style.display = 'block';
            } else {
                details.style.display = 'none';
            }
            toggleActiveItem(listItem);
        });

        const details = document.createElement('div');
        details.className = 'knowledge-software-details';
        details.innerHTML = `
            <p><strong>Software Name:</strong> ${software['Software Name']}</p>
            <p><strong>Company Name:</strong> ${software['Company Name']}</p>
            <p><strong>Contact Name:</strong> ${software['Contact Name']}</p>
            <p><strong>Phone:</strong> ${software['Phone']}</p>
            <p><strong>Email:</strong> ${software['Email']}</p>
            <p><strong>Website:</strong> <a href="${software['Website']}" target="_blank">${software['Website']}</a></p>
            <p><strong>Office Address:</strong> ${software['OfficeAddress']}</p>
            <p><strong>Monthly Expenses:</strong> ${software['MonthlyExpenses']}</p>
            <p><strong>Monthly Budget:</strong> ${software['Monthly Budget']}</p>
            <p><strong>Contract Sign Date:</strong> ${software['Contract Sign Date']}</p>
            <p><strong>Contract Expiration Date:</strong> ${software['Contract Expiration Date']}</p>
        `;
        listItem.appendChild(details);
        softwareDataContainer.appendChild(listItem);
    });

    // Display vendor data
    data.vendorData.forEach(vendor => {
        const listItem = document.createElement('li');
        listItem.textContent = vendor['Vendor Category'];
        listItem.addEventListener('click', function() {
            const details = this.querySelector('.knowledge-vendor-details');
            if (details.style.display === 'none' || details.style.display === '') {
                details.style.display = 'block';
            } else {
                details.style.display = 'none';
            }
            toggleActiveItem(listItem);
        });

        const details = document.createElement('div');
        details.className = 'knowledge-vendor-details';
        details.innerHTML = `
            <p><strong>Company:</strong> ${vendor['Company']}</p>
            <p><strong>Contact:</strong> ${vendor['Contact Name']}</p>
            <p><strong>Phone:</strong> ${vendor['Phone']}</p>
            <p><strong>Email:</strong> ${vendor['Email']}</p>
            <p><strong>Website:</strong> <a href="${vendor['Website']}" target="_blank">${vendor['Website']}</a></p>
            <p><strong>Office Address:</strong> ${vendor['OfficeAddress']}</p>
            <p><strong>Monthly Expenses:</strong> ${vendor['Monthly Expenses']}</p>
            <p><strong>Monthly Budget:</strong> ${vendor['Monthly Budget']}</p>
            <p><strong>COI Policy Number:</strong> ${vendor['COI Policy Number']}</p>
            <p><strong>COI Policy Expiration Date:</strong> ${vendor['COI Policy Expiration Date']}</p>
            <p><strong>Contract Sign Date:</strong> ${vendor['Contract Sign Date']}</p>
            <p><strong>Contract Expiration Date:</strong> ${vendor['Contract Expiration Date']}</p>
        `;
        listItem.appendChild(details);
        vendorDataContainer.appendChild(listItem);
    });
}

function setActiveItem(selectedItem, selector) {
    const listItems = document.querySelectorAll(selector);
    listItems.forEach(item => {
        item.classList.remove('active');
    });
    selectedItem.classList.add('active');
}

function toggleActiveItem(item) {
    item.classList.toggle('active');
}

// Modal functionality

// Get the modal
var modal = document.getElementById("photosModal");

// Get the buttons that open the modal
var photosBtn = document.getElementById("photosButton");
var mapBtn = document.getElementById("mapButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get the photos container
var photosContainer = document.getElementById("photosContainer");

// Function to load photos
function loadPhotos(facilityName) {
    // Clear previous photos
    photosContainer.innerHTML = '';

    // Path to the facility photos folder
    var folderPath = `knowledgejson/knowledgefacilityphotos/${facilityName}`;

    // Fetch the list of photos (assuming you have an endpoint or a way to get the list of photos)
    fetch(`${folderPath}/photos.json`)
        .then(response => response.json())
        .then(photos => {
            photos.forEach(photo => {
                var imgContainer = document.createElement('div');
                imgContainer.style.position = 'relative';
                imgContainer.style.display = 'inline-block';
                imgContainer.style.margin = '10px';

                var img = document.createElement('img');
                img.src = `${folderPath}/${photo}`;
                img.style.width = '250px'; // Adjust size as needed
                img.style.height = '250px'; // Adjust size as needed
                img.style.padding = '10px'; // Adjust padding as needed
                img.style.maxWidth = '100%'; // Ensure it doesn't overflow the modal
                img.style.maxHeight = '100%'; // Ensure it doesn't overflow the modal

                var caption = document.createElement('div');
                caption.innerText = photo.replace('.jpg', '');
                caption.style.textAlign = 'center';
                caption.style.marginTop = '5px';

                imgContainer.appendChild(img);
                imgContainer.appendChild(caption);
                photosContainer.appendChild(imgContainer);

                // Open larger view of image on click
                img.onclick = function() {
                    var largeImgContainer = document.createElement('div');
                    largeImgContainer.style.position = 'fixed';
                    largeImgContainer.style.top = '50%';
                    largeImgContainer.style.left = '50%';
                    largeImgContainer.style.transform = 'translate(-50%, -50%)';
                    largeImgContainer.style.zIndex = '1000';
                    largeImgContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    largeImgContainer.style.padding = '0px';
                    largeImgContainer.style.borderRadius = '10px';

                    var largeImg = document.createElement('img');
                    largeImg.src = img.src;
                    largeImg.style.maxWidth = '90vw';
                    largeImg.style.maxHeight = '90vh';

                    var closeBtn = document.createElement('span');
                    closeBtn.innerText = '×';
                    closeBtn.style.position = 'absolute';
                    closeBtn.style.top = '10px';
                    closeBtn.style.right = '20px';
                    closeBtn.style.fontSize = '30px';
                    closeBtn.style.color = 'white';
                    closeBtn.style.cursor = 'pointer';

                    closeBtn.onclick = function() {
                        document.body.removeChild(largeImgContainer);
                    };

                    document.body.appendChild(largeImgContainer);

                    setTimeout(() => {
                        document.addEventListener('click', function(event) {
                            if (!largeImgContainer.contains(event.target)) {
                                document.body.removeChild(largeImgContainer);
                            }
                        });
                    }, 0);

                    largeImgContainer.appendChild(largeImg);
                    largeImgContainer.appendChild(closeBtn);
                    document.body.appendChild(largeImgContainer);

                
                };
            });
        })
        .catch(error => console.error('Error loading photos:', error));
}

// Function to load map images
function loadMapImages(facilityName) {
    // Clear previous photos
    photosContainer.innerHTML = '';

    // Path to the facility photos folder
    var folderPath = `knowledgejson/knowledgefacilityphotos/${facilityName}`;

    // Fetch the list of photos (assuming you have an endpoint or a way to get the list of photos)
    fetch(`${folderPath}/mapphotos.json`)
        .then(response => response.json())
        .then(photos => {
            var mapPhotos = photos.filter(photo => photo.includes('map'));
            mapPhotos.forEach(photo => {
                var imgContainer = document.createElement('div');
                imgContainer.style.position = 'relative';
                imgContainer.style.display = 'inline-block';
                imgContainer.style.margin = '10px';
                imgContainer.style.width = 'calc(33.33% - 20px)'; // 3x3 grid
                imgContainer.style.boxSizing = 'border-box';

                var img = document.createElement('img');
                img.src = `${folderPath}/${photo}`;
                img.style.width = '100%'; // Adjust size as needed
                img.style.height = 'auto'; // Adjust size as needed
                img.style.padding = '10px'; // Adjust padding as needed
                img.style.transition = 'transform 0.2s'; // Smooth transition for enlargement
                img.style.maxWidth = '100%'; // Ensure it doesn't overflow the modal
                img.style.maxHeight = '100%'; // Ensure it doesn't overflow the modal

                var caption = document.createElement('div');
                caption.innerText = photo.replace('.jpg', '');
                caption.style.textAlign = 'center';
                caption.style.marginTop = '5px';

                imgContainer.appendChild(img);
                imgContainer.appendChild(caption);
                photosContainer.appendChild(imgContainer);

                // Open larger view of image on click
                img.onclick = function() {
                    var largeImgContainer = document.createElement('div');
                    largeImgContainer.style.position = 'fixed';
                    largeImgContainer.style.top = '50%';
                    largeImgContainer.style.left = '50%';
                    largeImgContainer.style.transform = 'translate(-50%, -50%)';
                    largeImgContainer.style.zIndex = '1000';
                    largeImgContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    largeImgContainer.style.padding = '0px';
                    largeImgContainer.style.borderRadius = '10px';

                    var largeImg = document.createElement('img');
                    largeImg.src = img.src;
                    largeImg.style.maxWidth = '90vw';
                    largeImg.style.maxHeight = '90vh';

                    var closeBtn = document.createElement('span');
                    closeBtn.innerText = '×';
                    closeBtn.style.position = 'absolute';
                    closeBtn.style.top = '10px';
                    closeBtn.style.right = '20px';
                    closeBtn.style.fontSize = '30px';
                    closeBtn.style.color = 'white';
                    closeBtn.style.cursor = 'pointer';

                    closeBtn.onclick = function() {
                        document.body.removeChild(largeImgContainer);
                    };

                    document.body.appendChild(largeImgContainer);

                    setTimeout(() => {
                        document.addEventListener('click', function(event) {
                            if (!largeImgContainer.contains(event.target)) {
                                document.body.removeChild(largeImgContainer);
                            }
                        });
                    }, 0);

                    largeImgContainer.appendChild(largeImg);
                    largeImgContainer.appendChild(closeBtn);
                    document.body.appendChild(largeImgContainer);

                
                };
            });
        })
        .catch(error => console.error('Error loading photos:', error));
}

// When the user clicks the Photos button, open the modal and load photos
photosBtn.onclick = function() {
    var selectedFacility = document.querySelector('.knowledge-facility-list-container li.active').textContent;
    loadPhotos(selectedFacility);
    modal.style.display = "block";
}

// When the user clicks the Map button, open the modal and load map images
mapBtn.onclick = function() {
    var selectedFacility = document.querySelector('.knowledge-facility-list-container li.active').textContent;
    loadMapImages(selectedFacility);
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}