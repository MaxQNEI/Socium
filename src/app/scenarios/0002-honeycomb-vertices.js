import * as THREE from 'three';

import { Random } from '../../core/helpers/Random.js';

export default class HoneycombVerticesScenario {
  Scene;
  Camera;

  Hexagone = {
    Radius: 10,
  };

  Ground = {
    Geometry: null,
    Material: null,
    Mesh: null,

    Chunk: {
      Size: 8,
      List: {},
    },
  };

  Vertices = {};
  Faces = [];

  constructor(Parameters) {
    this.Camera = Parameters.Camera;
    this.Scene = Parameters.Scene;
    this.ZeroPosition = new THREE.Vector3(0, 0, 0);

    this.Camera.position.set(0, 700, 0);
    this.Camera.lookAt(this.ZeroPosition);

    // this.Scene.AnimationList.push((timestamp) => {
    //   this.Camera.position.y += 1;
    // });

    this.CameraControls();



    this.Chunk(-2, -1, { show: true });
    this.Chunk(-1, 0, { show: true });
    this.Chunk(0, 0, { show: true });
    this.Chunk(1, 0, { show: true });
    this.Chunk(2, 0, { show: true });
    this.Chunk(1, 1, { show: true });
    this.Chunk(1, 2, { show: true });
  }

  CameraControls() {

    const debug = document.createElement('div');
    Object.assign(debug.style, {
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 1,

      backgroundColor: 'rgba(255, 255, 255, .8)',
      color: '#333333',
    });
    document.body.appendChild(debug);


    const debugCamera = document.createElement('h4');
    debug.appendChild(debugCamera);

    const AnimatePositionY = {
      duration: 200,
      use: false,
      start: 0,
      end: 0,
      prevY: 0,
      diffY: 0,
      newY: 0,
      handle: (y) => {
        const a = AnimatePositionY;

        if(!a.use) { return; }

        const p = 1 - Math.max(0, Math.min(1, (a.end - Date.now()) / a.duration));
        const d = Math.pow(p, 1.1);

        this.Camera.position.y = a.prevY - (a.diffY * d);
        // this.Camera.position.y = a.prevY - a.diffY;

        debugCamera.innerHTML = ([
          `Camera: ${this.Camera.position.y}`,
          '',
          `a.start: ${a.start}`,
          `a.end: ${a.end}`,
          `a.prevY: ${a.prevY}`,
          `a.diffY: ${a.diffY}`,
          `a.newY: ${a.newY}`,
          '',
          `p: ${p}`,
        ]).join('<br>');

        if(p >= 1) { a.use = false; }
      },
      animate: (y) => {
        const a = AnimatePositionY;

        a.start = Date.now();
        a.end = a.start + a.duration;
        a.newY = (a.use ? a.newY : this.Camera.position.y) - y;

        a.newY = Math.max(100, Math.min(2000, a.newY));

        a.prevY = this.Camera.position.y;
        a.diffY = a.prevY - a.newY;

        a.use = true;
      },
    };

    this.Scene.AnimationList.push((timestamp) => {
      AnimatePositionY.handle(timestamp);
    });


    var NormalZoomSize = 100;
    var LargeZoomSize = 500;

    window.addEventListener('wheel', (event) => {
      if(!event.deltaY) {
        return;
      }

      const ZoomIn = (event.deltaY < 0);

      var NewZoom;

      ZoomIn && (NewZoom = (event.shiftKey ? LargeZoomSize : NormalZoomSize));
      !ZoomIn && (NewZoom = -(event.shiftKey ? LargeZoomSize : NormalZoomSize));

      AnimatePositionY.animate(NewZoom);
    });
  }

  Chunk(x, z, params) {
    const ChunkKey = (x +'x'+ z);

    if(this.Ground.Chunk.List.hasOwnProperty(ChunkKey)) {
      return this.Ground.Chunk.List[ChunkKey];
    }

    const ChunkColor = (() => {
      const c = Random(100, 200);
      return `rgb(${c}, ${c}, ${c})`;
    })();

    const Geometry = new THREE.Geometry();
    const Material = new THREE.MeshBasicMaterial({ color: ChunkColor, vertexColors: THREE.FaceColors, transparent: true, opacity: 1 });
    const Mesh = new THREE.Mesh(Geometry, Material);


    const hexRadius = this.Hexagone.Radius;
    const chunkSize = this.Ground.Chunk.Size;

    const chunkRadius = Math.round(this.Ground.Chunk.Size / 2);

    const shiftX = -(x * 9);

    const startX = (((x * (hexRadius * 2)) - chunkRadius * 3) - 1) - shiftX;
    const endX = (((x * (hexRadius * 2)) + chunkRadius * 3) + 2) - shiftX + 1;
    const startZ = ((z * hexRadius) - chunkRadius) - 1;
    const endZ = ((z * hexRadius) + chunkRadius);


    // Минус??
    // const startX = (x);
    // const endX = (x + chunkSize);
    // const startZ = (z);
    // const endZ = (z + chunkSize);

    for(var _x = startX; _x <= endX; _x++) {
      for(var _z = startZ; _z <= endZ; _z++) {

        ((x, z) => {
          const absX = ((x * (hexRadius * 2)) - (x * hexRadius));
          const absZ = ((z * (hexRadius * 2)) + (x % 2 !== 0 ? hexRadius * 1.5 : 0)) + (z * hexRadius);

          // center cell vertice index
          const ccvi = Geometry.vertices.length;

          const faceColor = (() => {
            const c = Random(80, 160);
            return new THREE.Color(`rgb(${c}, ${c}, ${c})`)
          })();

          var vertices, faces;

          Geometry.vertices.push.apply(Geometry.vertices, vertices = [
            // Center
            new THREE.Vector3(absX,           0,    absZ),
            // Top
            new THREE.Vector3(absX,           0,    absZ - hexRadius),
            // Top-Left
            new THREE.Vector3(absX - hexRadius,  0,    absZ - (hexRadius / 2)),
            // Bottom-Left
            new THREE.Vector3(absX - hexRadius,  0,    absZ + (hexRadius / 2)),
            // Bottom
            new THREE.Vector3(absX,           0,    absZ + hexRadius),
            // Bottom-Right
            new THREE.Vector3(absX + hexRadius,  0,    absZ + (hexRadius / 2)),
            // Top-Right
            new THREE.Vector3(absX + hexRadius,  0,    absZ - (hexRadius / 2)),
          ]);

          Geometry.faces.push.apply(Geometry.faces, faces = [
            new THREE.Face3((ccvi+0), (ccvi+1), (ccvi+2), null, faceColor),
            new THREE.Face3((ccvi+0), (ccvi+2), (ccvi+3), null, faceColor),
            new THREE.Face3((ccvi+0), (ccvi+3), (ccvi+4), null, faceColor),
            new THREE.Face3((ccvi+0), (ccvi+4), (ccvi+5), null, faceColor),
            new THREE.Face3((ccvi+0), (ccvi+5), (ccvi+6), null, faceColor),
            new THREE.Face3((ccvi+0), (ccvi+6), (ccvi+1), null, faceColor),
          ]);
        })(_x, _z);

      }
    }

    const Chunk = this.Ground.Chunk.List[ChunkKey] = Object.defineProperties({}, {
      Key: { enumerable: true, value: ChunkKey },
      Geometry: { enumerable: true, value: Geometry },
      Material: { enumerable: true, value: Material },
      Mesh: { enumerable: true, value: Mesh },

      Show: { enumerable: true, value: () => {
        this.Scene.add(Mesh);
      } },
      Hide: { enumerable: true, value: () => {
        this.Scene.remove(Mesh);
      } },
    });

    params.show && Chunk.Show();

    return Chunk;
  }

  Cell(x, z) { /* TODO */ }

  Point(x, z, color = 'gray') {
    const Point = new THREE.Mesh(
      new THREE.CircleBufferGeometry(1, 32),
      new THREE.MeshBasicMaterial({ color: color })
    );

    Point.position.set(x, 0, z);
    Point.rotation.x = -Math.PI / 2;

    this.Scene.add(Point);

    return [x, z];
  }

}
