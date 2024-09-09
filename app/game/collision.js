import * as THREE from 'three';

export default function isColliding(sphere, box) {
	const boxPosition = new THREE.Vector3();
	const boxSize = new THREE.Vector3();
	box.geometry.computeBoundingBox();
	box.geometry.boundingBox.getCenter(boxPosition);
	box.geometry.boundingBox.getSize(boxSize);
  
	// Box center
	boxPosition.add(box.position);
  
	// Compute the closest point on the box to the sphere's center
	const spherePosition = new THREE.Vector3();
	sphere.getWorldPosition(spherePosition);
  
	// Clamp the sphere position to the box bounds
	const closestPoint = new THREE.Vector3().copy(spherePosition).clamp(
		boxPosition.clone().sub(boxSize.clone().multiplyScalar(0.5)),
		boxPosition.clone().add(boxSize.clone().multiplyScalar(0.5))
	);
  
	// Calculate distance between closest point and sphere center
	const distance = spherePosition.distanceTo(closestPoint);

	if (distance < sphere.geometry.parameters.radius)
	{
		if (Math.abs(closestPoint.x - (boxPosition.x - boxSize.x * 0.5)) < 0.001) {
			return 1
			// collisionSide = 'left';
		} else if (Math.abs(closestPoint.x - (boxPosition.x + boxSize.x * 0.5)) < 0.001) {
			// collisionSide = 'right';
			return 1
		}

		if (Math.abs(closestPoint.z - (boxPosition.z - boxSize.z * 0.5)) < 0.001) {
			// collisionSide = 'back';
			return 2
		} else if (Math.abs(closestPoint.z - (boxPosition.z + boxSize.z * 0.5)) < 0.001) {
			// collisionSide = 'front';
			return 2
		}
	}
	return 0

	return distance < sphere.geometry.parameters.radius;
  }
  