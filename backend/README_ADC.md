# Testing Application Default Credentials (ADC) for Gemini (Generative AI)

This file explains how to create a Service Account, enable ADC locally, and run a test script that lists available Gemini models using ADC.

Steps:

1. Enable the Generative Language API in your Google Cloud project and ensure billing is enabled.

2. Create a service account in Cloud Console and grant it the roles needed to call the Generative API (for testing, `Editor` is sufficient). For production, give least privilege required.

3. Create and download a JSON key for the service account.

4. Place the JSON file somewhere on your machine (for example `D:\codebase-qa\backend\sa-key.json`).

5. Set the environment variable `GOOGLE_APPLICATION_CREDENTIALS` to the JSON path. Examples:

PowerShell:

```
$Env:GOOGLE_APPLICATION_CREDENTIALS = 'D:\codebase-qa\backend\sa-key.json'
cd backend
node scripts/test_adc.js
```

Command Prompt (cmd.exe):

```
set GOOGLE_APPLICATION_CREDENTIALS=D:\codebase-qa\backend\sa-key.json
cd backend
node scripts/test_adc.js
```

Or set it in your OS environment variables permanently.

6. Run the test script above. It will attempt to obtain an access token via ADC and call the Generative Language API to list models. If successful you'll see HTTP 200 and the model list JSON.

Troubleshooting:
- If you get 401/403, verify the service account has permissions and the API is enabled.
- If you get network errors, ensure your machine can reach `generativelanguage.googleapis.com`.
