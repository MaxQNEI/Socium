import * as THREE from 'three';

export default function BuildGridModule() {
    const Grid = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(10000, 10000, 10, 10),
        new THREE.MeshBasicMaterial({ color: 'tomato', wireframe: true, transparent: true, opacity: 0 })
    );

    const GridWrap = new THREE.Object3D();

    Grid.rotation.x = -(Math.PI / 2);

    GridWrap.add(Grid);

    return Grid;
}
