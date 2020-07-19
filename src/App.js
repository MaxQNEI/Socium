import './css/index.css';

// import RendererController from './core/controllers/Renderer.js';
// import CameraController from './core/controllers/Camera.js';
import SceneController from './core/controllers/Scene.js';

import * as THREE from 'three';

export default class App {
  Renderer;
  Canvas;
  Scene;
  Camera;

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

    window.addEventListener('resize', (evt) => {
      this.Renderer.setSize(this.Width(), this.Height());

      this.Camera.aspect = this.Aspect();
      this.Camera.updateProjectionMatrix();
    });

    document.body.classList.add('root-wrap');
    document.body.appendChild(this.Canvas);

    this.Scenario();
    this.Render();
  }

  Scenario() {
    this.Scene.fog = new THREE.Fog(0x000000, 100, 500);

    // ―――― Plane ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――― //
    const PlaneMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000, 100, 100),
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        wireframe: true,
      }),
    );
    PlaneMesh.rotation.x = -(Math.PI / 2);

    const PlaneWrap = new THREE.Object3D;
    PlaneWrap.add(PlaneMesh);

    this.Scene.add(PlaneWrap);
    // ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――― //


    const CubeSize = 5;
    const CubeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(CubeSize, CubeSize, CubeSize),
      new THREE.MeshBasicMaterial({ color: 'tomato' })
    );

    this.Camera.position.z = 10;

    this.Scene.add(CubeMesh);


    this.ZeroPosition = new THREE.Vector3(0, 0, 0);

    (this.Scene.AnimationList = (this.Scene.AnimationList = []))
      .push((timestamp) => {
        this.Camera.position.y = (Math.sin(timestamp / 5e3) + 50);
        this.Camera.position.x = (Math.cos(timestamp / 2e3) * 50);
        this.Camera.position.z = (Math.sin(timestamp / 2e3) * 50);
        // this.Camera.rotation.x = (timestamp / 3e3);
        // this.Camera.rotation.y = (timestamp / 1e3);
        this.Camera.lookAt(this.ZeroPosition);
      })
    ;
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
  LockEvent(evt) {
    evt.preventDefault();
  }
}
