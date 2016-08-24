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

  //Player model
  var player = {
    id: thisPlayerId,
    x:0,
    y:0
  };

  players[thisPlayerId] = player;

  console.log('client connected, broadcasting spawn, id:', thisPlayerId);

  //Notifica a todos los clientes conectados
  socket.broadcast.emit("spawn", { id: thisPlayerId });
  socket.broadcast.emit("requestPosition");

  //Emite la lista de jugadores conectados
  for (var playerId in players){
    if(playerId === thisPlayerId)
      continue;

    socket.emit('spawn', players[playerId]);
    console.log('Sending spawn to new player for id: ' + playerId);
  };

  //Escucha el evento move del cliente
  socket.on('move', function (data) {
    data.id = thisPlayerId;
    console.log("Client moved!", JSON.stringify(data));

    player.x = data.x;
    player.y = data.y;


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

    delete players[thisPlayerId];
    //Avisa a los clientes conectados que el usuario con el id fue eliminado
    socket.broadcast.emit('disconnected', {id: thisPlayerId});

  })

});
