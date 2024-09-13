const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

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
const port = 5000;

const app = express();
const server = createServer(app);
const io = new Server(server, {

});

var players = [];
var balls = [];
var positions = [];
const centerDistanceToPaddle = 45;

function startGame()
{
    
    return { players: players };
}

io.on("connection", (socket) => {
    
    
    if (players.length === 0)
    {
        players[socket.id] = new Paddle(new Vector3(0, 0, 0), 1, 2);
        players[socket.id].position = new Vector3(centerDistanceToPaddle, 0, 0);
        positions = players[socket.id].position;
        console.log('Position: ', positions);
        console.log('Player: ', players[socket.id].position);
    }
    else if (players.length === 1)
    {
        players[socket.id] = new Paddle(new Vector3(0, 0, 0), 1, 2);
        players[socket.id].position = new Vector3(-centerDistanceToPaddle, 0, 0);
        positions = players[socket.id].position;
        balls[socket.id] = new Ball(new Vector3(0, 0, 0), new Vector3(1, 0, 0));
        socket.emit('startGame', { positions, balls: balls });
    }

    players.push(socket.id);

});

// app.get('*', (req, res) => {
//     res.sendFile( './index.html');
// });

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});