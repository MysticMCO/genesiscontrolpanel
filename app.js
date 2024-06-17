// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "green-genesis.firebaseapp.com",
    databaseURL: "https://green-genesis-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "green-genesis",
    storageBucket: "green-genesis.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Function to update sensor readings
function updateSensorReadings(snapshot) {
    const data = snapshot.val();
    console.log("Sensor data received:", data);
    document.getElementById('temp').innerText = data.temperature || 'N/A';
    document.getElementById('humidity').innerText = data.humidity || 'N/A';
    document.getElementById('soilMoisture').innerText = data.soilMoisture || 'N/A';
    document.getElementById('waterLevel').innerText = data.waterLevel || 'N/A';
    document.getElementById('ph').innerText = data.pH || 'N/A';
    document.getElementById('nitrogen').innerText = data.nitrogen || 'N/A';
    document.getElementById('phosphorus').innerText = data.phosphorus || 'N/A';
    document.getElementById('potassium').innerText = data.potassium || 'N/A';
    document.getElementById('co2').innerText = data.co2 || 'N/A';
    document.getElementById('lux').innerText = data.lux || 'N/A';

    // Check for alerts
    checkForAlerts(data);
}

// Function to update command output
function updateCommandOutput(snapshot) {
    const data = snapshot.val();
    console.log("Command output data received:", data);
    let output = '';
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            output += `${key}: ${data[key].command}\n`;
        }
    }
    document.getElementById('command-output').innerText = output || 'No commands executed yet.';
}

// Send predefined command to Firebase
function sendCommand(command) {
    const commandsRef = db.ref('/commands');
    commandsRef.push({
        command: command,
        timestamp: new Date().toISOString()
    })
    .then(() => {
        console.log(`Command sent: ${command}`);
        updateLocalCommandOutput(command);
    })
    .catch(error => {
        console.error('Error sending command:', error);
    });
}

// Send custom command to Firebase
function sendCustomCommand() {
    const command = document.getElementById('command-input').value;
    console.log("Command to send:", command);
    if (command) {
        const commandsRef = db.ref('/commands');
        commandsRef.push({
            command: command,
            timestamp: new Date().toISOString()
        })
        .then(() => {
            console.log(`Command sent: ${command}`);
            updateLocalCommandOutput(command);
            document.getElementById('command-input').value = ''; // Clear the input field
        })
        .catch(error => {
            console.error('Error sending command:', error);
        });
    }
}

// Update local command output
function updateLocalCommandOutput(command) {
    const commandOutput = document.getElementById('command-output');
    commandOutput.innerText += `You: ${command}\n`;
}

// Set up Firebase listeners
const sensorsRef = db.ref('/sensors');
sensorsRef.on('value', updateSensorReadings);

const commandOutputRef = db.ref('/commands');
commandOutputRef.on('value', updateCommandOutput);

document.getElementById('command-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendCustomCommand();
    }
});

// Function to check for alerts and update the alert dashboard
function checkForAlerts(data) {
    const alerts = [];
    if (data.temperature < 15 || data.temperature > 30) {
        alerts.push('Temperature out of range!');
    }
    if (data.humidity < 30 || data.humidity > 70) {
        alerts.push('Humidity out of range!');
    }
    if (data.soilMoisture < 300 || data.soilMoisture > 700) {
        alerts.push('Soil moisture out of range!');
    }
    if (data.waterLevel < 100) {
        alerts.push('Water level too low!');
    }
    if (data.pH < 5.5 || data.pH > 7.5) {
        alerts.push('pH level out of range!');
    }
    if (data.nitrogen < 50 || data.nitrogen > 200) {
        alerts.push('Nitrogen level out of range!');
    }
    if (data.phosphorus < 30 || data.phosphorus > 80) {
        alerts.push('Phosphorus level out of range!');
    }
    if (data.potassium < 20 || data.potassium > 100) {
        alerts.push('Potassium level out of range!');
    }
    if (data.co2 < 250 || data.co2 > 800) {
        alerts.push('CO2 level out of range!');
    }
    if (data.lux < 1000 || data.lux > 10000) {
        alerts.push('Light intensity out of range!');
    }

    const alertDiv = document.getElementById('alerts');
    if (alerts.length > 0) {
        alertDiv.innerHTML = alerts.map(alert => `<p>${alert}</p>`).join('');
    } else {
        alertDiv.innerHTML = '<p>No alerts</p>';
    }
}
