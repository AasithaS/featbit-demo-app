// Fetch color from the server using the username
async function fetchColorFromNats(username) {
    try {
        const response = await fetch(`/color?username=${encodeURIComponent(username)}`); // Pass username as a query parameter
        const data = await response.json();
        return data; // Extract color from the response
    } catch (error) {
        console.error("Error fetching color:", error);
        return "#FF69B4"; // Fallback color
    }
}

// Change the launch screen color
async function setLaunchScreenColor(username) {
    const color = await fetchColorFromNats(username);
    document.getElementById('launchScreen').style.backgroundColor = color;
}

// Show the login container
function showLogin() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('launchScreen').style.display = 'none'; // Hide launch screen
}

// Handle login button click
function handleLogin() {
    const username = document.getElementById('username').value;
    if (username) {
        document.getElementById('usernameDisplay').innerText = username;
        document.getElementById('loginContainer').style.display = 'none'; // Hide login container
        document.getElementById('launchScreen').style.display = 'flex'; // Show launch screen
        setLaunchScreenColor(username); // Pass username to set the background color
    } else {
        alert('Please enter your username.');
    }
}

// Initialize the app
document.getElementById('loginButton').addEventListener('click', handleLogin);
showLogin(); // Show login on load
