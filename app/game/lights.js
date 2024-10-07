import { AmbientLight, DirectionalLight, RectAreaLight, SpotLight } from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { DirectionalLightHelper, SpotLightHelper } from 'three'
export default class Light {
	constructor(scene) {
		this.scene = scene;
		this.ambientLight = new AmbientLight(0xffffff, 0.7);
		this.scene.add(this.ambientLight);
		
		this.directionalLight = new DirectionalLight(0xffffff, 1.34);
		this.directionalLight.position.set(20, 200, 10);
		this.directionalLight.castShadow = true;
		this.directionalLight.shadow.mapSize.width = 1024;
		this.directionalLight.shadow.mapSize.height = 1024;
		this.directionalLight.shadow.camera.near = 0.1;
		this.directionalLight.shadow.camera.far = 500;
		this.directionalLight.shadow.camera.left = -50;
		this.directionalLight.shadow.camera.right = 50;
		this.directionalLight.shadow.camera.top = 50;
		this.directionalLight.shadow.camera.bottom = -50;
		this.directionalLight.shadow.bias = -0.001;

		this.scene.add(this.directionalLight);
		
		// let helper;

		// let helper = new DirectionalLightHelper(this.directionalLight)
		// scene.add(helper)

		this.recLight = new RectAreaLight(0xffffff, 3, 50, 10);
		this.recLight.position.set(-51, 2, 0);
		this.recLight.rotation.y = Math.PI / -2;
		scene.add(this.recLight);
		
		// helper = new RectAreaLightHelper( this.recLight );
		// scene.add( helper );
		
		this.recLight2 = new RectAreaLight(0xffffff, 3, 50, 10);
		this.recLight2.position.set(51, 2, 0);
		this.recLight2.rotation.y = Math.PI / 2;
		scene.add(this.recLight2);
		
		// helper = new RectAreaLightHelper( this.recLight2 );
		// scene.add( helper );
		
		this.spotLight = new SpotLight(0xffffff, 8000);
		this.spotLight.position.set(-10, 100, 20);
		this.spotLight.angle = Math.PI / 20; // Narrow beam angle
		this.spotLight.penumbra = 0.1; // Soft edges
		this.spotLight.decay = 2; // Light decay over distance
		this.spotLight.distance = 200; // Maximum range of the light
		this.spotLight.castShadow = true;
		this.spotLight.shadow.mapSize.width = 1024;
		this.spotLight.shadow.mapSize.height = 1024;
		this.spotLight.shadow.camera.near = 0.1;
		this.spotLight.shadow.camera.far = 500;
		this.scene.add(this.spotLight);
		this.spotLight.target.position.set(0, 0, 0);
		
		this.scene.add(this.spotLight.target);
		this.spotLight.visible = false;
		
		// helper = new SpotLightHelper(this.spotLight);
		// this.scene.add(helper);

	}
}