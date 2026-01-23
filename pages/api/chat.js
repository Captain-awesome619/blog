// pages/api/chat.js
import { CohereClientV2 } from "cohere-ai";

const cohere = new CohereClientV2({
  token: process.env.NEXT_COHERE_KEY,
});

/* -------------------------------------------
   Helper: Split article into numbered paragraphs
-------------------------------------------- */
function buildParagraphs(articleText = "") {
  return articleText
    .split(/\n\s*\n/) // split by blank lines
    .map((text, index) => ({
      id: index + 1,
      text: text.trim(),
    }))
    .filter((p) => p.text.length > 0);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, article } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res
        .status(400)
        .json({ error: "Missing or invalid messages array" });
    }

    if (!article || typeof article !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid article content" });
    }

    const paragraphs = buildParagraphs(article);

    const systemPrompt = `
You are an intelligent assistant embedded in an article-reading experience.

Your priority is to answer questions using the article below when the question is related to it.
If the article contains the answer, you MUST use it and cite the relevant paragraph numbers.

ARTICLE PARAGRAPHS:
${paragraphs.map((p) => `[${p.id}] ${p.text}`).join("\n\n")}

Answering Rules:

1. Article-related questions
- If the question is about the article content, concepts mentioned, or facts discussed:
  - Answer using ONLY the article paragraphs
  - After every factual statement, include paragraph citations in square brackets (e.g. [1])
  - If multiple paragraphs apply, cite all relevant ones (e.g. [1, 3])
  - Do NOT invent citations

2. General questions
- If the question is NOT answered by the article:
  - You may answer using general knowledge
  - Do NOT include paragraph citations
  - Do NOT imply the article contains this information
  - Keep the answer concise and clear

3. Missing article information
- If the question asks about the article but the information is not present:
  - Say: "This information is not mentioned in the current article."
  - You may then provide a brief general explanation if helpful

4. Writing style
- Use clear, friendly English
- Avoid unnecessary symbols or formatting
- Be helpful but accurate
`;
    const cohereMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];
    const response = await cohere.chat({
      model: "command-a-03-2025",
      messages: cohereMessages,
    });

    res.status(200).json({
      reply: response.message,
    });
  } catch (error) {
    console.error("Cohere API Error:", error);
    res.status(500).json({ error: "Cohere API request failed" });
  }
}
