# M2Home Smart Home Dashboard

Een moderne Flask-gebaseerde smart home dashboard applicatie met gebruikersauthenticatie en weer integratie.

## Functionaliteiten

- **Gebruikersauthenticatie**: Veilige login en registratie systeem
- **Dashboard**: Overzichtelijk dashboard voor smart home beheer
- **Weer Integratie**: Automatische weersinformatie op basis van locatie
- **Responsive Design**: Werkt op desktop en mobiel
- **Modern UI**: Moderne interface met Bootstrap en Font Awesome

## Installatie

1. Zorg ervoor dat Python 3.7+ geïnstalleerd is
2. Navigeer naar de project directory
3. Installeer de benodigde packages:
   ```
   pip install -r requirements.txt
   ```
4. Start de applicatie:
   ```
   python main.py
   ```

### Snelle Start (Windows)
Dubbelklik op `start.bat` om automatisch alles te installeren en starten.

## Gebruik

1. Ga naar `http://localhost:5000`
2. Je wordt automatisch doorgestuurd naar de login pagina
3. Klik op "Heeft u nog geen account? Registreer hier" om een account aan te maken
4. Log in met je nieuwe account om toegang te krijgen tot het dashboard

### Locatie Instellen

De weer informatie wordt automatisch bepaald via je IP-adres, maar dit is niet altijd nauwkeurig:

1. Klik op "Instellingen" in de sidebar
2. Vul je eigen stad in (bijv. "Landgraaf", "Heerlen", "Maastricht")
3. Klik "Locatie Bijwerken"
4. De weersinformatie wordt nu gebaseerd op jouw exacte locatie

## Project Structuur

```
M2Home/
├── main.py                 # Hoofd applicatie bestand
├── requirements.txt        # Python dependencies
├── start.bat              # Windows start script
├── instance/
│   └── database.db        # SQLite database
└── website/
    ├── __init__.py        # Flask app configuratie
    ├── auth.py            # Authenticatie routes
    ├── models.py          # Database modellen
    ├── views.py           # Hoofd applicatie routes
    ├── static/
    │   ├── auth.css       # Styling voor login/register
    │   ├── dashboard.css  # Dashboard styling
    │   └── dashboard.js   # Dashboard JavaScript
    └── templates/
        ├── home.html      # Dashboard template
        ├── login.html     # Login pagina
        ├── register.html  # Registratie pagina
        └── settings.html  # Instellingen pagina
```

## Locatie Probleem Oplossen

**Probleem**: Weer toont verkeerde locatie (bijv. Den Haag in plaats van Landgraaf)

**Oorzaak**: IP-gebaseerde locatie detectie is niet altijd nauwkeurig door:
- ISP server locaties
- VPN/Proxy gebruik
- Geolocation database onnauwkeurigheden

**Oplossing**: 
1. Log in op je account
2. Ga naar "Instellingen" 
3. Vul je eigen stad in
4. De app gebruikt nu jouw exacte locatie voor weersinformatie

## API's

- **OpenWeatherMap API**: Voor weersinformatie
- **IPInfo API**: Voor locatie bepaling

## Features

- **Sessie Beheer**: Flask-Login voor veilige sessies
- **Password Hashing**: Veilige wachtwoord opslag
- **Form Validatie**: Client en server-side validatie
- **Flash Messages**: Gebruiksvriendelijke feedback
- **Responsive Design**: Optimaal op alle apparaten
