'use strict';
//Inicia el servidor
const io = require('socket.io')(process.env.PORT || 3000);
const shortid = require('shortid');

console.log('server starter');

var players = [];

//Escucha las conexiones
io.on('connection', function (socket) {

  //Generamos un identificador unico para esta conexion
  const thisClientId = shortid.generate();

  //Añadimos al nuevo jugador a la lista
  players.push(thisClientId);

  console.log('client connected, broadcasting spawn, id:', thisClientId);

  //Notifica a todos los clientes conectados
  socket.broadcast.emit("spawn", { id: thisClientId });

  //Emite la lista de jugadores conectados
  players.forEach(function(playerId){
    if(playerId === thisClientId)
      return;
    socket.emit('spawn', {id: playerId});
    console.log('Sending spawn to new player for id: ' + playerId);
  });

  //Escucha el evento move del cliente
  socket.on('move', function (data) {
    data.id = thisClientId;
    console.log("Client moved!", JSON.stringify(data));
    //Envia el movimiento del jugador a todos los usuarios conectados
    socket.broadcast.emit('move', data);
  });

  //Escucha las desconexiones
  socket.on('disconnect', function () {
    console.log('client disconnected');
  })

});
