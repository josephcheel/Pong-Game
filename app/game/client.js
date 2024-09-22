import io from 'socket.io-client';
import { updatePaddlePosition, updateBallPosition, startGame } from './index.js';
const socket = io('ws://localhost:4000');

var PlayerNb = undefined; 

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
	

	socket.on('set-cookie', (cookie) => {
		// Set the cookie in the browser using JavaScript
		document.cookie = `${cookie.name}=${cookie.value}; path=${cookie.options.path}; expires=${cookie.options.expires}`;
		console.log('Cookie has been set:', document.cookie);
	});
	
	socket.on('startGame', (data) => {
		// if (data.player1.id === socket.id) {
		// 	PlayerNb = 1;
		// }
		// else
		// 	PlayerNb = 2;
		startGame();
		
		console.log('Game has started');
		console.log(PlayerNb);
		
	});

	socket.on('gameFull', () => {
		console.log('Game is full');
	});

	socket.on('updatePlayer', (data) => {
		// console.log(data);
		// if (data.id !== socket.id) {
			updatePaddlePosition(data)
			// console.log('padlle1:', paddle1);
			// console.log('padlle2:', paddle2);
		// }
	});


	socket.on('updateBall', (position) => {
		updateBallPosition(position);
	});
	socket.on('disconnect', () => {
		console.log('Disconnected from server');
	});

	window.addEventListener('keydown', (event) => {
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
		// console.log('UserInput');
		socket.emit('userInput', { down: keys.s.pressed, up: keys.w.pressed });
	});
	
	
		document.getElementById('down-mobile-button').addEventListener('touchstart', () => {
			socket.emit('userInput', { down: true, up: false });
		});
	  
		document.getElementById('up-mobile-button').addEventListener('touchstart', () => {
			socket.emit('userInput', { down: false, up: true });
		});
		
});

