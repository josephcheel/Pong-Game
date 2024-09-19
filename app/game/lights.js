import { AmbientLight, DirectionalLight, PointLight, RectAreaLight } from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { DirectionalLightHelper } from 'three'
export default class Light {
	constructor(scene) {
		this.scene = scene;
		this.ambientLight = new AmbientLight(0xffffff, 0.5);
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
		
		// let helper = new DirectionalLightHelper(this.directionalLight)
		// scene.add(helper)

		this.recLight = new RectAreaLight(0xffffff, 3, 50, 10);
		this.recLight.position.set(-50, 2, 0);
		this.recLight.rotation.y = Math.PI / -2;
		scene.add(this.recLight);

		this.recLight2 = new RectAreaLight(0xffffff, 3, 50, 10);
		this.recLight2.position.set(50, 2, 0);
		this.recLight2.rotation.y = Math.PI / 2;
		scene.add(this.recLight2);


		// helper = new RectAreaLightHelper( this.recLight2 );
		// scene.add( helper );
		// helper = new RectAreaLightHelper( this.recLight );
		// scene.add( helper );

	}
}