import { AmbientLight, DirectionalLight, PointLight,  } from 'three';

export default class Light {
	constructor(scene) {
		this.scene = scene;
		this.ambientLight = new AmbientLight(0xffffff, 0.9);
		this.scene.add(this.ambientLight);
		
		this.directionalLight = new DirectionalLight(0xffffff, 0.8);
		this.directionalLight.position.set(10, 2, 10);
		// this.directionalLight.castShadow = true; // Enable shadows for the light
		// this.directionalLight.shadow.mapSize.width = 1024;
		// this.directionalLight.shadow.mapSize.height = 1024;
		// this.directionalLight.shadow.camera.near = 0.1;
		// this.directionalLight.shadow.camera.far = 50;
		
		// this.recLight = new RectAreaLight(0xffffff, 1000, 100, 100);
		// this.recLight.position.set(10, 30, 10);
		// this.recLight.lookAt(0, 0, 0);
		// this.recLight.castShadow = true;
		// scene.add(this.recLight);

		// helper  = new RectAreaLightHelper( this.recLight );
		// scene.add( helper );

		this.pointLight = new PointLight(0xffffff, 1000, 1000);
		this.pointLight.position.set(0, 30, 0);
		this.scene.add(this.pointLight);


		// this.hemisphereLight = new HemisphereLight(0xffffbb, 0x080820, 1);
		// this.hemisphereLight.position.set(0, 1, 0);
		// this.scene.add(this.hemisphereLight);

		this.scene.add(this.directionalLight);
	}
}