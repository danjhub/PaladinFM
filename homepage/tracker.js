function initializeTracker() {
    const optionsCache = {}; // Cache for dropdown options

    // Preload options for all dropdowns
    preloadOptions(optionsCache, () => {
        populateFormDropdowns(optionsCache);
        document.getElementById('maintenance-form').addEventListener('submit', function(event) {
            event.preventDefault();
            addRow(optionsCache);
        });
    });
}

function preloadOptions(cache, callback) {
    const urls = {
        status: 'tracker/trackerstatus.json',
        priority: 'tracker/trackerpriority.json',
        maintenanceCategory: 'tracker/trackermaintenancecategory.json',
        approvalStatus: 'tracker/trackerapprovalstatus.json'
    };

    const fetchPromises = Object.entries(urls).map(([key, url]) => {
        return fetch(url)
            .then(response => response.json())
            .then(data => {
                cache[key] = data[key]; // Store loaded options in cache
            });
    });

    Promise.all(fetchPromises).then(callback);
}

function populateFormDropdowns(optionsCache) {
    Object.keys(optionsCache).forEach(id => {
        const select = document.getElementById(id);
        const options = optionsCache[id];
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.toLowerCase().replace(' ', '-');
            opt.textContent = option;
            select.appendChild(opt);
        });
    });
}

function addRow(optionsCache) {
    const projectName = document.getElementById('projectName').value;
    const dateReported = document.getElementById('dateReported').value;
    const status = document.getElementById('status').value;
    const priority = document.getElementById('priority').value;
    const quoteAmount = document.getElementById('quoteAmount').value;
    const maintenanceCategory = document.getElementById('maintenanceCategory').value;
    const approvalStatus = document.getElementById('approvalStatus').value;
    const unitNumber = document.getElementById('unitNumber').value;
    const scheduledDOC = document.getElementById('scheduledDOC').value;

    const table = document.getElementById('maintenance-table').getElementsByTagName('tbody')[0];
    const placeholderRow = table.querySelector('.placeholder-row');
    if (placeholderRow) {
        table.removeChild(placeholderRow);
    }

    const newRow = table.insertRow();

    newRow.insertCell(0).innerHTML = `<input type="text" class="table-input" value="${projectName}">`;
    newRow.insertCell(1).innerHTML = `<input type="date" class="table-input" value="${dateReported}">`;
    createSelectFromCache('status', status, newRow.insertCell(2), optionsCache);
    createSelectFromCache('priority', priority, newRow.insertCell(3), optionsCache);
    newRow.insertCell(4).innerHTML = `<input type="text" class="table-input" value="${quoteAmount}">`;
    createSelectFromCache('maintenanceCategory', maintenanceCategory, newRow.insertCell(5), optionsCache);
    createSelectFromCache('approvalStatus', approvalStatus, newRow.insertCell(6), optionsCache);
    newRow.insertCell(7).innerHTML = `<input type="text" class="table-input" value="${unitNumber}">`;
    newRow.insertCell(8).innerHTML = `<input type="date" class="table-input" value="${scheduledDOC}">`;

    document.getElementById('maintenance-form').reset();
}

function createSelectFromCache(id, selectedValue, cell, cache) {
    const select = document.createElement('select');
    select.className = `table-select ${id}`;
    const options = cache[id];

    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.toLowerCase().replace(' ', '-');
        opt.textContent = option;
        if (opt.value === selectedValue) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });

    cell.appendChild(select);
}

// Initialize the tracker when the script is loaded
initializeTracker();