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
    this.Camera.position.set(0, 10, 0);
    this.Camera.lookAt(ZeroPoint);

    this.Scene.AnimationList.push((timestamp) => {
      this.Camera.position.x = (Math.sin(timestamp / 5000) * 20);
      this.Camera.position.z = (Math.cos(timestamp / 5000) * 20);
      this.Camera.rotation.y = (Math.sin(timestamp / 5000));
      // this.Camera.lookAt(ZeroPoint);
    });
  }

  Generate() {
    function axis(size) {
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

    Object.keys(this.Map).some((x) => {
      Object.keys(this.Map).some((z) => {
        this.Map[x][z] = this.AddCell({
          r: 5,
          h: 1,
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
    Light.castShadow = true;
    this.Scene.add(Light);
  }

  // Helpers ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――― //
  AddCell({r, h, x, y, z} = params) {
    const s = r;

    const Rnd = Random(40, 180);
    const Color = `rgb(${Rnd}, ${Rnd}, ${Rnd})`;

    const Material = new THREE.MeshBasicMaterial({ color: Color });
    // const Material = new THREE.MeshStandardMaterial({ color: Color });

    const Mesh = new THREE.Mesh(
      // new THREE.CylinderBufferGeometry(s, s, h, 6),
      new THREE.CylinderGeometry(s, s, h, 6),
      // new THREE.ConeBufferGeometry(s, s, h, 6),

      // new THREE.MeshBasicMaterial({ color: 0xCCCCCC, transparent: true, opacity: .95 })
      // new THREE.MeshStandardMaterial({ color: 0xCCCCCC })
      // new THREE.MeshBasicMaterial({ color: Random(0xD0D0D0, 0xDFDFDF) })
      Material
    );

    Mesh.receiveShadow = true;
    Mesh.castShadow = true;

    Mesh.scale.x += 0.155;

    Mesh.position.x = ((x * (r * 2)) - (x * r));
    Mesh.position.y = y || 0;
    Mesh.position.z = ((z * (r * 2)) + (x % 2 !== 0 ? r * 1.5 : 0)) + (z * r);




    this.Scene.add(Mesh);

    return Mesh;
  }
}