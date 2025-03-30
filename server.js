const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;

// Statische Dateien bereitstellen
app.use(express.static(path.join(__dirname, "public")));

// Index.html als Startseite
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Server läuft auf Port ${port}`);
});
