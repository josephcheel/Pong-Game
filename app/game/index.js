import * as THREE from 'three';
import Ball from './Ball.js';
import Paddle from './Paddle.js';
import Line from './Line.js';
import Lights from './lights.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/* Initialize the scene, camera, and renderer */
const scene = new THREE.Scene();

/*    Camera Settings   */
const fov = 75;
const aspect = {
  width: window.innerWidth,
  height: window.innerHeight
};
const camera = new THREE.PerspectiveCamera(fov, aspect.width / aspect.height, 0.1, 1000);
camera.position.set(0, 50, 10);
camera.lookAt(new THREE.Vector3(0, 0, 0))

const renderer = new THREE.WebGLRenderer();
// const renderer = new THREE.WebGLRenderer({ antialias: window.devicePixelRatio < 2, logarithmicDepthBuffer: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffe0 );
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);
// resizeCanvas();

/* Paddle for the player */

const paddle1 = new Paddle(scene, 25, 0, 0);
paddle1.castShadow = true;

const paddle2 = new Paddle(scene, -25, 0, 0);
paddle2.castShadow = true;

/* Ball for the game */
const ball = new Ball(scene);

const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)


/**
 * OrbitControls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// const line = new Line(scene, new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 10, 10));

// Create a plane geometry and material as the floor

const planeGeometry = new THREE.BoxGeometry(100, 50, 1);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xf88379 }); // Coral color for the plane
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = - Math.PI / 2; // Rotate the plane to lie flat
plane.position.y = -2; // Position the plane below the cube
plane.receiveShadow = true; // Enable shadows for the plane
scene.add(plane);

// const line = new THREE.Line

const lights = new Lights(scene);
// Add a directional light source
// const light = new THREE.DirectionalLight(0xffffff, 0.8);
// light.position.set(10, 10, 10);
// light.castShadow = true; // Enable shadows for the light
// light.shadow.mapSize.width = 1024;
// light.shadow.mapSize.height = 1024;
// light.shadow.camera.near = 0.1;
// light.shadow.camera.far = 50;
// scene.add(light);

// Ambient light to illuminate all sides evenly
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
// scene.add(ambientLight);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  arrowup: {
    pressed: false,
  },
  arrowdown: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  shift: {
    pressed: false,
  },
};

// function resizeCanvas() {
  
// }

document.addEventListener('keydown', (event) => {
  switch (event.key) {
  case 's':
    keys.s.pressed = true;
    break;
  case 'w':
    keys.w.pressed = true;
    break;
  case 'ArrowUp':
    keys.arrowup.pressed = true;
    break;
  case 'ArrowDown':
    keys.arrowdown.pressed = true;
    break;
  case 'Shift':
    keys.shift.pressed = true;
    break;
  default:
    console.log(event.key);
    break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.key) {
  case 's':
    keys.s.pressed = false;
    break;
  case 'w':
    keys.w.pressed = false;
    break;
  case 'ArrowUp':
    keys.arrowup.pressed = false;
    break;
  case 'ArrowDown':
    keys.arrowdown.pressed = false;
    break;
  case 'Shift':
    keys.shift.pressed = false;
    break;
  default:
    console.log(event.key);
    break;
  }
});

const clock = new THREE.Clock();

function keyHandler(event) {
  let speedModifier = 0.9;
  if (keys.s.pressed)
     paddle2.position.z +=  speedModifier; 
   else if (keys.w.pressed)
     paddle2.position.z -=  speedModifier;
 
   if (keys.arrowdown.pressed)
     paddle1.position.z += speedModifier;
   else if (keys.arrowup.pressed)
     paddle1.position.z -= speedModifier;
 
}

function PaddleLimits() {
  if (paddle1.position.z > 22)
    paddle1.position.z = 22;
  else if (paddle1.position.z < -22)
    paddle1.position.z = -22;

  if (paddle2.position.z > 22)
    paddle2.position.z = 22;
  else if (paddle2.position.z < -22)
    paddle2.position.z = -22;
}

function animate() {
  requestAnimationFrame(animate);

  // Update sphere position based on keys
  const deltaTime = clock.getDelta();
  ball.update(deltaTime);

  keyHandler();
  PaddleLimits();
  
  // Render the scene
  renderer.render(scene, camera);
}
animate();


window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
