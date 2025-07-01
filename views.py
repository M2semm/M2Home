from flask import Blueprint, render_template, jsonify, request
import requests

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template('home.html')

def get_user_location():
    """Haal gebruiker locatie op via IP adres"""
    try:
        # Haal client IP op
        client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR', ''))
        
        # Als localhost (development), gebruik echte externe IP
        if client_ip in ['127.0.0.1', 'localhost', '::1', None]:
            try:
                # Vraag echte externe IP op
                ip_response = requests.get('https://api.ipify.org?format=json', timeout=5)
                client_ip = ip_response.json()['ip']
            except:
                # Fallback naar Nederlandse locatie
                return {
                    'city': 'Amsterdam',
                    'lat': 52.3676,
                    'lon': 4.9041,
                    'country': 'NL'
                }
        
        # Vraag locatie op via IP
        location_response = requests.get(f'https://ipinfo.io/{client_ip}/json', timeout=5)
        location_data = location_response.json()
        
        # Haal gegevens op
        city = location_data.get('city', 'Amsterdam')
        coordinates = location_data.get('loc', '52.3676,4.9041').split(',')
        lat, lon = float(coordinates[0]), float(coordinates[1])
        
        return {
            'city': city,
            'lat': lat,
            'lon': lon,
            'country': location_data.get('country', 'NL')
        }
        
    except Exception as e:
        print(f"Location error: {e}")
        # Fallback naar Amsterdam
        return {
            'city': 'Amsterdam',
            'lat': 52.3676,
            'lon': 4.9041,
            'country': 'NL'
        }

@views.route('/api/weather')
def get_weather():
    # API key
    API_KEY = "abe37049e3552c127fe464726a70f77c"
    
    # Automatisch locatie bepalen
    location = get_user_location()
    
    # Gebruik coördinaten voor weer data
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={location['lat']}&lon={location['lon']}&appid={API_KEY}&units=metric&lang=nl"
    
    try:
        response = requests.get(url, timeout=10)
        data = response.json()
        
        if response.status_code != 200:
            # Fallback data als API faalt
            return jsonify({
                'temperature': 18,
                'description': 'deels bewolkt',
                'humidity': 65,
                'wind_speed': 3.2,
                'city': location['city']
            })
        
        # Echte weer data
        weather_data = {
            'temperature': round(data['main']['temp']),
            'description': data['weather'][0]['description'],
            'humidity': data['main']['humidity'],
            'wind_speed': round(data['wind']['speed'], 1),
            'city': data['name']
        }
        
        return jsonify(weather_data)
        
    except Exception as e:
        print(f"Weather API error: {e}")
        # Fallback data
        return jsonify({
            'temperature': 18,
            'description': 'weer niet beschikbaar',
            'humidity': 65,
            'wind_speed': 3.0,
            'city': location['city']
        })