const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {cors: {origin: '*',methods: ["GET", "POST"]}});
const port = process.env.PORT || 3000;


io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("deployed_contract_address", (data) => {
    socket.to(data.room).emit("received_contract_address", data);
  });
});

http.listen(port, () => {
  console.log("SERVER IS RUNNING");
});
