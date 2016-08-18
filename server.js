'use strict';
//Inicia el servidor
const io = require('socket.io')(process.env.PORT || 3000);

console.log('server starter');
//Escucha las conexiones
io.on('connection', function (socket) {
  console.log('client connected, broadcasting spawn');

  //Notifica a todos los clientes conectados
  socket.broadcast.emit("spawn");

  //Escucha el evento move del cliente
  socket.on('move', function (data) {
    console.log("Client moved!");
  });

});
