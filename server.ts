import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/system/status", async (req, res) => {
    try {
      const { level, achievements } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are the Solo Leveling System. Greet Kenneth Jay Guban Mapalad. 
        He is current SSS Rank. Level ${level || 99}. Achievements: ${achievements || '532 Million'}.
        Provide a short, cryptic, and cool 'System Message' that fits the cozy lofi vibe but maintains the SSS-rank intensity. 
        Keep it under 3 sentences. No markdown level headers.`,
      });
      res.json({ message: response.text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "System error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
