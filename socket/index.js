require('./init.js');

const SocketController = require('./controllers/Socket.js');

const HTTP = require('http').createServer();
const IO = require('socket.io')(HTTP);

const Server = {
  ReloadTime: Date.now(),
};

IO.on('connection', (Socket) => {
  new SocketController({Server, Socket});
});

HTTP.listen(Config.SocketPort);
