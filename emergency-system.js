// Picker App - Emergency Contact System
// Provides quick access to emergency services and harm reduction resources

class EmergencySystem {
    constructor() {
        this.emergencyContacts = {
            // United States
            'US': {
                emergency: '911',
                poisonControl: '1-800-222-1222',
                crisisText: '741741',
                neverUseAlone: '1-800-484-3731',
                samhsa: '1-800-662-4357'
            },
            // Canada
            'CA': {
                emergency: '911',
                poisonControl: '1-800-268-9017',
                crisisText: '686868',
                neverUseAlone: '1-800-484-3731'
            },
            // United Kingdom
            'GB': {
                emergency: '999',
                nonEmergency: '111',
                samaritans: '116 123',
                crisisText: '85258'
            },
            // Australia
            'AU': {
                emergency: '000',
                poisonControl: '13 11 26',
                lifeline: '13 11 14',
                crisisText: '0477 13 11 14'
            },
            // Default/International
            'DEFAULT': {
                emergency: '112', // International emergency number
                crisisText: 'HOME to 741741',
                neverUseAlone: '1-800-484-3731'
            }
        };
        
        this.harmReductionResources = {
            'US': [
                {
                    name: 'National Harm Reduction Coalition',
                    url: 'https://harmreduction.org',
                    phone: null,
                    description: 'Comprehensive harm reduction resources and advocacy'
                },
                {
                    name: 'DanceSafe',
                    url: 'https://dancesafe.org',
                    phone: null,
                    description: 'Drug checking, education, and harm reduction services'
                },
                {
                    name: 'Never Use Alone',
                    url: 'https://neverusealone.com',
                    phone: '1-800-484-3731',
                    description: 'Supervised use hotline to prevent overdose deaths'
                },
                {
                    name: 'Erowid',
                    url: 'https://erowid.org',
                    phone: null,
                    description: 'Comprehensive psychoactive substance information'
                }
            ],
            'CA': [
                {
                    name: 'Canadian Association of People who Use Drugs',
                    url: 'https://capud.ca',
                    phone: null,
                    description: 'National drug user organization'
                },
                {
                    name: 'Toward the Heart',
                    url: 'https://towardtheheart.com',
                    phone: null,
                    description: 'BC harm reduction services and naloxone training'
                }
            ],
            'GB': [
                {
                    name: 'Release',
                    url: 'https://release.org.uk',
                    phone: '020 7324 2989',
                    description: 'Drugs, the law and human rights'
                },
                {
                    name: 'Crew',
                    url: 'https://crew2000.org.uk',
                    phone: null,
                    description: 'Scottish harm reduction organization'
                }
            ]
        };
        
        this.overdoseRecognition = {
            'opioids': {
                signs: [
                    'Slow or stopped breathing',
                    'Blue lips or fingernails',
                    'Pale or clammy skin',
                    'Unresponsive to stimuli',
                    'Pinpoint pupils',
                    'Gurgling or choking sounds'
                ],
                response: [
                    'Call emergency services immediately',
                    'Administer naloxone if available',
                    'Perform rescue breathing',
                    'Stay with person until help arrives',
                    'Place in recovery position if breathing'
                ]
            },
            'stimulants': {
                signs: [
                    'Rapid heart rate',
                    'High blood pressure',
                    'Chest pain',
                    'Severe agitation',
                    'Seizures',
                    'Extreme hyperthermia'
                ],
                response: [
                    'Call emergency services',
                    'Keep person cool and calm',
                    'Do not restrain if agitated',
                    'Monitor vital signs',
                    'Provide water if conscious'
                ]
            },
            'general': {
                signs: [
                    'Unconsciousness',
                    'Difficulty breathing',
                    'Seizures',
                    'Severe confusion',
                    'Vomiting while unconscious'
                ],
                response: [
                    'Call emergency services immediately',
                    'Do not leave person alone',
                    'Place in recovery position',
                    'Clear airway if vomiting',
                    'Provide information to responders'
                ]
            }
        };
    }
    
    getEmergencyContacts(countryCode = null) {
        const code = countryCode || this.detectCountry() || 'DEFAULT';
        return this.emergencyContacts[code] || this.emergencyContacts['DEFAULT'];
    }
    
    getHarmReductionResources(countryCode = null) {
        const code = countryCode || this.detectCountry();
        return this.harmReductionResources[code] || this.harmReductionResources['US'] || [];
    }
    
    detectCountry() {
        // Simple country detection based on timezone and language
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const language = navigator.language;
        
        if (timezone.includes('America') || language === 'en-US') return 'US';
        if (timezone.includes('Canada') || language === 'en-CA') return 'CA';
        if (timezone.includes('Europe') && language === 'en-GB') return 'GB';
        if (timezone.includes('Australia') || language === 'en-AU') return 'AU';
        
        return null;
    }
    
    callEmergencyNumber(number) {
        if (confirm(`Call ${number}? This will connect you to emergency services.`)) {
            window.location.href = `tel:${number.replace(/\D/g, '')}`;
        }
    }
    
    textCrisisLine(number) {
        if (confirm(`Text ${number}? This will connect you to crisis support.`)) {
            window.location.href = `sms:${number.replace(/\D/g, '')}`;
        }
    }
    
    getOverdoseInfo(substanceType = 'general') {
        return this.overdoseRecognition[substanceType] || this.overdoseRecognition['general'];
    }
    
    showEmergencyModal(substanceType = null) {
        const modal = this.createEmergencyModal(substanceType);
        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
    
    createEmergencyModal(substanceType) {
        const modal = document.createElement('div');
        modal.className = 'emergency-modal';
        modal.innerHTML = `
            <div class="emergency-modal-backdrop"></div>
            <div class="emergency-modal-content">
                <div class="emergency-header">
                    <div class="emergency-icon">🚨</div>
                    <h2>Emergency Resources</h2>
                    <button class="close-btn" onclick="this.closest('.emergency-modal').remove()">×</button>
                </div>
                
                <div class="emergency-sections">
                    ${this.createImmediateHelpSection()}
                    ${substanceType ? this.createOverdoseSection(substanceType) : ''}
                    ${this.createHarmReductionSection()}
                    ${this.createRecoveryPositionSection()}
                </div>
            </div>
        `;
        
        // Add styles
        this.addEmergencyStyles();
        
        return modal;
    }
    
    createImmediateHelpSection() {
        const contacts = this.getEmergencyContacts();
        
        return `
            <div class="emergency-section">
                <h3>Immediate Help</h3>
                <div class="emergency-contacts">
                    <button class="emergency-btn emergency" onclick="emergencySystem.callEmergencyNumber('${contacts.emergency}')">
                        <span class="icon">🚨</span>
                        <span class="text">
                            <strong>Emergency Services</strong>
                            <small>${contacts.emergency}</small>
                        </span>
                    </button>
                    
                    ${contacts.poisonControl ? `
                        <button class="emergency-btn poison" onclick="emergencySystem.callEmergencyNumber('${contacts.poisonControl}')">
                            <span class="icon">☠️</span>
                            <span class="text">
                                <strong>Poison Control</strong>
                                <small>${contacts.poisonControl}</small>
                            </span>
                        </button>
                    ` : ''}
                    
                    ${contacts.neverUseAlone ? `
                        <button class="emergency-btn support" onclick="emergencySystem.callEmergencyNumber('${contacts.neverUseAlone}')">
                            <span class="icon">📞</span>
                            <span class="text">
                                <strong>Never Use Alone</strong>
                                <small>${contacts.neverUseAlone}</small>
                            </span>
                        </button>
                    ` : ''}
                    
                    ${contacts.crisisText ? `
                        <button class="emergency-btn text" onclick="emergencySystem.textCrisisLine('${contacts.crisisText}')">
                            <span class="icon">💬</span>
                            <span class="text">
                                <strong>Crisis Text Line</strong>
                                <small>Text ${contacts.crisisText}</small>
                            </span>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    createOverdoseSection(substanceType) {
        const overdoseInfo = this.getOverdoseInfo(substanceType);
        
        return `
            <div class="emergency-section">
                <h3>Overdose Recognition & Response</h3>
                <div class="overdose-info">
                    <div class="signs">
                        <h4>Warning Signs:</h4>
                        <ul>
                            ${overdoseInfo.signs.map(sign => `<li>${sign}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="response">
                        <h4>What to Do:</h4>
                        <ol>
                            ${overdoseInfo.response.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            </div>
        `;
    }
    
    createHarmReductionSection() {
        const resources = this.getHarmReductionResources();
        
        return `
            <div class="emergency-section">
                <h3>Harm Reduction Resources</h3>
                <div class="harm-reduction-resources">
                    ${resources.map(resource => `
                        <div class="resource-card">
                            <h4>${resource.name}</h4>
                            <p>${resource.description}</p>
                            <div class="resource-links">
                                <a href="${resource.url}" target="_blank" rel="noopener">Visit Website</a>
                                ${resource.phone ? `<button onclick="emergencySystem.callEmergencyNumber('${resource.phone}')">Call</button>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    createRecoveryPositionSection() {
        return `
            <div class="emergency-section">
                <h3>Recovery Position</h3>
                <div class="recovery-position">
                    <p>If someone is unconscious but breathing, place them in the recovery position:</p>
                    <ol>
                        <li>Kneel beside the person</li>
                        <li>Straighten their legs</li>
                        <li>Place the arm nearest you at right angles</li>
                        <li>Bring the far arm across their chest</li>
                        <li>Grasp the far leg just above the knee</li>
                        <li>Roll them toward you onto their side</li>
                        <li>Tilt head back to maintain airway</li>
                        <li>Monitor breathing until help arrives</li>
                    </ol>
                </div>
            </div>
        `;
    }
    
    addEmergencyStyles() {
        if (document.getElementById('emergency-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'emergency-styles';
        styles.textContent = `
            .emergency-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .emergency-modal.show {
                opacity: 1;
            }
            
            .emergency-modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
            }
            
            .emergency-modal-content {
                position: relative;
                background: white;
                margin: 2rem;
                max-height: calc(100vh - 4rem);
                overflow-y: auto;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            
            .emergency-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1.5rem;
                background: #E07A5F;
                color: white;
                border-radius: 16px 16px 0 0;
            }
            
            .emergency-header h2 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
            }
            
            .emergency-icon {
                font-size: 2rem;
            }
            
            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 2rem;
                height: 2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s;
            }
            
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .emergency-sections {
                padding: 0 1.5rem 1.5rem;
            }
            
            .emergency-section {
                margin-bottom: 2rem;
            }
            
            .emergency-section h3 {
                color: #1E4D4B;
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid #81B366;
            }
            
            .emergency-contacts {
                display: grid;
                gap: 0.75rem;
            }
            
            .emergency-btn {
                display: flex;
                align-items: center;
                gap: 1rem;
                width: 100%;
                padding: 1rem;
                border: none;
                border-radius: 12px;
                text-align: left;
                cursor: pointer;
                transition: all 0.2s;
                font-family: inherit;
            }
            
            .emergency-btn.emergency {
                background: #dc2626;
                color: white;
            }
            
            .emergency-btn.poison {
                background: #7c2d12;
                color: white;
            }
            
            .emergency-btn.support {
                background: #1E4D4B;
                color: white;
            }
            
            .emergency-btn.text {
                background: #2563eb;
                color: white;
            }
            
            .emergency-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            
            .emergency-btn .icon {
                font-size: 1.5rem;
                flex-shrink: 0;
            }
            
            .emergency-btn .text {
                flex: 1;
            }
            
            .emergency-btn strong {
                display: block;
                font-size: 1rem;
                margin-bottom: 0.25rem;
            }
            
            .emergency-btn small {
                opacity: 0.9;
                font-size: 0.875rem;
            }
            
            .overdose-info {
                display: grid;
                gap: 1.5rem;
            }
            
            .signs, .response {
                background: #f8fafc;
                padding: 1rem;
                border-radius: 8px;
                border-left: 4px solid #E07A5F;
            }
            
            .signs h4, .response h4 {
                color: #dc2626;
                font-size: 1rem;
                font-weight: 600;
                margin-bottom: 0.75rem;
            }
            
            .signs ul, .response ol {
                margin: 0;
                padding-left: 1.25rem;
            }
            
            .signs li, .response li {
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .response li {
                font-weight: 500;
            }
            
            .harm-reduction-resources {
                display: grid;
                gap: 1rem;
            }
            
            .resource-card {
                background: #f8fafc;
                padding: 1rem;
                border-radius: 8px;
                border-left: 4px solid #81B366;
            }
            
            .resource-card h4 {
                color: #1E4D4B;
                font-size: 1rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            
            .resource-card p {
                font-size: 0.9rem;
                color: #64748b;
                margin-bottom: 1rem;
                line-height: 1.4;
            }
            
            .resource-links {
                display: flex;
                gap: 0.75rem;
            }
            
            .resource-links a, .resource-links button {
                background: #1E4D4B;
                color: white;
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 6px;
                text-decoration: none;
                font-size: 0.875rem;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .resource-links a:hover, .resource-links button:hover {
                background: #2C5F5D;
            }
            
            .recovery-position {
                background: #f0f9ff;
                padding: 1rem;
                border-radius: 8px;
                border-left: 4px solid #0ea5e9;
            }
            
            .recovery-position h4 {
                color: #0c4a6e;
                font-size: 1rem;
                font-weight: 600;
                margin-bottom: 0.75rem;
            }
            
            .recovery-position ol {
                margin: 0;
                padding-left: 1.25rem;
            }
            
            .recovery-position li {
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            @media (max-width: 640px) {
                .emergency-modal-content {
                    margin: 1rem;
                    max-height: calc(100vh - 2rem);
                }
                
                .emergency-header {
                    padding: 1rem;
                }
                
                .emergency-sections {
                    padding: 0 1rem 1rem;
                }
                
                .emergency-btn {
                    padding: 0.75rem;
                }
                
                .emergency-btn .icon {
                    font-size: 1.25rem;
                }
                
                .emergency-btn strong {
                    font-size: 0.9rem;
                }
                
                .emergency-btn small {
                    font-size: 0.8rem;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Create global instance
const emergencySystem = new EmergencySystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmergencySystem;
}