import { config } from "dotenv";
config();

import { GoogleGenAI } from "@google/genai";
import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
