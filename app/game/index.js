import * as THREE from 'three';
import Ball from './Ball.js';
import Paddle from './Paddle.js';
import Lights from './lights.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Text from './Text.js';
// import { Scene, PerspectiveCamera, WebGLRenderer, Vector3, AudioListener, BoxGeometry, MeshStandardMaterial, Mesh, MeshPhongMaterial, Clock, MathUtils, OrthographicCamera} from 'three'
import { keys, userInput } from './userInput.js';

import SoundEffect from './SoundEffect.js';
import Stadium from './Stadium.js';
import Clouds from './Clouds.js';
// import { PlayerNb } from './client.js';
/* Variables */
const CENTER_DISTANCE_TO_PADDLE = 45;
var score = {player1: 0, player2: 0};
export var PLAYER = 0



/* Initialize the scene, camera, and renderer */
const scene = new THREE.Scene();

/*    Camera Settings   */
const fov = 75;
const aspect = {
  width: window.innerWidth,
  height: window.innerHeight
};

// export const camera = new THREE.OrthographicCamera(-aspect.width / 2, aspect.width / 2, aspect.height / 2, -aspect.height / 2, 0.1, 1000);
export const camera = new THREE.PerspectiveCamera(fov, aspect.width / aspect.height, 0.1, 1000);

camera.position.set(0, 50, 10);
camera.lookAt(new THREE.Vector3(0, 0, 0))







const renderer = new THREE.WebGLRenderer({antialias: true});
// const renderer = new THREE.WebGLRenderer({ antialias: window.devicePixelRatio < 2, logarithmicDepthBuffer: true });
renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setClearColor( 0xffffe0 );
renderer.setClearColor(0xc2f1ff);
// renderer.setClearColor(0xe5f9fe);
renderer.shadowMap.enabled = true;

// document.body.appendChild(renderer.domElement);
document.getElementById('canvas').appendChild(renderer.domElement);
// resizeCanvas();

scene.fog = new THREE.Fog(0xffffff, 0.1, 200)


/* Listener for the camera */
const listener = new THREE.AudioListener();
camera.add(listener);

var endSound = new SoundEffect(listener, './assets/audio/end.wav', 0.5);
var goalSound = new SoundEffect(listener, './assets/audio/goal4.wav', 0.5);
var paddlecollisionSound = new SoundEffect(listener, './assets/audio/beep2.mp3', 0.5);
var wallCollisionSound = new SoundEffect(listener, './assets/audio/beep.mp3', 0.5);
document.getElementById('volume').addEventListener('change', () => {
  const volumeButton =  document.getElementById('volume');
  if (volumeButton.checked)
    listener.setMasterVolume(0);
  else
    listener.setMasterVolume(0.5);
});



/* Paddle for the player */
export const paddle1 = new Paddle(scene, CENTER_DISTANCE_TO_PADDLE, 0, 0);
paddle1.castShadow = true;


export const paddle2 = new Paddle(scene, -CENTER_DISTANCE_TO_PADDLE, 0, 0);
paddle2.castShadow = true;

/* Ball for the game */
const ball = new Ball(scene);
ball.position.set(0, 0, 0);

new Stadium(scene);
new Clouds(scene);
// const axesHelper = new THREE.AxesHelper(10)
// scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const lights = new Lights(scene);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});


let animationFrameIdanimate;

export function animate() {
  animationFrameIdanimate = requestAnimationFrame(animate);
 
  if (PLAYER)
      visibleFollowPlayer(PLAYER)
  controls.update();
  renderer.render(scene, camera);
}

export function visibleFollowPlayer(playerNb)
{
  if (playerNb == 2)
  {
    lights.spotLight.target.position.set(paddle1.position.x, paddle1.position.y, paddle1.position.z )
    console.log("PLAYER1")
    PLAYER = 2
    // scene.add(lights.spotLight.target)
  }
  else if (playerNb == 1)
  {
    
    lights.spotLight.target.position.set(paddle2.position.x, paddle2.position.y, paddle2.position.z);
    // scene.add(lights.spotLight.target);
    PLAYER = 1
    console.log("PLAYER2")
  }
  // lights.spotLight.visible = true;
  lights.spotLight.intensity = 50000
}

export function before_start_light()
{
  lights.directionalLight.visible = true;
  lights.recLight.visible = false;
  lights.recLight2.visible = false;
  lights.spotLight.visible = true
}

export function start_light()
{
  lights.directionalLight.visible = true;
  lights.recLight.visible = true;
  lights.recLight2.visible = true;
  lights.spotLight.angle = Math.PI / 20;
  lights.spotLight.visible = false
  lights.spotLight.intensity = 7000
  lights.spotLight.target.position.set(0,0,0)
  scene.fog = undefined
  PLAYER = 0
}

const text = new Text(scene, 'GOAL!', './assets/fonts/kenney_rocket_regular.json', 5, 1, 0xFFF68F, 'goalText', new THREE.Vector3(2, 0, 0), camera.position);
const endText = new Text(scene, 'END', './assets/fonts/kenney_rocket_regular.json', 5, 1, 0xFFF68F, 'goalText', new THREE.Vector3(5, 0, 0), camera.position);

export function updatePaddlePosition(player)
{
    if (player.nb === 1 && paddle1)// && start))
    {
        paddle1.position.z = player.z;
    }
    else if (player.nb === 2 && paddle2)// && start)
    {
        paddle2.position.z = player.z;
    }

}

export function updateBallPosition(position)
{
  ball.position.set(position.x, position.y, position.z);
  // console.log('updateBall');
}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  document.getElementById('up-mobile-button').style.visibility = 'visible';
  document.getElementById('down-mobile-button').style.visibility = 'visible';
  // console.log('PlayerNb:', PlayerNb);

}

export function changeCameraPosition(playerNb)
{
  if (playerNb === 1)
  {
    camera.position.set(-50, 70, 0);
    // camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
  else if (playerNb === 2)
  {
    camera.position.set(50, 70, 0);
    // camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
}

export function goal(PlayerNb)
{
  if (PlayerNb === 1)
    score.player1 += 1;
  else if (PlayerNb === 2)
    score.player2 += 1;
  document.getElementById('score').textContent = `Score ${score.player1} - ${score.player2}`;
  lights.spotLight.visible = true
  text.show();
  goalSound.play();
  ball.mesh.visible = false;
}

export function endGame()
{
  document.getElementById('score').textContent = `End of the game!`;
  endText.show();
  endSound.play();
  ball.mesh.visible = false;
  console.log('End of the game');
  // setTimeout(() => {
  //   restart();
  // }, 2000);
}

export function continueAfterGoal()
{
  lights.spotLight.visible = false
  text.hide();
  ball.mesh.visible = true;
}

export function playWallCollision()
{
  if (ball.mesh.visible === true)
    wallCollisionSound.play();
}

export function playPaddleCollision()
{
  if (ball.mesh.visible === true)
    paddlecollisionSound.play();
}



// const camera = new OrthographicCamera(-aspect.width / 2, aspect.width / 2, aspect.height / 2, -aspect.height / 2, 0.1, 1000);

// const camera = new PerspectiveCamera(fov, aspect.width / aspect.height, 0.1, 1000);

// const renderer = new WebGLRenderer({ antialias: true});

// renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setClearColor(0xc2f1ff);
// renderer.shadowMap.enabled = true;
// document.getElementById('canvas').appendChild(renderer.domElement);




// const particles = new Particles(scene);

/* Paddle for the player */
// const paddle1 = new Paddle(scene, CENTER_DISTANCE_TO_PADDLE, 0, 0);
// paddle1.castShadow = true;

// const paddle2 = new Paddle(scene, -CENTER_DISTANCE_TO_PADDLE, 0, 0);
// paddle2.castShadow = true;

// /* Ball for the game */
// // const ball = new Ball(scene, listener);
// ball.position.set(0, 0, 0);






// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true

// const lights = new Lights(scene);

// userInput();

// window.addEventListener('resize', () => {
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
// });

// const clock = new Clock();

// function keyHandler() {
//   let speedModifier = 0.9;
//   if (keys.s.pressed)
//   {
//       paddle2.position.z +=  speedModifier; 
//       paddle2.velocity.x = -speedModifier;
//   }
//   else if (keys.w.pressed)
//   {
//     paddle2.position.z -=  speedModifier;
//     paddle2.velocity.x = -speedModifier;
//   }
//   if (keys.arrowdown.pressed)
//   {
//     paddle1.position.z += speedModifier;
//     paddle1.velocity.x = -speedModifier ;
//   }
//   else if (keys.arrowup.pressed)
//   { 
//     paddle1.position.z -= speedModifier;
//     paddle1.velocity.x = speedModifier;
//   }
 
// }

// function updateBallDirection(paddleDirection, ballDirection) {
//   const angle = Math.random() *  (35 - 10) + 10;
//   console.log(angle);
//   const angleOffset = MathUtils.degToRad(angle);

//   if (paddleDirection.x > 0)
//       ballDirection.applyAxisAngle(new Vector3(0 ,1 ,0) , angleOffset);
//   else if (paddleDirection.x < 0)
//       ballDirection.applyAxisAngle(new Vector3(0 ,1 ,0), -angleOffset);
// }

// // function PaddleLimits() {
// //   if (paddle1.position.z > 22)
// //     paddle1.position.z = 22;
// //   else if (paddle1.position.z < -22)
// //     paddle1.position.z = -22;

// //   if (paddle2.position.z > 22)
// //     paddle2.position.z = 22;
// //   else if (paddle2.position.z < -22)
// //     paddle2.position.z = -22;
// // }


// let animationFrameIdanimate;

// function animate() {

//   if (animationFrameIdanimate)
//     cancelAnimationFrame(animationFrameIdanimate);
//   animationFrameIdanimate = requestAnimationFrame(animate);

//   // Update sphere position based on keys
//   const deltaTime = clock.getDelta();
//   ball.update(deltaTime);
//   keyHandler();
//   PaddleLimits();

//   //  Check for collision
//    switch (isColliding(ball.mesh, paddle1.mesh))
//    {
//     case 1:
//       if (Math.abs(ball.velocity.x) <= MIN_BALL_VELOCITY)
//       {
//         if (ball.velocity.x > 0)
//           ball.velocity.x = MAX_BALL_VELOCITY;
//         else
//           ball.velocity.x = -MAX_BALL_VELOCITY;
//       }
//       ball.velocity.x *= -1;
//       if (ball.position.x >= 0)
//         ball.position.x -= 0.3;
//       else
//         ball.position.x += 0.3;
//       updateBallDirection(paddle1.velocity, ball.velocity);
//       collisionSound.play();
//       break;
//     case 2:
//       if (Math.abs(ball.velocity.x) <= MIN_BALL_VELOCITY)
//       {
//         if (ball.velocity.x > 0)
//           ball.velocity.x = MAX_BALL_VELOCITY;
//         else
//           ball.velocity.x = -MAX_BALL_VELOCITY;
//       }
//       ball.velocity.z *= -1;
//       if (ball.position.z >= 0)
//         ball.position.z -= 0.3;
//       else
//         ball.position.z += 0.3;
//         collisionSound.play();
//       break;
//   }
  
//    switch (isColliding(ball.mesh, paddle2.mesh))
//    {
//       case 1:
//         if (Math.abs(ball.velocity.x) <= MIN_BALL_VELOCITY)
//         {
//           if (ball.velocity.x > 0)
//             ball.velocity.x = MAX_BALL_VELOCITY;
//           else
//             ball.velocity.x = -MAX_BALL_VELOCITY;
//         }
//         ball.velocity.x *= -1;
//         if (ball.position.x >= 0)
//           ball.position.x -= 0.3;
//         else
//           ball.position.x += 0.3;//0.1;
        
//         updateBallDirection(paddle1.velocity, ball.velocity);
//         collisionSound.play();
        
//         break;
//       case 2:
//         if (Math.abs(ball.velocity.x) <= MIN_BALL_VELOCITY)
//         {
//           if (ball.velocity.x > 0)
//             ball.velocity.x = MAX_BALL_VELOCITY;
//           else
//             ball.velocity.x = -MAX_BALL_VELOCITY;
//         }
//         ball.velocity.z *= -1;
//         if (ball.position.z >= 0)
//           ball.position.z -= 0.3;
//         else
//           ball.position.z += 0.3;
//         // updateBallDirection(paddle1.velocity, ball.velocity);
//         collisionSound.play();
//         break;
//   }
//   renderer.render(scene, camera);
// }

// const sleep = async (ms)  => {
//   await new Promise(resolve => {
//     return setTimeout(resolve, ms);
//   });
// };

// let animationFrameId;
// function animationBeforeGame() {
//   animationFrameId = requestAnimationFrame(animationBeforeGame);
//   keyHandler();
//   PaddleLimits();
//   camera.lookAt(new Vector3(0, 0, 0));
//   if (camera.position.y < 15)
//     camera.position.y += 0.2;
//   else
//     camera.position.y += 0.4;
//   camera.position.z += 0.1;
//   if (camera.position.y > 50)
//     camera.position.y = 50;
//   if (camera.position.z > 10)
//     camera.position.z = 10;
//   renderer.render(scene, camera);
// }
// async function startCountdown() {
//   await sleep(2000);
//   document.getElementById('countdown').textContent = '2';
//   await sleep(1000);
//   document.getElementById('countdown').textContent = '1';
//   await sleep(1000);
//   document.getElementById('countdown').textContent = 'GO!';
//   await sleep(1000);
// }

// async function startGame() {
//   animationBeforeGame();
//   await startCountdown();
//   console.log('camera', camera.position);
//   camera.position.set(0, 50, 10);
//   camera.lookAt(new Vector3(0, 0, 0));
//   document.getElementById('right-keys').hidden = true;
//   document.getElementById('left-keys').hidden = true;
//   document.getElementById('countdown').hidden = true;
//   document.getElementById('score').style.visibility = 'visible';
//   ball.velocity = new Vector3(1, 0, (Math.random() * 1).toFixed(2)).multiplyScalar(ball.speed / 2);
//   ball.velocity.x = MIN_BALL_VELOCITY;
//   cancelAnimationFrame(animationFrameId);
//   animate();
// }

// startGame();

// const text = new Text(scene, 'GOAL!', './assets/fonts/kenney_rocket_regular.json', 5, 1, 0xFFF68F, 'goalText', new Vector3(2, 0, 0), camera.position);

// function restart()
// {
//   location.reload();
// }

// function playAgain()
// {
//   document.getElementById('score').style.visibility = 'hidden';
//   score = {player1: 0, player2: 0};
//   document.getElementById('score').textContent = `Score ${score.player1} - ${score.player2}`;
//   ball.position.set(0, 0, 0);
  
//   ball.velocity.set(0, 0, 0);
//   ball.mesh.visible = true;
//   endText.hide();
//   document.getElementById('right-keys').hidden = false;
//   document.getElementById('left-keys').hidden = false;
//   startGame();

// }

// function updateScore(from)
// {
//   if (from.player === 'player1') {
//     score.player1 += 1;
//   }
//   else if (from.player === 'player2') {
//     score.player2 += 1;
//   }
//   document.getElementById('score').textContent = `Score ${score.player1} - ${score.player2}`;
//   console.log(score);
// }


// ball.addEventListener('goal', (from) => {

//   text.show();
//   lights.spotLight.visible = true;
//   updateScore(from);
  
//   if (score.player1 === MAX_GOALS || score.player2 === MAX_GOALS){
//     document.getElementById('score').textContent = `End of the game!`;
//     text.hide();
//     endText.show();
//     endSound.play();
//     setTimeout(() => {
//       restart();
//     }, 2000);
//   }
//   else {
//     goalSound.play();
//     setTimeout(() => {
//       let direction = undefined;
//       if (ball.velocity.x > 0)
//        direction = 1;
//       else
//         direction = -1;
//       ball.velocity = new Vector3(1, 0, (Math.random() * 2 - 1).toFixed(10)).multiplyScalar(ball.speed / 2);
//       ball.velocity.x = MIN_BALL_VELOCITY;
//       ball.velocity.x *= direction;
//       ball.position.set(0, 0, 0);
//       text.hide();
//       lights.spotLight.visible = false;
//       ball.mesh.visible = true;
//       console.log('Goal!');
    
//     }, 2000);
//   }
// });

