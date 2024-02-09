const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {cors: {origin: '*', methods: ["GET", "POST"]}});
const port = process.env.PORT || 3000;

let roomConnections = {};
let opponentAddress = "";
io.on("connection", (socket) => {
  
  socket.on("join_room", (data) => {
    socket.join(data);
    if (!roomConnections[data.room]) {
      roomConnections[data.room] = 0;
      opponentAddress = data.address;
    }
    roomConnections[data.room]++;

    if (roomConnections[data.room] === 2) {
      io.to(data.room).emit("both_players_joined", data);
    }
  });

  socket.on("deployed_contract_address", (data) => {
    socket.to(data.room).emit("received_contract_address", data);
  });

  socket.on("opponent_move", (data) => {
    socket.to(data.room).emit("received_opponent_move", data);
  });
  
  socket.on("initiator_move", (data) => {
    socket.to(data.room).emit("received_initiator_move", data);
  });

  socket.on("disconnect", () => {
    Object.keys(roomConnections).forEach(room => {
      if (roomConnections[room] > 0) {
        roomConnections[room]--;
      }
    });
  });
});

http.listen(port, () => {
  console.log("SERVER IS RUNNING");
});
