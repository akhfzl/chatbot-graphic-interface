const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Endpoint untuk meneruskan request ke n8n
app.post("/chat", async (req, res) => {
  try {
    const response = await fetch("https://n8n.smartid.or.id/webhook/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menghubungi chatbot" });
  }
});

app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
