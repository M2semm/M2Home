from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_user, login_required, logout_user, current_user
from . import db
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
import requests
import requests


auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        if not username or not email or not password or not confirm_password:
            flash("Vul alle velden in.", category='error')
            return render_template('register.html')

        elif len(email) < 4:
            flash("E-mailadres moet minimaal 4 tekens bevatten.", category='error')
            return render_template('register.html')
        
        elif len(username) < 2:
            flash("Gebruikersnaam moet minimaal 2 tekens bevatten.", category='error')
            return render_template('register.html')
        
        elif len(password) < 6:
            flash("Wachtwoord moet minimaal 6 tekens bevatten.", category='error') 
            return render_template('register.html')

        elif password != confirm_password:
            flash("Wachtwoorden komen niet overeen.", category='error')
            return render_template('register.html')

        else:
            # Check of gebruiker al bestaat
            user = User.query.filter_by(email=email).first()
            if user:
                flash("E-mailadres is al in gebruik.", category='error')
                return render_template('register.html')
            
            user = User.query.filter_by(username=username).first()
            if user:
                flash("Gebruikersnaam is al in gebruik.", category='error')
                return render_template('register.html')
            
            # Maak nieuwe gebruiker aan
            new_user = User(username=username, email=email, password=generate_password_hash(password))
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            flash("Registratie succesvol!", category='success')
            return redirect(url_for('views.home'))
        
    return render_template('register.html')


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if not username or not password:
            flash('Vul alle velden in.', category='error')
            return render_template('login.html')
        
        # Zoek gebruiker op username of email
        user = User.query.filter((User.username == username) | (User.email == username)).first()
        
        if user and check_password_hash(user.password, password):
            login_user(user, remember=True)
            flash('Succesvol ingelogd!', category='success')
            return redirect(url_for('views.home'))
        else:
            flash('Ongeldige inloggegevens.', category='error')
            return render_template('login.html')
    
    return render_template('login.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Je bent uitgelogd.', category='success')
    return redirect(url_for('auth.login'))

@auth.route('/settings', methods=['GET', 'POST'])
@login_required
def settings():
    if request.method == 'POST':
        city = request.form.get('city')
        if city:
            # Zoek coördinaten voor de stad via OpenWeatherMap
            API_KEY = "abe37049e3552c127fe464726a70f77c"
            try:
                geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city},NL&limit=1&appid={API_KEY}"
                geo_response = requests.get(geo_url, timeout=5)
                geo_data = geo_response.json()
                
                if geo_data:
                    current_user.city = city
                    current_user.latitude = geo_data[0]['lat']
                    current_user.longitude = geo_data[0]['lon']
                    db.session.commit()
                    flash(f'Locatie is bijgewerkt naar {city}!', category='success')
                else:
                    flash('Stad niet gevonden. Probeer een andere naam.', category='error')
            except Exception as e:
                flash('Fout bij het bijwerken van de locatie.', category='error')
        
        return redirect(url_for('auth.settings'))
    
    return render_template('settings.html')