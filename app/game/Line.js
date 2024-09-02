import { Mesh, MeshBasicMaterial, BufferGeometry, Vector3 } from 'three';

export default class Line {
	constructor(scene, startPos, endPos) {
		this.scene = scene;
		const geometry = new BufferGeometry().setFromPoints([
           startPos, // Start point
            endPos  // End point
        ]);
		this.material = new MeshBasicMaterial({ color: 0x00ff00 });
		

		this.mesh = new Mesh(this.geometry, this.material);
		this.scene.add(this.mesh);
	}
}