import { Mesh, MeshBasicMaterial, SphereGeometry, Vector3, EventDispatcher, MeshNormalMaterial, MeshToonMaterial, MeshPhysicalMaterial } from 'three';

export default class Ball extends EventDispatcher {

	speed = 50;
	velocity = new Vector3(1, 0, 0);
	constructor(scene) {
		super()
		this.scene = scene;
		this.radius = 1;
		this.geometry = new SphereGeometry(this.radius, 32, 32);
		
		this.material = new MeshToonMaterial({ color: 0x2ecc71 });
		
		this.mesh = new Mesh(this.geometry, this.material);
		this.position = this.mesh.position;

		this.velocity.multiplyScalar(this.speed);
		this.scene.add(this.mesh);
		// this.objSphere = new SphereGeometry().setFromObject(this.mesh);
	}

	update(dt) {
		// calculate displacement
		const displacement = this.velocity.clone().multiplyScalar(dt);
		
		// calculate new position adding displacement
		const FinalPos = this.position.clone().add(displacement);

		this.boundaries = { x: 50, y: 25 };
		const dx = this.boundaries.x - this.radius - Math.abs(this.mesh.position.x);
		const dz = this.boundaries.y - this.radius - Math.abs(this.mesh.position.z);

		if (dx <= 0 && this.mesh.visible) {
			this.mesh.visible = false
			FinalPos.x = 0;
			FinalPos.y = 0;
			FinalPos.z = 0;		
			this.dispatchEvent({ type: 'goal'})
		}

		if (dz <= 0) {
			const z = this.mesh.position.z
			// const message = z > 0 ? 'pc' : 'player'
			// this.dispatchEvent({ type: 'ongoal', message: message })

			FinalPos.z =
				(this.boundaries.y - this.radius + dz) * Math.sign(this.mesh.position.z)
			this.velocity.z *= -1
		}

		// const paddle1 = this.scene.getObjectByName('paddle1');
		// const paddle2 = this.scene.getObjectByName('paddle2');
		
		// set new position
		this.position.copy(FinalPos);
	}
}