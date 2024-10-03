import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three';

export default class Stadium{
  constructor(scene) {
	const planeGeometry = new BoxGeometry(100, 50, 1);
	const planeMaterial = new MeshStandardMaterial({
	color: 0xf88379,//0xf88379,//0x9dc1fa,
	roughness: 0.3,
	metalness: 0.25,
	emissive: 0xf88379,//0xf88379,
	emissiveIntensity: 0.1,
	});

	const plane = new Mesh(planeGeometry, planeMaterial);
	plane.rotation.x = - Math.PI / 2;
	plane.position.y = -2;
	plane.receiveShadow = true;
	scene.add(plane);

	const Box = new BoxGeometry(2, 50.1, 1.1);

	const BoxMaterial = new MeshStandardMaterial({
	color: 0xffffff,//0xf88379,//0x9dc1fa,
	roughness: 0.3,
	metalness: 0.25,
	emissive: 0xffffff,//0xf88379,
	emissiveIntensity: 0.1,
	});
	const BoxMesh = new Mesh(Box, BoxMaterial);

	BoxMesh.rotation.x = - Math.PI / 2;
	BoxMesh.position.y = -2;
	BoxMesh.renderOrder = 0;
	scene.add(BoxMesh);
  }
}