import * as THREE from 'three';
import Ball from './Ball.js';
import Paddle from './Paddle.js';
import Line from './Line.js';
import Lights from './lights.js';
// import Text  from './Text.js';
import isColliding from './collision.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
/* Variables */
const centerDistanceToPaddle = 45;
var score = {player1: 0, player2: 0};
var start = false;
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
// renderer.setClearColor( 0xffffe0 );
renderer.setClearColor(0xc2f1ff);
// renderer.setClearColor(0xe5f9fe);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);
// resizeCanvas();

/* Paddle for the player */
const paddle1 = new Paddle(scene, centerDistanceToPaddle, 0, 0);
paddle1.castShadow = true;

const paddle2 = new Paddle(scene, -centerDistanceToPaddle, 0, 0);
paddle2.castShadow = true;

/* Ball for the game */
const ball = new Ball(scene);
ball.position.set(0, 0, 0);
const planeGeometry = new THREE.BoxGeometry(100, 50, 1);
// const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xf88379 }); // Coral color for the plane
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xf88379,
  roughness: 0.4,
  metalness: 0.3,
  emissive: 0xf88379,
  emissiveIntensity: 0.15,
  transparent: true 
  });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = - Math.PI / 2; // Rotate the plane to lie flat
plane.position.y = -2; // Position the plane below the cube
plane.receiveShadow = true; // Enable shadows for the plane
plane.renderOrder = 1; // Ensure the plane is rendered first
scene.add(plane);


const Box = new THREE.BoxGeometry(2, 50.1, 1.1);

const BoxMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
const BoxMesh = new THREE.Mesh(Box, BoxMaterial);

BoxMesh.rotation.x = - Math.PI / 2;
BoxMesh.position.y = -2;
BoxMesh.renderOrder = 0;
scene.add(BoxMesh);

// const axesHelper = new THREE.AxesHelper(10)
// scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const lights = new Lights(scene);

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

document.addEventListener('keydown', (event) => {
  switch (event.key) {
  case 's':
    keys.s.pressed = true;
    break;
  case 'S':
    keys.s.pressed = true;
    break; 
  case 'w':
    keys.w.pressed = true;
    break;
  case 'W':
    keys.w.pressed = true;
    break ;
  case 'ArrowUp':
    keys.arrowup.pressed = true;
    break;
  case 'ArrowDown':
    keys.arrowdown.pressed = true;
    break;
  default:
    // console.log(event.key);
    break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.key) {
  case 's':
    keys.s.pressed = false;
    break;
  case 'S':
      keys.s.pressed = false;
      break;
  case 'w':
    keys.w.pressed = false;
    break;
    case 'W':
      keys.w.pressed = false;
      break;
  case 'ArrowUp':
    keys.arrowup.pressed = false;
    break;
  case 'ArrowDown':
    keys.arrowdown.pressed = false;
    break;
  default:
    // console.log(event.key);
    break;
  }
});


window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
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

   // Check for collision
   switch (isColliding(ball.mesh, paddle1.mesh))
   {
    case 1:
      ball.velocity.x *= -1;
      break;
    case 2:
      ball.velocity.z *= -1;
      break;
    
  }

   switch (isColliding(ball.mesh, paddle2.mesh))
   {
      case 1:
        ball.velocity.x *= -1;
        break;
      case 2:
        ball.velocity.z *= -1;
        break;
  }
  // Render the scene
  renderer.render(scene, camera);
}


const sleep = async (ms)  => {
  await new Promise(resolve => {
    return setTimeout(resolve, ms);
  });
};

let animationFrameId;
function animationBeforeGame() {
  animationFrameId = requestAnimationFrame(animationBeforeGame);
  keyHandler();
  PaddleLimits();
  renderer.render(scene, camera);
}
async function startCountdown() {
  await sleep(1000);
  document.getElementById('countdown').textContent = '2';
  await sleep(1000);
  document.getElementById('countdown').textContent = '1';
  await sleep(1000);
  document.getElementById('countdown').textContent = 'GO!';
  await sleep(1000);
  document.getElementById('right-keys').hidden = true;
  document.getElementById('left-keys').hidden = true;
}

if (!start) {
  animationBeforeGame();
  await startCountdown();
  document.getElementById('right-keys').hidden = true;
  document.getElementById('left-keys').hidden = true;
  document.getElementById('countdown').hidden = true;
  document.getElementById('score').style.visibility = 'visible';
  ball.velocity = new THREE.Vector3(1, 0, (Math.random() * 1).toFixed(2)).multiplyScalar(ball.speed);
  cancelAnimationFrame(animationFrameId);
  start = true;
  
}

animate();

// Create a new FontLoader instance
const fontLoader = new FontLoader();

// Load the font file
fontLoader.load('./fonts/helvetiker_regular.typeface.json', function(font) {
  // Create the text geometry with the loaded font
  const textGeometry = new TextGeometry('GOAL!', {
    font: font, // Use the loaded font here
    size: 5,
    depth: 1,
    curveSegments: 12, // Optional: Adjusts the smoothness of the text
  });

  // Create a material for the text
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // Create a mesh from the text geometry and material
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  // Optionally, set the position of the text
  textMesh.position.set(0, 0, 0); // Adjust as needed

  textMesh.lookAt(camera.position);
  // Add the textMesh to your scene
  // textMesh.visible = false
  textMesh.name = 'goalText';
  textMesh.position.set(-10, 0, 0);
  textMesh.visible = false;
  scene.add(textMesh);

});

// const text = new Text(scene, 'GOAL!', './fonts/helvetiker_regular.typeface.json', 5, 1, 0xffffff, 'goalText', new THREE.Vector3(0, 0, 0), camera.position);
// text.show();

ball.addEventListener('goal', (from) => {

  scene.getObjectByName('goalText').visible = true;
  if (from.player === 'player1') {
    score.player1 += 1;
  }
  else if (from.player === 'player2') {
    score.player2 += 1;
  }
  
  document.getElementById('score').textContent = `Score ${score.player1} - ${score.player2}`;
  console.log(score);
  setTimeout(() => {
    ball.velocity.x *= -1;
    /* Random Display Direction */
    ball.velocity.z = 10 * Math.random() * (Math.random() > 0.5 ? 1 : -1);
    ball.position.set(0, 0, 0);
    scene.getObjectByName('goalText').visible = false;
    ball.mesh.visible = true;
    console.log('Goal!');

  }, 2000);
});

