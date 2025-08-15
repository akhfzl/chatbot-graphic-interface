const CRISP_BASE_URL = "https://api.crisp.chat/v1/website";
const WEBSITE_ID = "2bd940f6-2190-436e-bbb0-1d419f2dd437";
const CRISP_AUTH =
  "Basic M2M4YmEwNDktZWNmZi00NjVlLWIyOTEtYWI2NWM2NTlkOGZhOjM3Y2M1NmQ5NTNiZTkxYjFlOGZiNGMxNTMxZGIzZGFhZWE1YWJhZTkzOTFiYmJjYTYwZTY3ZjE3ODk2OTU1YmY=";

async function createCrispConversation() {
  try {
    const res = await fetch(`${CRISP_BASE_URL}/${WEBSITE_ID}/conversation`, {
      method: "POST",
      headers: {
        Authorization: CRISP_AUTH,
        "X-Crisp-Tier": "plugin",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // kosongkan body sesuai API Crisp
    });

    if (!res.ok) {
      throw new Error(`Gagal membuat conversation: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log("Conversation berhasil dibuat:", data);
    return data;
  } catch (err) {
    console.error("Error:", err.message);
    throw err;
  }
}

async function getCrispConversation() {
  const inisiateSession = createCrispConversation();
  const SESSION_ID = inisiateSession && inisiateSession.data && inisiateSession.data.session_id ? inisiateSession.data.session_id : null;

  if (!SESSION_ID) {
    throw "Kesalahan Sistem";
  }

  const res = await fetch(`${CRISP_BASE_URL}/${WEBSITE_ID}/conversation/${SESSION_ID}`, {
    method: "GET",
    headers: {
      Authorization: CRISP_AUTH,
      "X-Crisp-Tier": "plugin",
    },
  });
  if (!res.ok) throw new Error(`Gagal GET Crisp: ${res.statusText}`);
  return res.json();
}

async function sendMessageToCrisp(content) {
  const inisiateSession = createCrispConversation();
  const SESSION_ID = inisiateSession && inisiateSession.data && inisiateSession.data.session_id ? inisiateSession.data.session_id : null;

  if (!SESSION_ID) {
    throw "Kesalahan Sistem";
  }

  const res = await fetch(`${CRISP_BASE_URL}/${WEBSITE_ID}/conversation/${SESSION_ID}/message`, {
    method: "POST",
    headers: {
      Authorization: CRISP_AUTH,
      "X-Crisp-Tier": "plugin",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "text",
      from: "operator",
      origin: "chat",
      content,
    }),
  });
  if (!res.ok) throw new Error(`Gagal POST ke Crisp: ${res.statusText}`);
  return res.json();
}

module.exports = {
  getCrispConversation,
  sendMessageToCrisp,
};
