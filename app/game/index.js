import * as THREE from 'three';
import Ball from './Ball.js';
import Paddle from './Paddle.js';
import Line from './Line.js';
import Lights from './lights.js';
import isColliding from './collision.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import Text from './Text.js';
// import { PlayerNb } from './client.js';
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

export const camera = new THREE.OrthographicCamera(-aspect.width / 2, aspect.width / 2, aspect.height / 2, -aspect.height / 2, 0.1, 1000);
// export const camera = new THREE.PerspectiveCamera(fov, aspect.width / aspect.height, 0.1, 1000);

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
export const paddle1 = new Paddle(scene, centerDistanceToPaddle, 0, 0);
paddle1.castShadow = true;


export const paddle2 = new Paddle(scene, -centerDistanceToPaddle, 0, 0);
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

// const BoxMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
const BoxMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.4,
  metalness: 0.3,
  emissive: 0xf88379,
  emissiveIntensity: 0.15,
  transparent: true 
  });
const BoxMesh = new THREE.Mesh(Box, BoxMaterial);

BoxMesh.rotation.x = - Math.PI / 2;
BoxMesh.position.y = -2;
BoxMesh.renderOrder = 0;
scene.add(BoxMesh);

// const axesHelper = new THREE.AxesHelper(10)
// scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

new Lights(scene);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const clock = new THREE.Clock();

let animationFrameIdanimate;

export function animate() {
  animationFrameIdanimate = requestAnimationFrame(animate);
 
  controls.update();
  renderer.render(scene, camera);
}

const text = new Text(scene, 'GOAL!', './fonts/kenney_rocket_regular.json', 5, 1, 0xFFF68F, 'goalText', new THREE.Vector3(2, 0, 0), camera.position);


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
  text.show();
  ball.mesh.visible = false;
}

export function continueAfterGoal()
{
  text.hide();
  ball.mesh.visible = true;
}