import { Scene, PerspectiveCamera, WebGLRenderer, Vector3, AudioListener, BoxGeometry, MeshStandardMaterial, Mesh, MeshPhongMaterial, Clock, MathUtils} from 'three'
import Ball from './Ball.js';
import Paddle from './Paddle.js';
import Lights from './lights.js';
import isColliding from './collision.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { keys, userInput } from './userInput.js';
import Text from './Text.js';
import SoundEffect from './SoundEffect.js';
/* Variables */
const CENTER_DISTANCE_TO_PADDLE = 45;
var score = {player1: 0, player2: 0};
var start = false;
var MAX_GOALS = 5;
var MAX_BALL_VELOCITY = 50;
var MIN_BALL_VELOCITY = 25;
var volumeOn = true;
/* Initialize the scene, camera, and renderer */
const scene = new Scene();

/*    Camera Settings   */
const fov = 75;
const aspect = {
  width: window.innerWidth,
  height: window.innerHeight
};

document.getElementById('volume').addEventListener('change', () => {
  const volumeButton =  document.getElementById('volume');
  if (volumeButton.checked)
    volumeOn = false;
  else
    volumeOn = true;
});

const camera = new PerspectiveCamera(fov, aspect.width / aspect.height, 0.1, 1000);
camera.position.set(0, 50, 10);
camera.lookAt(new Vector3(0, 0, 0))

const renderer = new WebGLRenderer({ antialias: true});

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xc2f1ff);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

/* Listener for the camera */
const listener = new AudioListener();
camera.add(listener);


/* Paddle for the player */
const paddle1 = new Paddle(scene, CENTER_DISTANCE_TO_PADDLE, 0, 0);
paddle1.castShadow = true;

const paddle2 = new Paddle(scene, -CENTER_DISTANCE_TO_PADDLE, 0, 0);
paddle2.castShadow = true;

/* Ball for the game */
const ball = new Ball(scene, listener);
ball.position.set(0, 0, 0);
const planeGeometry = new BoxGeometry(100, 50, 1);
const planeMaterial = new MeshStandardMaterial({
  color: 0xf88379,//0xf88379,//0x9dc1fa,
  roughness: 0.4,
  metalness: 0.25,
  emissive: 0x78ecf0,//0xf88379,
  emissiveIntensity: 0.1,
  });

const plane = new Mesh(planeGeometry, planeMaterial);
plane.rotation.x = - Math.PI / 2;
plane.position.y = -2;
plane.receiveShadow = true;
scene.add(plane);

const Box = new BoxGeometry(2, 50.1, 1.1);

const BoxMaterial = new MeshPhongMaterial({ color: 0xffffff });
const BoxMesh = new Mesh(Box, BoxMaterial);

BoxMesh.rotation.x = - Math.PI / 2;
BoxMesh.position.y = -2;
BoxMesh.renderOrder = 0;
scene.add(BoxMesh);

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

new Lights(scene);

userInput();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const clock = new Clock();

function keyHandler() {
  let speedModifier = 0.9;
  if (keys.s.pressed)
  {
      paddle2.position.z +=  speedModifier; 
      paddle2.velocity.x = -speedModifier;
  }
  else if (keys.w.pressed)
  {
    paddle2.position.z -=  speedModifier;
    paddle2.velocity.x = -speedModifier;
  }
  if (keys.arrowdown.pressed)
  {
    paddle1.position.z += speedModifier;
    paddle1.velocity.x = -speedModifier ;
  }
  else if (keys.arrowup.pressed)
  { 
    paddle1.position.z -= speedModifier;
    paddle1.velocity.x = speedModifier;
  }
 
}

function updateBallDirection(paddleDirection, ballDirection) {
  const angle = Math.random() *  (35 - 10) + 10;
  console.log(angle);
  const angleOffset = MathUtils.degToRad(angle);

  if (paddleDirection.x > 0)
      ballDirection.applyAxisAngle(new Vector3(0 ,1 ,0) , angleOffset);
  else if (paddleDirection.x < 0)
      ballDirection.applyAxisAngle(new Vector3(0 ,1 ,0), -angleOffset);
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

var collisionSound = new SoundEffect(listener, './assets/audio/beep2.mp3', 0.5);

let animationFrameIdanimate;

function animate() {
  animationFrameIdanimate = requestAnimationFrame(animate);
 
  // Update sphere position based on keys
  const deltaTime = clock.getDelta();
  ball.update(deltaTime, volumeOn);
  keyHandler();
  PaddleLimits();

  //  Check for collision
   switch (isColliding(ball.mesh, paddle1.mesh))
   {
    case 1:
      if (Math.abs(ball.velocity.x) <= MIN_BALL_VELOCITY)
      {
        if (ball.velocity.x > 0)
          ball.velocity.x = MAX_BALL_VELOCITY;
        else
          ball.velocity.x = -MAX_BALL_VELOCITY;
      }
      ball.velocity.x *= -1;
      if (ball.position.x >= 0)
        ball.position.x -= 0.3;
      else
        ball.position.x += 0.3;
      updateBallDirection(paddle1.velocity, ball.velocity);
      if (volumeOn)
        collisionSound.play();
      break;
    case 2:
      if (Math.abs(ball.velocity.x) <= MIN_BALL_VELOCITY)
      {
        if (ball.velocity.x > 0)
          ball.velocity.x = MAX_BALL_VELOCITY;
        else
          ball.velocity.x = -MAX_BALL_VELOCITY;
      }
      ball.velocity.z *= -1;
      if (ball.position.z >= 0)
        ball.position.z -= 0.3;
      else
        ball.position.z += 0.3;
      updateBallDirection(paddle1.velocity, ball.velocity);
      if (volumeOn)
        collisionSound.play();
      break;
    // case 3:
    //   console.log('Inside');
    
  }

   switch (isColliding(ball.mesh, paddle2.mesh))
   {
      case 1:
        if (Math.abs(ball.velocity.x) <= MIN_BALL_VELOCITY)
        {
          if (ball.velocity.x > 0)
            ball.velocity.x = MAX_BALL_VELOCITY;
          else
            ball.velocity.x = -MAX_BALL_VELOCITY;
        }
        ball.velocity.x *= -1;
        if (ball.position.x >= 0)
          ball.position.x -= 0.3;
        else
          ball.position.x += 0.3;//0.1;
        updateBallDirection(paddle1.velocity, ball.velocity);
        if (volumeOn)
          collisionSound.play();
        break;
      case 2:
        if (Math.abs(ball.velocity.x) <= MIN_BALL_VELOCITY)
        {
          if (ball.velocity.x > 0)
            ball.velocity.x = MAX_BALL_VELOCITY;
          else
            ball.velocity.x = -MAX_BALL_VELOCITY;
        }
        ball.velocity.z *= -1;
        if (ball.position.z >= 0)
          ball.position.z -= 0.3;
        else
          ball.position.z += 0.3;
        updateBallDirection(paddle1.velocity, ball.velocity);
        if (volumeOn)
          collisionSound.play();
        break;
      // case 3:
      //   console.log('Inside');
  }
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
  ball.velocity = new Vector3(1, 0, (Math.random() * 1).toFixed(2)).multiplyScalar(ball.speed / 2);
  ball.velocity.x = MIN_BALL_VELOCITY;
  cancelAnimationFrame(animationFrameId);
  start = true;
}

if (!start) {
  startGame();
}

animate();

const text = new Text(scene, 'GOAL!', './assets/fonts/kenney_rocket_regular.json', 5, 1, 0xFFF68F, 'goalText', new Vector3(2, 0, 0), camera.position);
const endText = new Text(scene, 'END', './assets/fonts/kenney_rocket_regular.json', 5, 1, 0xFFF68F, 'goalText', new Vector3(5, 0, 0), camera.position);

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


var endSound = new SoundEffect(listener, './assets/audio/end.wav', 0.5);
var goalSound = new SoundEffect(listener, './assets/audio/goal4.wav', 0.5);
ball.addEventListener('goal', (from) => {

  text.show();
  updateScore(from);
  
  if (score.player1 === MAX_GOALS || score.player2 === MAX_GOALS){
    document.getElementById('score').textContent = `End of the game!`;
    text.hide();
    endText.show();
    if (volumeOn)
      endSound.play();
    setTimeout(() => {
      restart();
    }, 2000);
  }
  else {
    if (volumeOn)
      goalSound.play();
    setTimeout(() => {
      let direction = undefined;
      if (ball.velocity.x > 0)
       direction = 1;
      else
        direction = -1;
      ball.velocity = new Vector3(1, 0, (Math.random() * 2 - 1).toFixed(10)).multiplyScalar(ball.speed / 2);
      ball.velocity.x = MIN_BALL_VELOCITY;
      ball.velocity.x *= direction;
      ball.position.set(0, 0, 0);
      text.hide();
      ball.mesh.visible = true;
      console.log('Goal!');
    
    }, 2000);
  }
});

