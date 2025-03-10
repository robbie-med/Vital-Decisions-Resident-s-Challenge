/**
 * Game module for Vital Decisions: Resident's Challenge
 * Main game controller that coordinates all modules
 */

class GameManager {
    constructor() {
        // Game state
        this.score = 0;
        this.gameTimer = null;
        this.gameTime = 0;
        
        // DOM elements
        this.scoreElement = document.getElementById('score');
        this.gameTimeElement = document.getElementById('game-time');
        this.newPatientButton = document.getElementById('new-patient-btn');
        this.patientInfoElement = document.getElementById('patient-info');
        
        // Initialize event listeners
        this.initEventListeners();
    }

    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // New patient button
        this.newPatientButton.addEventListener('click', () => {
            this.startNewCase();
        });
    }

    /**
     * Start the game
     */
    async start() {
        // Show welcome message
        this.showWelcomeMessage();
        
        // Set initial score
        this.updateScore(0, 'Game started');
    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        resultsManager.addStatusUpdate(
            'Welcome to Vital Decisions: Resident\'s Challenge! Click "New Patient" to begin a new case.', 
            'info'
        );
    }

    /**
     * Start a new patient case
     */
    async startNewCase() {
        try {
            // Show loading indicator
            this.patientInfoElement.innerHTML = '<p>Generating new patient case...</p>';
            resultsManager.clearResults();
            actionsManager.reset();
            
            // Reset score for new case
            this.score = 0;
            this.updateScore(0, 'New case started');
            
            // Reset game time
            this.resetGameTime();
            
            // Generate new patient
            const patient = await patientManager.generateNewPatient();
            
            // Display patient info
            this.displayPatientInfo(patient);
            
            // Start game timer
            this.startGameTimer();
            
            // Add initial status update
            resultsManager.addStatusUpdate('New patient case started. Perform examination and tests to diagnose and treat.', 'info');
            
            // Display initial vital signs
            resultsManager.updateVitalSigns(patient.vitalSigns);
        } catch (error) {
            console.error('Error starting new case:', error);
            resultsManager.addStatusUpdate('Error generating patient case. Please try again.', 'abnormal');
        }
    }

    /**
     * Display patient information
     * @param {Object} patient - Patient data
     */
    displayPatientInfo(patient) {
        let html = `<h3>${patient.patientInfo.name}</h3>`;
        html += `<p><strong>Age:</strong> ${patient.patientInfo.age} | <strong>Gender:</strong> ${patient.patientInfo.gender}</p>`;
        html += `<p><strong>Chief Complaint:</strong> "${patient.patientInfo.chiefComplaint}"</p>`;
        
        html += '<h4>Medical History</h4>';
        html += '<ul>';
        for (const item of patient.patientInfo.medicalHistory) {
            html += `<li>${item}</li>`;
        }
        html += '</ul>';
        
        this.patientInfoElement.innerHTML = html;
    }

    /**
     * Start game timer
     */
    startGameTimer() {
        // Clear existing timer if any
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        
        // Reset game time
        this.gameTime = 0;
        this.updateGameTimeDisplay();
        
        // Start timer that updates every second
        this.gameTimer = setInterval(() => {
            this.gameTime++;
            this.updateGameTimeDisplay();
        }, 1000);
    }

    /**
     * Reset game timer
     */
    resetGameTime() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        this.gameTime = 0;
        this.updateGameTimeDisplay();
    }

    /**
     * Update game time display
     */
    updateGameTimeDisplay() {
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = this.gameTime % 60;
        this.gameTimeElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    /**
     * Update the game score
     * @param {Number} points - Points to add (negative for penalties)
     * @param {String} reason - Reason for score change
     */
    updateScore(points, reason) {
        this.score += points;
        this.scoreElement.textContent = this.score;
        
        // If points are being deducted, show reason in results log
        if (points < 0) {
            resultsManager.addStatusUpdate(`Score penalty: ${points} points - ${reason}`, 'abnormal');
        }
    }

    /**
     * End the current case
     * @param {Boolean} success - Whether the case was successfully resolved
     * @param {String} diagnosis - Final diagnosis
     */
    endCase(success, diagnosis) {
        // Stop patient updates
        patientManager.stopVitalSignsUpdates();
        
        // Stop game timer
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        // Display end case message
        if (success) {
            resultsManager.addStatusUpdate(`Case successfully resolved. Final diagnosis: ${diagnosis}. Final score: ${this.score}`, 'normal');
        } else {
            resultsManager.addStatusUpdate(`Case ended. Patient transferred to higher level of care. Final score: ${this.score}`, 'abnormal');
        }
        
        // Disable all action buttons
        document.querySelectorAll('.action-btn').forEach(button => {
            button.disabled = true;
        });
        
        // Enable new patient button
        this.newPatientButton.disabled = false;
    }
}

// Create and export a single instance of the GameManager
const gameManager = new GameManager();

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    gameManager.start();
});
