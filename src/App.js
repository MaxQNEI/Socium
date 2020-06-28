import Core from './core/Core.js';

export default class App extends Core {
  constructor() {
    super();

    this.OnDOMReady(this.Init);
  }

  Init() {
    this.InitRootCanvas();
  }


}
