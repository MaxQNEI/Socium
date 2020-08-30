import './css/index.css';

import * as THREE from 'three';

// import RendererController from './core/controllers/Renderer.js';
// import CameraController from './core/controllers/Camera.js';
// import SceneController from './core/controllers/Scene.js';

// import InitialScenario from './app/scenarios/0000-initial-scenario.js';

const ENABLED = true;
const DISABLED = false;

export default class App {
  Renderer;
  Canvas;
  Scene;
  Camera;

  DebugBlock;

  constructor() {
    // LockEvents
    window.addEventListener('selectstart', this.LockEvent);
    window.addEventListener('contextmenu', this.LockEvent);

    // Base
    this.Renderer = new THREE.WebGLRenderer({ antialias: true });
    this.Canvas = this.Renderer.domElement;
    this.Scene = new THREE.Scene;
    this.Camera = new THREE.PerspectiveCamera(75, this.Aspect(), .1, 1000);

    this.Renderer.setPixelRatio(window.devicePixelRatio);
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

    // this.InitDebugBlock();
    this.Render();

    // InitialScenario({
    //   Scene: this.Scene,
    //   Camera: this.Camera,
    // });
  }

  // InitDebugBlock() {
  //   this.DebugBlock = document.createElement('div');
  //   Object.assign(this.DebugBlock.style, {
  //     position: 'fixed',
  //     zIndex: 10000,
  //     top: '10px',
  //     right: '10px',
  //     minWidth: '200px',
  //     minHeight: '5px',
  //     padding: '5px',
  //     backgroundColor: 'rgba(255, 255, 255, .85)',
  //     color: '#222222',
  //   });
  //   document.body.append(this.DebugBlock);

  //   Object.defineProperties(this.DebugBlock, {
  //     add: { enumerable: true, value: function add() {
  //       const element = document.createElement('p');
  //       this.appendChild(element);
  //       return element;
  //     } }
  //   });
  // }

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
