// Mini API Express pour exposer la collection 'sensor_db' de la base MongoDB 'sensor_db'
// Dossier : ./sensor_db
// Port : 7272

const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const PORT = 7272;
const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "sensor_db";
const COLLECTION_NAME = "sensor_data";

app.use(cors());

let db, collection;

// Connexion MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db(DB_NAME);
    collection = db.collection(COLLECTION_NAME);
    console.log(
      `Connecté à MongoDB, base '${DB_NAME}', collection '${COLLECTION_NAME}'`
    );
  })
  .catch((err) => {
    console.error("Erreur de connexion MongoDB:", err);
    process.exit(1);
  });

// Route GET / pour retourner tous les documents de la collection
app.get("/", async (req, res) => {
  try {
    const docs = await collection.find({}).toArray();
    res.json(docs);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données." });
  }
});

app.listen(PORT, () => {
  console.log(`API sensor_db démarrée sur http://localhost:${PORT}`);
});
