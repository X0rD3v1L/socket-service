const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {cors: {origin: '*', methods: ["GET", "POST"]}});
const port = process.env.PORT || 1337;

const userList = {};

io.on("connection", (socket) => {

  socket.on("join_room", (data) => {
    userList[socket.id] = data.user_address;
    socket.join(data.room);
    io.to(data.room).emit("update_users", Object.values(userList));
  });

  socket.on("join_game", (data) => {
    socket.join(data.room);
    io.to(data.room).emit("new_player_joined", data);
  });

  socket.on("change_room", (data) => {
    socket.leave(data.oldRoom);
    socket.join(data.room);
  })


  socket.on("brodcast_winner", (data) => {
    socket.to(data.room).emit("received_winner", data.winners);
  });

  socket.on("brodcast_join_game", (data) => {
    socket.to(data.room).emit("received_join_game", data);
  });


  socket.on("deployed_contract_address", (data) => {
    socket.to(data.room).emit("received_contract_address", data.contract);
  });

  socket.on("opponent_move", (data) => {
    socket.to(data.room).emit("received_opponent_move", data);
  });

  socket.on("initiator_move", (data) => {
    socket.to(data.room).emit("received_initiator_move", data);
  });

  socket.on("brodcast_end_game", (data) => {
    socket.to(data.oldRoom).emit("received_end_game", data);
    socket.leave(data.oldRoom);
    socket.join(data.room);
  });

  socket.on("disconnect", () => {
    delete userList[socket.id];
    io.to(1).emit("update_users", Object.values(userList));
  });
});

http.listen(port, () => {
  console.log("SERVER IS RUNNING");
});
