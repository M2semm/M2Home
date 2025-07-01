// Dashboard JavaScript voor Home Assistant verlichting

// Navigatie tussen ruimtes
document.querySelectorAll('.nav-link[data-room]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update actieve navigatie
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Filter lampen per ruimte
        const selectedRoom = this.getAttribute('data-room');
        filterLightsByRoom(selectedRoom);
        
        // Update titel
        updateRoomTitle(selectedRoom);
    });
});
// Functie om weer data op te halen
async function loadWeatherData() {
    try {
        console.log('Laden van weer data...');
        const response = await fetch('/api/weather');
        const data = await response.json();
        
        console.log('Weer data ontvangen:', data);
        
        if (data.error) {
            console.error('Weer error:', data.error);
            document.getElementById('weather-temp').textContent = 'Error';
            return;
        }
        
        // Update HTML elementen
        updateWeatherDisplay(data);
        
    } catch (error) {
        console.error('API fout:', error);
        document.getElementById('weather-temp').textContent = 'Fout';
    }
}

// Functie om weer info in HTML te tonen
function updateWeatherDisplay(weather) {
    console.log('Bijwerken van weer display...');
    
    // Update temperatuur
    document.getElementById('weather-temp').textContent = `${weather.temperature}°C`;
    
    // Update beschrijving
    document.getElementById('weather-desc').textContent = weather.description;
    
    // Update stad
    document.getElementById('weather-city').textContent = weather.city;
    
    // Update wind
    document.getElementById('wind-speed').textContent = `${weather.wind_speed} m/s`;
    
    // Update humidity
    document.getElementById('weather-humidity').textContent = `${weather.humidity}%`;
}

// Laad weer data bij page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Pagina geladen, weer data laden...');
    loadWeatherData();
    
    // Update elke 10 minuten (600000 ms)
    setInterval(loadWeatherData, 600000);
});