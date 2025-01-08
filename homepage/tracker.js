document.addEventListener('DOMContentLoaded', function() {
    initializeUI();

    fetch('knowledgejson/facilitylist.json')
        .then(response => response.json())
        .then(data => {
            const facilityList = document.getElementById('tracker-facility-list');
            data.forEach(facility => {
                const listItem = document.createElement('li');
                listItem.textContent = facility.name;
                listItem.addEventListener('click', () => {
                    loadProjects(facility.name);
                    setActiveItem(listItem, '#tracker-facility-list li');
                    resetProjectDetails();
                });
                facilityList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching facility list:', error));

    document.getElementById('tracker-photos-button').addEventListener('click', openPhotosModal);
    document.querySelector('.tracker-close').addEventListener('click', closePhotosModal);
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('tracker-photosModal');
        if (event.target == modal) {
            closePhotosModal();
        }
    });
});

function initializeUI() {
    const trackerData = document.getElementById('tracker-data');
    if (trackerData) {
        trackerData.innerHTML = '<p class="placeholder-text">Select a facility and project to view details</p>';
    }
}

function loadProjects(facilityName) {
    const projectList = document.getElementById('tracker-project-list');
    projectList.innerHTML = ''; // Clear existing projects

    const filePath = `trackerjson/trackeddata/${facilityName}.json`;
    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            data.projects.forEach(project => {
                const listItem = document.createElement('li');
                listItem.textContent = project.projectName;
                listItem.dataset.projectId = project.projectid; // Add project ID to dataset
                listItem.dataset.imagePath = project.imagePath; // Add image path to dataset
                listItem.addEventListener('click', () => {
                    setActiveItem(listItem, '#tracker-project-list li');
                    displayProjectDetails(project);
                });
                projectList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching project list:', error));
}

function setActiveItem(selectedItem, selector) {
    const listItems = document.querySelectorAll(selector);
    listItems.forEach(item => {
        item.classList.remove('active');
    });
    selectedItem.classList.add('active');
}

function displayProjectDetails(project) {
    const projectDetailsContainer = document.getElementById('tracker-data');
    projectDetailsContainer.innerHTML = `
        <p><strong>Project Name:</strong> ${project.projectName}</p>
        <p><strong>Date Reported:</strong> ${project.dateReported}</p>
        <p><strong>Status:</strong> ${project.status}</p>
        <p><strong>Priority:</strong> ${project.priority}</p>
        <p><strong>Quote Amount:</strong> ${project.quoteAmount}</p>
        <p><strong>Approval Status:</strong> ${project.approvalStatus}</p>
        <p><strong>Maintenance Category:</strong> ${project.maintenanceCategory}</p>
        <p><strong>Unit Number:</strong> ${project.unitNumber}</p>
        <p><strong>Scheduled Date of Completion:</strong> ${project.scheduledDOC}</p>
        <p><strong>Notes:</strong> ${project.Notes}</p>
    `;
}

function resetProjectDetails() {
    const projectDetailsContainer = document.getElementById('tracker-data');
    projectDetailsContainer.innerHTML = '<p class="placeholder-text">Select a facility and project to view details</p>';
}

function openPhotosModal() {
    const modal = document.getElementById('tracker-photosModal');
    const photosContainer = document.getElementById('tracker-photosContainer');
    const activeProject = document.querySelector('#tracker-project-list li.active');

    if (activeProject) {
        const imagePath = activeProject.dataset.imagePath;

        // Clear existing photos
        photosContainer.innerHTML = '';

        // Fetch and display photos
        fetch(imagePath)
            .then(response => response.json())
            .then(data => {
                data.photos.forEach(photo => {
                    var imgContainer = document.createElement('div');
                    imgContainer.style.position = 'relative';
                    imgContainer.style.display = 'inline-block';
                    imgContainer.style.margin = '10px';

                    var img = document.createElement('img');
                    img.src = `${imagePath.replace('projectphotos.json', '')}${photo}`;
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

        modal.style.display = 'block';
    } else {
        alert('Please select a project first.');
    }
}

function closePhotosModal() {
    const modal = document.getElementById('tracker-photosModal');
    modal.style.display = 'none';
}