// pages/api/chat.js
import { CohereClient, CohereClientV2 } from "cohere-ai";

const cohere = new CohereClientV2({
  token: process.env.NEXT_COHERE_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing or invalid messages array" });
    }

    // Call Cohere’s Chat API
    const response = await cohere.chat({
      model:  'command-a-03-2025', // Cohere’s chat model
      messages,           // array of user/assistant messages
    });

    // response.message = latest assistant reply
    res.status(200).json({ reply: response.message });
  } catch (error) {
    console.error("Cohere API Error:", error);
    res.status(500).json({ error: "Cohere API request failed" });
  }
}
