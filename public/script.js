document.getElementById("chat-form").addEventListener("submit", async (e) => {
  const BASE_URL = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://chatbot-njs.vercel.app";

  e.preventDefault();

  const input = document.getElementById("user-input");
  const message = input.value.trim();
  input.value = "";

  if (!message) return;

  addMessage(message, "user");

  try {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    const rawReply = data.output || "⚠️ Tidak ada balasan dari bot.";
    const reply = formatText(rawReply);

    addMessage(reply, "bot");
  } catch (error) {
    addMessage("⚠️ Error: Gagal menghubungi server.", "bot");
  }
});

function formatText(rawText) {
  let text = rawText;

  text = text.replace(/\*/g, "");
  text = text.replace(/(\d+)\.\s*/g, "\n$1. ");
  text = text.replace(/\n\s*-\s*/g, "\n   - ");

  return text.trim();
}

function addMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");

  msg.classList.add("message", sender);

  msg.innerHTML = text.replace(/\n/g, "<br>");

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
