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
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function giveHints(
  code,
  error = "no error",
  prompt = "you itself understand"
) {
  try {
    const completePrompt = `${prompt}, with that in mind check this code ${code} and it shows these errors ${error} give me only the hint where the error is and guide me to think in the right way to debug it without directly giving me the answer. if there are no errors then just say "Awesome there are no errors in this code ✨" and nothing else how many times i ask.`;

    const result = await model.generateContent(completePrompt);
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
