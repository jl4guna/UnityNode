'use strict';
//Inicia el servidor
const io = require('socket.io')(process.env.PORT || 3000);
const shortid = require('shortid');

console.log('server starter');

var players = [];

//Escucha las conexiones
io.on('connection', function (socket) {

  //Generamos un identificador unico para esta conexion
  const thisPlayerId = shortid.generate();

  //Añadimos al nuevo jugador a la lista
  players.push(thisPlayerId);

  console.log('client connected, broadcasting spawn, id:', thisPlayerId);

  //Notifica a todos los clientes conectados
  socket.broadcast.emit("spawn", { id: thisPlayerId });
  socket.broadcast.emit("requestPosition");

  //Emite la lista de jugadores conectados
  players.forEach(function(playerId){
    if(playerId === thisPlayerId)
      return;
    socket.emit('spawn', {id: playerId});
    console.log('Sending spawn to new player for id: ' + playerId);
  });

  //Escucha el evento move del cliente
  socket.on('move', function (data) {
    data.id = thisPlayerId;
    console.log("Client moved!", JSON.stringify(data));
    //Envia el movimiento del jugador a todos los usuarios conectados
    socket.broadcast.emit('move', data);
  });

  socket.on('updatePosition', function (data) {
    console.log(data);

    data.id = thisPlayerId;

    socket.broadcast.emit('updatePosition', data);

  });

  //Escucha las desconexiones
  socket.on('disconnect', function () {
    console.log('client disconnected');

    //Eliminamos al player de la lista
    players.splice(players.indexOf(thisPlayerId, 1));
    //Avisa a los clientes conectados que el usuario con el id fue eliminado
    socket.broadcast.emit('disconnected', {id: thisPlayerId});

  })

});
