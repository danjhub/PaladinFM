let performanceData;

document.addEventListener('DOMContentLoaded', function() {
    initializeUI();

    fetch('knowledgejson/facilitylist.json')
        .then(response => response.json())
        .then(data => {
            const facilityList = document.getElementById('performance-facility-list');
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
                    setActiveItem(listItem, '#performance-facility-list li');
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
});

function fetchFacilityData(facilityName) {
    const filePath = `performancejson/facilityfolders/${facilityName} performance.json`;
    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            console.log('Facility Data:', data); // Debugging
            performanceData = data;
            populatePerformanceData(data);
        })
        .catch(error => console.error('Error fetching facility data:', error));
}

function fetchCombinedPerformanceData() {
    const filePath = 'performancejson/facilityfolders/combinedPerformance.json';
    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            console.log('Combined Performance Data:', data); // Debugging
            performanceData = data;
            populatePerformanceData(data);
        })
        .catch(error => console.error('Error fetching combined performance data:', error));
}

function populatePerformanceData(data) {
    // Clear existing data
    document.querySelector('.mtd-kpi-data').innerHTML = '';
    document.querySelector('.kpi-graphs').innerHTML = '';
    document.querySelector('.mtd-occ-data').innerHTML = '';
    document.querySelector('.occ-graphs').innerHTML = '';
    document.querySelector('.mtd-traffic-data').innerHTML = '';
    document.querySelector('.traffic-graphs').innerHTML = '';
    document.querySelector('.mtd-ar-data').innerHTML = '';
    document.querySelector('.ar-graphs').innerHTML = '';

    // Populate Revenue Data
    const revenueData = data.performanceData.revenue;
    const mtdKpiDataContainer = document.querySelector('.mtd-kpi-data');
    revenueData.mtdKpiData.forEach(item => {
        const kpiBox = document.createElement('div');
        kpiBox.classList.add('kpi-box');
        kpiBox.innerHTML = `<div class="kpi-title">${item.title}</div><div class="kpi-data">${formatData(item.data, item.format)}</div>`;
        mtdKpiDataContainer.appendChild(kpiBox);
    });

    const kpiGraphsContainer = document.querySelector('.kpi-graphs');
    revenueData.kpiGraphs.forEach(item => {
        const kpiGraph = document.createElement('div');
        kpiGraph.classList.add('kpi-graph');
        kpiGraph.innerHTML = `<h2>${item.title}</h2>`;
        kpiGraph.setAttribute('data-type', 'bar'); // Set default graph type to bar
        kpiGraph.addEventListener('click', () => openGraphModal(kpiGraph));
        kpiGraphsContainer.appendChild(kpiGraph);
    });

    // Populate Occupancy Data
    const occupancyData = data.performanceData.occupancy;
    const mtdOccDataContainer = document.querySelector('.mtd-occ-data');
    occupancyData.mtdOccData.forEach(item => {
        const occBox = document.createElement('div');
        occBox.classList.add('occ-box');
        occBox.innerHTML = `<div class="occ-title">${item.title}</div><div class="occ-data">${formatData(item.data, item.format)}</div>`;
        mtdOccDataContainer.appendChild(occBox);
    });

    const occGraphsContainer = document.querySelector('.occ-graphs');
    occupancyData.occGraphs.forEach(item => {
        const occGraph = document.createElement('div');
        occGraph.classList.add('occ-graph');
        occGraph.innerHTML = `<h2>${item.title}</h2>`;
        occGraph.setAttribute('data-type', 'line'); // Set graph type to line
        occGraph.addEventListener('click', () => openGraphModal(occGraph));
        occGraphsContainer.appendChild(occGraph);
    });

    const mtdTrafficDataContainer = document.querySelector('.mtd-traffic-data');
    occupancyData.mtdTrafficData.forEach(item => {
        const trafficBox = document.createElement('div');
        trafficBox.classList.add('traffic-box');
        trafficBox.innerHTML = `<div class="traffic-title">${item.title}</div><div class="traffic-data">${formatData(item.data, item.format)}</div>`;
        mtdTrafficDataContainer.appendChild(trafficBox);
    });

    const trafficGraphsContainer = document.querySelector('.traffic-graphs');
    occupancyData.trafficGraphs.forEach(item => {
        const trafficGraph = document.createElement('div');
        trafficGraph.classList.add('traffic-graph');
        trafficGraph.innerHTML = `<h2>${item.title}</h2>`;
        trafficGraph.setAttribute('data-type', 'bar'); // Set graph type to bar
        trafficGraph.addEventListener('click', () => openGraphModal(trafficGraph));
        trafficGraphsContainer.appendChild(trafficGraph);
    });

    // Populate ARPlus Data
    const arplusData = data.performanceData.arplus;
    const mtdArDataContainer = document.querySelector('.mtd-ar-data');
    arplusData.mtdArData.forEach(item => {
        const arBox = document.createElement('div');
        arBox.classList.add('ar-box');
        arBox.innerHTML = `<div class="ar-title">${item.title}</div><div class="ar-data">${formatData(item.data, item.format)}</div>`;
        mtdArDataContainer.appendChild(arBox);
    });

    const arGraphsContainer = document.querySelector('.ar-graphs');
    arplusData.arGraphs.forEach(item => {
        const arGraph = document.createElement('div');
        arGraph.classList.add('ar-graph');
        arGraph.innerHTML = `<h2>${item.title}</h2>`;
        arGraph.setAttribute('data-type', 'line'); // Set graph type to line
        arGraph.addEventListener('click', () => openGraphModal(arGraph));
        arGraphsContainer.appendChild(arGraph);
    });

    // Render graphs
    renderGraphs(data);
}

function formatData(data, format) {
    if (format === 'currency') {
        return `$${parseFloat(data.replace(/[^0-9.-]+/g, "")).toFixed(2)}`;
    } else if (format === 'percentage') {
        return `${parseFloat(data.replace(/[^0-9.-]+/g, "")).toFixed(2)}%`;
    } else if (format === 'number') {
        return parseFloat(data.replace(/[^0-9.-]+/g, "")).toFixed(0);
    } else {
        return data;
    }
}

function renderGraphs(data) {
    const graphs = document.querySelectorAll('.kpi-graph, .occ-graph, .traffic-graph, .ar-graph');
    graphs.forEach(graph => {
        const type = graph.getAttribute('data-type');
        const title = graph.querySelector('h2').textContent;
        const graphData = getGraphData(title, data);

        // Render the graph using Chart.js
        const ctx = document.createElement('canvas');
        ctx.style.width = '100%';
        ctx.style.height = '100%';
        graph.appendChild(ctx);
        new Chart(ctx, {
            type: type,
            data: graphData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: title
                }
            }
        });
    });
}

function getGraphData(title, data) {
    let graphData = {};
    const labels = [];
    const datasets = [];

    if (title === "Revenue & Receipts Performance") {
        const revenueData = [];
        const receiptsData = [];
        data.performanceData.revenue.kpiGraphs.forEach(graph => {
            if (graph.title === title) {
                graph.data.forEach(item => {
                    labels.push(item.month);
                    revenueData.push(parseFloat(item.revenue.replace(/[^0-9.-]+/g, "")));
                    receiptsData.push(parseFloat(item.receipts.replace(/[^0-9.-]+/g, "")));
                });
            }
        });
        datasets.push({
            label: 'Revenue',
            data: revenueData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        });
        datasets.push({
            label: 'Receipts',
            data: receiptsData,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        });
    } else if (title === "YTD Revenue Performance") {
        const graphDataset = [];
        data.performanceData.revenue.kpiGraphs.forEach(graph => {
            if (graph.title === title) {
                graph.data.forEach(item => {
                    labels.push(item.month);
                    graphDataset.push(parseFloat(item.revenue.replace(/[^0-9.-]+/g, "")));
                });
            }
        });
        datasets.push({
            label: title,
            data: graphDataset,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        });
    } else if (title === "Gross Potential History") {
        const graphDataset = [];
        data.performanceData.revenue.kpiGraphs.forEach(graph => {
            if (graph.title === title) {
                graph.data.forEach(item => {
                    labels.push(item.month);
                    graphDataset.push(parseFloat(item.grossPotential.replace(/[^0-9.-]+/g, "")));
                });
            }
        });
        datasets.push({
            label: title,
            data: graphDataset,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        });
    } else if (title === "OCC Performance") {
        const occData = [];
        const sqftOccData = [];
        data.performanceData.occupancy.occGraphs.forEach(graph => {
            if (graph.title === title) {
                graph.data.forEach(item => {
                    labels.push(item.month);
                    occData.push(parseFloat(item.occPercentage.replace(/[^0-9.-]+/g, "")));
                    sqftOccData.push(parseFloat(item.sqftOccPercentage.replace(/[^0-9.-]+/g, "")));
                });
            }
        });
        datasets.push({
            label: 'Occupancy Percentage',
            data: occData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        });
        datasets.push({
            label: 'Sqft Occupancy Percentage',
            data: sqftOccData,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        });
    } else if (title === "YTD Traffic Performance") {
        const moveInsData = [];
        const moveOutsData = [];
        const netMovesData = [];
        data.performanceData.occupancy.trafficGraphs.forEach(graph => {
            if (graph.title === title) {
                graph.data.forEach(item => {
                    labels.push(item.month);
                    moveInsData.push(item.moveIns);
                    moveOutsData.push(item.moveOuts);
                    netMovesData.push(item.netMoves);
                });
            }
        });
        datasets.push({
            label: 'Move Ins',
            data: moveInsData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        });
        datasets.push({
            label: 'Move Outs',
            data: moveOutsData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        });
        datasets.push({
            label: 'Net Moves',
            data: netMovesData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        });
    } else if (title === "Accounts Receivable History Graph" || title === "Auto Pay Enrolled History Graph" || title === "Insurance Penetration History Graph") {
        const percentageData = [];
        data.performanceData.arplus.arGraphs.forEach(graph => {
            if (graph.title === title) {
                graph.data.forEach(item => {
                    labels.push(item.month);
                    percentageData.push(parseFloat(item.percentage.replace(/[^0-9.-]+/g, "")));
                });
            }
        });
        datasets.push({
            label: title,
            data: percentageData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        });
    }

    graphData.labels = labels;
    graphData.datasets = datasets;
    return graphData;
}

function openGraphModal(graphElement) {
    const title = graphElement.querySelector('h2').textContent;
    const type = graphElement.getAttribute('data-type');
    const data = getGraphData(title, performanceData); // Use the globally available performanceData

    const modal = document.createElement('div');
    modal.classList.add('graph-modal');
    modal.innerHTML = `
        <span class="graph-modal-close">&times;</span>
        <canvas id="modalGraphCanvas"></canvas>
    `;
    document.body.appendChild(modal);

    const closeModal = modal.querySelector('.graph-modal-close');
    closeModal.addEventListener('click', () => {
        modal.remove();
    });

    modal.classList.add('active');

    // Render the graph in the modal
    const ctx = document.getElementById('modalGraphCanvas').getContext('2d');
    new Chart(ctx, {
        type: type,
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
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