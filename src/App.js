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

    window.addEventListener('resize', (event) => {
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

    // ―――― BuildGrid ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――― //
    const BuildGridMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(100, 100, 10, 10),
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        // wireframe: true,
        transparent: true,
        opacity: .2,
      }),
    );
    BuildGridMesh.rotation.x = -(Math.PI / 2);

    const BuildGridWrap = new THREE.Object3D;
    BuildGridWrap.add(BuildGridMesh);

    this.Scene.add(BuildGridWrap);
    // ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――― //


    // ―――― Object to observation ――――――――――――――――――――――――――――――――――――――――――― //
    const CubeSize = 5;
    const CubeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(CubeSize, CubeSize, CubeSize),
      new THREE.MeshBasicMaterial({ color: 'tomato' })
    );

    this.Camera.position.z = 10;

    this.Scene.add(CubeMesh);

    this.ZeroPosition = new THREE.Vector3(0, 0, 0);

        this.Camera.position.y = 50;
        this.Camera.position.x = 50;
        this.Camera.position.z = 50;
        this.Camera.lookAt(this.ZeroPosition);

    // Need create extented scene object (project)
    // (this.Scene.AnimationList = (this.Scene.AnimationList || []))
    //   .push((timestamp) => {
    //     this.Camera.position.y = (Math.sin(timestamp / 5e3) + 50);
    //     this.Camera.position.x = (Math.cos(timestamp / 2e3) * 50);
    //     this.Camera.position.z = (Math.sin(timestamp / 2e3) * 50);
    //     // this.Camera.rotation.x = (timestamp / 3e3);
    //     // this.Camera.rotation.y = (timestamp / 1e3);
    //     this.Camera.lookAt(this.ZeroPosition);
    //   })
    // ;
    // ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――― //


    // ―――― "Building" ―――――――――――――――――――――――――――――――――――――――――――――――――――――― //
    const BuildPointer = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(0.1, 0.1, 20, 20),
      new THREE.MeshBasicMaterial({ color: 'red' })
    );

    this.Scene.add(BuildPointer);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    var intersects;

    window.addEventListener('touchmove', (event) => {
      const touch = event.touches[0];
      mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (touch.clientY / window.innerHeight) * 2 + 1;
    });
    window.addEventListener('mousemove', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    });

    // Need create extented scene object (project)
    (this.Scene.AnimationList = (this.Scene.AnimationList || []))
      .push((timestamp) => {
        raycaster.setFromCamera(mouse, this.Camera);
        intersects = raycaster.intersectObject(BuildGridWrap, true);

        (intersects && intersects[0]) && (() => {
          var { x, y, z } = intersects[0].point;

          x = Math.round(x);
          z = Math.round(z);

          BuildPointer.position.set(x, y, z);
        })();
      })
    ;
    // ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――― //
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
