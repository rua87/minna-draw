const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ★ publicじゃなくて今のフォルダを使う
app.use(express.static(__dirname));

io.on("connection", (socket) => {
  console.log("ユーザー接続:", socket.id);

  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
