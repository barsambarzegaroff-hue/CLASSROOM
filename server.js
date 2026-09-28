const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const users = {};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join-room", ({ name, room }) => {
    socket.join(room);

    users[socket.id] = {
      name,
      room
    };

    socket.to(room).emit("user-joined", {
      id: socket.id,
      name
    });

    io.to(room).emit(
      "users",
      Object.entries(users)
        .filter(([id, user]) => user.room === room)
        .map(([id, user]) => ({
          id,
          name: user.name
        }))
    );
  });

  socket.on("chat-message", (message) => {
    const user = users[socket.id];

    if (!user) return;

    io.to(user.room).emit("chat-message", {
      name: user.name,
      message
    });
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];

    if (user) {
      socket.to(user.room).emit("user-left", {
        id: socket.id,
        name: user.name
      });

      delete users[socket.id];
    }

    console.log("🔴 User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 CLASSROOM running on port ${PORT}`);
});
