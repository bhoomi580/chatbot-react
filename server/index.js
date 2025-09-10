const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
app.use(cors());
app.use(bodyParser.json());

const HISTORY_FILE = path.join(__dirname, "history.json");

if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify([]));
}

app.get("/history", (req, res) => {
  const history = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf-8"));
  res.json(history);
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    let history = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf-8"));
    history.push({ from: "user", text: message });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    });

    const reply = response.choices[0].message.content;
    history.push({ from: "bot", text: reply });

    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error with AI response." });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
