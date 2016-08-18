'use strict';
const io = require('socket.io')(process.env.PORT || 3000);

console.log('server starter');
io.on('connection', function (socket) {
  console.log('client connected');

  socket.on('move', function (data) {
    console.log("Client moved!");
  });

});
