/**
 * Patient module for Vital Decisions: Resident's Challenge
 * Handles patient generation and state management
 */

class Patient {
    constructor() {
        this.data = null;
        this.vitalHistory = [];
        this.actionHistory = [];
        this.isActive = false;
        this.timeElapsed = 0; // Time elapsed in seconds
        this.vitalUpdateInterval = null;
    }

    /**
     * Generate a new patient
     * @param {Object} parameters - Optional parameters for patient generation
     * @returns {Promise} - Promise that resolves when patient is generated
     */
    async generateNewPatient(parameters = {}) {
        try {
            // Clear any existing patient data
            this.resetPatient();
            
            // Generate patient data using API
            this.data = await apiService.generatePatient(parameters);
            
            // Initialize vital signs history
            this.recordVitalSigns(this.data.vitalSigns);
            
            // Mark patient as active
            this.isActive = true;
            
            // Start vital signs updates
            this.startVitalSignsUpdates();
            
            return this.data;
        } catch (error) {
            console.error('Error generating patient:', error);
            throw error;
        }
    }

    /**
     * Reset patient state
     */
    resetPatient() {
        this.stopVitalSignsUpdates();
        this.data = null;
        this.vitalHistory = [];
        this.actionHistory = [];
        this.isActive = false;
        this.timeElapsed = 0;
    }

    /**
     * Record current vital signs to history
     * @param {Object} vitalSigns - Current vital signs
     */
    recordVitalSigns(vitalSigns) {
        this.vitalHistory.push({
            timestamp: this.timeElapsed,
            vitals: { ...vitalSigns }
        });
        
        // Calculate MAP if not provided
        if (!vitalSigns.meanArterialPressure && vitalSigns.bloodPressure) {
            const systolic = vitalSigns.bloodPressure.systolic;
            const diastolic = vitalSigns.bloodPressure.diastolic;
            vitalSigns.meanArterialPressure = Math.round((diastolic * 2 + systolic) / 3);
        }
    }

    /**
     * Start automatic vital signs updates
     */
    startVitalSignsUpdates() {
        // Update vitals every 10 seconds
        this.vitalUpdateInterval = setInterval(() => {
            this.updateVitalSigns();
            this.timeElapsed += 10;
        }, 10000);
    }

    /**
     * Stop automatic vital signs updates
     */
    stopVitalSignsUpdates() {
        if (this.vitalUpdateInterval) {
            clearInterval(this.vitalUpdateInterval);
            this.vitalUpdateInterval = null;
        }
    }

    /**
     * Update vital signs based on condition and treatments
     */
    updateVitalSigns() {
        if (!this.isActive || !this.data) return;
        
        // Get current vitals
        const currentVitals = { ...this.data.vitalSigns };
        
        // Apply small random variations to vitals to simulate natural changes
        currentVitals.heartRate = this.addVariation(currentVitals.heartRate, 5);
        currentVitals.bloodPressure.systolic = this.addVariation(currentVitals.bloodPressure.systolic, 5);
        currentVitals.bloodPressure.diastolic = this.addVariation(currentVitals.bloodPressure.diastolic, 3);
        currentVitals.respiratoryRate = this.addVariation(currentVitals.respiratoryRate, 2);
        currentVitals.temperature = this.addVariation(currentVitals.temperature, 0.2);
        currentVitals.oxygenSaturation = Math.min(100, this.addVariation(currentVitals.oxygenSaturation, 1));
        
        // Update the current vitals
        this.data.vitalSigns = currentVitals;
        
        // Record the updated vitals
        this.recordVitalSigns(currentVitals);
        
        // Trigger an event to update the UI
        document.dispatchEvent(new CustomEvent('vitalsUpdated', { detail: currentVitals }));
    }

    /**
     * Add a small random variation to a value
     * @param {Number} value - The original value
     * @param {Number} maxChange - Maximum change allowed
     * @returns {Number} - The value with variation applied
     */
    addVariation(value, maxChange) {
        const variation = (Math.random() * 2 - 1) * maxChange;
        return Math.round((value + variation) * 10) / 10;
    }

    /**
     * Process a player action
     * @param {String} action - The action type
     * @param {Object} details - Details of the action
     * @returns {Promise} - Promise that resolves with the action result
     */
    async processAction(action, details) {
        if (!this.isActive || !this.data) {
            throw new Error('No active patient');
        }
        
        try {
            // Process the action using the API
            const result = await apiService.processAction(this.data, action, details);
            
            // Record the action
            this.actionHistory.push({
                timestamp: this.timeElapsed,
                action: action,
                details: details,
                result: result
            });
            
            // Update patient vital signs if there are changes
            if (result.vitalSignsChange) {
                this.applyVitalSignsChanges(result.vitalSignsChange);
            }
            
            // Update patient condition if there are changes
            if (result.conditionChange) {
                this.data.condition.improved = result.conditionChange.improved;
                this.data.condition.worsened = result.conditionChange.worsened;
                if (result.conditionChange.description) {
                    this.data.condition.statusUpdate = result.conditionChange.description;
                }
            }
            
            return result;
        } catch (error) {
            console.error('Error processing action:', error);
            throw error;
        }
    }

    /**
     * Apply changes to vital signs
     * @param {Object} changes - The changes to apply
     */
    applyVitalSignsChanges(changes) {
        // Only update values that have changed (non-null)
        if (changes.heartRate !== null && changes.heartRate !== undefined) {
            this.data.vitalSigns.heartRate = changes.heartRate;
        }
        
        if (changes.bloodPressure) {
            if (changes.bloodPressure.systolic !== null && changes.bloodPressure.systolic !== undefined) {
                this.data.vitalSigns.bloodPressure.systolic = changes.bloodPressure.systolic;
            }
            if (changes.bloodPressure.diastolic !== null && changes.bloodPressure.diastolic !== undefined) {
                this.data.vitalSigns.bloodPressure.diastolic = changes.bloodPressure.diastolic;
            }
        }
        
        if (changes.respiratoryRate !== null && changes.respiratoryRate !== undefined) {
            this.data.vitalSigns.respiratoryRate = changes.respiratoryRate;
        }
        
        if (changes.temperature !== null && changes.temperature !== undefined) {
            this.data.vitalSigns.temperature = changes.temperature;
        }
        
        if (changes.oxygenSaturation !== null && changes.oxygenSaturation !== undefined) {
            this.data.vitalSigns.oxygenSaturation = changes.oxygenSaturation;
        }
        
        // Record the updated vitals after changes
        this.recordVitalSigns(this.data.vitalSigns);
        
        // Trigger UI update
        document.dispatchEvent(new CustomEvent('vitalsUpdated', { detail: this.data.vitalSigns }));
    }

    /**
     * Get the current patient data
     * @returns {Object} - Current patient data or null if no active patient
     */
    getCurrentPatient() {
        return this.data;
    }

    /**
     * Get vital signs history
     * @returns {Array} - Array of historical vital signs records
     */
    getVitalHistory() {
        return this.vitalHistory;
    }

    /**
     * Get action history
     * @returns {Array} - Array of historical actions
     */
    getActionHistory() {
        return this.actionHistory;
    }
}

// Create and export a single instance of the Patient class
const patientManager = new Patient();
