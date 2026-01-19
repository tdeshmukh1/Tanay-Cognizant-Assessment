import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

dotenv.config({ path: new URL("./.env", import.meta.url) });

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/generate", async (req, res) => {
  try {
    const prompt = (req.body?.prompt ?? "").trim();
    if (!prompt) return res.status(400).json({ error: "Prompt is required." });
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
    const response = await client.responses.create({
      model,
      input: prompt
    });

    res.json({ text: response.output_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
