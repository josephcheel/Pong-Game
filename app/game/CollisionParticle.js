import * as THREE from 'three';

export default class CollisionParticle {
	constructor(position) {
		this.position = position;
		this.particles = [];
		this.particleCount = 100;
		this.createParticles();
	}

	createParticles() {
		const geometry = new THREE.BufferGeometry();
		const vertices = [];
		const colors = [];
		const sizes = [];

		for (let i = 0; i < this.particleCount; i++) {
			const x = this.position.x + (Math.random() - 0.5) * 2;
			const y = this.position.y + (Math.random() - 0.5) * 2;
			const z = this.position.z + (Math.random() - 0.5) * 2;
			vertices.push(x, y, z);

			// Add color variation
			const color = new THREE.Color(Math.random(), Math.random(), Math.random());
			colors.push(color.r, color.g, color.b);

			// Add size variation
			sizes.push(Math.random() * 0.2 + 0.1);
		}

		geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
		geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

		const material = new THREE.PointsMaterial({
			vertexColors: true,
			size: 0.1,
			sizeAttenuation: true,
			transparent: true,
			opacity: 0.8
		});
		this.particles = new THREE.Points(geometry, material);
	}

	addToScene(scene) {
		scene.add(this.particles);
		this.animateParticles();
		setTimeout(() => {
			scene.remove(this.particles);
		}, 5000);
	}

	animateParticles() {
		const animate = () => {
			requestAnimationFrame(animate);

			const positions = this.particles.geometry.attributes.position.array;
			for (let i = 0; i < positions.length; i += 3) {
				positions[i] += (Math.random() - 0.5) * 0.1;
				positions[i + 1] += (Math.random() - 0.5) * 0.1;
				positions[i + 2] += (Math.random() - 0.5) * 0.1;
			}
			this.particles.geometry.attributes.position.needsUpdate = true;
		};
		animate();
	}
}
