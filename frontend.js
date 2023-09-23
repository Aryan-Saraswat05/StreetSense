// Frontend code for making API requests

const apiEndpoint = 'https://f7szwjfzu2.execute-api.us-east-1.amazonaws.com/development';

async function fetchLiveTrafficData() {
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching live traffic data:', error);
        throw error;
    }
}

// Function to process and use live traffic data
function processLiveTrafficData(data) {
    // Implement data processing logic here
}

// Handle the button click event
document.getElementById('fetchButton').addEventListener('click', async () => {
    try {
        const liveTrafficData = await fetchLiveTrafficData();
        processLiveTrafficData(liveTrafficData);
    } catch (error) {
        // Handle errors here
    }
});
