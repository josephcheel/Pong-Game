const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
// const { hash } = require('crypto');
const crypto = require('crypto');
const { instrument } = require('@socket.io/admin-ui');
const cors = require('cors');

class Vector3 {
    constructor(x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Ball {
    constructor(position, velocity)
    {
        this.speed = 50;
        this.radius = 1;
        this.position = position;
        this.velocity = velocity;
    }   
}

class Paddle {
    constructor(position, width, height)
    {
        this.position = position;
        this.width = width;
        this.height = height;
        this.score = 0;
        this.room = undefined;
        this.isWaiting = false;
    }
}

function GameLoop()
{
    console.log('GameLoop');
    // Send Position Ball
    // Send Position Paddle
    setInterval(GameLoop, 60 / 1000);
}

// GameLoop();

// const app = express();
const port = 4000;

const app = express();

app.use(cors({
    origin: ["https://admin.socket.io"],
    credentials: true
}));
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://admin.socket.io"], 
        credentials: true
    },
});

var players = {};
var balls = {};
var positions = {};
const centerDistanceToPaddle = 45;

io.on("connection", (socket) => {
    console.log('New Connection');
    if (Object.keys(players).length % 2 === 0)
    {
        players[socket.id] = new Paddle(new Vector3(0, 0, 0), 1, 2);
        players[socket.id].position = new Vector3(centerDistanceToPaddle, 0, 0);
        players[socket.id].room = crypto.randomUUID();
        players[socket.id].isWaiting = true;
        
        socket.join(players[socket.id].room);
        // positions[socket.id] = players[socket.id].position;

        // console.log('Position:', positions);
        console.log('Player:', players[socket.id].position);
        // console.log('Player length:', players.length);
    }
    else if (Object.keys(players).length % 2 !== 0)
    {
        players[socket.id] = new Paddle(new Vector3(0, 0, 0), 1, 2);
        players[socket.id].position = new Vector3(-centerDistanceToPaddle, 0, 0);
      
      
        positions[socket.id] = players[socket.id].position;
        balls[socket.id] = new Ball(new Vector3(0, 0, 0), new Vector3(1, 0, 0));
        // players[socket.id].room = crypto.randomUUID();
        let KeyPlayer1 = Object.keys(players).find(key => players[key].isWaiting === true);
        players[socket.id].room = players[KeyPlayer1].room;
        players[KeyPlayer1].isWaiting = false;
        // players[KeyPlayer1].room = players[socket.id].room;

        console.log('PLAYERS:', players);

        socket.join(players[socket.id].room);
        console.log('Position: ', positions);
        console.log('Player: ', players[socket.id].position);
    }
    else
    {
        socket.emit('gameFull');
    }
    // socket.emit('updatePositions', positions, balls);

});

// app.get('*', (req, res) => {
//     res.sendFile( './index.html');
// });

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

instrument(io, { auth: false });