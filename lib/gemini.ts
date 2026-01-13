import { GoogleGenerativeAI, Part } from "@google/generative-ai"
import { fileToGenerativePart } from "./utils"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY as string)

/**
 * Get available models to debug model naming issues
 */
async function getAvailableModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`)
    const data = await response.json()
    console.log("Available models:", data.models?.map((m: any) => m.name))
    return data.models || []
  } catch (error) {
    console.error("Failed to fetch models:", error)
    return []
  }
}

/**
 * Process a question paper buffer with Gemini AI and return parsed questions
 */
export async function processQuestionPaperWithGemini(buffer: Buffer, mimeType: string) {
    // Try to get available models for debugging
    const availableModels = await getAvailableModels()
    
    // Use correct model names without the "models/" prefix
    // The SDK adds the prefix automatically
    // Using models from the available list
    const modelNames = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-2.5-pro",
      "gemini-2.0-flash-001",
      "gemini-2.0-flash-lite"
    ]
    
    let model
    let lastError
    
    for (const modelName of modelNames) {
      try {
        console.log(`Trying model: ${modelName}`)
        model = genAI.getGenerativeModel({ model: modelName })
        
        // Don't test with image first, just initialize
        console.log(`Successfully initialized model: ${modelName}`)
        break
      } catch (error: any) {
        console.log(`Model ${modelName} failed:`, error?.message || error)
        lastError = error
        model = undefined
        continue
      }
    }
    
    if (!model) {
      const availableModelsList = availableModels.map((m: any) => m.name).join(', ')
      throw new Error(
        `All models failed. Available models: ${availableModelsList || 'none found'}. ` +
        `Last error: ${lastError?.message || lastError}`
      )
    }

    const prompt = `
You are an AI assistant that extracts multiple-choice questions from a document.

Input: A document containing multiple-choice questions.

Instructions:
- Extract all questions from the document.
- For each question, provide:
  - "question": the question text.
  - "options": an array of strings with all options labeled (A., B., etc.).
  - "answer": the letter of the correct option (A, B, C, ...).
- Return a JSON array of objects in this exact format:

[
  {
    "question": "What is the capital of France?",
    "options": ["A. London", "B. Berlin", "C. Paris", "D. Madrid"],
    "answer": "C"
  }
]

Make sure the output is valid JSON without extra text or markdown.
`
    const imagePart: Part = fileToGenerativePart(buffer, mimeType)
    const result = await model.generateContent([prompt, imagePart])
    const text = result.response.text()

    // Clean code fences if any
    const cleanedJson = text.replace(/^```json\s*|```$/g, '').trim()
    const parsedData = JSON.parse(cleanedJson) as { question: string; options: string[]; answer: string }[]

    if (!Array.isArray(parsedData)) throw new Error("AI response was not a JSON array.")
    return parsedData
}