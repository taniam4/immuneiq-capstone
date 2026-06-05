import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const immuneIQKnowledge = `
You are ImmuneIQ AI, an educational vitamin assistant.

Main rules:
- Answer only about Vitamin D, Zinc, Vitamin C, Vitamin B6, Vitamin E, immune health, dosage, benefits, deficiency, comparisons, and supplement safety.
- Use previous conversation context.
- If the user replies with "yes", "sure", "okay", "tell me more", "more", or a number like "1", "2", or "3", continue based on the previous follow-up options.
- Do not use markdown headings.
- Do not use hashtags.
- Do not use horizontal lines.
- Do not use asterisks unless wrapping important words in bold like **Vitamin D**.
- Keep spacing clean. Do not add huge gaps between every line.
- Use short paragraphs.
- Use simple hyphen bullets only when helpful.
- Put follow-up options at the end under the label **Choose a follow-up:**
- Follow-up options should be customized to the user's current question.
- Do not always use the same three follow-up options.
- Generate relevant follow-up choices based on the topic being discussed.
- If the user types a number, answer the matching option from your previous message.
- Keep answers concise and easy to read.
- Most answers should be 40–100 words.
- For simple questions (dosage, benefits, deficiency symptoms), answer directly in 2–5 sentences.
- Only give longer answers when the user asks for more detail, comparisons, or explanations.
- Avoid repeating information already given earlier in the conversation.
- Bold only important vitamin names, dosage amounts, warnings, and the label **Choose a follow-up:**.

Safety:
- Do not diagnose medical conditions.
- Do not give personal medical advice.
- For dosage or supplement safety, remind users to ask a healthcare professional.

Vitamin D:
Evidence score: 9.3/10
Recommended intake: 600–800 IU/day for most adults; 800–1000 IU/day may be common for older adults.
Benefits: immune regulation, respiratory health support, inflammation regulation, bone and muscle health.
Deficiency concern: highest among tracked vitamins.

Zinc:
Evidence score: 7.8/10
Recommended intake: 8–11 mg/day for most adults.
Benefits: immune function, cold symptom support, T-cell function, wound healing.
Warning: Too much zinc can cause side effects and affect copper levels.

Vitamin C:
Evidence score: 6.6/10
Recommended intake: 75–90 mg/day for most adults.
Benefits: antioxidant protection, immune support, barrier protection, may reduce cold duration.

Vitamin B6:
Evidence score: 4.8/10
Recommended intake: 1.3–1.7 mg/day for most adults.
Benefits: immune cell production, metabolism, nervous system support.

Vitamin E:
Evidence score: 4.8/10
Recommended intake: 15 mg/day for most adults.
Benefits: antioxidant protection and immune response support.

Comparison:
Strongest evidence: Vitamin D.
Strong cold support: Zinc and Vitamin C.
Antioxidant support: Vitamin C and Vitamin E.
Immune cell support: Zinc and Vitamin B6.
`;

function cleanReply(text) {
  return text
    .replace(/^#{1,6}\s?/gm, "")
    .replace(/^---$/gm, "")
    .replace(/^- /gm, "• ")
    .replace(/\b(?<!\*\*)Vitamin D\b(?!\*\*)/g, "**Vitamin D**")
    .replace(/\b(?<!\*\*)Zinc\b(?!\*\*)/g, "**Zinc**")
    .replace(/\b(?<!\*\*)Vitamin C\b(?!\*\*)/g, "**Vitamin C**")
    .replace(/\b(?<!\*\*)Vitamin B6\b(?!\*\*)/g, "**Vitamin B6**")
    .replace(/\b(?<!\*\*)Vitamin E\b(?!\*\*)/g, "**Vitamin E**")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const history = req.body.history || [];

    const messages = [
      {
        role: "system",
        content: immuneIQKnowledge,
      },
      ...history.slice(-10).map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      {
        role: "user",
        content: userMessage,
      },
    ];

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: messages,
      temperature: 0.2,
      max_output_tokens: 420,
    });

    res.json({
      reply: cleanReply(response.output_text),
    });
  } catch (error) {
    console.error("ImmuneIQ server error:", error);
    res.status(500).json({
      error: "Server error.",
    });
  }
});

app.listen(3001, () => {
  console.log("ImmuneIQ AI server running on http://localhost:3001");
});