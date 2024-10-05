import { MeshStandardMaterial, Mesh, MathUtils } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export default class Text {
	constructor(scene, text, fontPath, size, depth, color, name, position, cameraPosition)
	{
		this.scene = scene;
		this.text = text;
		this.fontPath = fontPath;
		this.size = size;
		this.depth = depth;
		this.color = color;
		this.name = name;
		this.position = position;
		this.cameraPosition = cameraPosition;
		this.bevelThickness = 1;
		this.bevelSize = 0.35;

		this.fontLoader = new FontLoader();
		this.fontLoader.load(this.fontPath, (font) => {
		this.textGeometry = new TextGeometry(this.text, {
				font: font,
				size: this.size,
				depth: this.depth,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: this.bevelThickness,
				bevelSize: this.bevelSize,
				color: this.color,
				curveSegments: 4,
			});

			this.textMaterial = new MeshStandardMaterial({
				color: this.color,
				roughness: 0.4,
				metalness: 0.3,
				emissive: this.color,
				emissiveIntensity: 0.4,
			});

			this.textMesh = new Mesh(this.textGeometry, this.textMaterial);

			this.textMesh.lookAt(this.cameraPosition);
			this.textMesh.name = this.name;
			this.textMesh.position.set(this.position.x - 15, this.position.y + 35, this.position.z  + 10);
			this.textMesh.visible = false;
			this.scene.add(this.textMesh);
			this.textMesh.castShadow = true;
			this.textMesh.receiveShadow = true;
		});
	}
	show()
	{
		this.textMesh.visible = true;
	}

	hide()
	{
		this.textMesh.visible = false;
	}
	
	rotate(x, y, z)
	{
		if (this.textMesh) {
			this.textMesh.rotation.set(
				MathUtils.degToRad(x),
				MathUtils.degToRad(y),
				MathUtils.degToRad(z)
			);
		} else {
			console.warn('textMesh is not yet created.');
		}
	}
	 createText(newText) {
        // Remove the old mesh (if it exists)
        if (this.textMesh) {
            this.scene.remove(textMesh);
        }

        // Create a new text geometry
        let textGeometry = new TextGeometry(newText, {
            font: this.font,
            size: 1, // Size of the text
            height: 0.2, // Depth of the text
            curveSegments: 12, // Quality of the curve segments
            bevelEnabled: false, // Add bevel if needed
        });

        // Create a material for the text
        let textMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

        // Create a new mesh with the text geometry and material
        textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Optionally, center the text
        textGeometry.computeBoundingBox();
        // Add the new text to the scene
        scene.add(textMesh);
    }
}
