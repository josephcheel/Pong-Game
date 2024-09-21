import * as THREE from 'three';

const PADDLE_INFLUENCE = 0.5; // How much the paddle's movement influences the ball
const MAX_BALL_SPEED = 70; // Maximum speed of the ball
const BALL_ACCELERATION = 5; // How much the ball accelerates on each hit

const MAX_BOUNCE_ANGLE = Math.PI / 3; // Maximum angle the ball can bounce (60 degrees)

export function isColliding(sphere, box) {
  const boxPosition = new THREE.Vector3();
  const boxSize = new THREE.Vector3();
  const spherePosition = new THREE.Vector3();
  const closestPoint = new THREE.Vector3();
  
  // Get box properties
  box.geometry.computeBoundingBox();
  box.geometry.boundingBox.getCenter(boxPosition);
  box.geometry.boundingBox.getSize(boxSize);
  boxPosition.add(box.position);
  
  // Get sphere position
  sphere.getWorldPosition(spherePosition);
  
  // Clamp the sphere position to the box bounds
  closestPoint.copy(spherePosition).clamp(
    boxPosition.clone().sub(boxSize.clone().multiplyScalar(0.5)),
    boxPosition.clone().add(boxSize.clone().multiplyScalar(0.5))
  );
  
  // Calculate distance between closest point and sphere center
  const distance = spherePosition.distanceTo(closestPoint);
  
  if (distance < sphere.geometry.parameters.radius) {
    // Collision detected, determine which side
    const epsilon = 0.001;
    const halfSize = boxSize.clone().multiplyScalar(0.5);
    
    if (Math.abs(closestPoint.x - (boxPosition.x - halfSize.x)) < epsilon) return 'left';
    if (Math.abs(closestPoint.x - (boxPosition.x + halfSize.x)) < epsilon) return 'right';
    if (Math.abs(closestPoint.y - (boxPosition.y - halfSize.y)) < epsilon) return 'bottom';
    if (Math.abs(closestPoint.y - (boxPosition.y + halfSize.y)) < epsilon) return 'top';
    if (Math.abs(closestPoint.z - (boxPosition.z - halfSize.z)) < epsilon) return 'back';
    if (Math.abs(closestPoint.z - (boxPosition.z + halfSize.z)) < epsilon) return 'front';
    
    // If we're here, there's a collision but not on a face (e.g., edge or corner)
    return 'inside';
  }
  
  // No collision
  return false;
}

// export const handleCollision = (ball, paddle) => {
//   const collisionSide = isColliding(ball.mesh, paddle.mesh);
  
//   if (collisionSide) {
//     // Get the paddle's velocity (assuming it's stored in paddle.velocity)
//     const paddleVelocity = paddle.velocity || new THREE.Vector3();

//     switch (collisionSide) {
//       case 'left':
//       case 'right':
//         // Reverse x direction
//         ball.velocity.x *= -1;
        
//         // Add paddle's y and z velocity influence
//         ball.velocity.y += paddleVelocity.y * PADDLE_INFLUENCE;
//         ball.velocity.z += paddleVelocity.z * PADDLE_INFLUENCE;
//         break;
//       case 'front':
//       case 'back':
//         // Reverse z direction
//         ball.velocity.z *= -1;
        
//         // Add paddle's x and y velocity influence
//         ball.velocity.x += paddleVelocity.x * PADDLE_INFLUENCE;
//         ball.velocity.y += paddleVelocity.y * PADDLE_INFLUENCE;
//         break;
//       case 'top':
//       case 'bottom':
//         // Reverse y direction
//         ball.velocity.y *= -1;
        
//         // Add paddle's x and z velocity influence
//         ball.velocity.x += paddleVelocity.x * PADDLE_INFLUENCE;
//         ball.velocity.z += paddleVelocity.z * PADDLE_INFLUENCE;
//         break;
//       case 'inside':
//         // Handle edge case where ball is inside paddle
//         ball.velocity.negate();
//         break;
//     }

//     // Increase ball speed
//     ball.velocity.multiplyScalar(1 + BALL_ACCELERATION);

//     // Clamp ball speed to maximum
//     const speed = ball.velocity.length();
//     if (speed > MAX_BALL_SPEED) {
//       ball.velocity.normalize().multiplyScalar(MAX_BALL_SPEED);
//     }

//     // Move the ball slightly away from the paddle to prevent multiple collisions
//     const offset = ball.velocity.clone().normalize().multiplyScalar(0.01);
//     ball.mesh.position.add(offset);
//   }

//   return collisionSide;
// };

export const handleCollision = (ball, paddle) => {
	const collisionSide = isColliding(ball.mesh, paddle);
	
	if (collisionSide) {
	  const paddleVelocity = paddle.velocity;
	  const relativePosition = ball.mesh.position.y - paddle.position.y;
	  const normalizedRelativePosition = relativePosition / (paddle.size.y / 2);
	  
	  let bounceAngle = normalizedRelativePosition * MAX_BOUNCE_ANGLE;
	  
	  // Adjust bounce angle based on paddle velocity
	  if (paddleVelocity.y !== 0) {
		const paddleInfluence = Math.sign(paddleVelocity.y) * PADDLE_INFLUENCE;
		bounceAngle += paddleInfluence * MAX_BOUNCE_ANGLE;
	  }
	  
	  // Clamp the bounce angle
	  bounceAngle = THREE.MathUtils.clamp(bounceAngle, -MAX_BOUNCE_ANGLE, MAX_BOUNCE_ANGLE);
  
	  const speed = ball.velocity.length();
	  
	  switch (collisionSide) {
		case 'left':
		case 'right':
		  ball.velocity.set(
			Math.sign(ball.velocity.x) * Math.cos(bounceAngle) * speed * Math.random(),
			Math.sin(bounceAngle) * speed,
			ball.velocity.z
		  );
		  break;
		case 'front':
		case 'back':
		  ball.velocity.set(
			ball.velocity.x,
			Math.sin(bounceAngle) * speed,
			Math.sign(ball.velocity.z) * Math.cos(bounceAngle) * speed * Math.random()
		  );
		  break;
		case 'top':
		case 'bottom':
		  ball.velocity.y *= -1;
		  break;
		case 'inside':
		  ball.velocity.negate();
		  break;
	  }
  
	  // Increase ball speed
	  ball.velocity.multiplyScalar(1 + BALL_ACCELERATION);
  
	  // Clamp ball speed to maximum
	  const newSpeed = ball.velocity.length();
	  if (newSpeed > MAX_BALL_SPEED) {
		ball.velocity.normalize().multiplyScalar(MAX_BALL_SPEED);
	  }
  
	  // Move the ball slightly away from the paddle to prevent multiple collisions
	  const offset = ball.velocity.clone().normalize().multiplyScalar(0.01);
	  ball.mesh.position.add(offset);
	}
  
	return collisionSide;
  };