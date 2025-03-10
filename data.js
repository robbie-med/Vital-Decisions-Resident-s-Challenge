/**
 * Data module for Vital Decisions: Resident's Challenge
 * Contains reference data for labs, medications, and normal values
 */

const gameData = {
    // Normal ranges for common lab values
    labRanges: {
        // Complete Blood Count
        "WBC": { min: 4.5, max: 11.0, unit: "x10^9/L" },
        "RBC": { min: 4.5, max: 5.9, unit: "x10^12/L" },
        "Hemoglobin": { min: 13.5, max: 17.5, unit: "g/dL" },
        "Hematocrit": { min: 41, max: 53, unit: "%" },
        "Platelets": { min: 150, max: 450, unit: "x10^9/L" },
        
        // Basic Metabolic Panel
        "Sodium": { min: 135, max: 145, unit: "mmol/L" },
        "Potassium": { min: 3.5, max: 5.0, unit: "mmol/L" },
        "Chloride": { min: 96, max: 106, unit: "mmol/L" },
        "CO2": { min: 23, max: 29, unit: "mmol/L" },
        "BUN": { min: 7, max: 20, unit: "mg/dL" },
        "Creatinine": { min: 0.6, max: 1.2, unit: "mg/dL" },
        "Glucose": { min: 70, max: 100, unit: "mg/dL" },
        "Calcium": { min: 8.5, max: 10.5, unit: "mg/dL" },
        
        // Liver Function Tests
        "AST": { min: 5, max: 40, unit: "U/L" },
        "ALT": { min: 7, max: 56, unit: "U/L" },
        "ALP": { min: 44, max: 147, unit: "U/L" },
        "Total Bilirubin": { min: 0.1, max: 1.2, unit: "mg/dL" },
        "Direct Bilirubin": { min: 0.0, max: 0.3, unit: "mg/dL" },
        "Albumin": { min: 3.4, max: 5.4, unit: "g/dL" },
        "Total Protein": { min: 6.0, max: 8.3, unit: "g/dL" },
        
        // Cardiac Markers
        "Troponin I": { min: 0.00, max: 0.04, unit: "ng/mL" },
        "Troponin T": { min: 0.00, max: 0.01, unit: "ng/mL" },
        "CK-MB": { min: 0, max: 3.6, unit: "ng/mL" },
        "BNP": { min: 0, max: 100, unit: "pg/mL" },
        
        // Coagulation Studies
        "PT": { min: 11.0, max: 13.5, unit: "sec" },
        "INR": { min: 0.8, max: 1.2, unit: "" },
        "PTT": { min: 25, max: 35, unit: "sec" },
        
        // Arterial Blood Gas
        "pH": { min: 7.35, max: 7.45, unit: "" },
        "PaCO2": { min: 35, max: 45, unit: "mmHg" },
        "PaO2": { min: 80, max: 100, unit: "mmHg" },
        "HCO3": { min: 22, max: 26, unit: "mmol/L" },
        
        // Inflammatory Markers
        "ESR": { min: 0, max: 15, unit: "mm/hr" },
        "CRP": { min: 0, max: 10, unit: "mg/L" },
        
        // Other Common Tests
        "Lactate": { min: 0.5, max: 2.2, unit: "mmol/L" },
        "Ammonia": { min: 15, max: 45, unit: "μmol/L" },
        "Lipase": { min: 0, max: 160, unit: "U/L" },
        "Amylase": { min: 30, max: 110, unit: "U/L" }
    },
    
    // Available lab test categories
    labTests: {
        "Complete Blood Count": [
            "WBC", "RBC", "Hemoglobin", "Hematocrit", "Platelets", "Differential"
        ],
        "Basic Metabolic Panel": [
            "Sodium", "Potassium", "Chloride", "CO2", "BUN", "Creatinine", "Glucose", "Calcium"
        ],
        "Comprehensive Metabolic Panel": [
            "Sodium", "Potassium", "Chloride", "CO2", "BUN", "Creatinine", "Glucose", "Calcium",
            "AST", "ALT", "ALP", "Total Bilirubin", "Albumin", "Total Protein"
        ],
        "Liver Function Tests": [
            "AST", "ALT", "ALP", "Total Bilirubin", "Direct Bilirubin", "Albumin", "Total Protein"
        ],
        "Cardiac Markers": [
            "Troponin I", "Troponin T", "CK-MB", "BNP"
        ],
        "Coagulation Studies": [
            "PT", "INR", "PTT"
        ],
        "Arterial Blood Gas": [
            "pH", "PaCO2", "PaO2", "HCO3", "Base Excess", "Lactate"
        ],
        "Inflammatory Markers": [
            "ESR", "CRP"
        ],
        "Other Tests": [
            "Lactate", "Ammonia", "Lipase", "Amylase", "Urinalysis"
        ]
    },
    
    // Available imaging studies
    imagingStudies: [
        "Chest X-ray",
        "Abdominal X-ray",
        "Head CT",
        "Chest CT",
        "Abdominal CT",
        "Brain MRI",
        "Spine MRI",
        "Abdominal Ultrasound",
        "Echocardiogram",
        "Doppler Ultrasound",
        "CT Angiogram"
    ],
    
    // Common medication categories
    medicationCategories: {
        "Antibiotics": [
            "Amoxicillin", "Azithromycin", "Ceftriaxone", "Ciprofloxacin", "Doxycycline",
            "Levofloxacin", "Meropenem", "Piperacillin-Tazobactam", "Vancomycin"
        ],
        "Cardiovascular": [
            "Amlodipine", "Atenolol", "Carvedilol", "Digoxin", "Enalapril", "Furosemide",
            "Hydralazine", "Lisinopril", "Metoprolol", "Nitroglycerin", "Warfarin"
        ],
        "Respiratory": [
            "Albuterol", "Budesonide", "Fluticasone", "Ipratropium", "Montelukast",
            "Prednisone", "Salmeterol", "Tiotropium"
        ],
        "Gastrointestinal": [
            "Famotidine", "Metoclopramide", "Omeprazole", "Ondansetron", "Pantoprazole",
            "Polyethylene Glycol", "Sucralfate"
        ],
        "Neurological": [
            "Gabapentin", "Levetiracetam", "Lorazepam", "Phenytoin", "Sertraline",
            "Sumatriptan", "Topiramate"
        ],
        "Pain Management": [
            "Acetaminophen", "Hydromorphone", "Ibuprofen", "Ketorolac", "Morphine",
            "Naproxen", "Oxycodone", "Tramadol"
        ],
        "Fluids": [
            "Normal Saline", "Lactated Ringer's", "D5W", "D5NS", "D5 1/2NS"
        ],
        "Other": [
            "Insulin (Regular)", "Insulin (Lantus)", "Methylprednisolone", "Diphenhydramine",
            "Epinephrine", "Heparin", "Enoxaparin", "Hydrocortisone"
        ]
    },
    
    // Vital signs normal ranges
    vitalSignRanges: {
        "heartRate": { min: 60, max: 100, unit: "bpm" },
        "bloodPressure": { 
            "systolic": { min: 90, max: 140, unit: "mmHg" },
            "diastolic": { min: 60, max: 90, unit: "mmHg" }
        },
        "meanArterialPressure": { min: 70, max: 100, unit: "mmHg" },
        "respiratoryRate": { min: 12, max: 20, unit: "breaths/min" },
        "temperature": { min: 36.5, max: 37.5, unit: "°C" },
        "oxygenSaturation": { min: 95, max: 100, unit: "%" }
    },
    
    // Available physical exam components
    physicalExamComponents: [
        "General Appearance",
        "HEENT (Head, Eyes, Ears, Nose, Throat)",
        "Neck",
        "Cardiovascular",
        "Pulmonary",
        "Abdominal",
        "Extremities",
        "Neurological",
        "Skin"
    ],
    
    // Available specialist consultations
    consultations: [
        "Cardiology",
        "Pulmonology",
        "Gastroenterology",
        "Neurology",
        "Nephrology",
        "Infectious Disease",
        "Hematology",
        "Endocrinology",
        "General Surgery",
        "Orthopedic Surgery",
        "Critical Care"
    ]
};
