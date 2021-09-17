import { Socket } from "socket.io";

const express = require("express");
const app = express();
const socketio = require("socket.io");

const expressServer = app.listen(8000);

import namespaces from "./data/namespaces";

console.log(namespaces);

const io = socketio(expressServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket: Socket) => {
  socket.on("messageToServer", (msg: String) => {
    socket.emit("messageFromServer", msg);
  });

  socket.join("level1");
  io.of("/")
    .to("level1")
    .emit("joined", `${socket.id} says i have joined the level1 room`);
});

io.of("/admin").on("connection", (socket: Socket) => {
  io.of("/admin").emit("welcome", "welcome to the admin channel");
});
