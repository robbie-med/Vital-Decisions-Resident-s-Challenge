/**
 * Actions module for Vital Decisions: Resident's Challenge
 * Handles player interactions and action processing
 */

class ActionsManager {
    constructor() {
        // DOM elements
        this.actionContentElement = document.getElementById('action-content');
        this.actionButtons = document.querySelectorAll('.action-btn');
        
        // Current active action
        this.currentAction = null;
        
        // Initialize event listeners
        this.initEventListeners();
    }

    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Action button event listeners
        this.actionButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const action = event.target.id.replace('-btn', '');
                this.selectAction(action);
            });
        });
    }

    /**
     * Select an action type and show its interface
     * @param {String} action - The action type to select
     */
    selectAction(action) {
        // Remove active class from all buttons
        this.actionButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Add active class to selected button
        document.getElementById(`${action}-btn`).classList.add('active');
        
        // Set current action
        this.currentAction = action;
        
        // Show appropriate interface
        switch (action) {
            case 'exam':
                this.showExamInterface();
                break;
            case 'labs':
                this.showLabsInterface();
                break;
            case 'drugs':
                this.showDrugsInterface();
                break;
            case 'imaging':
                this.showImagingInterface();
                break;
            case 'consult':
                this.showConsultInterface();
                break;
            default:
                this.actionContentElement.innerHTML = '<p>Select an action to continue.</p>';
        }
    }

    /**
     * Show physical exam interface
     */
    showExamInterface() {
        let html = '<h3>Physical Examination</h3>';
        html += '<p>Select components to examine:</p>';
        
        html += '<div class="action-grid">';
        for (const component of gameData.physicalExamComponents) {
            html += `
                <div class="action-item">
                    <button class="action-option-btn" data-exam="${component}">
                        ${component}
                    </button>
                </div>
            `;
        }
        html += '</div>';
        
        this.actionContentElement.innerHTML = html;
        
        // Add event listeners to the exam buttons
        this.actionContentElement.querySelectorAll('.action-option-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const examComponent = event.target.getAttribute('data-exam');
                this.performExam(examComponent);
            });
        });
    }

    /**
     * Show laboratory tests interface
     */
    showLabsInterface() {
        let html = '<h3>Laboratory Tests</h3>';
        html += '<p>Select tests to order:</p>';
        
        html += '<div class="lab-categories">';
        for (const [category, tests] of Object.entries(gameData.labTests)) {
            html += `
                <div class="lab-category">
                    <h4>${category}</h4>
                    <div class="action-grid">
            `;
            
            for (const test of tests) {
                html += `
                    <div class="action-item">
                        <button class="action-option-btn" data-test="${test}" data-category="${category}">
                            ${test}
                        </button>
                    </div>
                `;
            }
            
            html += `
                    </div>
                </div>
            `;
        }
        html += '</div>';
        
        this.actionContentElement.innerHTML = html;
        
        // Add event listeners to the lab buttons
        this.actionContentElement.querySelectorAll('.action-option-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const test = event.target.getAttribute('data-test');
                const category = event.target.getAttribute('data-category');
                this.orderLabTest(test, category);
            });
        });
    }

    /**
     * Show medications interface
     */
    showDrugsInterface() {
        let html = '<h3>Medications</h3>';
        html += '<p>Select medication to administer:</p>';
        
        html += '<div class="medication-categories">';
        for (const [category, medications] of Object.entries(gameData.medicationCategories)) {
            html += `
                <div class="medication-category">
                    <h4>${category}</h4>
                    <div class="action-grid">
            `;
            
            for (const medication of medications) {
                html += `
                    <div class="action-item">
                        <button class="action-option-btn" data-medication="${medication}" data-category="${category}">
                            ${medication}
                        </button>
                    </div>
                `;
            }
            
            html += `
                    </div>
                </div>
            `;
        }
        html += '</div>';
        
        this.actionContentElement.innerHTML = html;
        
        // Add event listeners to the medication buttons
        this.actionContentElement.querySelectorAll('.action-option-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const medication = event.target.getAttribute('data-medication');
                const category = event.target.getAttribute('data-category');
                this.showMedicationDosageForm(medication, category);
            });
        });
    }

    /**
     * Show imaging studies interface
     */
    showImagingInterface() {
        let html = '<h3>Imaging Studies</h3>';
        html += '<p>Select imaging to order:</p>';
        
        html += '<div class="action-grid">';
        for (const study of gameData.imagingStudies) {
            html += `
                <div class="action-item">
                    <button class="action-option-btn" data-imaging="${study}">
                        ${study}
                    </button>
                </div>
            `;
        }
        html += '</div>';
        
        this.actionContentElement.innerHTML = html;
        
        // Add event listeners to the imaging buttons
        this.actionContentElement.querySelectorAll('.action-option-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const imaging = event.target.getAttribute('data-imaging');
                this.orderImaging(imaging);
            });
        });
    }

    /**
     * Show specialist consultation interface
     */
    showConsultInterface() {
        let html = '<h3>Specialist Consultation</h3>';
        html += '<p>Select specialist to consult:</p>';
        
        html += '<div class="action-grid">';
        for (const specialist of gameData.consultations) {
            html += `
                <div class="action-item">
                    <button class="action-option-btn" data-specialist="${specialist}">
                        ${specialist}
                    </button>
                </div>
            `;
        }
        html += '</div>';
        
        this.actionContentElement.innerHTML = html;
        
        // Add event listeners to the consultation buttons
        this.actionContentElement.querySelectorAll('.action-option-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const specialist = event.target.getAttribute('data-specialist');
                this.requestConsultation(specialist);
            });
        });
    }

    /**
     * Show medication dosage form
     * @param {String} medication - The selected medication
     * @param {String} category - The medication category
     */
    showMedicationDosageForm(medication, category) {
        let html = `<h3>Administer ${medication}</h3>`;
        
        html += `
            <form id="medication-form" class="medication-form">
                <div class="form-group">
                    <label for="medication-dose">Dose:</label>
                    <input type="text" id="medication-dose" required>
                </div>
                <div class="form-group">
                    <label for="medication-route">Route:</label>
                    <select id="medication-route" required>
                        <option value="IV">IV</option>
                        <option value="PO">PO (Oral)</option>
                        <option value="IM">IM</option>
                        <option value="SC">Subcutaneous</option>
                        <option value="Inhaled">Inhaled</option>
                        <option value="Topical">Topical</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="medication-frequency">Frequency:</label>
                    <select id="medication-frequency" required>
                        <option value="Once">Once</option>
                        <option value="PRN">PRN (As needed)</option>
                        <option value="Q4H">Q4H (Every 4 hours)</option>
                        <option value="Q6H">Q6H (Every 6 hours)</option>
                        <option value="Q8H">Q8H (Every 8 hours)</option>
                        <option value="Q12H">Q12H (Every 12 hours)</option>
                        <option value="Daily">Daily</option>
                        <option value="BID">BID (Twice daily)</option>
                        <option value="TID">TID (Three times daily)</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="primary-btn">Administer</button>
                    <button type="button" class="secondary-btn" id="cancel-medication">Cancel</button>
                </div>
            </form>
        `;
        
        this.actionContentElement.innerHTML = html;
        
        // Add event listeners
        document.getElementById('medication-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const details = {
                medication: medication,
                category: category,
                dose: document.getElementById('medication-dose').value,
                route: document.getElementById('medication-route').value,
                frequency: document.getElementById('medication-frequency').value
            };
            this.administerMedication(details);
        });
        
        document.getElementById('cancel-medication').addEventListener('click', () => {
            this.showDrugsInterface();
        });
    }

    /**
     * Perform a physical examination
     * @param {String} component - The component to examine
     */
    async performExam(component) {
        try {
            // Disable buttons during processing
            this.disableButtons();
            
            // Process the exam action
            const result = await patientManager.processAction('physical_exam', { component: component });
            
            // Add result to the results log
            resultsManager.addExamResult(
                component, 
                result.result.description, 
                result.conditionChange && result.conditionChange.worsened
            );
            
            // Update score
            gameManager.updateScore(result.scoringImpact.points, result.scoringImpact.explanation);
            
            // Re-enable buttons
            this.enableButtons();
        } catch (error) {
            console.error('Error performing exam:', error);
            resultsManager.addStatusUpdate('Error performing examination. Please try again.', 'abnormal');
            this.enableButtons();
        }
    }

    /**
     * Order a laboratory test
     * @param {String} test - The test to order
     * @param {String} category - The test category
     */
    async orderLabTest(test, category) {
        try {
            // Disable buttons during processing
            this.disableButtons();
            
            // Process the lab test action
            const result = await patientManager.processAction('lab_test', { 
                test: test,
                category: category
            });
            
            // Add result to the results log
            // For individual tests
            if (test !== category) {
                const labResults = {};
                labResults[test] = result.result.values[test] || 'No result';
                resultsManager.addLabResult(test, labResults);
            } 
            // For panel tests (like "Complete Blood Count")
            else {
                resultsManager.addLabResult(category, result.result.values);
            }
            
            // Update score
            gameManager.updateScore(result.scoringImpact.points, result.scoringImpact.explanation);
            
            // Re-enable buttons
            this.enableButtons();
        } catch (error) {
            console.error('Error ordering lab test:', error);
            resultsManager.addStatusUpdate('Error ordering laboratory test. Please try again.', 'abnormal');
            this.enableButtons();
        }
    }

    /**
     * Administer medication
     * @param {Object} details - Medication details
     */
    async administerMedication(details) {
        try {
            // Disable buttons during processing
            this.disableButtons();
            
            // Process the medication action
            const result = await patientManager.processAction('medication', details);
            
            // Add result to the results log
            resultsManager.addMedicationResponse(
                `${details.medication} ${details.dose} ${details.route} ${details.frequency}`,
                result.result.description,
                !result.conditionChange.worsened
            );
            
            // Update score
            gameManager.updateScore(result.scoringImpact.points, result.scoringImpact.explanation);
            
            // Return to medications interface
            this.showDrugsInterface();
            
            // Re-enable buttons
            this.enableButtons();
        } catch (error) {
            console.error('Error administering medication:', error);
            resultsManager.addStatusUpdate('Error administering medication. Please try again.', 'abnormal');
            this.enableButtons();
        }
    }

    /**
     * Order imaging study
     * @param {String} imaging - The imaging study to order
     */
    async orderImaging(imaging) {
        try {
            // Disable buttons during processing
            this.disableButtons();
            
            // Process the imaging action
            const result = await patientManager.processAction('imaging', { study: imaging });
            
            // Add result to the results log
            resultsManager.addImagingResult(
                imaging,
                result.result.description,
                result.result.interpretation && result.result.interpretation.includes('abnormal')
            );
            
            // Update score
            gameManager.updateScore(result.scoringImpact.points, result.scoringImpact.explanation);
            
            // Re-enable buttons
            this.enableButtons();
        } catch (error) {
            console.error('Error ordering imaging:', error);
            resultsManager.addStatusUpdate('Error ordering imaging study. Please try again.', 'abnormal');
            this.enableButtons();
        }
    }

    /**
     * Request specialist consultation
     * @param {String} specialist - The specialist to consult
     */
    async requestConsultation(specialist) {
        try {
            // Disable buttons during processing
            this.disableButtons();
            
            // Process the consultation action
            const result = await patientManager.processAction('consultation', { specialist: specialist });
            
            // Add result to the results log
            resultsManager.addConsultationResult(specialist, result.result.description);
            
            // Update score
            gameManager.updateScore(result.scoringImpact.points, result.scoringImpact.explanation);
            
            // Re-enable buttons
            this.enableButtons();
        } catch (error) {
            console.error('Error requesting consultation:', error);
            resultsManager.addStatusUpdate('Error requesting consultation. Please try again.', 'abnormal');
            this.enableButtons();
        }
    }

    /**
     * Disable all action buttons during processing
     */
    disableButtons() {
        this.actionContentElement.querySelectorAll('button').forEach(button => {
            button.disabled = true;
            button.classList.add('disabled');
        });
    }

    /**
     * Enable all action buttons after processing
     */
    enableButtons() {
        this.actionContentElement.querySelectorAll('button').forEach(button => {
            button.disabled = false;
            button.classList.remove('disabled');
        });
    }

    /**
     * Reset the actions panel
     */
    reset() {
        this.currentAction = null;
        this.actionButtons.forEach(button => {
            button.classList.remove('active');
        });
        this.actionContentElement.innerHTML = '<p>Select an action to begin.</p>';
    }
}

// Create and export a single instance of the ActionsManager
const actionsManager = new ActionsManager();
