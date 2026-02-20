// Load environment variables
// require("dotenv").config({ path: __dirname + "/../../.env" });
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini correctly (API key must be passed as STRING)
let genAI;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.info("Using Application Default Credentials (ADC)");
  genAI = new GoogleGenerativeAI();
} else {
  console.info("Using API key from .env");
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Use stable public model
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash";

const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
});

exports.askLLM = async (question, context) => {
  const prompt = `You are analyzing a codebase to answer questions about it.

Use ONLY the provided code context to answer the question.
Be specific and reference exact file paths and line numbers.

CODE CONTEXT:
${context}

QUESTION:
${question}

Provide a clear, concise answer with specific references to the code.`;

  try {
    console.log("Using model:", MODEL_NAME);
    console.log("Gemini key loaded:", !!process.env.GEMINI_API_KEY);

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = response.text();

    return text;
  } catch (err) {
    console.error("LLM Error:", err);
    throw new Error(
      "Failed to get response from LLM: " +
        (err?.message || JSON.stringify(err))
    );
  }
};