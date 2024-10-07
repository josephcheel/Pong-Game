import { Mesh, MeshBasicMaterial,ClampToEdgeWrapping, SphereGeometry, Vector3, EventDispatcher, MeshStandardMaterial, MeshNormalMaterial, MeshToonMaterial, MeshPhysicalMaterial, TextureLoader, RepeatWrapping, EquirectangularReflectionMapping, DoubleSide} from 'three';
import SoundEffect from './SoundEffect.js';
export default class Ball extends EventDispatcher {

	speed = 50;
	velocity = new Vector3(0, 0, 0);
	constructor(scene, listener) {
		super()
		this.scene = scene;
		this.radius = 1;
		this.geometry = new SphereGeometry(this.radius, 32, 32);
		
		// this.material = new MeshToonMaterial({ color: 0x2ecc71 });
		// const textureLoader = new TextureLoader();
		// const colorMapTexture = textureLoader.load('./gr.png', function (texture) {
		// 	texture.mapping = EquirectangularReflectionMapping;
		// 	texture.wrapS = ClampToEdgeWrapping;
		// 	texture.wrapS = ClampToEdgeWrapping;
		// 	// texture.repeat.set(1, 1);  // Set how many times the texture repeats across the sphere
		// 	texture.center.set(0.5, 0.5);
		// 	texture.rotation = Math.PI / 2;
		//   });
		this.material = new MeshStandardMaterial({
			color: 0xff0000, // red color
			roughness: 0.1,
			metalness: 0.2,
			emissive: 0x98FF98,
			emissiveIntensity: 0.05,
			transparent: true,
			// map: colorMapTexture,
			side: DoubleSide
		  });
		
	
		this.mesh = new Mesh(this.geometry, this.material);
		this.position = this.mesh.position;

		this.mesh.castShadow = true;
		this.receiveShadow = true;
		this.velocity.multiplyScalar(this.speed);
		this.scene.add(this.mesh);

		// To change the texture edge connection
		this.mesh.rotation.z = Math.PI / 2;
		// this.objSphere = new SphereGeometry().setFromObject(this.mesh);

		// Load a sound and set it as the audio object's buffer
		this.wallSound = new SoundEffect(listener, './assets/audio/beep.mp3', 0.5);
	
		
	}

	update(dt) {
		// calculate displacement
		const displacement = this.velocity.clone().multiplyScalar(dt);
		
		// calculate new position adding displacement
		const FinalPos = this.position.clone().add(displacement);

		this.boundaries = { x: 50, y: 25 };
		const dx = this.boundaries.x - this.radius - Math.abs(FinalPos.x);
		const dz = this.boundaries.y - this.radius - Math.abs(FinalPos.z);

		if (dx <= 0 && this.mesh.visible) {
			this.mesh.visible = false
			if (FinalPos.x > 0) {
				this.dispatchEvent({ type: 'goal', player: 'player1' })
				
			}
			else {
				this.dispatchEvent({ type: 'goal', player: 'player2' })
			}
			FinalPos.x = 0;
			FinalPos.y = 0;
			FinalPos.z = 0;
		}

		if (dz <= 0) {
			const z = FinalPos.z;
			// const message = z > 0 ? 'pc' : 'player'
			// this.dispatchEvent({ type: 'ongoal', message: message })
			// sound.play();
			if (!this.wallSound.sound.isPlaying && this.mesh.visible) {
				this.wallSound.play();
			}
			FinalPos.z =
				(this.boundaries.y - this.radius + dz) * Math.sign(FinalPos.z);
			this.velocity.z *= -1;
		}

		// set new position
		this.position.copy(FinalPos);
	}
}