import { GoogleGenerativeAI, Part } from "@google/generative-ai"
import { fileToGenerativePart } from "./utils"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)

/**
 * Process a question paper buffer with Gemini AI and return parsed questions
 */
export async function processQuestionPaperWithGemini(buffer: Buffer, mimeType: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }) // Ensure valid model
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
