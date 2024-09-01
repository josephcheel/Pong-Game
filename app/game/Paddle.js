import { Mesh, MeshPhongMaterial, BoxGeometry } from 'three';

export default class Paddle {
	constructor(scene, x, y, z) {
		this.scene = scene;
		this.geometry = new BoxGeometry(1, 2, 5);
		this.material = new MeshPhongMaterial({ color: 0xe0fff });
		
		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.position.set(x, y, z);

		this.position = this.mesh.position;
		this.scene.add(this.mesh);
	}
}