async function getVisitorTokenByIP(CRISP_AUTH, WEBSITE_ID, CRISP_BASE_URL, ip) {
  const url = `${CRISP_BASE_URL}/${WEBSITE_ID}/conversations?search=${ip}`;
  const res = await fetch(url, {
    headers: {
      Authorization: CRISP_AUTH,
      "X-Crisp-Tier": "plugin",
    },
  });

  const data = await res.json();

  if (!data?.data?.length) {
    return null;
  }

  const lastItem = data.data[data.data.length - 1];
  return lastItem?.meta?.token_id || null;
}

async function sendMessageToCrispBySession(sessionId, CRISP_BASE_URL, WEBSITE_ID, CRISP_AUTH, content) {
  const url = `${CRISP_BASE_URL}/${WEBSITE_ID}/conversation/${sessionId}/message`;
  const res = await fetch(url, {
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
  getVisitorTokenByIP,
  sendMessageToCrispBySession,
};
