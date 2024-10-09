import io from 'socket.io-client';
import { changeCameraPosition, updatePaddlePosition, updateBallPosition, animate, continueAfterGoal, goal, endGame, playPaddleCollision, playWallCollision, before_start_light, start_light, visibleFollowPlayer } from './index.js';
// import * as os from 'os'

// const interfaces = os.networkInterfaces();
// let ipAddress;
// for (const inter in interfaces) {
//     for (const details of interfaces[inter]) {
//         // Check if the address is an IPv4 address and not a loopback address
//         if (details.family === 'IPv4' && !details.internal) {
//             ipAddress = details.address;
//             break;
//         }
//     }
//     if (ipAddress) break;
// }

// import { camera } from './index.js';
// const socket = io('ws://192.168.1.43:4000', {

const socket = io("ws://localhost:4000", {
	
	// withCredentials: true,
});


let PlayerNb = undefined;

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


socket.on('connect', () => {
	console.log('Connected to server');
	
	// socket.emit('chat message', 'Hello from client');
	
	document.getElementById('countdown-container').style.visibility = 'hidden';
	socket.on('set-cookie', (cookies) => {
		console.log('Setting cookies', cookies);
		for (let cookie of cookies) {
			document.cookie = `${cookie.name}=${cookie.value}; path=${cookie.options.path}; expires=${cookie.options.expires}`;
			console.log('Cookie has been set:', document.cookie);
		}
	});
	
	socket.on('countdown-3', (players) => {
		document.getElementById('countdown-container').style.visibility = 'visible';
		let keys = document.getElementsByClassName('keys');
		for (let i = 0; i < keys.length; i++) 
			keys[i].style.visibility = 'visible';
		before_start_light()
		if (players.player1.id == socket.id)
			visibleFollowPlayer(1)
		else if (players.player2.id == socket.id)
			visibleFollowPlayer(2)
	});

	socket.on('countdown-2', () => {
		// document.getElementById('countdown-container').style.visibility = 'visible';
		
		document.getElementById('countdown').textContent = '2';
	});

	socket.on('countdown-1', () => {
		document.getElementById('countdown').textContent = '1';
	});

	socket.on('countdown-GO', () => {
		document.getElementById('countdown').textContent = 'GO!';
		
	});

	socket.on('countdown-end', () => {
		start_light()
		document.getElementById('right-keys').hidden = true;
		document.getElementById('left-keys').hidden = true;
		document.getElementById('countdown').hidden = true;
		document.getElementById('score').style.visibility = 'visible';
	});
	socket.on('startGame', (data) => {
		// if (data.player1.id === socket.id) {
		// 	PlayerNb = 1;
		// 	changeCameraPosition(1);
		// 	// console.log('Player 1');
		// 	// camera.position.set(60, 5, 0);
		// }
		// else
		// {
		// 	changeCameraPosition(2);
		// 	// console.log('Player 2');
		// 	// camera.position.set(-60, 5, 0);
		// 	PlayerNb = 2;
		// }
		
		let elements = document.getElementsByClassName('waiting-screen');

		for (let i = 0; i < elements.length; i++) {
			elements[i].style.display = 'none';
		}
		
		// startGame();
		animate();
		
		console.log('Game has started');
		console.log(PlayerNb);
		// if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {	
			// if (PlayerNb === 1)
			// 	changeCameraPosition(1);
			// // 	// camera.position.set(-80, 5, 0);
			// else if (PlayerNb === 2)
			// 	changeCameraPosition(2);
			// camera.lookAt(new THREE.Vector3(0, 0, 0));
			// camera.fov = 150;
		// }
		
	});

	socket.on('reconnect', (data) => {
		console.log('Reconnected to server');

		updateBallPosition(data.ball);
		
	});

	socket.on('updatePlayer', (player) => {
		// console.log(data);
		// if (data.id !== socket.id) {
			updatePaddlePosition(player)
	});

	socket.on('goal_scored', (PlayerNb) => {
		goal(PlayerNb);
	});

	socket.on('continue_after_goal', () => {
		continueAfterGoal()
	});
	socket.on('updateBall', (position) => {
		updateBallPosition(position);
	});
	socket.on('disconnect', () => {
		console.log('Disconnected from server');
	});

	socket.on('roomLeft', (message) => {
		console.log(message); // This will log 'You have been removed from the room'
		alert('You have left the room.');
	  });
	
	socket.on('endGame', () => {
		endGame();
	});
	socket.on('closeTheGame', () => {
		location.reload();
	});
	socket.on('colision-paddle', () => {
		playPaddleCollision();
	});

	socket.on('colision-wall', () => {
		playWallCollision();
	});
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
			break;
		}
		socket.emit('userInput', { down: keys.s.pressed, up: keys.w.pressed });
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
		}
		socket.emit('userInput', { down: keys.s.pressed, up: keys.w.pressed });
	});
	
	
		document.getElementById('down-mobile-button').addEventListener('touchstart', () => {
			if (PlayerNb !== 1) return;
			socket.emit('userInput', { down: false, up: true });
		});
		document.getElementById('down-mobile-button').addEventListener('touchend', () => {
			if (PlayerNb !== 1) return;
			socket.emit('userInput', { down: false, up: false });
		});
		document.getElementById('up-mobile-button').addEventListener('touchstart', () => {
			if (PlayerNb !== 1) return;
			socket.emit('userInput', { down: true, up: false });
		});
		document.getElementById('up-mobile-button').addEventListener('touchend', () => {
			if (PlayerNb !== 1) return;
			socket.emit('userInput', { down: false, up: false });
		});
		document.getElementById('down-mobile-button').addEventListener('touchstart', () => {
			if (PlayerNb !== 2) return;
			socket.emit('userInput', { down: true, up: false });
		});
		document.getElementById('down-mobile-button').addEventListener('touchend', () => {
			if (PlayerNb !== 2) return;
			socket.emit('userInput', { down: false, up: false });
		});
		document.getElementById('up-mobile-button').addEventListener('touchstart', () => {
			if (PlayerNb !== 2) return;
			socket.emit('userInput', { down: false, up: true });
		});
		document.getElementById('up-mobile-button').addEventListener('touchend', () => {
			if (PlayerNb !== 2) return;
			socket.emit('userInput', { down: false, up: false });
		});
	
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		document.getElementById('up-mobile-button').style.visibility = 'visible';
		document.getElementById('down-mobile-button').style.visibility = 'visible';
		document.getElementById('down-mobile-button').addEventListener('touchstart', () => {
			if (PlayerNb !== 1) return;
			socket.emit('userInput', { down: false, up: true });
		});
		document.getElementById('down-mobile-button').addEventListener('touchend', () => {
			if (PlayerNb !== 1) return;
			socket.emit('userInput', { down: false, up: false });
		});
		document.getElementById('up-mobile-button').addEventListener('touchstart', () => {
			if (PlayerNb !== 1) return;
			socket.emit('userInput', { down: true, up: false });
		});
		document.getElementById('up-mobile-button').addEventListener('touchend', () => {
			if (PlayerNb !== 1) return;
			socket.emit('userInput', { down: false, up: false });
		});
		document.getElementById('down-mobile-button').addEventListener('touchstart', () => {
			if (PlayerNb !== 2) return;
			socket.emit('userInput', { down: true, up: false });
		});
		document.getElementById('down-mobile-button').addEventListener('touchend', () => {
			if (PlayerNb !== 2) return;
			socket.emit('userInput', { down: false, up: false });
		});
		document.getElementById('up-mobile-button').addEventListener('touchstart', () => {
			if (PlayerNb !== 2) return;
			socket.emit('userInput', { down: false, up: true });
		});
		document.getElementById('up-mobile-button').addEventListener('touchend', () => {
			if (PlayerNb !== 2) return;
			socket.emit('userInput', { down: false, up: false });
		});
	}
});

