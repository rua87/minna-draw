
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let rooms = {};

io.on("connection", (socket) => {

  socket.on("joinRoom", ({ room, username, password }) => {

    if (!rooms[room]) {
      rooms[room] = { password: password || null, history: [] };
    } else {
      if (rooms[room].password && rooms[room].password !== password) {
        socket.emit("wrongPassword");
        return;
      }
    }

    socket.join(room);
    socket.data.username = username;
    socket.data.room = room;

    socket.emit("loadHistory", rooms[room].history);
  });

  socket.on("draw", (data) => {
    const room = socket.data.room;
    if (!room) return;

    rooms[room].history.push(data);
    socket.to(room).emit("draw", data);
  });

  socket.on("clearCanvas", () => {
    const room = socket.data.room;
    if (!room) return;

    rooms[room].history = [];
    io.to(room).emit("clearCanvas");
  });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
