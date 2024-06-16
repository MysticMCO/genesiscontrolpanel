// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCLhWLCBZeY7zYUnoUmySgbBIfobJiyUVw",
    authDomain: "green-genesis.firebaseapp.com",
    databaseURL: "https://green-genesis-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "green-genesis",
    storageBucket: "green-genesis.appspot.com",
    messagingSenderId: "551458600145",
    appId: "1:551458600145:web:bd62f25b2afd6db04a01f0"
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
