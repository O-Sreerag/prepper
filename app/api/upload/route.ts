import { NextResponse } from "next/server"
import { GoogleGenerativeAI, Part } from "@google/generative-ai"

// Get API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)

/**
 * Converts a file buffer to a GoogleGenerativeAI.Part object.
 * @param {Buffer} buffer The file buffer.
 * @param {string} mimeType The MIME type of the file.
 * @returns {GoogleGenerativeAI.Part} The Part object for the API call.
 */
function fileToGenerativePart(buffer: Buffer, mimeType: string): Part {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  }
}

export async function POST(request: Request) {
  const data = await request.formData()
  const file: File | null = data.get("file") as unknown as File

  if (!file) {
    return NextResponse.json({ success: false, error: "No file provided." }, { status: 400 })
  }

  // Convert file to buffer
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Use a generative model that supports vision
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  // Prompt for question extraction
  const prompt = `
    Extract all questions from this document. For each question, provide:
    - The question text.
    - The multiple-choice options.
    - The correct answer's letter (e.g., "A", "B", "C").
    - A brief explanation (if available, otherwise null).
    Return the data as a structured JSON array, like this:
    [
      {
        "question": "What is the capital of France?",
        "options": ["A. London", "B. Berlin", "C. Paris", "D. Madrid"],
        "answer": "C",
        "explanation": "Paris is the capital and most populous city of France."
      }
    ]
  `

  // Create the image part for the API call
  const imagePart = fileToGenerativePart(buffer, file.type)

  try {
    // Generate content using the prompt and the image
    const result = await model.generateContent([prompt, imagePart])
    const response = result.response
    const text = response.text()

    // Assuming the response is a JSON string, parse it
    const structuredQuestions = JSON.parse(text)

    return NextResponse.json({
      success: true,
      data: structuredQuestions,
    })
  } catch (error) {
    console.error("Gemini API call failed:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process the document with AI." },
      { status: 500 },
    )
  }
}