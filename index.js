const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {cors: {origin: '*',methods: ["GET", "POST"]}});
const port = process.env.PORT || 3000;

let totalConnections = 0;
io.on("connection", (socket) => {
  
  socket.on("join_room", (data) => {
    socket.join(data);
    totalConnections += 1;
    if(totalConnections == 2){
	socket.to(data.room).emit("both_players_joined", data);
    }
  });

  socket.on("deployed_contract_address", (data) => {
    socket.to(data.room).emit("received_contract_address", data);
  });

  socket.on("opponent_move", (data) => {
    socket.to(data.room).emit("received_opponent_move", data);
  });
  
  socket.on("initator_move", (data) => {
    socket.to(data.room).emit("received_initator_move", data);
  });


});

http.listen(port, () => {
  console.log("SERVER IS RUNNING");
});
