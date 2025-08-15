// document.getElementById("chat-form").addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const input = document.getElementById("user-input");
//   const message = input.value.trim();
//   input.value = "";

//   if (!message) return;

//   addMessage(message, "user");

//   try {
//     const res = await fetch("/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message }),
//     });

//     const data = await res.json();
//     const reply = data.output || "⚠️ Tidak ada balasan dari bot.";
//     addMessage(reply, "bot");
//   } catch (error) {
//     addMessage("⚠️ Error: Gagal menghubungi server.", "bot");
//   }
// });

// function addMessage(text, sender) {
//   const chatBox = document.getElementById("chat-box");
//   const msg = document.createElement("div");
//   msg.classList.add("message", sender);
//   msg.textContent = text;
//   chatBox.appendChild(msg);
//   chatBox.scrollTop = chatBox.scrollHeight;
// }
