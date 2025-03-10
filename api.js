/**
 * API integration for Vital Decisions: Resident's Challenge
 * Handles communication with the PPQ.AI service
 */

class ApiService {
    constructor() {
        this.apiKey = "sk-e69yagfy1LbeuHU7wUpAIg";
        this.url = "https://api.ppq.ai/chat/completions";
        this.model = "claude-3.5-sonnet";
    }

    /**
     * Send a request to the API
     * @param {Array} messages - Array of message objects in the format {role: "user"|"assistant", content: string}
     * @returns {Promise} - Promise that resolves with the API response
     */
    async sendRequest(messages) {
        try {
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKey}`
            };

            const data = {
                model: this.model,
                messages: messages
            };

            const response = await fetch(this.url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    /**
     * Generate a new patient with a medical condition
     * @param {Object} parameters - Parameters for patient generation (age, gender, etc.)
     * @returns {Promise} - Promise that resolves with the patient data
     */
    async generatePatient(parameters = {}) {
        const systemPrompt = `You are a medical AI that generates realistic patient cases for a medical diagnostic game. Create a patient with a specific internal medicine condition, including relevant history, physical exam findings, vital signs, and labs that would be consistent with the condition. Format the response as a JSON object with the following structure:
        {
            "patientInfo": {
                "name": "Patient's name",
                "age": age,
                "gender": "gender",
                "medicalHistory": ["relevant history points"],
                "chiefComplaint": "chief complaint"
            },
            "vitalSigns": {
                "heartRate": number,
                "bloodPressure": {
                    "systolic": number,
                    "diastolic": number
                },
                "respiratoryRate": number,
                "temperature": number (in Celsius),
                "oxygenSaturation": number (percentage)
            },
            "condition": {
                "name": "actual medical condition",
                "severity": "mild/moderate/severe",
                "duration": "time since onset"
            }
        }
        
        Ensure the vital signs are realistic and consistent with the condition. Focus on internal medicine conditions at a level appropriate for a resident physician. Make the case challenging but diagnosable with appropriate history, physical findings, and relevant tests.`;

        const userPrompt = `Generate a new patient case with the following parameters: ${JSON.stringify(parameters)}. Make sure all vitals and findings are consistent with the underlying condition but do not make the diagnosis too obvious.`;

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ];

        const response = await this.sendRequest(messages);
        
        try {
            // Extract JSON from the response
            const responseContent = response.choices[0].message.content;
            const patientData = JSON.parse(responseContent);
            return patientData;
        } catch (error) {
            console.error('Error parsing patient data:', error);
            throw new Error('Failed to generate patient data');
        }
    }

    /**
     * Process a player action and get the response
     * @param {Object} patientData - Current patient data
     * @param {String} action - The action taken by the player
     * @param {Object} actionDetails - Details of the action (e.g., medication dosage)
     * @returns {Promise} - Promise that resolves with the action results
     */
    async processAction(patientData, action, actionDetails) {
        const systemPrompt = `You are a medical AI that simulates patient responses to diagnostic and treatment actions in a medical simulation game. Respond with realistic clinical outcomes based on the patient's condition and the action taken. Format your response as a JSON object with:
        {
            "result": {
                "description": "Detailed description of findings or results",
                "interpretation": "Brief medical interpretation when relevant",
                "values": {object with any relevant numeric values or findings}
            },
            "vitalSignsChange": {
                "heartRate": number or null (if no change),
                "bloodPressure": {
                    "systolic": number or null,
                    "diastolic": number or null
                },
                "respiratoryRate": number or null,
                "temperature": number or null,
                "oxygenSaturation": number or null
            },
            "conditionChange": {
                "improved": boolean,
                "worsened": boolean,
                "description": "Description of any change in condition"
            },
            "scoringImpact": {
                "points": number (negative for mistakes, 0 for neutral actions),
                "explanation": "Brief explanation of scoring impact"
            }
        }
        
        Make the responses medically accurate and consistent with what would be expected in a real patient with the given condition.`;

        const userPrompt = `Current patient: ${JSON.stringify(patientData)}
        
        Player action: ${action}
        Action details: ${JSON.stringify(actionDetails)}
        
        Provide a realistic response to this action, including any changes to vital signs, condition status, and impact on scoring.`;

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ];

        const response = await this.sendRequest(messages);
        
        try {
            // Extract JSON from the response
            const responseContent = response.choices[0].message.content;
            const actionResult = JSON.parse(responseContent);
            return actionResult;
        } catch (error) {
            console.error('Error parsing action result:', error);
            throw new Error('Failed to process action');
        }
    }
}

// Create and export a single instance of the API service
const apiService = new ApiService();
