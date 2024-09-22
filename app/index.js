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
const { start } = require('repl');
// const { default: isColliding } = require('./game/collision');

class Vector3 {
    constructor(x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    clone()
    {
        return new Vector3(this.x, this.y, this.z);
    }
    add(vector)
    {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        return this;
    }
    sub(vector)
    {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
        return this;
    }
    multiplyScalar(scalar)
    {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }
    copy(vector)
    {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;
    }
    clamp(min, max)
    {
        // Manually clamp each component (x, y, z) of the sphere position
        this.x = Math.max(min.x, Math.min(this.x, max.x));
        this.y = Math.max(min.y, Math.min(this.y, max.y));
        this.z = Math.max(min.z, Math.min(this.z, max.z));
    }

    distanceTo(vector)
    {
        const dx = vector.x - this.x;
        const dy = vector.y - this.y;
        const dz = vector.z - this.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
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

        this.velocity = velocity;
        this.speed = 50;
        this.radius = 1;
        this.position = position;
        this.velocity.multiplyScalar(this.speed);
        this.isGoal = false;
    }
    update(deltaTime)
    {
        const displacement = this.velocity.clone().multiplyScalar(deltaTime);

        const FinalPos = this.position.clone().add(displacement);
        this.boundaries = { x: 50, y: 25 };
        const dx = this.boundaries.x - this.radius - Math.abs(this.position.x);
		const dz = this.boundaries.y - this.radius - Math.abs(this.position.z);

		if (dx <= 0 && this.isGoal) {
			// this.mesh.visible = false
			this.isGoal = true;
            FinalPos.x = 0;
			FinalPos.y = 0;
			FinalPos.z = 0;
			if (this.mesh.position.x > 0) {
				// this.dispatchEvent({ type: 'goal', player: 'player1' })
                socket.emit('goal', { player: 'player1' });
			}
			else {
				// this.dispatchEvent({ type: 'goal', player: 'player2' })
                socket.emit('goal', { player: 'player2' });
			}
            this.isGoal = false;
		}

		if (dz <= 0) {
			const z = this.mesh.position.z
			FinalPos.z = (this.boundaries.y - this.radius + dz) * Math.sign(this.mesh.position.z)
			this.velocity.z *= -1
		}

		// set new position
		this.position.copy(FinalPos);
    }   
}
class Paddle extends UserInput {
    constructor(position, width, height, depth)
    {
        super();

        this.position = position;
        this.width = width;
        this.height = height;
        this.depth = depth
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
    // handleCollision(ball)
    // {
    //     const closestPoint = this.position.clone();
    //     const scalar = new Vector3(this.width * 0.5, this.height * 0.5, this.depth * 0.5);
    //     const min = this.position.clone().sub(scalar);
    //     const max = this.position.clone().add(scalar);
    //     closestPoint.clamp(
    //         min,
    //         max
    //     );
    //     const distance = ball.ball.position.distanceTo(closestPoint);
    //     // console.log('Distance:', distance);
    //     if (distance <= ball.ball.radius)
    //     {
    //         if (Math.abs(closestPoint.x - (this.position.x - this.width * 0.5)) < 0.001) {
    //             return 1
    //             // collisionSide = 'left';
    //         } else if (Math.abs(closestPoint.x - (this.position.x + this.width.x * 0.5)) < 0.001) {
    //             // collisionSide = 'right';
    //             return 1
    //         }
    
    //         if (Math.abs(closestPoint.z - (this.position.z - this.depth.z * 0.5)) < 0.001) {
    //             // collisionSide = 'back';
    //             ball.velocity.z *= -1;
    //             return 2
    //         } else if (Math.abs(closestPoint.z - (this.position.z + this.depth.z * 0.5)) < 0.001) {
    //             // collisionSide = 'front';
    //             ball.velocity.z *= -1;
    //             return 2
    //         }
    //     }
    //     return 0;
    // }
    handleCollision(ball) {
        // Example collision detection logic
        const paddle = this; // Assuming the player has a paddle property
        const ballPosition = ball.ball.position;
        const ballVelocity = ball.ball.velocity;

        // Check for collision with paddle
        if (ballPosition.x >= paddle.position.x && ballPosition.x <= paddle.position.x + paddle.width &&
            ballPosition.z >= paddle.position.z && ballPosition.z <= paddle.position.z + paddle.depth) {
            // Determine collision side
            // console.log('Collision');
            // if (ballVelocity.x > 0) {
            //     return 1; // Collision on the x-axis
            // } else if (ballVelocity.z > 0) {
            //     return 2; // Collision on the z-axis
            // }
            return 1;
        }

        return 0; // No collision
    }

    // handleCollision(ball) {
    // const paddle = this; // Assuming the player has a paddle property
    // const ballPosition = ball.ball.position;
    // const ballVelocity = ball.ball.velocity;

    // Check for collision with paddle
//     if (ballPosition.x >= paddle.position.x && ballPosition.x <= paddle.position.x + paddle.width &&
//         ballPosition.z >= paddle.position.z && ballPosition.z <= paddle.position.z + paddle.depth) {
        
//         // Determine collision side
//         const closestPoint = {
//             x: Math.max(paddle.position.x, Math.min(ballPosition.x, paddle.position.x + paddle.width)),
//             z: Math.max(paddle.position.z, Math.min(ballPosition.z, paddle.position.z + paddle.depth))
//         };

//         if (Math.abs(closestPoint.x - paddle.position.x) < 0.001) {
//             // Collision on the left side
//             return 1;
//         } else if (Math.abs(closestPoint.x - (paddle.position.x + paddle.width)) < 0.001) {
//             // Collision on the right side
//             return 1;
//         }

//         if (Math.abs(closestPoint.z - paddle.position.z) < 0.001) {
//             // Collision on the back side
//             return 2;
//         } else if (Math.abs(closestPoint.z - (paddle.position.z + paddle.depth)) < 0.001) {
//             // Collision on the front side
//             return 2;
//         }
//     }

//     return 0; // No collision
// }
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


let s = false;
let lastTickTime = Date.now();

function GameLoop()
{
    // if (!s) {
    //     lastTickTime = Date.now();
    //     s = true;
    // }

    const currentTime = Date.now();
    const deltaTime = (currentTime - lastTickTime) / 1000; // Time difference in seconds
    lastTickTime = currentTime;
    // Send Position Ball
    // Send Position Paddle

    for (let playerId in players)
    {
        if (balls[players[playerId].room])
        {
            // console.log('ball:', balls[players[playerId].room].ball.position);
           switch (players[playerId].handleCollision(balls[players[playerId].room]))
            {
                case 1:
                    balls[players[playerId].room].ball.velocity.x *= -1;
                    break;
                case 2:
                    balls[players[playerId].room].ball.velocity.z *= -1;
                    break;
                // default:
                //     console.log('No Collision');
            }
        }

    }

    for (let playerId in players)
    {
        players[playerId].keyHandler();
        players[playerId].PaddleLimits();

        io.to(players[playerId].room).emit('updatePlayer', { id: playerId , z: players[playerId].position.z, nb: players[playerId].nb });

    }
    for (let id in balls)
    {
        balls[id].ball.update(deltaTime);
        io.to(balls[id].room).emit('updateBall', balls[id].ball.position);
    }

}

io.on("connection", (socket) => {
    console.log('New Connection');
    
    // const query = socket.handshake.query;
    // console.log('Query:', query);
    const cookiesHeader = socket.handshake.headers.cookie;
    if (cookiesHeader === 'string' )//&& cookiesHeader.includes('roomId'))
    {
        const cookies = cookie.parse(cookiesHeader);

    
        if (cookies.roomId && io.sockets.adapter.rooms.has(cookies.roomId) && io.sockets.adapter.rooms.get(cookies.roomId).size < 2) //TOO BLOCK JUST TWO PLAYERS BY ROOM
        { 
            console.log('RoomId:', cookies.roomId, 'socketId:', socket.id);
            socket.join(cookies.roomId);

        }
    }
    else if (Object.keys(players).length % 2 === 0)
    {
        players[socket.id] = new Paddle(new Vector3(0, 0, 0), 1, 2, 6);
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
        players[socket.id] = new Paddle(new Vector3(0, 0, 0),  1, 2, 6);
        players[socket.id].position = new Vector3(-centerDistanceToPaddle, 0, 0);
        players[socket.id].id = socket.id;
        players[socket.id].nb = 2;
        let tmpBall = new Ball(new Vector3(1, 0, 0), new Vector3(1, 0, 0));
        let KeyPlayer1 = Object.keys(players).find(key => players[key].isWaiting === true);
        players[socket.id].room = players[KeyPlayer1].room;
        balls[players[KeyPlayer1].room] = {id: socket.id, room: players[KeyPlayer1].room, ball: tmpBall};
        players[KeyPlayer1].isWaiting = false;

        console.log('PLAYERS:', players);
        
        socket.join(players[socket.id].room);
        io.to(players[socket.id].room).emit('set-cookie', {
            name: 'roomId',
            value: players[socket.id].room,
            options: { 
                path: '/', 
                expires: new Date(Date.now() + 900000).toUTCString(),
                // httpOnly: true, // Optional, helps with security
                // sameSite: 'None', // Required for cross-site cookies
                // secure: true // Required for SameSite=None
            } // Set expiration, path, etc.
        });
        io.to(players[socket.id].room).emit('startGame', { player1: players[socket.id], player2: players[KeyPlayer1], ball: balls[players[KeyPlayer1].room] });
    }

    socket.on('userInput', (userInput) => {
        if (players[socket.id])
        {
            players[socket.id].up = userInput.up;
            players[socket.id].down = userInput.down;
        }
    });
    // for (let id in balls)
    // {
    //     io.to(balls[id].room).emit('updateBall', balls[id].ball);
    // }
    // socket.emit('updatePositions', positions, balls);

    socket.on('disconnect', () => {
        console.log('Disconnected:', socket.id);
        players[socket.id].id = undefined;
    });
});

// io.on('disconnect', (socket) => {
//     console.log('Disconnected:', socket.id);
//     delete players[socket.id];
// });

setInterval(GameLoop, 1000/60);

app.use(cookieParser());

// app.use((req, res, next) => {
//     res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
//     res.setHeader('Pragma', 'no-cache');
//     res.setHeader('Expires', '0');
//     next();
// });

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});

instrument(io, { auth: false });

