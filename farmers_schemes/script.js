// Example JS for interaction or simple functions, like alerting when a link is clicked

document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        alert("You are now being redirected to the official government website.");
    });
});


// Function to check for new updates
function checkForUpdates() {
    fetch('https://api.example.com/latest-schemes')  // Use the actual API URL or the government webpage data if available
        .then(response => response.json())
        .then(data => {
            // Check if there is a new update
            if (data.isNewUpdate) {
                showNotification();
            }
        })
        .catch(error => console.error('Error fetching updates:', error));
}

// Function to show a browser notification
function showNotification() {
    // Check if the browser supports notifications
    if (Notification.permission === "granted") {
        const notification = new Notification("New Government Scheme Update", {
            body: "Click here to see the latest farmer scheme.",
            icon: "icon.png",
        });

        notification.onclick = function () {
            window.open('https://www.india.gov.in/');  // Open the government website
        };
    }
}

// Ask for notification permission when the page loads
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Periodically check for updates (every 5 minutes)
setInterval(checkForUpdates, 300000);
