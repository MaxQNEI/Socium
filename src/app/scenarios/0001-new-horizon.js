import * as THREE from 'three';

import { Random } from '../../core/helpers/Random.js';

export default class NewHorizonScenario {
  Scene;
  Camera;

  Map = {};

  constructor(Parameters) {
    this.Camera = Parameters.Camera;
    this.Scene = Parameters.Scene;

    this.Scene.fog = new THREE.Fog(0x000000, 0, 500);

    this.AddStats();

    this.Light();
    this.PrepareView();

    // this.Generate();
    // this.Apply();
  }

  AddStats() {
    var div = document.createElement('div');

    Object.assign(div.style, {
      display: 'none',

      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 10000,
      minWidth: '100px',
      minHeight: '1px',
      padding: '10px',
      backgroundColor: 'rgba(255, 255, 255, .75)',
      color: '#222222',
    });

    document.body.appendChild(div);

    this.Stats = div;

    this.Stats.CameraPosition = document.createElement('h2');
    this.Stats.appendChild(this.Stats.CameraPosition);

    this.Stats.GroundSize = document.createElement('h2');
    this.Stats.appendChild(this.Stats.GroundSize);
  }

  PrepareView() {
    const ZeroPoint = new THREE.Vector3(0, 0, 0);
    this.Camera.position.set(0, 100, 0);
    this.Camera.rotation.x = -(Math.PI / 4);

    this.Scene.AnimationList.push((timestamp) => {
      this.Camera.position.z -= .5;
    });


    const op = { x: null, z: null };
    this.Scene.OnRender.push((timestamp) => {
      let x = Math.round(this.Camera.position.x);
      let z = Math.round(this.Camera.position.z);

      this.Stats.CameraPosition.innerHTML = `${x} x ${z}<br>${op.x} x ${op.z}`;

      if(op.x !== x || op.z !== z) {
        this.UpdGround();

        op.x = x;
        op.z = z;
      }
    });
  }

  UpdGround(X = Math.round(this.Camera.position.x), Z = Math.round(this.Camera.position.z)) {
    var FromX = 30;
    var FromZ = 20;

    for(var x = X-FromX; x < X+FromX; x++) {
      this.Map[x] = this.Map[x] || {};

      for(var z = Z-FromZ; z < Z+FromZ; z++) {
        this.Map[x][z] = this.Map[x][z] || this.AddCell({
            r: 20,
            h: 0,
            x: x,
            y: 0,
            z: z,
          });
      }
    }
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
    this.HLight = new THREE.HemisphereLight(0x9F9FFA, 0xCCCCCC, 1);
    this.Scene.add(this.HLight);
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