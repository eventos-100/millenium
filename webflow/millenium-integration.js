/**
 * Millenium Automotive - Webflow Integration JavaScript
 * Add this to your Webflow site's custom code (Before </body> tag)
 */

(function() {
    'use strict';

    // Configuration
    const API_BASE = 'https://millenium-automotive.your-subdomain.workers.dev';
    const SITE_ID = '687bbc3b0bb3dd57d6c1fd83';

    // Session management
    function getSessionId() {
        let sessionId = sessionStorage.getItem('millenium_session');
        if (!sessionId) {
            sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('millenium_session', sessionId);
        }
        return sessionId;
    }

    // Lead capture form integration
    function initLeadCapture() {
        const leadForms = document.querySelectorAll('[data-millenium="lead-form"]');
        
        leadForms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const leadData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    vehicle_interest: formData.get('vehicle_interest') || 'General Inquiry',
                    message: formData.get('message'),
                    source: 'website_form'
                };

                try {
                    const response = await fetch(`${API_BASE}/api/leads`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(leadData)
                    });

                    if (response.ok) {
                        const result = await response.json();
                        
                        // Track successful lead submission
                        trackEvent('lead_submitted', {
                            lead_id: result.lead_id,
                            vehicle_interest: leadData.vehicle_interest
                        });

                        // Show success message
                        showNotification('Thank you! Our premium concierge team will contact you within 24 hours.', 'success');
                        
                        // Reset form
                        form.reset();
                        
                        // Optional: Redirect to thank you page
                        // window.location.href = '/thank-you';
                        
                    } else {
                        throw new Error('Failed to submit form');
                    }
                    
                } catch (error) {
                    console.error('Lead submission error:', error);
                    showNotification('We apologize for the inconvenience. Please call us directly at +1-555-MILLENIUM', 'error');
                }
            });
        });
    }

    // Test drive request form
    function initTestDriveRequests() {
        const testDriveForms = document.querySelectorAll('[data-millenium="test-drive-form"]');
        
        testDriveForms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const testDriveData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    vehicle_id: formData.get('vehicle_id'),
                    vehicle_name: formData.get('vehicle_name'),
                    preferred_date: formData.get('preferred_date'),
                    preferred_time: formData.get('preferred_time'),
                    dealer_location: formData.get('dealer_location') || 'Main Showroom',
                    notes: formData.get('notes')
                };

                try {
                    const response = await fetch(`${API_BASE}/api/test-drive`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(testDriveData)
                    });

                    if (response.ok) {
                        const result = await response.json();
                        
                        // Track test drive request
                        trackEvent('test_drive_requested', {
                            request_id: result.request_id,
                            vehicle_id: testDriveData.vehicle_id,
                            vehicle_name: testDriveData.vehicle_name
                        });

                        showNotification('Your concierge test drive has been scheduled! We will confirm within 2 hours.', 'success');
                        form.reset();
                        
                    } else {
                        throw new Error('Failed to schedule test drive');
                    }
                    
                } catch (error) {
                    console.error('Test drive request error:', error);
                    showNotification('Unable to schedule at this time. Please call our concierge line.', 'error');
                }
            });
        });
    }

    // Vehicle configuration saving
    function initConfigurationSaving() {
        window.milleniumSaveConfig = function(vehicleId, vehicleName, configuration, totalPrice, monthlyPayment) {
            const sessionId = getSessionId();
            
            const configData = {
                session_id: sessionId,
                vehicle_id: vehicleId,
                vehicle_name: vehicleName,
                configuration: configuration,
                total_price: totalPrice,
                monthly_payment: monthlyPayment
            };

            fetch(`${API_BASE}/api/configurations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(configData)
            })
            .then(response => response.ok ? response.json() : Promise.reject())
            .then(result => {
                trackEvent('configuration_saved', {
                    vehicle_id: vehicleId,
                    total_price: totalPrice
                });
                showNotification('Configuration saved! You can continue customizing anytime.', 'success');
            })
            .catch(error => {
                console.error('Configuration save error:', error);
            });
        };

        // Load saved configuration
        window.milleniumLoadConfig = function(vehicleId) {
            const sessionId = getSessionId();
            
            return fetch(`${API_BASE}/api/configurations?session_id=${sessionId}&vehicle_id=${vehicleId}`)
                .then(response => response.ok ? response.json() : null)
                .then(config => {
                    if (config) {
                        trackEvent('configuration_loaded', {
                            vehicle_id: vehicleId
                        });
                    }
                    return config;
                })
                .catch(error => {
                    console.error('Configuration load error:', error);
                    return null;
                });
        };
    }

    // Analytics event tracking
    function trackEvent(eventType, metadata = {}) {
        const eventData = {
            event_type: eventType,
            vehicle_id: metadata.vehicle_id || getCurrentVehicleId(),
            user_session_id: getSessionId(),
            page_url: window.location.href,
            referrer: document.referrer,
            metadata: metadata
        };

        fetch(`${API_BASE}/api/analytics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        }).catch(error => {
            console.error('Analytics tracking error:', error);
        });
    }

    // Get current vehicle ID from URL or page
    function getCurrentVehicleId() {
        // Try to get from URL path
        const pathParts = window.location.pathname.split('/');
        if (pathParts.includes('cars') || pathParts.includes('vehicles')) {
            return pathParts[pathParts.indexOf('cars') + 1] || pathParts[pathParts.indexOf('vehicles') + 1];
        }
        
        // Try to get from data attribute
        const vehicleElement = document.querySelector('[data-vehicle-id]');
        if (vehicleElement) {
            return vehicleElement.getAttribute('data-vehicle-id');
        }
        
        return null;
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.millenium-notification');
        existingNotifications.forEach(n => n.remove());

        // Create notification
        const notification = document.createElement('div');
        notification.className = `millenium-notification millenium-notification--${type}`;
        notification.innerHTML = `
            <div class="millenium-notification__content">
                <p>${message}</p>
                <button class="millenium-notification__close">&times;</button>
            </div>
        `;

        // Add styles if not already present
        if (!document.querySelector('#millenium-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'millenium-notification-styles';
            styles.textContent = `
                .millenium-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    max-width: 400px;
                    z-index: 9999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    overflow: hidden;
                    animation: slideIn 0.3s ease-out;
                }
                .millenium-notification--success {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                }
                .millenium-notification--error {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                }
                .millenium-notification--info {
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: white;
                }
                .millenium-notification__content {
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .millenium-notification__content p {
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.4;
                }
                .millenium-notification__close {
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 20px;
                    cursor: pointer;
                    margin-left: 12px;
                    padding: 0;
                    opacity: 0.8;
                }
                .millenium-notification__close:hover {
                    opacity: 1;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        // Add to page
        document.body.appendChild(notification);

        // Add close functionality
        const closeBtn = notification.querySelector('.millenium-notification__close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Page view tracking
    function trackPageView() {
        const vehicleId = getCurrentVehicleId();
        trackEvent('page_view', {
            vehicle_id: vehicleId,
            page_type: vehicleId ? 'vehicle_detail' : 'general'
        });
    }

    // Scroll tracking for engagement
    function initScrollTracking() {
        let scrollDepth = 0;
        let scrollTracked = {
            25: false,
            50: false,
            75: false,
            100: false
        };

        window.addEventListener('scroll', () => {
            const winHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight - winHeight;
            const scrolled = Math.min(Math.round((window.scrollY / docHeight) * 100), 100);

            if (scrolled > scrollDepth) {
                scrollDepth = scrolled;
                
                // Track significant scroll milestones
                Object.keys(scrollTracked).forEach(milestone => {
                    if (scrolled >= parseInt(milestone) && !scrollTracked[milestone]) {
                        scrollTracked[milestone] = true;
                        trackEvent('scroll_milestone', {
                            depth: milestone,
                            vehicle_id: getCurrentVehicleId()
                        });
                    }
                });
            }
        });
    }

    // Initialize all functionality when DOM is ready
    function init() {
        // Basic integrations
        initLeadCapture();
        initTestDriveRequests();
        initConfigurationSaving();
        
        // Analytics
        trackPageView();
        initScrollTracking();
        
        // Track time on page
        const startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            if (timeOnPage > 10) { // Only track if more than 10 seconds
                trackEvent('time_on_page', {
                    duration: timeOnPage,
                    vehicle_id: getCurrentVehicleId()
                });
            }
        });

        console.log('🏆 Millenium Automotive integration loaded successfully');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export functions for global access
    window.Millenium = {
        trackEvent,
        saveConfig: window.milleniumSaveConfig,
        loadConfig: window.milleniumLoadConfig,
        getSessionId,
        showNotification
    };

})();