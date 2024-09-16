const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
// const { hash } = require('crypto');
const crypto = require('crypto');
const { instrument } = require('@socket.io/admin-ui');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');

class Vector3 {
    constructor(x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class UserInput {
    constructor()
    {
        this.up = false;
        this.down = false;   
    }
}
class Ball extends UserInput {
    constructor(position, velocity)
    {
        super();

        this.speed = 50;
        this.radius = 1;
        this.position = position;
        this.velocity = velocity;
    }   
}
class Paddle extends UserInput {
    constructor(position, width, height)
    {
        super();

        this.position = position;
        this.width = width;
        this.height = height;
        this.score = 0;
        this.room = undefined;
        this.isWaiting = false;
        this.id = undefined;
        this.keySpeed = 0.9;
        this.nb = undefined;
    }

    PaddleLimits() {
        if (this.position.z > 22)
            this.position.z = 22;
        else if (this.position.z < -22)
            this.position.z = -22;
    }

    keyHandler()
    {
        if (this.down)
            this.position.z +=  this.keySpeed; 
        else if (this.up)
            this.position.z -=  this.keySpeed;
    }
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

function GameLoop()
{
    // console.log('GameLoop');
    // Send Position Ball
    // Send Position Paddle

    for (let playerId in players)
    {
        // console.log('Player:', players[playerId]);
        players[playerId].keyHandler();
        players[playerId].PaddleLimits();
        // console.log('Player:', playerId);
        io.to(players[playerId].room).emit('updatePlayer', { id: playerId , z: players[playerId].position.z, nb: players[playerId].nb });
        // console.log('position:', players[playerId].position);
    }
}

io.on("connection", (socket) => {
    console.log('New Connection');
    
    const cookiesHeader = socket.handshake.headers.cookie;
    const cookies = cookie.parse(cookiesHeader);

    
    if (cookies.roomId && io.sockets.adapter.rooms.has(cookies.roomId) )//&& io.sockets.adapter.rooms.get(cookies.roomId).size < 2) TOO BLOCK JUST TWO PLAYERS BY ROOM
    { 
        // console.log('RoomId:', cookies.roomId);
        socket.join(cookies.roomId);
    }
    else if (Object.keys(players).length % 2 === 0)
    {
        players[socket.id] = new Paddle(new Vector3(0, 0, 0), 1, 2);
        players[socket.id].position = new Vector3(centerDistanceToPaddle, 0, 0);
        players[socket.id].room = crypto.randomUUID();
        players[socket.id].id = socket.id;
        players[socket.id].nb = 1;
        players[socket.id].isWaiting = true;
        
        socket.join(players[socket.id].room);
        console.log('Player:', players[socket.id].position);

    }
    else if (Object.keys(players).length % 2 !== 0)
    {
        players[socket.id] = new Paddle(new Vector3(0, 0, 0), 1, 2);
        players[socket.id].position = new Vector3(-centerDistanceToPaddle, 0, 0);
        players[socket.id].id = socket.id;
        players[socket.id].nb = 2;
        let tmpBall = new Ball(new Vector3(0, 0, 0), new Vector3(1, 0, 0));
        let KeyPlayer1 = Object.keys(players).find(key => players[key].isWaiting === true);
        players[socket.id].room = players[KeyPlayer1].room;
        balls[players[KeyPlayer1].room] = {id: socket.id, room: players[KeyPlayer1].room, ball: tmpBall};
        players[KeyPlayer1].isWaiting = false;

        console.log('PLAYERS:', players);
        
        socket.join(players[socket.id].room);
        io.to(players[socket.id].room).emit('set-cookie', {
            name: 'roomId',
            value: players[socket.id].room,
            options: { path: '/', expires: new Date(Date.now() + 900000).toUTCString() } // Set expiration, path, etc.
        });
        io.to(players[socket.id].room).emit('startGame', { player1: players[socket.id], player2: players[KeyPlayer1], ball: balls[players[KeyPlayer1].room] });
    }

    socket.on('userInput', (userInput) => {
        if (players[socket.id])
        {
            players[socket.id].up = userInput.up;
            players[socket.id].down = userInput.down;
        }
            // console.log('UserInput:', userInput.up);
        // console.log('UserInput:', userInput.down);
        
    });
    // for (let id in balls)
    // {
    //     io.to(balls[id].room).emit('updateBall', balls[id].ball);
    // }
    // socket.emit('updatePositions', positions, balls);

});
setInterval(GameLoop, 1000/60);

app.use(cookieParser());

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

instrument(io, { auth: false });

