/**
 * Results module for Vital Decisions: Resident's Challenge
 * Handles display of vital signs and test results
 */

class ResultsManager {
    constructor() {
        // DOM elements for vital signs
        this.heartRateElement = document.getElementById('heart-rate');
        this.bloodPressureElement = document.getElementById('blood-pressure');
        this.mapElement = document.getElementById('mean-arterial-pressure');
        this.respiratoryRateElement = document.getElementById('respiratory-rate');
        this.temperatureElement = document.getElementById('temperature');
        this.oxygenSaturationElement = document.getElementById('oxygen-saturation');
        
        // Results log element
        this.resultsLogElement = document.getElementById('results-log');
        
        // Initialize event listeners
        this.initEventListeners();
    }

    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Listen for vital signs updates
        document.addEventListener('vitalsUpdated', (event) => {
            this.updateVitalSigns(event.detail);
        });
    }

    /**
     * Update vital signs display
     * @param {Object} vitals - Current vital signs
     */
    updateVitalSigns(vitals) {
        // Update heart rate with proper styling based on normal ranges
        this.heartRateElement.textContent = vitals.heartRate;
        this.setVitalSignStyling(
            this.heartRateElement, 
            vitals.heartRate, 
            gameData.vitalSignRanges.heartRate.min, 
            gameData.vitalSignRanges.heartRate.max
        );
        
        // Update blood pressure
        const bpText = `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`;
        this.bloodPressureElement.textContent = bpText;
        const systolicNormal = (
            vitals.bloodPressure.systolic >= gameData.vitalSignRanges.bloodPressure.systolic.min && 
            vitals.bloodPressure.systolic <= gameData.vitalSignRanges.bloodPressure.systolic.max
        );
        const diastolicNormal = (
            vitals.bloodPressure.diastolic >= gameData.vitalSignRanges.bloodPressure.diastolic.min && 
            vitals.bloodPressure.diastolic <= gameData.vitalSignRanges.bloodPressure.diastolic.max
        );
        this.bloodPressureElement.className = 'vital-value';
        if (!systolicNormal || !diastolicNormal) {
            this.bloodPressureElement.classList.add(
                vitals.bloodPressure.systolic > gameData.vitalSignRanges.bloodPressure.systolic.max || 
                vitals.bloodPressure.diastolic > gameData.vitalSignRanges.bloodPressure.diastolic.max 
                    ? 'high' : 'low'
            );
        }
        
        // Calculate and update MAP if not provided
        const map = vitals.meanArterialPressure || 
            Math.round((vitals.bloodPressure.diastolic * 2 + vitals.bloodPressure.systolic) / 3);
        this.mapElement.textContent = map;
        this.setVitalSignStyling(
            this.mapElement, 
            map, 
            gameData.vitalSignRanges.meanArterialPressure.min, 
            gameData.vitalSignRanges.meanArterialPressure.max
        );
        
        // Update respiratory rate
        this.respiratoryRateElement.textContent = vitals.respiratoryRate;
        this.setVitalSignStyling(
            this.respiratoryRateElement, 
            vitals.respiratoryRate, 
            gameData.vitalSignRanges.respiratoryRate.min, 
            gameData.vitalSignRanges.respiratoryRate.max
        );
        
        // Update temperature (convert to one decimal place)
        this.temperatureElement.textContent = vitals.temperature.toFixed(1);
        this.setVitalSignStyling(
            this.temperatureElement, 
            vitals.temperature, 
            gameData.vitalSignRanges.temperature.min, 
            gameData.vitalSignRanges.temperature.max
        );
        
        // Update oxygen saturation
        this.oxygenSaturationElement.textContent = vitals.oxygenSaturation + '%';
        this.setVitalSignStyling(
            this.oxygenSaturationElement, 
            vitals.oxygenSaturation, 
            gameData.vitalSignRanges.oxygenSaturation.min, 
            gameData.vitalSignRanges.oxygenSaturation.max
        );
    }

    /**
     * Set styling for vital sign based on normal ranges
     * @param {Element} element - DOM element to style
     * @param {Number} value - Current value
     * @param {Number} min - Minimum normal value
     * @param {Number} max - Maximum normal value
     */
    setVitalSignStyling(element, value, min, max) {
        // Reset classes
        element.className = 'vital-value';
        
        // Add appropriate class based on value
        if (value < min) {
            element.classList.add('low');
        } else if (value > max) {
            element.classList.add('high');
        }
    }

    /**
     * Add a result entry to the results log
     * @param {String} type - Type of result (e.g., 'lab', 'exam', 'update')
     * @param {String} title - Title of the result
     * @param {String} content - Content of the result
     * @param {String} status - Status of the result ('normal', 'abnormal', 'info')
     */
    addResultEntry(type, title, content, status = 'info') {
        // Create result entry container
        const entryDiv = document.createElement('div');
        entryDiv.className = `log-entry log-entry-${status}`;
        
        // Add timestamp
        const timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        timestamp.textContent = this.formatGameTime(patientManager.timeElapsed);
        entryDiv.appendChild(timestamp);
        
        // Add title
        const titleElement = document.createElement('h3');
        titleElement.textContent = `${type}: ${title}`;
        entryDiv.appendChild(titleElement);
        
        // Add content
        const contentElement = document.createElement('div');
        contentElement.className = 'log-content';
        contentElement.innerHTML = content;
        entryDiv.appendChild(contentElement);
        
        // Add to log at the top
        this.resultsLogElement.insertBefore(entryDiv, this.resultsLogElement.firstChild);
    }

    /**
     * Add a lab result to the results log
     * @param {String} labName - Name of the lab test
     * @param {Object} results - Lab results
     */
    addLabResult(labName, results) {
        // Convert results to HTML
        let contentHtml = '<table class="results-table">';
        
        // Add table headers
        contentHtml += '<tr><th>Test</th><th>Result</th><th>Reference Range</th></tr>';
        
        // Track if any abnormal results
        let hasAbnormalResults = false;
        
        // Add each result
        for (const [test, value] of Object.entries(results)) {
            if (gameData.labRanges[test]) {
                const range = gameData.labRanges[test];
                const isNormal = value >= range.min && value <= range.max;
                if (!isNormal) hasAbnormalResults = true;
                
                contentHtml += `
                    <tr class="${isNormal ? 'normal' : 'abnormal'}">
                        <td>${test}</td>
                        <td>${value} ${range.unit}</td>
                        <td>${range.min} - ${range.max} ${range.unit}</td>
                    </tr>
                `;
            } else {
                // For tests without defined ranges
                contentHtml += `
                    <tr>
                        <td>${test}</td>
                        <td colspan="2">${value}</td>
                    </tr>
                `;
            }
        }
        
        contentHtml += '</table>';
        
        // Add to results log
        this.addResultEntry(
            'Lab Result', 
            labName, 
            contentHtml, 
            hasAbnormalResults ? 'abnormal' : 'normal'
        );
    }

    /**
     * Add an imaging result to the results log
     * @param {String} imagingType - Type of imaging
     * @param {String} result - Imaging result text
     * @param {Boolean} hasFindings - Whether abnormal findings were noted
     */
    addImagingResult(imagingType, result, hasFindings) {
        this.addResultEntry(
            'Imaging', 
            imagingType, 
            `<p>${result}</p>`, 
            hasFindings ? 'abnormal' : 'normal'
        );
    }

    /**
     * Add a physical exam result to the results log
     * @param {String} examComponent - Component of the exam
     * @param {String} result - Exam findings
     * @param {Boolean} hasAbnormalFindings - Whether abnormal findings were noted
     */
    addExamResult(examComponent, result, hasAbnormalFindings) {
        this.addResultEntry(
            'Physical Exam', 
            examComponent, 
            `<p>${result}</p>`, 
            hasAbnormalFindings ? 'abnormal' : 'normal'
        );
    }

    /**
     * Add a medication response to the results log
     * @param {String} medication - Medication name
     * @param {String} response - Patient's response
     * @param {Boolean} isPositive - Whether the response is positive
     */
    addMedicationResponse(medication, response, isPositive) {
        this.addResultEntry(
            'Medication', 
            medication, 
            `<p>${response}</p>`, 
            isPositive ? 'normal' : 'abnormal'
        );
    }

    /**
     * Add a consultation result to the results log
     * @param {String} specialist - Specialist consulted
     * @param {String} response - Consultant's response
     */
    addConsultationResult(specialist, response) {
        this.addResultEntry(
            'Consultation', 
            specialist, 
            `<p>${response}</p>`, 
            'info'
        );
    }

    /**
     * Add a general status update to the results log
     * @param {String} update - Update text
     * @param {String} status - Status type ('info', 'normal', 'abnormal')
     */
    addStatusUpdate(update, status = 'info') {
        this.addResultEntry(
            'Status Update', 
            'Patient Condition', 
            `<p>${update}</p>`, 
            status
        );
    }

    /**
     * Format game time for display
     * @param {Number} seconds - Time in seconds
     * @returns {String} - Formatted time string (MM:SS)
     */
    formatGameTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    /**
     * Clear the results log
     */
    clearResults() {
        this.resultsLogElement.innerHTML = '';
        
        // Reset vital signs display
        this.heartRateElement.textContent = '--';
        this.bloodPressureElement.textContent = '--/--';
        this.mapElement.textContent = '--';
        this.respiratoryRateElement.textContent = '--';
        this.temperatureElement.textContent = '--';
        this.oxygenSaturationElement.textContent = '--';
        
        // Remove any styling classes
        this.heartRateElement.className = 'vital-value';
        this.bloodPressureElement.className = 'vital-value';
        this.mapElement.className = 'vital-value';
        this.respiratoryRateElement.className = 'vital-value';
        this.temperatureElement.className = 'vital-value';
        this.oxygenSaturationElement.className = 'vital-value';
    }
}

// Create and export a single instance of the ResultsManager
const resultsManager = new ResultsManager();
