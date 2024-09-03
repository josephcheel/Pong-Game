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
  
	// Check if the distance is less than the sphere's radius
	return distance < sphere.geometry.parameters.radius;
  }
  