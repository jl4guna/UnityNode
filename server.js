'use strict';
//Inicia el servidor
const io = require('socket.io')(process.env.PORT || 3000);

console.log('server starter');

var playerCount = 0;

//Escucha las conexiones
io.on('connection', function (socket) {
  console.log('client connected, broadcasting spawn');

  //Notifica a todos los clientes conectados
  socket.broadcast.emit("spawn");
  //Aumentamos el numero de usuarios
  playerCount++;

  //Mostramos a las nuevas conexiones todos los usuarios que ya estan conectados
  for (var i = 0; i < playerCount; i++) {
    socket.emit('spawn');
    console.log('sending spawn to new player');
  }

  //Escucha el evento move del cliente
  socket.on('move', function (data) {
    console.log("Client moved!", JSON.stringify(data));
    //Envia el movimiento del jugador a todos los usuarios conectados
    socket.broadcast.emit('move', data);
  });

  //Escucha las desconexiones
  socket.on('disconnect', function () {
    console.log('client disconnected');
    playerCount--;
  })

});
