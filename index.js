import { config } from "dotenv";
config();

import { GoogleGenAI } from "@google/genai";
import { inject } from "@vercel/analytics";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

inject();

// Recréer __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json());
app.use(cors());
// Configuration du serveur Express

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Servir les fichiers statiques

// Initialiser GoogleGenAI avec la clé API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Route POST pour corriger le texte
app.post("/correct", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Texte manquant dans la requête." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: text,
      config: {
        systemInstruction:
          "Tu es un correcteur orthographique. tu recois un texte et tu corrige les fautes. Tu ne dois sortir que la correction du texte",
      },
    });

    res.json({ correctedText: response.text });
  } catch (error) {
    console.error("Erreur lors de la génération du contenu :", error.message);
    res.status(500).json({ error: "Erreur lors de la génération du contenu." });
  }
});

// Route par défaut pour servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
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