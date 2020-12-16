var canvas, ctx;
      
window.onload = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    document.addEventListener("keydown", keyDownEvent);

    // render X times per second
    var x = 12;
    setInterval(draw, 1000 / x);
};

// game world
var gridSize = (tileSize = 20); // 20 x 20 = 400
var nextX = (nextY = 0);
var round = 1;

var jumperSize = 2;
var homeSize = 2;

var homeX = 0;
var homeY = 18;
var goalX = 17;
var goalY = 0;

var playerX = homeX;
var playerY = homeY + 1;

var xLocKiller = [];
var yLocKiller = [];
var xPoss = [0,1,0,-1];
var yPoss = [1,0,-1,0];
var xMoveKillerTo = [];
var yMoveKillerTo = [];

// initialize location, movement arrays, and number of attackers
var numKillers = 3;

function draw() {

    for ( let i = 0; i < numKillers; i++) {
        xMoveKillerTo.push(xPoss[Math.round(Math.random() * 4)]);
        yMoveKillerTo.push(yPoss[Math.round(Math.random() * 4)]);
        xLocKiller.push(Math.round(Math.random() * tileSize));
        yLocKiller.push(Math.round(Math.random() * tileSize));
    }

    // moves every attacker in their new direction every refresh
	for ( let i = 0; i < numKillers; i++) {
		xLocKiller[i] += xMoveKillerTo[i];
		yLocKiller[i] += yMoveKillerTo[i];

		if (xLocKiller[i] + xMoveKillerTo[i] === 0 && yLocKiller[i]  + yMoveKillerTo[i] === 0) {
			xLocKiller[i] += 1;
			yLocKiller[i] += 1;
			console.log("someone has all 0");
		}
	}

    // move player depending on movement function
    playerX += nextX;
    playerY += nextY;

    // replace background
    ctx.fillStyle = "#f1faee";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw home spaces and goal spaces
    ctx.fillStyle = "#e9c46a"; // home
    ctx.fillRect(homeX * tileSize, homeY * tileSize, homeSize * tileSize, homeSize * tileSize);
    ctx.fillStyle = "#2a9d8f"; // goal
    ctx.fillRect(goalX * tileSize, goalY * tileSize, homeSize * tileSize, homeSize * tileSize);

    // draw round count
    ctx.fillStyle = "#1d3557";
    ctx.font = "20px Georgia";
    ctx.fillText("Round: " + round, (homeX + 2) * tileSize, (homeY + 1.75) * tileSize);

    // initialize directions of worms
	ctx.fillStyle = "#e63946";
	// draw walls
    for (let i = 0; i < numKillers; i++) {
    	ctx.fillRect(xLocKiller[i] * tileSize, yLocKiller[i] * tileSize, tileSize, tileSize);
    }

    // draw player
    ctx.fillStyle = "#457b9d";
    ctx.fillRect(playerX * tileSize, playerY * tileSize, tileSize, tileSize);


    // check if attacker moved off the border
	for (let i = 0; i < numKillers; i++) {
		if (xLocKiller[i] < 0) {
			xLocKiller[i] = tileSize;
		}
		if (xLocKiller[i] > tileSize) {
			xLocKiller[i] = 0;
		}
		if (yLocKiller[i] < 0) {
			yLocKiller[i] = tileSize;
		}
		if (yLocKiller[i] > tileSize) {
			yLocKiller[i] = 0;
		}
    }

    // check if player moved off border
    if (playerX < 0) {
        playerX = tileSize - 2;
    }
    if (playerX > tileSize - 2) {
        playerX = 0;
    }
    if (playerY < 0) {
        playerY = tileSize - 1;
    }
    if (playerY > tileSize - 1) {
        playerY = 0;
    }

    // lock player in home till they choose to leave
    if ((playerX == homeX || playerX == homeX + 1) && (playerY == homeY || playerY == homeY + 1)) {
        nextX = 0;
        nextY = 0;
    }

    // check if player reaches goal
    if ((playerX == goalX || playerX == goalX + 1) && (playerY == goalY || playerY == goalY + 1)) {
        playerX = homeX;
        playerY = homeY + 1;

        round++;
        numKillers += 3;
        console.log(numKillers);
    }

    // check if player collides with killer
    for (let i = 0; i < numKillers; i++) {
        if (playerX == xLocKiller[i] && playerY == yLocKiller[i]) {
            playerX = homeX;
            playerY = homeY;
            numKillers = 3;
            round = 0;
        }
    }
    
}

// input
function keyDownEvent(e) {
    switch (e.keyCode) {
        case 37: // left 
            nextX = -1;
            nextY = 0;
            break;
        case 38: // down 
            nextX = 0;
            nextY = -1;
            break;
        case 39: // right 
            nextX = 1;
            nextY = 0;
            break;
        case 40: // up 
            nextX = 0;
            nextY = 1;
            break;
    }
}
