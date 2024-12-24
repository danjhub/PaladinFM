/* General Functions */
/* Function to update the date and time */
function updateDateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    document.getElementById('datetime').innerHTML = `<span class="time">${timeString}</span><br><span class="date">${dateString}</span>`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

/* Function to show the correct container and load its JS file */
function showContainer(containerId, scriptPath) {
    const containers = document.querySelectorAll('.content-container');
    containers.forEach(container => {
        container.style.display = 'none';
    });
    document.getElementById(containerId).style.display = 'block';

    // Load the corresponding JavaScript file
    if (scriptPath) {
        const existingScript = document.querySelector(`script[src="${scriptPath}"]`);
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = scriptPath;
            document.body.appendChild(script);
        }
    }
}