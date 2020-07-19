import './css/index.css';

// import RendererController from './core/controllers/Renderer.js';
// import CameraController from './core/controllers/Camera.js';
import SceneController from './core/controllers/Scene.js';

import * as THREE from 'three';

const ENABLED = true;
const DISABLED = false;

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
      new THREE.PlaneBufferGeometry(10000, 10000, 1, 1),
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        // wireframe: true,
        transparent: true,
        opacity: .1,
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

    // this.Scene.add(CubeMesh);

    this.ZeroPosition = new THREE.Vector3(0, 0, 0);

        this.Camera.position.y = 50;
        this.Camera.position.x = 50;
        this.Camera.position.z = 50;
        this.Camera.lookAt(this.ZeroPosition);

    // Need create extented scene object (project)
    DISABLED && (this.Scene.AnimationList = (this.Scene.AnimationList || []))
      .push((timestamp) => {
        this.Camera.position.y = (Math.sin(timestamp / 5e3) + 50);
        this.Camera.position.x = (Math.cos(timestamp / 2e3) * 50);
        this.Camera.position.z = (Math.sin(timestamp / 2e3) * 50);
        // this.Camera.rotation.x = (timestamp / 3e3);
        // this.Camera.rotation.y = (timestamp / 1e3);
        this.Camera.lookAt(this.ZeroPosition);
      })
    ;
    // ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――― //


    // ―――― "Building" ―――――――――――――――――――――――――――――――――――――――――――――――――――――― //
    var MouseDown = false;
    var AllowBuild = false;
    var HexagoneList = {};

    const BuildPointerMesh = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(5, 5, 5, 6),
      new THREE.MeshBasicMaterial({
        color: 'gray',
        transparent: true,
        opacity: .5,
      })
    );

    const BuildPointerWrap = new THREE.Object3D();
    BuildPointerWrap.add(BuildPointerMesh);
    BuildPointerMesh.position.y = 2.5;
    this.Scene.add(BuildPointerWrap);

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



      var key = (hX +'x'+ hZ);
      if(!AllowBuild) {
        console.debug(`Woops! Build not allow!`);
        return;
      }

      if(!MouseDown) {
        console.debug(`Mouse is't down!`);
        return;
      }

      if(key in HexagoneList) {
        console.debug(`Hexagone on ${key} exists!`);
        return;
      }



      const HexagoneMesh = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(5, 5, 5, 6),
        new THREE.MeshBasicMaterial({ color: 'gray' })
      );

      const HexagoneWrap = new THREE.Object3D();
      HexagoneWrap.add(HexagoneMesh);
      HexagoneMesh.position.y = 2.5;

      HexagoneWrap.position.set(hX, 0, hZ);
      HexagoneWrap.children[0].material.color = new THREE.Color('green');

      HexagoneList[key] = HexagoneWrap;

      this.Scene.add(HexagoneWrap);
    });

    var hX, hZ;
    window.addEventListener('mousedown', (event) => {
      MouseDown = true;

      window.dispatchEvent(new Event('mousemove', event));
    });

    window.addEventListener('mouseup', (event) => {
      MouseDown = false;
    });

    // Need create extented scene object (project)
    const GridSize = 10;
    (this.Scene.AnimationList = (this.Scene.AnimationList || []))
      .push((timestamp) => {
        raycaster.setFromCamera(mouse, this.Camera);
        intersects = raycaster.intersectObject(BuildGridWrap, true);

        if(intersects && intersects[0]) {
          var { x, y, z } = intersects[0].point;

          hX = Math.round(x / GridSize) * GridSize;
          hZ = Math.round(z / GridSize) * GridSize;

          AllowBuild = true;

          BuildPointerWrap.position.set(hX, y, hZ);
        } else {
          AllowBuild = false;
        }
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
