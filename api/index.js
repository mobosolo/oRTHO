import { config } from "dotenv";
config();

import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import express from "express";

const app = express();

app.use(express.json());
app.use(cors());

// Initialiser GoogleGenAI avec la clé API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Route POST pour corriger le texte
app.post("/correct", async (req, res) => {
  try {
    const { text } = req.body; // Assurez-vous que le frontend envoie un corps JSON avec "text"
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: text,
      config: {
        systemInstruction:
          "Tu es correcteur orthographique. tu recois un texte et tu corrige les fautes",
      },
    });

    // Envoyer le résultat corrigé au frontend
    res.json({ correctedText: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la génération du contenu." });
  }
});

// Middleware pour gérer les routes non définies
app.use((req, res) => {
  res.status(404).json({ error: "Route non définie." });
});

// Exporter l'application Express comme une fonction serverless
export default app;