import { Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from 'three';

export default class Ball {

	speed = 10;
	velocity = new Vector3(1, 0, 0);
	constructor(scene) {
		this.scene = scene;
		this.geometry = new SphereGeometry(1, 32, 32);
		
		this.material = new MeshBasicMaterial({ color: 0x2ecc71 });
		
		this.mesh = new Mesh(this.geometry, this.material);
		this.position = this.mesh.position;

		this.velocity.multiplyScalar(this.speed);
		this.scene.add(this.mesh);
	}

	update(dt) {
		// calculate displacement
		const displacement = this.velocity.clone().multiplyScalar(dt);
		
		// calculate new position adding displacement
		const FinalPos = this.position.clone().add(displacement);

		// set new position
		this.position.copy(FinalPos);
	}
}