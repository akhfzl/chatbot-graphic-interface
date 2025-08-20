const express = require("express");
const cors = require("cors");
const path = require("path");
const { getVisitorTokenByIP, sendMessageToCrispBySession } = require("./utils");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const CRISP_BASE_URL = "https://api.crisp.chat/v1/website";
const WEBSITE_ID = "2bd940f6-2190-436e-bbb0-1d419f2dd437";
const CRISP_AUTH =
  "Basic M2M4YmEwNDktZWNmZi00NjVlLWIyOTEtYWI2NWM2NTlkOGZhOjM3Y2M1NmQ5NTNiZTkxYjFlOGZiNGMxNTMxZGIzZGFhZWE1YWJhZTkzOTFiYmJjYTYwZTY3ZjE3ODk2OTU1YmY=";

const lastProcessed = new Map();

app.get("/process-crisp", async (req, res) => {
  try {
    const sessionId = req.query.sessionId;
    if (!sessionId) {
      return res.status(400).json({ error: "IP tidak ditemukan" });
    }

    const resConv = await fetch(`${CRISP_BASE_URL}/${WEBSITE_ID}/conversation/${sessionId}`, {
      headers: {
        Authorization: CRISP_AUTH,
        "X-Crisp-Tier": "plugin",
      },
    });
    const conversation = await resConv.json();

    const { preview_message, last_message } = conversation.data || {};
    if (preview_message?.from === "user") {
      // const lastId = lastProcessed.get(sessionId);
      // if (lastId === last_message?.id) {
      //   return res.json({ status: "ignored", reason: "Pesan sudah diproses sebelumnya", users: lastProcessed });
      // }

      const N8N_WEBHOOK = "https://n8n.smartid.or.id/webhook/chatbot";
      const webhookRes = await fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: last_message }),
      });
      const webhookData = await webhookRes.json();

      const botReply = webhookData.output || "⚠️ Bot tidak memberikan balasan.";
      await sendMessageToCrispBySession(sessionId, CRISP_BASE_URL, WEBSITE_ID, CRISP_AUTH, botReply);

      res.json({ status: "success", sent: botReply });
    } else {
      res.json({ status: "ignored", reason: "Pesan terakhir bukan dari user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
