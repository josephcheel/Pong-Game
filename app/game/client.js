import io from 'socket.io-client';

const socket = io('ws://localhost:4000');

socket.on('connect', () => {
	console.log('Connected to server');
	socket.emit('chat message', 'Hello from client');
	io.on('startGame', () => {
		console.log('Game started');
	});
});
