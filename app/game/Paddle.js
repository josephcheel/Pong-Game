import { Mesh, MeshStandardMaterial, BoxGeometry, Vector3 } from 'three';

export default class Paddle {
	constructor(scene, x, y, z) {
		this.scene = scene;
		this.size = { x: 1, y: 2, z: 6 };
		this.geometry = new BoxGeometry(this.size.x, this.size.y, this.size.z);
		this.material = new MeshStandardMaterial({
			color: 0xe0fff,//0x0F97FF,//0xfc7e1e, //0xfaa666, //0xe0fff,
			roughness: 0.5,
			metalness: 0.2,
			emissive: 0xe0fff,
			emissiveIntensity: 0.2,
			transparent: true
			});
			
		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.receiveShadow = true; 
		this.mesh.position.set(x, y, z);
		this.mesh.castShadow = true;
		this.position = this.mesh.position;
		this.velocity = new Vector3();
		this.scene.add(this.mesh);
	}
}