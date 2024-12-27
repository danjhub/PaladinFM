document.addEventListener('DOMContentLoaded', () => {
    const clientListContainer = document.getElementById('client-list');
    const clientDataContainer = document.getElementById('client-data');
    const facilityInfoContainer = document.querySelector('.facility-info');
    const fieldDataContainer = document.querySelector('.field-data');
    const newClientButton = document.getElementById('new-client-button');
    const newClientModal = document.getElementById('new-client-modal');
    const closeButton = document.querySelector('.close-button');
    const newClientForm = document.getElementById('new-client-form');
    const clientDataSection = document.getElementById('client-data-section');
    const facilityDataSection = document.getElementById('facility-data-section');
    const fieldDataSection = document.getElementById('field-data-section');

    // Load client list
    fetch('clientlinkjson/clientlist.json')
        .then(response => response.json())
        .then(clientList => {
            clientList.forEach(client => {
                const listItem = document.createElement('li');
                listItem.textContent = client.name;
                listItem.addEventListener('click', () => loadClientData(client.id));
                clientListContainer.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading client list:', error));

    // Load client data
    function loadClientData(clientId) {
        fetch('clientlinkjson/clientlinkdata.json')
            .then(response => response.json())
            .then(clientData => {
                const client = clientData.find(client => client.id === clientId);
                if (client) {
                    renderClientData(client);
                    renderFacilityData(client.facility);
                    renderFieldData(client.fieldData);
                } else {
                    clientDataContainer.innerHTML = '<p>Client data not found.</p>';
                    facilityInfoContainer.innerHTML = '<p>Facility data not found.</p>';
                    fieldDataContainer.innerHTML = '<p>Field data not found.</p>';
                }
            })
            .catch(error => console.error('Error loading client data:', error));
    }

    function renderClientData(client) {
        clientDataContainer.innerHTML = `
            <p><strong>Name:</strong> <span class="editable" data-field="name">${client.name}</span></p>
            <p><strong>Email:</strong> <span class="editable" data-field="email">${client.email}</span></p>
            <p><strong>Phone:</strong> <span class="editable" data-field="phone">${client.phone}</span></p>
            <p><strong>Address:</strong> <span class="editable" data-field="address">${client.address}</span></p>
            <p><strong>Status:</strong> <span class="editable" data-field="status">${client.status}</span></p>
            <p><strong>Deal Stage:</strong> <span class="editable" data-field="dealStage">${client.dealStage}</span></p>
        `;
        addEditableListeners(clientDataContainer, client);
    }

    function renderFacilityData(facility) {
        facilityInfoContainer.innerHTML = `
            <p><strong>Name:</strong> <span class="editable" data-field="name">${facility.name}</span></p>
            <p><strong>Type:</strong> <span class="editable" data-field="type">${facility.type}</span></p>
            <p><strong>Address:</strong> <span class="editable" data-field="address">${facility.address}</span></p>
            <p><strong>Phone:</strong> <span class="editable" data-field="phone">${facility.phone}</span></p>
            <p><strong>Email:</strong> <span class="editable" data-field="email">${facility.email}</span></p>
            <p><strong>Website:</strong> <span class="editable" data-field="website">${facility.website}</span></p>
            <p><strong>Gate Hours:</strong> <span class="editable" data-field="gateHours">${facility.gateHours}</span></p>
            <p><strong>Office Hours:</strong> <span class="editable" data-field="officeHours">${facility.officeHours}</span></p>
            <p><strong>Call Center Hours:</strong> <span class="editable" data-field="callCenterHours">${facility.callCenterHours}</span></p>
            <p><strong>Emergency Contact:</strong> <span class="editable" data-field="emergencyContact">${facility.emergencyContact}</span></p>
            <p><strong>Notes:</strong> <span class="editable" data-field="notes">${facility.notes}</span></p>
        `;
        addEditableListeners(facilityInfoContainer, facility);
    }

    function renderFieldData(fieldData) {
        fieldDataContainer.innerHTML = `
            <p><strong>Manned or Unmanned:</strong> <span class="editable" data-field="mannedOrUnmanned">${fieldData.mannedOrUnmanned}</span></p>
            <p><strong>Buildings:</strong> <span class="editable" data-field="buildings">${fieldData.buildings}</span></p>
            <p><strong>Office:</strong> <span class="editable" data-field="office">${fieldData.office}</span></p>
            <p><strong>Floors:</strong> <span class="editable" data-field="floors">${fieldData.floors}</span></p>
            <p><strong>Doors:</strong> <span class="editable" data-field="doors">${fieldData.doors}</span></p>
            <p><strong>Emergency Exits:</strong> <span class="editable" data-field="emergencyExits">${fieldData.emergencyExits}</span></p>
            <p><strong>Emergency Lights:</strong> <span class="editable" data-field="emergencyLights">${fieldData.emergencyLights}</span></p>
            <p><strong>Fire Extinguishers:</strong> <span class="editable" data-field="fireExtinguishers">${fieldData.fireExtinguishers}</span></p>
            <p><strong>Total Units:</strong> <span class="editable" data-field="totalUnits">${fieldData.totalUnits}</span></p>
            <p><strong>CC Units:</strong> <span class="editable" data-field="ccUnits">${fieldData.ccUnits}</span></p>
            <p><strong>DU Units:</strong> <span class="editable" data-field="duUnits">${fieldData.duUnits}</span></p>
            <p><strong>Interior Units:</strong> <span class="editable" data-field="interiorUnits">${fieldData.interiorUnits}</span></p>
            <p><strong>Vacant Units:</strong> <span class="editable" data-field="vacantUnits">${fieldData.vacantUnits}</span></p>
            <p><strong>Reserved Units:</strong> <span class="editable" data-field="reservedUnits">${fieldData.reservedUnits}</span></p>
            <p><strong>Occupied Units:</strong> <span class="editable" data-field="occupiedUnits">${fieldData.occupiedUnits}</span></p>
            <p><strong>Commercial Units:</strong> <span class="editable" data-field="commercialUnits">${fieldData.commercialUnits}</span></p>
            <p><strong>Outdoor Parking Spaces:</strong> <span class="editable" data-field="outdoorParkingSpaces">${fieldData.outdoorParkingSpaces}</span></p>
            <p><strong>Enclosed Parking Spaces:</strong> <span class="editable" data-field="enclosedParkingSpaces">${fieldData.enclosedParkingSpaces}</span></p>
            <p><strong>Gates:</strong> <span class="editable" data-field="gates">${fieldData.gates}</span></p>
            <p><strong>Gate Type:</strong> <span class="editable" data-field="gateType">${fieldData.gateType}</span></p>
            <p><strong>Gate Operators:</strong> <span class="editable" data-field="gateOperators">${fieldData.gateOperators}</span></p>
            <p><strong>Gate Operator Model:</strong> <span class="editable" data-field="gateOperatorModel">${fieldData.gateOperatorModel}</span></p>
            <p><strong>Gate Operator Serial:</strong> <span class="editable" data-field="gateOperatorSerial">${fieldData.gateOperatorSerial}</span></p>
            <p><strong>Key Pads:</strong> <span class="editable" data-field="keyPads">${fieldData.keyPads}</span></p>
            <p><strong>Security Cameras:</strong> <span class="editable" data-field="securityCameras">${fieldData.securityCameras}</span></p>
            <p><strong>Security Camera Model:</strong> <span class="editable" data-field="securityCameraModel">${fieldData.securityCameraModel}</span></p>
            <p><strong>Security Camera Serial:</strong> <span class="editable" data-field="securityCameraSerial">${fieldData.securityCameraSerial}</span></p>
        `;
        addEditableListeners(fieldDataContainer, fieldData);
    }

    function addEditableListeners(container, data) {
        container.querySelectorAll('.editable').forEach(element => {
            element.addEventListener('click', () => {
                const field = element.dataset.field;
                const value = element.textContent;
                element.outerHTML = `<input type="text" data-field="${field}" value="${value}" /> <button class="save-button">Save</button>`;
                container.querySelector('.save-button').addEventListener('click', () => {
                    saveData(container, data);
                });
            });
        });
    }

    function saveData(container, data) {
        container.querySelectorAll('input').forEach(input => {
            const field = input.dataset.field;
            data[field] = input.value;
        });

        // Here you would send the updated data to the server to save it
        // For example:
        // fetch('clientlinkjson/save', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // }).then(response => {
        //     if (response.ok) {
        //         alert('Data saved successfully');
        //     } else {
        //         alert('Error saving data');
        //     }
        // });

        // Re-render the data to show the updated values
        if (container === clientDataContainer) {
            renderClientData(data);
        } else if (container === facilityInfoContainer) {
            renderFacilityData(data);
        } else if (container === fieldDataContainer) {
            renderFieldData(data);
        }
    }

    // Open new client form modal
    newClientButton.addEventListener('click', () => {
        newClientModal.style.display = 'block';
        loadNewClientForm();
    });

    // Close new client form modal
    closeButton.addEventListener('click', () => {
        newClientModal.style.display = 'none';
    });

    // Load new client form fields
    function loadNewClientForm() {
        fetch('clientlinkjson/clientlinkformdata.json')
            .then(response => response.json())
            .then(formData => {
                clientDataSection.innerHTML = '';
                facilityDataSection.innerHTML = '';
                fieldDataSection.innerHTML = '';
                Object.keys(formData.Clientdata).forEach(field => {
                    const fieldElement = document.createElement('div');
                    fieldElement.innerHTML = `
                        <label for="${field}">${field}</label>
                        <input type="text" id="${field}" name="${field}" value="${formData.Clientdata[field]}" />
                    `;
                    clientDataSection.appendChild(fieldElement);
                });
                Object.keys(formData.facility).forEach(field => {
                    const fieldElement = document.createElement('div');
                    fieldElement.innerHTML = `
                        <label for="${field}">${field}</label>
                        <input type="text" id="${field}" name="${field}" value="${formData.facility[field]}" />
                    `;
                    facilityDataSection.appendChild(fieldElement);
                });
                Object.keys(formData.fieldData).forEach(field => {
                    const fieldElement = document.createElement('div');
                    fieldElement.innerHTML = `
                        <label for="${field}">${field}</label>
                        <input type="text" id="${field}" name="${field}" value="${formData.fieldData[field]}" />
                    `;
                    fieldDataSection.appendChild(fieldElement);
                });
            })
            .catch(error => console.error('Error loading form data:', error));
    }

    // Handle new client form submission
    newClientForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(newClientForm);
        const newClient = {};
        formData.forEach((value, key) => {
            newClient[key] = value;
        });

        // Add new client to clientlinkdata.json
        fetch('clientlinkjson/clientlinkdata.json')
            .then(response => response.json())
            .then(clientData => {
                newClient.id = clientData.length + 1;
                clientData.push(newClient);
                return fetch('clientlinkjson/clientlinkdata.json', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(clientData)
                });
            })
            .then(() => {
                // Add new client to clientlist.json
                return fetch('clientlinkjson/clientlist.json')
                    .then(response => response.json())
                    .then(clientList => {
                        clientList.push({
                            id: newClient.id,
                            name: newClient.name,
                            status: newClient.status
                        });
                        return fetch('clientlinkjson/clientlist.json', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(clientList)
                        });
                    });
            })
            .then(() => {
                alert('New client added successfully');
                newClientModal.style.display = 'none';
                // Redirect to ClientLink section
                window.location.href = '#clientlink-container';
            })
            .catch(error => console.error('Error adding new client:', error));
    });
});