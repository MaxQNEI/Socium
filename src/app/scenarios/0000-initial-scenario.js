import * as THREE from 'three';

import BuildGridModule from '../modules/BuildGrid.js';

export default class InitialScenario {
  Scene;
  Camera;

  constructor(Parameters) {
    this.Camera = Parameters.Camera;
    this.Scene = Parameters.Scene;

    this.Scene.fog = new THREE.Fog(0x000000, 100, 500);

    const BuildGrid = BuildGridModule();
    this.Scene.add(BuildGrid);

    // ―――― Object to observation ――――――――――――――――――――――――――――――――――――――――――― //
    // const CubeSize = 5;
    // const CubeMesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(CubeSize, CubeSize, CubeSize),
    //   new THREE.MeshBasicMaterial({ color: 'tomato' })
    // );
    // this.Scene.add(CubeMesh);


    this.ZeroPosition = new THREE.Vector3(0, 0, 0);

        this.Camera.position.set(0, 100, 0);
        this.Camera.lookAt(this.ZeroPosition);


    // Need create extented scene object (project)
    // DISABLED && (this.Scene.AnimationList = (this.Scene.AnimationList || []))
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
        // console.debug(`Woops! Build not allow!`);
        return;
      }

      if(!MouseDown) {
        // console.debug(`Mouse is't down!`);
        return;
      }

      if(key in HexagoneList) {
        // console.debug(`Hexagone on ${key} exists!`);
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
    // const Observe = this.DebugBlock.add();

    const GridSize = 10;
    (this.Scene.AnimationList = (this.Scene.AnimationList || []))
      .push((timestamp) => {
        raycaster.setFromCamera(mouse, this.Camera);
        intersects = raycaster.intersectObject(BuildGrid, true);

        if(intersects && intersects[0]) {
          var { x, y, z } = intersects[0].point;

          AllowBuild = true;

          (() => {
            hX = Math.round(x / GridSize) * GridSize;
            hZ = Math.round(z / GridSize) * GridSize;

            const aX = Math.round(x / GridSize);
            const aZ = Math.round(z / GridSize);

            if(aX % 2 !== 0) {
              hX += GridSize / 2;
              hZ += GridSize / 2;
            }

            // Observe.innerHTML
            //   = `<p>GridSize: ${GridSize}</p>`
            //   + `<p>x: ${x}</p>`
            //   + `<p>z: ${z}</p>`
            //   + `<p>hX: ${hX}</p>`
            //   + `<p>hZ: ${hZ}</p>`
            //   + `<p>aX: ${aX}</p>`
            //   + `<p>aZ: ${aZ}</p>`
            // ;
          })();

          BuildPointerWrap.position.set(hX, y, hZ);
        } else {
          AllowBuild = false;
        }
      })
    ;
    // ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――― //
  }
}