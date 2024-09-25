import { Vector3 } from 'three';

export default function isColliding(sphere, box) {
	const boxPosition = new Vector3();
	const boxSize = new Vector3();
	box.geometry.computeBoundingBox();
	box.geometry.boundingBox.getCenter(boxPosition);
	box.geometry.boundingBox.getSize(boxSize);
  
	// Box center
	boxPosition.add(box.position);
  
	// Compute the closest point on the box to the sphere's center
	const spherePosition = new Vector3();
	sphere.getWorldPosition(spherePosition);
  
	// Clamp the sphere position to the box bounds
	const closestPoint = new Vector3().copy(spherePosition).clamp(
		boxPosition.clone().sub(boxSize.clone().multiplyScalar(0.5)),
		boxPosition.clone().add(boxSize.clone().multiplyScalar(0.5))
	);
  
	// Calculate distance between closest point and sphere center
	const distance = spherePosition.distanceTo(closestPoint);

	const epsilon = 0.01;
	const halfSize = boxSize.clone().multiplyScalar(0.5);
	if (distance < sphere.geometry.parameters.radius)
	{
		if (Math.abs(closestPoint.x - (boxPosition.x - halfSize.x)) < epsilon) {
			return 1
			// collisionSide = 'left';
		} else if (Math.abs(closestPoint.x - (boxPosition.x + halfSize.x)) < epsilon) {
			// collisionSide = 'right';
			return 1
		}

		if (Math.abs(closestPoint.z - (boxPosition.z - halfSize.z)) < epsilon) {
			// collisionSide = 'back';
			return 2
		} else if (Math.abs(closestPoint.z - (boxPosition.z + halfSize.z)) < epsilon) {
s
			return 2
		}
		return 3
	}
	return 0
  }
  