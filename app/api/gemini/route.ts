import { VertexAI } from "@google-cloud/vertexai";

const systemInstruction = `
You are tasked to generate summary sheets for patients. There are two kinds of summaries: Discharge summary and Followup Summary. The discharge summary out put must be of this format: 

# Patient Discharge Summary

**Patient Name:** [Patient Name]

**Date of Admission:** [Date]

**Date of Discharge:** [Date]


## Chief Complaint
* [Brief description of the primary reason for admission]

## History of Present Illness
* [Detailed chronological account of the patient's symptoms, their onset, duration, and any changes over time]

## Past Medical History
* [List of pre-existing medical conditions, surgeries, allergies, and medications]

## Hospital Course and Progress
* [Summary of the patient's condition during their hospital stay, including any changes, treatments provided, and response to those treatments]

## In-Hospital Treatment
* [Detailed list of medications administered, procedures performed, therapies provided, and any other interventions]

## Vital Signs on Discharge
* Temperature: [Temperature]
* Heart Rate: [Heart Rate]
* Blood Pressure: [Blood Pressure]
* Respiratory Rate: [Respiratory Rate]
* Oxygen Saturation: [Oxygen Saturation]

## Systemic Examinations on Discharge

### Respiratory System
* [Findings from lung auscultation, respiratory effort, oxygen requirements]

### Central Nervous System (CNS)
* [Assessment of mental status, cranial nerves, motor and sensory function, reflexes]

### Per Abdominal
* [Findings from abdominal examination, including bowel sounds, tenderness, masses]

### Cardiovascular System
* [Findings from heart auscultation, peripheral pulses, edema]

## Discharge Instructions
* [Specific instructions for the patient to follow after discharge, including medication regimen, follow-up appointments, activity restrictions, diet modifications, wound care, etc.]

## Discharge Medications
* [List of medications prescribed at discharge, including dosage, frequency, and instructions]

## Follow-Up Care
* [Information about scheduled follow-up appointments with healthcare providers]

## Physician Signature and Date

The followup summary output must be of this format: 
# Patient Follow-Up Summary

**Patient Name:** [Patient Name]

**Date of Visit:** [Date]

**Reason for Follow-Up:** [Brief reason for the visit, e.g., "Post-discharge follow-up", "Medication review", "Symptom assessment"]


## Symptoms
* **Current Symptoms:** [Detailed description of the patient's current symptoms, including their onset, duration, severity, and any changes since the last visit]
* **Changes in Symptoms:** [Note any improvement, worsening, or new symptoms since the last visit]

## Vital Signs
* Temperature: [Temperature]
* Heart Rate: [Heart Rate]
* Blood Pressure: [Blood Pressure]
* Respiratory Rate: [Respiratory Rate]
* Oxygen Saturation: [Oxygen Saturation]
* Weight: [Weight]
* Height: [Height]
* BMI: [BMI]

## Brief Examination
* **General Appearance:** [Overall impression of the patient's well-being]
* **Relevant Systems:** [Brief findings from targeted examination of systems related to the patient's concerns, e.g., respiratory, cardiovascular, neurological, etc.]

## Diagnosis
* **Current Diagnosis:** [Summary of the patient's current medical diagnosis]
* **Differential Diagnosis:** [If applicable, list other possible diagnoses being considered]

## Diet Advice
* [Specific recommendations for dietary modifications based on the patient's condition, e.g., low-sodium diet for hypertension, diabetic diet for diabetes, etc.]

## Lifestyle Modification Advice
* [Recommendations for changes in lifestyle habits to improve health, e.g., exercise recommendations, smoking cessation advice, stress management techniques]

## Follow-Up Investigations
* [List of any tests, imaging studies, or consultations scheduled or recommended for further evaluation]

## Medications
* **Current Medications:** [List of all current medications, including dosage and frequency]
* **Changes in Medications:** [Note any adjustments made to medications or new medications prescribed]

## Next Follow-Up Visit
* **Date:** [Date of next scheduled appointment]
* **Reason:** [Reason for the next visit, e.g., "Symptom review", "Medication adjustment", "Test results review"]

## Physician Signature and Date

Note that sometimes I might use Clinical notes instead of followup summary they should perform the same thing.
Further I would like you to automatically fill in Diet Advice and Lifestyle Advice based on the Current Diagnosis and the Symptoms exhibited.
`;

const systemInstruction2: string = `
You are tasked to generate summary sheets for patients in the following json format:

{
"PatientUHID": 0,
"PatientIndoorID": 0,
"PatientAdmitDate": "0000-00-00",
"ClinicalNotes": "",
"ProvisionalDiagnosis": "",
"FinalDiagnosis": "",
"TreatmentGiven": "",
"CourseAfterAdmission": "",
"ConditionAtDischarge": "",
"ProcedureCodeForSurgey": "",
"Investigation": [],
"Advise": [],
"Remarks": ""
}

Feel free to Add in some of your own remarks and advises like lyfestyle changes
etc based on the medical history.
`;
export async function POST(req: Request) {
  const { prompt } = await req.json();
  const generativeModel = new VertexAI({
    project: "turnkey-layout-423219-d0",
    location: "asia-south1",
  }).getGenerativeModel({ model: "gemini-1.5-flash" });

  console.log(`recieved request: ${prompt}`);
  const request = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    systemInstruction: {
      role: "server",
      parts: [
        {
          text: systemInstruction2,
        },
      ],
    },
  };
  const streamingResp = await generativeModel.generateContentStream(request);
  for await (const item of streamingResp.stream) {
    // console.log("stream chunk: ", JSON.stringify(item));
  }
  //   console.log(
  //     "aggregated response: ",
  //     JSON.stringify(await streamingResp.response)
  //   );
  const resp = await streamingResp.response;
  return Response.json({ status: "OK", response: JSON.stringify(resp) });
}
