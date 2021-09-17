import { Socket } from "socket.io";

const express = require("express");
const app = express();
const socketio = require("socket.io");

const expressServer = app.listen(8000);

const io = socketio(expressServer, {
  cors: {
    origin: "*",
  },
});

import namespaces from "./data/namespaces";

io.on("connection", (socket: Socket) => {
  let nsData = namespaces.map((namespace) => {
    return {
      img: namespace.img,
      endpoint: namespace.endpoint,
    };
  });
  socket.emit("nsList", nsData);
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (nsSocket: Socket) => {
    console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);

    if (namespace.endpoint === "/wiki") {
      nsSocket.emit("nsRoomLoad", namespaces[0].rooms);
    } else if (namespace.endpoint === "/mozilla") {
      nsSocket.emit("nsRoomLoad", namespaces[1].rooms);
    } else {
      nsSocket.emit("nsRoomLoad", namespaces[2].rooms);
    }
  });
});
