// Settings Page JavaScript

// Update current time in footer
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleString('nl-NL', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Reset form function
function resetForm() {
    const cityInput = document.getElementById('city');
    if (cityInput) {
        cityInput.value = '';
        cityInput.focus();
    }
}

// Settings navigation
function switchSettingsSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.settings-card');
    sections.forEach(section => {
        section.classList.add('d-none');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.remove('d-none');
    }
    
    // Update navigation
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-setting="${sectionName}"]`);
    if (activeLink && !activeLink.classList.contains('disabled')) {
        activeLink.classList.add('active');
    }
    
    // Update header
    const header = document.querySelector('.settings-header h1');
    const description = document.querySelector('.settings-header p');
    
    if (header && description) {
        switch(sectionName) {
            case 'locatie':
                header.innerHTML = '<i class="fas fa-map-marker-alt"></i> Locatie Instellingen';
                description.textContent = 'Stel je locatie in voor nauwkeurige weersinformatie';
                break;
            case 'account':
                header.innerHTML = '<i class="fas fa-user"></i> Account Instellingen';
                description.textContent = 'Beheer je account gegevens en voorkeuren';
                break;
            case 'thema':
                header.innerHTML = '<i class="fas fa-palette"></i> Thema Instellingen';
                description.textContent = 'Pas het uiterlijk van je dashboard aan';
                break;
            case 'notificaties':
                header.innerHTML = '<i class="fas fa-bell"></i> Notificatie Instellingen';
                description.textContent = 'Configureer je notificatie voorkeuren';
                break;
        }
    }
}

// Form submission with loading state
function handleFormSubmit(event) {
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Re-enable button after 3 seconds (in case form doesn't redirect)
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }, 3000);
    }
}

// Auto-dismiss alerts
function autoDismissAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000); // Auto dismiss after 5 seconds
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update time immediately and then every minute
    updateCurrentTime();
    setInterval(updateCurrentTime, 60000);
    
    // Auto-dismiss alerts
    autoDismissAlerts();
    
    // Add click handlers for settings navigation
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link:not(.disabled)');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const setting = this.getAttribute('data-setting');
            if (setting) {
                switchSettingsSection(setting);
            }
        });
    });
    
    // Add form submit handler
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Add input validation
    const cityInput = document.getElementById('city');
    if (cityInput) {
        cityInput.addEventListener('input', function() {
            const value = this.value.trim();
            const submitBtn = document.querySelector('.btn-primary');
            
            if (submitBtn) {
                if (value.length >= 2) {
                    submitBtn.disabled = false;
                    this.classList.remove('is-invalid');
                } else {
                    submitBtn.disabled = true;
                    if (value.length > 0) {
                        this.classList.add('is-invalid');
                    }
                }
            }
        });
        
        // Focus on city input when page loads
        cityInput.focus();
    }
});

// Utility function for future settings sections
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.messages-container') || document.querySelector('.main-content');
    if (container) {
        container.insertBefore(notification, container.firstChild);
        
        // Auto dismiss after 4 seconds
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(notification);
            bsAlert.close();
        }, 4000);
    }
}
