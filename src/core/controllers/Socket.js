import '../../lib/String.MtdName.js';

export default class Socket {
  Socket = null;

  ReloadTime = null;

  constructor() {
    this.Connect();
    this.Assign();
  }

  Connect() {
    this.Socket = io({
      // reconnection: false,
      // reconnectionDelay: 5000,
      // reconnectionAttempts: 5,
    });
  }

  Assign() {
    this.Socket.on('connect', this.OnSocketConnect.bind(this));
    this.Socket.on('reconnecting', this.OnSocketReconnecting.bind(this));
    this.Socket.on('disconnect', this.OnSocketDisconnect.bind(this));
    this.Socket.on('message', this.OnSocketMessage.bind(this));
  }

  SetAction(name, handle) {
    if(!name) {
      console.warn('SetAction() name is:', name);
      return false;
    }

    if(!handle) {
      console.warn('SetAction() handle is:', handle);
      return false;
    }

    if(this[name]) {
      console.warn(`SetAction() this.${name} already exists`);
      return false;
    }

    this[name] = handle.bind(this);
  }

  OnSocketConnect() {
    this.Emit({'maxqnei': 'Hi :)'});
  }

  OnSocketReconnecting() {}

  OnSocketDisconnect() {}

  OnSocketMessage(body) {
    var { Action, ...Args } = JSON.parse(body);

    if(Action) {
      Action = `Action${Action.MtdName()}`;
    }

    if(Action && this[Action]) {
      return this[Action](Args);
    }

    console.warn(`Not exists action: ${Action}`);
  }

  Emit(data) {
    if(data.constructor !== Object) {
      throw new Error(`data is't Object as {}!`);
    }

    this.Socket.emit('message', JSON.stringify(data));
  }
}
