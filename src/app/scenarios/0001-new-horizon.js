import * as THREE from 'three';

import { Random } from '../../core/helpers/Random.js';

export default class NewHorizonScenario {
  Scene;
  Camera;

  Map = {};

  constructor(Parameters) {
    this.Camera = Parameters.Camera;
    this.Scene = Parameters.Scene;

    this.Scene.fog = new THREE.Fog(0x000000, 100, 500);

    this.PrepareView();
    this.Generate();
    this.Apply();

    this.Light();
  }

  // Methods ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――― //
  PrepareView() {
    const ZeroPoint = new THREE.Vector3(0, 0, 0);
    this.Camera.position.set(0, 100, 50);
    this.Camera.lookAt(ZeroPoint);

    this.Scene.AnimationList.push((timestamp) => {
      this.Camera.position.x = (Math.sin(timestamp / 10000) * 50);
      this.Camera.position.z = (Math.cos(timestamp / 7500) * 100);
      this.Camera.lookAt(ZeroPoint);
    });
  }

  Generate() {
    function axis(size) {
      console.debug('axis()', size);

      var o = {};
      for(var x = -size; x <= size; x++) {
        o[x] = null;
      }
      return o;
    };

    this.Map = axis(5);
    Object.keys(this.Map).some((key) => {
      this.Map[key] = axis(5);
    });

    window.Map = this.Map;
  }

  Apply() {
    // console.debug('Map', this.Map);

    // window.A = this.AddCell({ r: 20, h: .1, x: 0, z: 0 });
    // window.B = this.AddCell({ r: 20, h: .1, x: 0, z: 0 });
    // window.C = this.AddCell({ r: 20, h: .1, x: 0, z: 0 });
    // window.D = this.AddCell({ r: 20, h: .1, x: 0, z: 0 });


    // this.AddCell({ r: 20, h: 0, x: 0, z: -1 });
    // this.AddCell({ r: 20, h: 0, x: 0, z: 0 });
    // this.AddCell({ r: 20, h: 0, x: 0, z: 1 });
    // this.AddCell({ r: 20, h: 0, x: 0, z: 2 });

    // this.AddCell({ r: 20, h: 0, x: 1, z: -1 });
    // this.AddCell({ r: 20, h: 0, x: 1, z: 0 });
    // this.AddCell({ r: 20, h: 0, x: 1, z: 1 });
    // this.AddCell({ r: 20, h: 0, x: 1, z: 2 });

    // this.AddCell({ r: 20, h: 0, x: 2, z: -1 });
    // this.AddCell({ r: 20, h: 0, x: 2, z: 0 });
    // this.AddCell({ r: 20, h: 0, x: 2, z: 1 });
    // this.AddCell({ r: 20, h: 0, x: 2, z: 2 });

    // this.AddCell({ r: 20, h: 0, x: 3, z: -1 });
    // this.AddCell({ r: 20, h: 0, x: 3, z: 0 });
    // this.AddCell({ r: 20, h: 0, x: 3, z: 1 });
    // this.AddCell({ r: 20, h: 0, x: 3, z: 2 });


    Object.keys(this.Map).some((x) => {
      Object.keys(this.Map).some((z) => {
        this.Map[x][z] = this.AddCell({
          r: 5,
          h: 50,
          x: x,
          // y: Math.sin(Math.pow((x * z) / 100, 2)) * 10,
          // y: ((x * z) * Math.pow((x * z), 1.5)),
          z: z,
        });
      });
    });
  }

  Light() {
    const Light = new THREE.PointLight(0xFFFFFF, 1, 1000);
    Light.position.y = 100;
    this.Scene.add(Light);
  }

  // Helpers ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――― //
  AddCell({r, h, x, y, z} = params) {
    const s = r * 1;

    const RB = Random();
    const color =

    const Mesh = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(s, s, h, 6),
      // new THREE.MeshBasicMaterial({ color: 0xCCCCCC, transparent: true, opacity: .95 })
      // new THREE.MeshStandardMaterial({ color: 0xCCCCCC })
      new THREE.MeshBasicMaterial({ color: Random(0xD0D0D0, 0xDFDFDF) })
    );

    var positionUp = (r * 2);

    var shiftDownX = 0;
    var shiftUpZ = 0;

    shiftDownX = (x * r);

    if(x % 2 !== 0) {
      // shiftDownX = r;
      shiftUpZ = r * 1.5;
    } else {
      // shiftDownX = (x * r);
    }

    Mesh.position.x = ((x * positionUp) - shiftDownX);
    Mesh.position.y = y || 0;
    Mesh.position.z = ((z * positionUp) + shiftUpZ) + (z * r);

    this.Scene.add(Mesh);

    return Mesh;
  }
}