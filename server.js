import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Gemini API key
const GEMINI_KEY = "AIzaSyBDkR45qikItOVcx1CO8NnCTwWjFfQeFlI";

app.post("/api/gemini", async (req, res) => {
  try {
    const userInstruction = req.body.instruction;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GEMINI_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `User says: "${userInstruction}". Respond professionally as a backend service advisor.` }
              ]
            }
          ]
        }),
      }
    );

    const data = await response.json();
    const textOutput = data?.candidates?.[0]?.content?.[0]?.text || "No response";
    res.json({ reply: textOutput });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error connecting to Gemini 3" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
