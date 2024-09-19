import * as THREE from 'three';
import Ball from './Ball.js';
import Paddle from './Paddle.js';
import Lights from './lights.js';
import isColliding from './collision.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { keys, userInput } from './userInput.js';
import Text from './Text.js';
/* Variables */
const centerDistanceToPaddle = 45;
var score = {player1: 0, player2: 0};
var start = false;
var MaxGoals = 5;

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

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xc2f1ff);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

/* Paddle for the player */
const paddle1 = new Paddle(scene, centerDistanceToPaddle, 0, 0);
paddle1.castShadow = true;

const paddle2 = new Paddle(scene, -centerDistanceToPaddle, 0, 0);
paddle2.castShadow = true;

/* Ball for the game */
const ball = new Ball(scene);
ball.position.set(0, 0, 0);
const planeGeometry = new THREE.BoxGeometry(100, 50, 1);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xf88379,
  roughness: 0.4,
  metalness: 0.25,
  emissive: 0xf88379,
  emissiveIntensity: 0.1,
  });

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = - Math.PI / 2;
plane.position.y = -2;
plane.receiveShadow = true;
scene.add(plane);

const Box = new THREE.BoxGeometry(2, 50.1, 1.1);

const BoxMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
const BoxMesh = new THREE.Mesh(Box, BoxMaterial);

BoxMesh.rotation.x = - Math.PI / 2;
BoxMesh.position.y = -2;
BoxMesh.renderOrder = 0;
scene.add(BoxMesh);

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const lights = new Lights(scene);

userInput();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const clock = new THREE.Clock();

function keyHandler(event) {
  let speedModifier = 0.9;
  if (keys.s.pressed)
  {
      paddle2.position.z +=  speedModifier; 
      // paddle2.velocity.x = -speedModifier * 10;
  }
  else if (keys.w.pressed)
  {
    paddle2.position.z -=  speedModifier;
    // paddle2.velocity.x = -speedModifier * 10;
  }
  if (keys.arrowdown.pressed)
  {
    paddle1.position.z += speedModifier;
    // paddle1.velocity.x = -speedModifier * 10;
  }
  else if (keys.arrowup.pressed)
  { 
    paddle1.position.z -= speedModifier;
    // paddle1.velocity.x = speedModifier * 10
  }
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

let animationFrameIdanimate;

function animate() {
  animationFrameIdanimate = requestAnimationFrame(animate);
 
  // Update sphere position based on keys
  const deltaTime = clock.getDelta();
  ball.update(deltaTime);
  keyHandler();
  PaddleLimits();

  //  Check for collision
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
  
  // handleCollision(ball, paddle1);
  // handleCollision(ball, paddle2);
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

async function startGame() {
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


if (!start) {
  startGame();
}

animate();

const text = new Text(scene, 'GOAL!', './fonts/kenney_rocket_regular.json', 5, 1, 0xFFF68F, 'goalText', new THREE.Vector3(2, 0, 0), camera.position);
const endText = new Text(scene, 'END', './fonts/kenney_rocket_regular.json', 5, 1, 0xFFF68F, 'goalText', new THREE.Vector3(5, 0, 0), camera.position);

function restart()
{
  location.reload();
}

function updateScore(from)
{
  if (from.player === 'player1') {
    score.player1 += 1;
  }
  else if (from.player === 'player2') {
    score.player2 += 1;
  }
  document.getElementById('score').textContent = `Score ${score.player1} - ${score.player2}`;
  console.log(score);
}

ball.addEventListener('goal', (from) => {

  text.show();
  updateScore(from);
  
  if (score.player1 === MaxGoals || score.player2 === MaxGoals){
    document.getElementById('score').textContent = `End of the game!`;
    text.hide();
    endText.show();
    setTimeout(() => {
      restart();
    }, 2000);
  }
  else {
    setTimeout(() => {
      ball.velocity.x *= -1;
      /* Random Display Direction */
      ball.velocity.z = 10 * Math.random() * (Math.random() > 0.5 ? 1 : -1);
      ball.position.set(0, 0, 0);
      text.hide();
      ball.mesh.visible = true;
      console.log('Goal!');
    
    }, 2000);
  }
});

