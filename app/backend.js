import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import crypto from 'crypto';
import { instrument } from '@socket.io/admin-ui';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cookie from 'cookie';
import { start } from 'repl';
import { Console } from 'console';
/* VARIABLES */
const MAX_GOALS = 5;

const sleep = async (ms)  => {
    await new Promise(resolve => {
      return setTimeout(resolve, ms);
    });
  };
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
        this.boundaries = { x: 50, y: 25 };
        this.score = { player1: 0, player2: 0 };
        this.finished = false;
    }
    async update(deltaTime) {
        const displacement = this.velocity.clone().multiplyScalar(deltaTime);
        const newPosition = this.position.clone().add(displacement);
        
        // Check boundaries
        if (Math.abs(newPosition.x) > this.boundaries.x - this.radius && !this.isGoal) {
            // Ball hit left or right wall
            // console.log('Goal');
            // console.log('Position:', newPosition);
            // console.log('room:', this.room);
            if (newPosition.x > 0)
            {
                this.score.player1++;
                if (this.score.player1 === MAX_GOALS)
                {
                    io.to(this.room).emit('endGame', 1);
                    io.to(this.room).emit('closeTheGame');
                    io.to(this.room).socketsLeave(this.room);
                    for (let id in players)
                    {
                        if (players[id].room == this.room)
                            delete players[id];
                    }
                    this.finished = true;
                }
                else
                    io.to(this.room).emit('goal_scored',{PlayerNb: 1,score: this.score });
            }
            else
            {    
                this.score.player2++;
                if (this.score.player2 === MAX_GOALS)
                {
                    io.to(this.room).emit('endGame', 2);
                    io.to(this.room).emit('closeTheGame');
                    io.to(this.room).socketsLeave(this.room);
                    for (let id in players)
                    {
                        if (players[id].room == this.room)
                            delete players[id];
                        // if (balls[this.room])
                            // delete balls[this.room];
                    }
                    this.finished = true;
                }
                else
                io.to(this.room).emit('goal_scored', {PlayerNb: 2,score: this.score });
            }
            this.isGoal = true;
            setTimeout(() => {
                newPosition.x = 0;
                newPosition.y = 0;
                newPosition.z = 0;
                this.velocity.x *= -1;
                this.isGoal = false;
                this.position.copy(newPosition);
                io.to(this.room).emit('continue_after_goal');
            }, 2000);
        }

        if (Math.abs(newPosition.z) > this.boundaries.y - this.radius) {
            // Ball hit top or bottom wall
            this.velocity.z *= -1;
            newPosition.z = Math.sign(newPosition.z) * (this.boundaries.y - this.radius);
            if (this.room !== undefined)
                io.to(this.room).emit('colision-wall');
        }

        this.position.copy(newPosition);
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
        this.connected = true;
        this.matchId = null;
        this.tournamentId = null;
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
    handleCollision(ball) {
        const paddleLeft = this.position.x - this.width / 2;
        const paddleRight = this.position.x + this.width / 2;
        const paddleTop = this.position.z + this.depth / 2;
        const paddleBottom = this.position.z - this.depth / 2;
    
        if (ball.position.x - ball.radius <= paddleRight &&
            ball.position.x + ball.radius >= paddleLeft &&
            ball.position.z - ball.radius <= paddleTop &&
            ball.position.z + ball.radius >= paddleBottom) {
            
            // Determine collision side
            if (Math.abs(ball.position.x - paddleLeft) < ball.radius || 
                Math.abs(ball.position.x - paddleRight) < ball.radius) {
                    io.to(this.room).emit('colision-paddle');
                return 1; // Collision on X-axis
            } else {
                io.to(this.room).emit('colision-paddle');
                return 2; // Collision on Z-axis
            }
        }
    
        return 0; // No collision
    }
    
    handleCollision4(ball) {
        const paddleLeft = this.position.x - this.width / 2;
        const paddleRight = this.position.x + this.width / 2;
        const paddleTop = this.position.z + this.depth / 2;
        const paddleBottom = this.position.z - this.depth / 2;
    
        const ballLeft = ball.position.x - ball.radius;
        const ballRight = ball.position.x + ball.radius;
        const ballTop = ball.position.z + ball.radius;
        const ballBottom = ball.position.z - ball.radius;
    
        // Check for collision
        if (ballLeft <= paddleRight && ballRight >= paddleLeft &&
            ballBottom <= paddleTop && ballTop >= paddleBottom) {
            
            // Calculate the overlap on both axes
            const overlapX = Math.min(ballRight - paddleLeft, paddleRight - ballLeft);
            const overlapZ = Math.min(ballTop - paddleBottom, paddleTop - ballBottom);
    
            // Determine collision side based on the smaller overlap
            if (overlapX < overlapZ) {
                // Collision on X-axis
                return 1; // Collision on X-axis
            } else {
                // Collision on Z-axis
                return 2; // Collision on Z-axis
            }
        }
    
        return 0; // No collision
    }       
}

const port = 4000;

const app = express();
const ORIGIN_IP = process.env.ORIGIN_IP || 'localhost';

app.use(cors({
    origin: ["https://admin.socket.io", `http://${ORIGIN_IP}:5173`, `http://${ORIGIN_IP}:5174`],
    credentials: true
}));

// app.use(cors({
//     origin: "*",
//     // credentials: true
// }));


const server = createServer(app);

const io = new Server(server, {
    cors: {
        // origin: "*", 
        origin: ["https://admin.socket.io", `http://${ORIGIN_IP}:5173`, `http://${ORIGIN_IP}:5174`],
        credentials: true
    },
    pingInterval: 2000, pingTimeout: 5000,
});

var players = {};
var balls = {};
var positions = {};
const centerDistanceToPaddle = 45;


let s = false;
let lastTickTime = Date.now();

function GameLoop()
{
    // console.log('NBR OF BALLS', Object.keys(balls).length)
    // console.log('NBR OF PLAYERS', Object.keys(players).length);
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastTickTime) / 1000; // Time difference in seconds
    lastTickTime = currentTime;
    for (let playerId in players)
        {
            players[playerId].keyHandler();
            players[playerId].PaddleLimits();
    
            if (balls[players[playerId].room])
            {
                switch (players[playerId].handleCollision4(balls[players[playerId].room].ball))
                {
                    case 1:
                        balls[players[playerId].room].ball.velocity.x *= -1;
                        break;
                    case 2:
                        balls[players[playerId].room].ball.velocity.z *= -1;
                        break;
                }
            }
            io.to(players[playerId].room).emit('updatePlayer', { id: playerId , z: players[playerId].position.z, nb: players[playerId].nb });
    }       
    for (let id in balls)
    {
        if (balls[id].ball.finished == true)
        {
            delete balls[id];
            continue
        }
        balls[id].ball.update(deltaTime);
        io.to(id).emit('updateBall', balls[id].ball.position);
    }
}

setInterval(GameLoop, 15);

function setCookie(socket) {
    const roomIdCookie = {
        name: 'roomId',
        value: players[socket.id].room,
        options: { 
            path: '/', 
            expires: new Date(Date.now() + 240000).toUTCString(),
            sameSite: 'None', 
            secure: true 
        }
    };
    // Broadcast the roomId to all players in the room
    io.to(players[socket.id].room).emit('set-cookie', [roomIdCookie]);

    // Send the unique id cookie to only the player (no broadcasting)
    // socket.emit('set-cookie', [idCookie]);
}

// function setReconnectionCookie(socket)
// {
//     const cookieOptions = {
//         path: '/',
//         expires: new Date(Date.now() + 240000).toUTCString(),
//         sameSite: 'None',
//         secure: true,
//     };

//     const cookie = {
//         name: 'id',
//         value: socket.id,
//         options: cookieOptions,
//     };

//     try {
//         socket.emit('set-reconnected-cookie', [cookie]);
//     } catch (error) {
//         console.error('Error setting reconnection cookie:', error);
//     }
// }


async function startCountdown(room, player1, player2) {
    console.log('Start Countdown');

    // await sleep(1000);
    io.to(room).emit('countdown-3', {player1: players[player1], player2: players[player2]});
    await sleep(1000);
    io.to(room).emit('countdown-2');
    await sleep(1000);
    io.to(room).emit('countdown-1');
    await sleep(1000);
    io.to(room).emit('countdown-GO');
    await sleep(1000);
    io.to(room).emit('countdown-end');
  }
  
async function startGame(room, socketId, KeyPlayer1) {
    await startCountdown(room, socketId, KeyPlayer1);
    balls[room].ball.velocity = new Vector3(1, 0, (Math.random() * 1).toFixed(2)).multiplyScalar(balls[room].ball.speed);
    io.to(room).emit('startGame', { player1: players[socketId], player2: players[KeyPlayer1], ball: balls[room] });
}

io.on("connection", (socket) => {
    console.log('New Connection');
    
    let reconnected = false
    const cookiesHeader = socket.handshake.headers.cookie;
    if (cookiesHeader)
    {
        const cookies = cookie.parse(cookiesHeader);
        if (cookies.playerId && cookies.roomId && io.sockets.adapter.rooms.has(cookies.roomId))
        { 
            if (players[cookies.playerId] && players[cookies.playerId].connected === false)
            {
                reconnected = true;
                players[cookies.playerId].id = socket.id
                players[cookies.playerId].connected = true;
                players[socket.id] = players[cookies.playerId];
                socket.join(cookies.roomId);
                setCookie(socket);
                console.log('Reconnected:', socket.id);
                socket.emit('reconnect', { player: players[socket.id], score: balls[cookies.roomId].ball.score, nb: players[socket.id].nb });
                delete players[cookies.playerId]
            }
        }
    }
    if (reconnected == false)
    {
        const query = socket.handshake.query;
        const matchId = query['match-id'] || null;       // match-id if provided
        const tournamentId = query['tournament-id'] || null; // tournament-id if provided
        
        players[socket.id] = new Paddle(new Vector3(0, 0, 0), 1, 2, 6);
        players[socket.id].id = socket.id;
        players[socket.id].matchId = matchId;
        players[socket.id].tournamentId = tournamentId;

        let pairedPlayerId = null;
        for (let id in players) {
            if (id !== socket.id) {
                const otherPlayer = players[id];
                if (otherPlayer.isWaiting && otherPlayer.matchId === matchId && otherPlayer.tournamentId === tournamentId) {
                    pairedPlayerId = id;
                    break;
                }
            }
        }

        if (pairedPlayerId) {
            // Pair the players in the same match/tournament
            const room = players[pairedPlayerId].room;
            players[socket.id].room = room;
            players[socket.id].nb = 2;
            players[pairedPlayerId].isWaiting = false;
            players[socket.id].id = socket.id;
            players[socket.id].position = new Vector3(-centerDistanceToPaddle, 0, 0);

            // Create a ball for the game
            let tmpBall = new Ball(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
            tmpBall.room = room;
            balls[room] = { id: socket.id, room: room, ball: tmpBall };

            // Join the room for both players
            socket.join(room);
            setCookie(socket, pairedPlayerId);

            // Start the game
            startGame(room, socket.id, pairedPlayerId);
            io.to(room).emit('startGame', {
                player1: players[pairedPlayerId],
                player2: players[socket.id],
                ball: balls[room]
            });

            // console.log(`Match started between Player ${pairedPlayerId} and Player ${socket.id} in room: ${room}`);

        } else {
            // No available player with the same match/tournament ID, make this player wait
            const room = crypto.randomUUID(); // Generate a random room ID
            players[socket.id].position = new Vector3(centerDistanceToPaddle, 0, 0);
            players[socket.id].id = socket.id;
            players[socket.id].room = room;
            players[socket.id].nb = 1;
            players[socket.id].isWaiting = true;

            socket.join(room);
        }
    }
    //     if (Object.keys(players).length % 2 === 0)
    //     {
    //         players[socket.id] = new Paddle(new Vector3(0, 0, 0), 1, 2, 6);
    //         players[socket.id].position = new Vector3(centerDistanceToPaddle, 0, 0);
    //         players[socket.id].room = crypto.randomUUID();
    //         players[socket.id].id = socket.id;
    //         players[socket.id].nb = 1;
    //         players[socket.id].isWaiting = true;
            
    //         socket.join(players[socket.id].room);
    //         console.log('Player:', players[socket.id].position);

    //     }
    //     else if (Object.keys(players).length % 2 !== 0)
    //     {
    //         players[socket.id] = new Paddle(new Vector3(0, 0, 0),  1, 2, 6);
    //         players[socket.id].position = new Vector3(-centerDistanceToPaddle, 0, 0);
    //         players[socket.id].id = socket.id;
    //         players[socket.id].nb = 2;
    //         let tmpBall = new Ball(new Vector3(0, 0, 0), new Vector3(0,0,0));//new Vector3(1, 0, 0.5));
    //         let KeyPlayer1 = Object.keys(players).find(key => players[key].isWaiting === true);
    //         players[socket.id].room = players[KeyPlayer1].room;
    //         tmpBall.room = players[KeyPlayer1].room;
    //         balls[players[KeyPlayer1].room] = {id: socket.id, room: players[KeyPlayer1].room, ball: tmpBall};
    //         players[KeyPlayer1].isWaiting = false;

    //         console.log('PLAYERS:', players);
            
    //         socket.join(players[socket.id].room);
    //         setCookie(socket, KeyPlayer1)
            
    //         startGame(players[socket.id].room, socket.id, KeyPlayer1);
    //         io.to(players[socket.id].room).emit('startGame', { player1: players[socket.id], player2: players[KeyPlayer1], ball: balls[players[KeyPlayer1].room] });
    //     }
    // }


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
        // console.log('Disconnected:', socket.id);
        if (players[socket.id])
        {
            console.log('disconnected')
            players[socket.id].connected = false;
            if (players[socket.id].isWaiting == true)
                delete players[socket.id]
            
        }
    });
});

// io.on('disconnect', (socket) => {
//     console.log('Disconnected:', socket.id);
//     delete players[socket.id];
// });



app.use(cookieParser());

// app.use((req, res, next) => {
//     res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
//     res.setHeader('Pragma', 'no-cache');
//     res.setHeader('Expires', '0');
//     next();
// });

app.use(express.static(path.join()));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});

instrument(io, { auth: false });

