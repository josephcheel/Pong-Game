
import { BufferGeometry, BufferAttribute, PointsMaterial, Points } from 'three';
export default class Particles {
	constructor (scene)
	{
		this.scene = scene;
		this.particles = [];
		this.particleCount = 10000;
		this.particleGeometry = new BufferGeometry();
		this.particleMaterial = new PointsMaterial({ color: 0x888888, size: 0.2 });
		this.particlePositions = new Float32Array(this.particleCount * 3);
		this.particleVelocities = new Float32Array(this.particleCount * 0.5);
		this.particleGeometry.setAttribute('position', new BufferAttribute(this.particlePositions, 3));
		this.particleGeometry.setAttribute('velocity', new BufferAttribute(this.particleVelocities, 0.5));
		this.particleSystem = new Points(this.particleGeometry, this.particleMaterial);
		this.scene.add(this.particleSystem);
		this.initParticles();
	}
	initParticles()
	{
		for (let i = 0; i < this.particleCount; i++)
		{
			this.particlePositions[i * 3 + 0] = Math.random() * 100 - 50;
			this.particlePositions[i * 3 + 1] = Math.random() * 100 - 50;
			this.particlePositions[i * 3 + 2] = Math.random() * 100 - 50;
			this.particleVelocities[i * 3 + 0] = Math.random() * 2 - 1;
			this.particleVelocities[i * 3 + 1] = Math.random() * 2 - 1;
			this.particleVelocities[i * 3 + 2] = Math.random() * 2 - 1;
		}
	}
	updateParticles()
	{
		for (let i = 0; i < this.particleCount; i++)
		{
			this.particlePositions[i * 3 + 0] += this.particleVelocities[i * 3 + 0];
			this.particlePositions[i * 3 + 1] += this.particleVelocities[i * 3 + 1];
			this.particlePositions[i * 3 + 2] += this.particleVelocities[i * 3 + 2];
			if (this.particlePositions[i * 3 + 0] > 50) this.particlePositions[i * 3 + 0] = -50;
			if (this.particlePositions[i * 3 + 0] < -50) this.particlePositions[i * 3 + 0] = 50;
			if (this.particlePositions[i * 3 + 1] > 50) this.particlePositions[i * 3 + 1] = -50;
			if (this.particlePositions[i * 3 + 1] < -50) this.particlePositions[i * 3 + 1] = 50;
			if (this.particlePositions[i * 3 + 2] > 50) this.particlePositions[i * 3 + 2] = -50;
			if (this.particlePositions[i * 3 + 2] < -50) this.particlePositions[i * 3 + 2] = 50;
		}
		this.particleGeometry.attributes.position.needsUpdate = true;
	}
	update()
	{
		this.updateParticles();
	}
}