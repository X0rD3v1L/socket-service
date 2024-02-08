const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {cors: {origin: '*',methods: ["GET", "POST"]}});
const port = process.env.PORT || 3000;

let arr=[]

io.on("connection", (socket) => {
  
  socket.on("join_room", (data) => {
    socket.join(data);
    if(data.room != null){
	arr.push(data.room)
	if(arr.length == 2){
		socket.emit("both_players_joined",2);
	}
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
