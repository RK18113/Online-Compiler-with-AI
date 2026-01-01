import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configure dotenv
dotenv.config();

// Get API key from environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not defined in environment variables");
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
  generationConfig: {
    temperature: 0.4,
    topP: 1,
    topK: 32,
    maxOutputTokens: 4096,
  },
  systemInstruction: `
You are an expert coding assistant and mentor. Your goal is to guide the user to find bugs in their code without directly giving them the solution code.

1. If the user provides code and an error, analyze the code to find the cause of the error.
2. Provide a HINT about where the error is and the concept involved.
3. Guide the user's thinking with a question or a pointer.
4. DO NOT write the corrected code snippet.
5. If there are NO errors, simply respond with:
"Awesome there are no errors in this code ✨"
`,
});

export async function giveHints(
  code,
  error = "no error",
  prompt = "you itself understand"
) {
  try {
    const userMessage = `My code is:\n\`\`\`\n${code}\n\`\`\`\n\nThe error/issue is: ${error}\n\nContext/Prompt: ${prompt}`;

    const result = await model.generateContent(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("Error in giveHints:", error);
    throw error;
  }
}

export async function analyseCode(req, res, next) {
  try {
    const { code, error, prompt } = req.body;
    console.log("Analyzing code:", { code, error, prompt });

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "No code provided",
      });
    }

    const hint = await giveHints(code, error, prompt);

    return res.status(200).json({
      success: true,
      hint: hint,
    });
  } catch (error) {
    console.error("Error in analyseCode:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate hints",
      details: error.message,
    });
  }
}
