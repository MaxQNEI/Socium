class SocketController {
  Server;
  Socket;

  Id;

  constructor({Server, Socket}) {
    console.debug(`[${Socket.id}] SocketController()`);

    this.Socket = Socket;
    this.Server = Server;

    this.Emit({
      Action: 'check-reload-time',
      ReloadTime: Server.ReloadTime,
    });

    this.Socket.on('disconnect', this.OnDisconnect.bind(this));
    this.Socket.on('message', this.OnMessage.bind(this));
  }

  OnDisconnect(reason) {
    console.debug(`[${this.Socket.id}] OnDisconnect()`, reason);
  }

  OnMessage(body) {
    console.debug(`[${this.Socket.id}] OnMessage()`, body);

    // ...
  }

  Emit(data) {
    console.debug(`[${this.Socket.id}] Emit()`, data);

    if(data.constructor !== Object) {
      throw new Error(`data is't Object as {}!`);
    }

    this.Socket.emit('message', JSON.stringify(data));
  }
}

module.exports = SocketController;
