import * as THREE from 'three';

export default function BuildGridModule() {
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

  return BuildGridWrap;
}
