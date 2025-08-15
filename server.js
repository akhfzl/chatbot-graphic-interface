const express = require("express");
const path = require("path");
const { getCrispConversation, sendMessageToCrisp } = require("./utils");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

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

app.get("/process-crisp", async (req, res) => {
  try {
    const conversation = await getCrispConversation();
    const N8N_WEBHOOK = "https://n8n.smartid.or.id/webhook/chatbot";

    const { preview_message, last_message } = conversation.data || {};

    if (preview_message?.from === "user") {
      const webhookRes = await fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: last_message }),
      });
      const webhookData = await webhookRes.json();

      const botReply = webhookData.output || "⚠️ Bot tidak memberikan balasan.";

      await sendMessageToCrisp(botReply);

      res.json({ status: "success", sent: botReply });
    } else {
      res.json({ status: "ignored", reason: "Pesan terakhir bukan dari user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server berjalan di https://chatbot-smartid-app.vercel.app/");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
