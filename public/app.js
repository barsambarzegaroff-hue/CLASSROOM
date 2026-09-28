const socket = io();

function joinRoom() {
  const name = document.getElementById("name").value.trim();
  const room = document.getElementById("room").value.trim();

  if (!name || !room) {
    alert("😎 اسم و اسم روم رو وارد کن!");
    return;
  }

  socket.emit("join-room", {
    name: name,
    room: room
  });

  document.getElementById("join").style.display = "none";
  document.getElementById("app").classList.remove("hidden");

  document.getElementById("roomTitle").textContent =
    "🚀 روم: " + room;
}

socket.on("users", function(users) {
  const box = document.getElementById("users");

  box.innerHTML = "";

  users.forEach(function(user) {
    const div = document.createElement("div");

    div.className = "user";
    div.textContent = "🟢 " + user.name;

    box.appendChild(div);
  });
});

function sendMessage() {
  const input = document.getElementById("message");
  const message = input.value.trim();

  if (!message) return;

  socket.emit("chat-message", message);

  input.value = "";
}

socket.on("chat-message", function(data) {
  const box = document.getElementById("messages");

  const div = document.createElement("div");

  div.className = "msg";

  const name = document.createElement("b");
  name.textContent = data.name;

  const text = document.createElement("div");
  text.textContent = data.message;

  div.appendChild(name);
  div.appendChild(text);

  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
});

socket.on("user-joined", function(user) {
  addSystemMessage("🟢 " + user.name + " وارد روم شد");
});

socket.on("user-left", function(user) {
  addSystemMessage("🔴 " + user.name + " خارج شد");
});

function addSystemMessage(message) {
  const box = document.getElementById("messages");

  const div = document.createElement("div");
  div.className = "msg";
  div.textContent = message;

  box.appendChild(div);
}
