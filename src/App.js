import './css/index.css';

import * as THREE from 'three';

import SocketController from './core/controllers/Socket.js';
// import RendererController from './core/controllers/Renderer.js';
// import CameraController from './core/controllers/Camera.js';
// import SceneController from './core/controllers/Scene.js';

import * as SocketActions from './app/socket/actions.js';

// import InitialScenario from './app/scenarios/0000-initial-scenario.js';
// import NewHorizonScenario from './app/scenarios/0001-new-horizon.js';
import Scenario from
  // './app/scenarios/0000-initial-scenario.js';
  './app/scenarios/0001-new-horizon.js';

const ENABLED = true;
const DISABLED = false;

export default class App {
  Renderer;
  Canvas;
  Scene;
  Camera;

  Scenario;

  Socket;

  constructor() {
    this.Socket = new SocketController;

    Object.keys(SocketActions).some((actionName) => {
      this.Socket.SetAction(actionName, SocketActions[actionName]);
    });

    // LockEvents
    window.addEventListener('selectstart', this.LockEvent);
    window.addEventListener('contextmenu', this.LockEvent);

    // Base
    this.Renderer = new THREE.WebGLRenderer({ antialias: true });
    this.Canvas = this.Renderer.domElement;
    this.Scene = new THREE.Scene;
    this.Camera = new THREE.PerspectiveCamera(75, this.Aspect(), .1, 1000);

    this.Scene.AnimationList = [];

    this.Renderer.setPixelRatio(window.devicePixelRatio);
    // this.Renderer.setPixelRatio(.5);
    this.Renderer.setSize(this.Width(), this.Height());
    this.Renderer.setClearColor(0x000000, 1);
    // this.Renderer.outputEncoding = THREE.sRGBEncoding;
    this.Renderer.shadowMap.enabled = true;

    this.Canvas.classList.add('root-canvas');

    window.addEventListener('resize', (event) => {
      this.Renderer.setSize(this.Width(), this.Height());

      this.Camera.aspect = this.Aspect();
      this.Camera.updateProjectionMatrix();
    });

    document.body.classList.add('root-wrap');
    document.body.appendChild(this.Canvas);

    this.Render();

    this.Scenario = new Scenario({
      Scene: this.Scene,
      Camera: this.Camera,
    });
  }

  // Base.js
  Aspect() {
    return (this.Width() / this.Height());
  }

  Width() {
    return window.innerWidth;
  }

  Height() {
    return window.innerHeight;
  }

  Render(timestamp = document.timeline.currentTime) {
    window.requestAnimationFrame(this.Render.bind(this));

    if(this.Scene.AnimationList) {
      this.Scene.AnimationList = this.Scene.AnimationList.filter((handle) => {
        if(handle(timestamp) === 'complete') {
          return false;
        }

        return true;
      });
    }

    this.Renderer.render(this.Scene, this.Camera);
  }



  // Additionals
  LockEvent(event) {
    event.preventDefault();
  }
}
