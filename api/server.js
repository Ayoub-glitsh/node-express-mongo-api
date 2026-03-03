/**
 * API REST Express + MongoDB (driver natif)
 * - Se connecte à MongoDB via la variable d'environnement MONGO_URL
 * - Expose les routes:
 *    GET  /        -> état de l'API
 *    POST /items   -> crée un item
 *    GET  /items   -> liste les items
 */

const express = require("express");
const { MongoClient } = require("mongodb");

// Configuration par variables d'environnement
const PORT = Number(process.env.PORT || 3000);
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/appdb";

// Express app
const app = express();
app.use(express.json()); // parse application/json

// Client MongoDB (driver natif)
const client = new MongoClient(MONGO_URL, {
  // Délai max de sélection de serveur pour accélérer l'échec si Mongo n'est pas prêt
  serverSelectionTimeoutMS: 5000,
});

let db; // instance de base de données après connexion

/**
 * Tentative de connexion à MongoDB avec retries.
 * @param {number} retries - nombre d'essais restants
 * @param {number} delayMs - délai entre essais
 */
async function connectWithRetry(retries = 10, delayMs = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await client.connect();
      // Si un nom de base figure dans l'URI, le driver l'utilise par défaut
      db = client.db();
      console.log(`[mongo] Connecté à ${MONGO_URL}`);
      return db;
    } catch (err) {
      console.error(
        `[mongo] Échec de connexion (tentative ${attempt}/${retries}):`,
        err.message
      );
      if (attempt === retries) throw err;
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}

/**
 * Accès à la collection "items"
 */
function itemsCollection() {
  if (!db) throw new Error("Base de données non initialisée");
  return db.collection("items");
}

/**
 * Routes
 */
app.get("/", async (req, res) => {
  try {
    const ok = !!db;
    res.json({
      ok,
      message: "API opérationnelle",
      mongoUrl: MONGO_URL,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/items", async (req, res) => {
  try {
    const docs = await itemsCollection()
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ ok: true, count: docs.length, items: docs });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/items", async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return res
        .status(400)
        .json({ ok: false, error: "Le corps doit être un objet JSON" });
    }
    // Ajouter métadonnées simples
    const doc = { ...payload, createdAt: new Date() };
    const result = await itemsCollection().insertOne(doc);
    res.status(201).json({ ok: true, id: result.insertedId, item: doc });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * Démarrage de l'application: d'abord Mongo, puis HTTP.
 */
async function start() {
  try {
    await connectWithRetry();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[api] Écoute sur le port ${PORT}`);
    });
  } catch (err) {
    console.error("[api] Impossible de démarrer l'API:", err);
    process.exit(1);
  }
}

// Arrêt propre
async function shutdown(signal) {
  try {
    console.log(`[api] Signal ${signal} reçu, arrêt en cours...`);
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error("[api] Erreur à la fermeture:", err);
    process.exit(1);
  }
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Lancement
start();

