# Patient Summary Generator

The Patient Summary Generator is a powerful tool designed to assist healthcare professionals in generating well-formatted patient summaries using AI. This application leverages a chat-like interface for entering patient details and offers a range of features to streamline the process of documenting patient information.

## Features

1. **Chat-Like Structure:**
   - Enter your prompt mentioning the patient's name, age, diagnosis, symptoms, history, etc., to generate a well-formatted AI-completed patient summary.
2. **Editable Prompts:**

   - Ability to edit the prompts before generating the patient summary.

3. **Copy and Paste with Formatting:**

   - You can copy the formatted output and paste it into any Rich Text Editor like Word or Google Docs, retaining all formatting.

4. **Local Storage of Prompts:**

   - Saves all your past prompts in localStorage, allowing you to manage your previous prompts and responses and maintain a record.

5. **Delete Unwanted Prompts:**
   - Easily delete unwanted prompts to keep your records organized.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/1611Dhruv/patient-app.git
   cd patient-app
   ```

2. Install the dependencies:

   ```bash
   npm i
   ```

3. Start the application:
   ```bash
   npm run build
   npm run start
   ```

### Usage

1. Create a project on [Cloud Console](https://cloud.google.com) and generate your own key. Refer to [Google's documentation on Service Accounts](https://cloud.google.com/iam/docs/keys-create-delete) for more information. Once you have created your account, go ahead and update the GOOGLE_APPLICATION_CREDENTIALS, PROJECT_ID, and LOCATION variables accordingly in the .env file. GOOGLE_APPLICATION_CREDENTIALS should be assigned to the path of your service account's .json key file, PROJECT_ID should be the name of your google cloud project, and LOCATION should be one of the locations for google (default is asia-south1 (Mumbai)). [More about GCP locations](https://cloud.google.com/about/locations)
2. Open your browser and navigate to `http://localhost:3000`.
3. Enter the patient's details in the chat-like interface.
4. Edit the prompt if necessary.
5. Generate the patient summary.
6. Copy the formatted output and paste it into any Rich Text Editor.
7. Manage your prompts using the localStorage feature – view, edit, or delete past prompts.
8. If you want to update the systemInstructions given to the AI, feel free to edit the systemInstruction variable in app/api/gemini/route.ts

## Contact

If you have any questions or feedback, please feel free to contact me at [ddesai7@wisc.edu].
