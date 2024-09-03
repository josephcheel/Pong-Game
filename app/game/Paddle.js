import { Mesh, MeshPhongMaterial, BoxGeometry, Box3, Box3Helper } from 'three';

export default class Paddle {
	constructor(scene, x, y, z) {
		this.scene = scene;
		this.size = { x: 1, y: 2, z: 5 };
		this.geometry = new BoxGeometry(this.size.x, this.size.y, this.size.z);
		this.material = new MeshPhongMaterial({ color: 0xe0fff });
		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.position.set(x, y, z);
		
		this.position = this.mesh.position;
		this.scene.add(this.mesh);
	}
}