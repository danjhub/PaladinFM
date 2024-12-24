document.addEventListener('DOMContentLoaded', () => {
    // Show facility table by default
    showTable('facility-table');
    selectTabButton('facility-table');
    
    // Setup form submission handler
    document.getElementById('knowledge-form').addEventListener('submit', function(event) {
        event.preventDefault();
        handleFormSubmit();
    });

    // Setup event listeners for tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const tableId = button.getAttribute('onclick').match(/showTable\('(.+)'\)/)[1];
            showTable(tableId);
            selectTabButton(tableId);
        });
    });

    // Show the add-row form when an option is selected
    document.getElementById('category').addEventListener('change', () => {
        const knowledgeForm = document.getElementById('knowledge-form');
        knowledgeForm.style.display = 'flex';
    });

    // Create and append the tooltip to the body
    createTooltip();

    // Add event listeners to show and hide the tooltip for notes fields in the table
    document.addEventListener('focusin', (event) => {
        if (event.target.classList.contains('notes-field') && event.target.closest('table')) {
            showTooltip(event.target);
        } else if (event.target.classList.contains('notes-field')) {
            event.target.style.width = '400px';
            event.target.style.height = '400px';
        }
    });

    document.addEventListener('focusout', (event) => {
        if (event.target.classList.contains('notes-field') && !event.target.closest('table')) {
            event.target.style.width = '';
            event.target.style.height = '';
        }
    });

    // Add event listeners to show and hide the tooltip for notes fields in the table
    document.addEventListener('mouseover', (event) => {
        if (event.target.classList.contains('notes-field') && event.target.closest('table')) {
            showTooltip(event.target);
        }
    });

    document.addEventListener('mouseout', (event) => {
        if (event.target.classList.contains('notes-field') && event.target.closest('table')) {
            const tooltip = document.getElementById('notes-tooltip');
            if (!tooltip.contains(event.relatedTarget)) {
                hideTooltip();
            }
        }
    });

    // Add event listener to keep the tooltip open and editable when clicked
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('notes-field') && event.target.closest('table')) {
            makeTooltipEditable(event.target);
        }
    });
});

function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.id = 'notes-tooltip';
    tooltip.className = 'tooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    // Add CSS styles for the tooltip
    const style = document.createElement('style');
    style.innerHTML = `
        .tooltip {
            position: absolute;
            background-color: #fff;
            border: 1px solid #ccc;
            padding: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            width: 400px; /* Fixed width */
            height: 400px; /* Fixed height */
            overflow: hidden; /* Hide scroll bars */
            word-wrap: break-word;
            font-size: 14px;
            color: #333;
            border-radius: 4px;
        }
        .tooltip-toolbar {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        .tooltip-toolbar button {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
        }
        .tooltip-textarea {
            width: 100%;
            height: calc(100% - 40px); /* Adjust height to account for toolbar and close button */
            border: none;
            resize: none;
            outline: none;
        }
        .tooltip-close {
            background-color: #380346;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
            margin-right: auto; /* Align to the left */
        }
        .tooltip-close:hover {
            background-color: #29976b;
        }
    `;
    document.head.appendChild(style);
}

function showTooltip(target) {
    const tooltip = document.getElementById('notes-tooltip');
    tooltip.textContent = target.value;
    tooltip.style.display = 'block';
    const rect = target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX - tooltip.offsetWidth}px`;
    tooltip.style.top = `${rect.top + window.scrollY}px`;
}

function hideTooltip() {
    const tooltip = document.getElementById('notes-tooltip');
    tooltip.style.display = 'none';
}

function makeTooltipEditable(target) {
    const tooltip = document.getElementById('notes-tooltip');
    tooltip.innerHTML = `
        <div class="tooltip-toolbar">
            <button class="tooltip-close" onclick="hideTooltip()">Close</button>
            <button onclick="document.execCommand('bold', false, '');"><b>B</b></button>
            <button onclick="document.execCommand('italic', false, '');"><i>I</i></button>
            <button onclick="document.execCommand('insertUnorderedList', false, '');">•</button>
        </div>
        <textarea class="tooltip-textarea">${target.value}</textarea>
    `;
    const textarea = tooltip.querySelector('.tooltip-textarea');
    textarea.style.width = '100%';
    textarea.style.height = 'calc(100% - 40px)';
    textarea.addEventListener('input', () => {
        target.value = textarea.value;
    });
    textarea.addEventListener('blur', () => {
        if (!tooltip.contains(document.activeElement)) {
            hideTooltip();
        }
    });
    textarea.focus();
}

function showFormFields() {
    const category = document.getElementById('category').value;
    const formFields = document.getElementById('form-fields');
    formFields.innerHTML = ''; // Clear existing fields
    
    // Get headers from selected table
    const tableHeaders = Array.from(
        document.querySelector(`#${category}-table thead`).getElementsByTagName('th')
    );
    
    // Create input fields based on table headers
    tableHeaders.forEach(header => {
        if (header.textContent === 'Asset Type' && category === 'facility') {
            // Create a dropdown for facility asset type
            const select = document.createElement('select');
            select.className = 'form-input';
            select.name = 'asset-type';
            formFields.appendChild(select);

            // Fetch options from facilitytype.json
            fetch('knowledgejson/facilitytype.json')
                .then(response => response.json())
                .then(data => {
                    console.log('Facility types:', data); // Debug log
                    Object.keys(data).forEach(key => {
                        const option = document.createElement('option');
                        option.value = key;
                        option.textContent = data[key].description;
                        select.appendChild(option);
                    });
                })
                .catch(error => console.error('Error loading facility types:', error));
        } else if (header.textContent === 'Location' || header.textContent === 'Facility Name') {
            // Create a dropdown for location or facility name
            const select = document.createElement('select');
            select.className = 'form-input';
            select.name = header.textContent.toLowerCase().replace(/\s+/g, '-');
            formFields.appendChild(select);

            // Fetch options from facilityname.json
            fetch('knowledgejson/facilityname.json')
                .then(response => response.json())
                .then(data => {
                    console.log('Facility names:', data); // Debug log
                    Object.keys(data).forEach(key => {
                        const option = document.createElement('option');
                        option.value = key;
                        option.textContent = key;
                        select.appendChild(option);
                    });
                })
                .catch(error => console.error('Error loading facility names:', error));
        } else if (header.textContent === 'Software Category' && category === 'software') {
            // Create a dropdown for software category
            const select = document.createElement('select');
            select.className = 'form-input';
            select.name = 'software-category';
            formFields.appendChild(select);

            // Fetch options from softwareclass.json
            fetch('knowledgejson/softwareclass.json')
                .then(response => response.json())
                .then(data => {
                    console.log('Software classes:', data); // Debug log
                    Object.keys(data).forEach(key => {
                        const option = document.createElement('option');
                        option.value = key;
                        option.textContent = data[key];
                        select.appendChild(option);
                    });
                })
                .catch(error => console.error('Error loading software classes:', error));
        } else if (header.textContent === 'Utility Category' && category === 'utilities') {
            // Create a dropdown for utility category
            const select = document.createElement('select');
            select.className = 'form-input';
            select.name = 'utility-category';
            formFields.appendChild(select);

            // Fetch options from utilityclass.json
            fetch('knowledgejson/utilityclass.json')
                .then(response => response.json())
                .then(data => {
                    console.log('Utility classes:', data); // Debug log
                    Object.keys(data).forEach(key => {
                        const option = document.createElement('option');
                        option.value = key;
                        option.textContent = data[key];
                        select.appendChild(option);
                    });
                })
                .catch(error => console.error('Error loading utility classes:', error));
        } else if (header.textContent === 'Vendor Category' && category === 'vendors') {
            // Create a dropdown for vendor category
            const select = document.createElement('select');
            select.className = 'form-input';
            select.name = 'vendor-category';
            formFields.appendChild(select);

            // Fetch options from vendorclass.json
            fetch('knowledgejson/vendorclass.json')
                .then(response => response.json())
                .then(data => {
                    console.log('Vendor classes:', data); // Debug log
                    Object.keys(data).forEach(key => {
                        const option = document.createElement('option');
                        option.value = key;
                        option.textContent = data[key];
                        select.appendChild(option);
                    });
                })
                .catch(error => console.error('Error loading vendor classes:', error));
        } else {
            // Create a text input for other fields
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = header.textContent;
            input.className = 'form-input';
            input.name = header.textContent.toLowerCase().replace(/\s+/g, '-');
            if (header.textContent === 'Notes') {
                input.classList.add('notes-field');
            }
            formFields.appendChild(input);
        }
    });
}

function showTable(tableId) {
    // Hide all tables
    const tables = document.querySelectorAll('.knowledge-table');
    tables.forEach(table => {
        table.style.display = 'none';
        
        // Check if table is empty and add placeholder if needed
        const tbody = table.querySelector('tbody');
        if (!tbody.hasChildNodes() || (tbody.children.length === 1 && tbody.children[0].classList.contains('placeholder-row'))) {
            tbody.innerHTML = `
                <tr class="placeholder-row">
                    <td colspan="${table.querySelectorAll('thead th').length}">Wow! So Empty!</td>
                </tr>`;
        }
    });
    
    // Show selected table
    const selectedTable = document.getElementById(tableId);
    if (selectedTable) {
        selectedTable.style.display = 'table';
    }
}

function selectTabButton(tableId) {
    // Update active state of tab buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        if (button.getAttribute('onclick').includes(tableId)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function handleFormSubmit() {
    const category = document.getElementById('category').value;
    const formInputs = document.getElementById('form-fields').getElementsByClassName('form-input');
    const tableBody = document.querySelector(`#${category}-table tbody`);
    
    // Remove placeholder row if exists
    const placeholderRow = tableBody.querySelector('.placeholder-row');
    if (placeholderRow) {
        tableBody.removeChild(placeholderRow);
    }
    
    // Create new row
    const newRow = document.createElement('tr');
    Array.from(formInputs).forEach(input => {
        const cell = document.createElement('td');
        const inputClone = document.createElement('input');
        inputClone.type = 'text';
        inputClone.value = input.value;
        inputClone.className = 'table-input';
        if (input.classList.contains('notes-field')) {
            inputClone.classList.add('notes-field');
        }
        cell.appendChild(inputClone);
        newRow.appendChild(cell);
    });
    
    // Add row to table
    tableBody.appendChild(newRow);
    
    // Reset form
    document.getElementById('knowledge-form').reset();
    document.getElementById('form-fields').innerHTML = '';
    console.log('Form submitted and table updated'); // Debug log

    // Activate the tab button for the selected category
    selectTabButton(`${category}-table`);
    showTable(`${category}-table`);

    // Reset the selector to the default value
    document.getElementById('category').value = '';
    document.getElementById('knowledge-form').style.display = 'none';
}