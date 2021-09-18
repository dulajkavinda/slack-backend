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
    nsSocket.emit("nsRoomLoad", namespace.rooms);
    nsSocket.on("joinRoom", async (roomToJoin, newNoOfMembers) => {
      console.log(nsSocket.rooms);

      nsSocket.join(roomToJoin);
      const ids = await io.of(namespace.endpoint).in(roomToJoin).allSockets();

      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin;
      });

      nsSocket.emit("history", nsRoom.history);
      io.of(namespace.endpoint).in(roomToJoin).emit("updateMembers", ids.size);
    });
    nsSocket.on("newMessageToServer", (msg) => {
      const nsRoom = namespaces[0].rooms.find((room) => {
        return room.roomTitle === msg.roomName;
      });

      nsRoom.addmessage(msg.message);

      io.of(namespace.endpoint)
        .to(msg.roomName)
        .emit("messageToClient", msg.message);
    });
  });
});
