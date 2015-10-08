/*
Jingyi Feng (jingyif) + Ruokan He (rkh)
*/


var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var canvasWidth = 800;
var canvasHeight = 600;
var intervalId;
var timerDelay = 100;
var rectLeft1 = canvasWidth;
var rectLeft2 = 0;
var rectLeft3 = 0;
var playerInitX = 20;
var playerInitY = 36;
var playerInitWidth = 20;
var playerInitHeight = 20;
var quit = false;
var pause = false;
var gameWin = false;
var gameDie = false;
var floatingBalls = [];
var floatingBallsFarSmall = [];

var left_press = false;
var right_press = false;
var up_press = false;
var down_press = false;

	var qCode = 81;
	var pCode = 80;
	var leftCode = 37;
	var upCode = 38;
	var rightCode = 39;
	var downCode = 40;
	var currentLevelCode = 82;
	var nextLevelCode = 32;


function circle(ctx, cx, cy, radius) {
		ctx.arc(cx, cy, radius, 0, 2*Math.PI, true);
		};
		
// player behavior		
var player = {
	color: "pink",
	x: playerInitX,
	y: playerInitY,
	width: playerInitWidth,
	height:playerInitHeight,
	shapeSize : 1,
	draw: function() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	},
}

// eating foods	
function getBigger(){
	player.width = player.width + bigPace
	player.height = player.height + bigPace
}

function getSmaller(){
	if (player.width !== 20){
		player.width = player.width - bigPace
		player.height = player.height - bigPace
	}
}

//player movement
function movePlayer(ctx, addx, addy){
	player.x += addx;
	player.y += addy;
	if (player.x <= 0) {player.x = 0;}
	if (player.x >= canvasWidth-player.width) {player.x = canvasWidth-player.width;}
	if (player.y <= 0) {player.y = 0;}
	if (player.y>= canvasHeight-player.height) {player.y = canvasHeight-player.height;}
}

//ball for big
var Ball = {
	color: "white",
	radius: 5,
	initBalls: function(){
		for (var i=0; i< 30; i++){
			var ballCx = Math.random()* ((canvasWidth-Ball.radius) - Ball.radius) + Ball.radius;
			var ballCy = Math.random()* ((canvasHeight-Ball.radius) - Ball.radius) + Ball.radius;
			var movedirection = Math.random()* (360 - 0) + 0;
			ctx.beginPath();
			circle(ctx, ballCx, ballCy, this.radius);
			ctx.fillStyle = this.color;
			ctx.fill();
			floatingBalls.push([ballCx, ballCy, movedirection,this.color]);
		}
	},
}

//ball for small
var BallForSmall = {
	color: "yellow",
	radius: 5,
	initBalls: function(){
		for (var i=0; i< 10; i++){
			var ballCx = Math.random()* ((canvasWidth-BallForSmall.radius) - BallForSmall.radius) + BallForSmall.radius;
			var ballCy = Math.random()* ((canvasHeight-BallForSmall.radius) - BallForSmall.radius) + BallForSmall.radius;
			var movedirection = Math.random()* (360 - 0) + 0;
			ctx.beginPath();
			circle(ctx, ballCx, ballCy, this.radius);
			ctx.fillStyle = this.color;
			ctx.fill();
			floatingBalls.push([ballCx, ballCy, movedirection,this.color]);
		}
	},
}
	
function movingBalls(){
	floatingBalls.forEach(function(x) {
	if (x[0] < Ball.radius || x[0] > canvasWidth - Ball.radius 
	|| x[1] < Ball.radius || x[1] > canvasHeight - Ball.radius) {
		x[2] = (x[2]+90) % 360;
		ctx.beginPath();
		x[0] = x[0] + Math.cos(x[2]*Math.PI/180) * Ball.radius;
		x[1] = x[1] - Math.sin(x[2]*Math.PI/180) * Ball.radius;
		circle(ctx, x[0], x[1], Ball.radius);
		ctx.fillStyle = x[3];
		ctx.fill();
		}
	else {
		ctx.beginPath();
		x[0] = x[0] + Math.cos(x[2]*Math.PI/180) * Ball.radius;
		x[1] = x[1] - Math.sin(x[2]*Math.PI/180) * Ball.radius;
		circle(ctx, x[0], x[1], Ball.radius);
		ctx.fillStyle = x[3];
		ctx.fill();
		}
	});	
}

// Goal
var gate = {
	color: "66ff66",
	width: 10,
	height: 70,
	x: canvasWidth - 10,
	y: (canvasHeight - 70 - 50),
	draw: function() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	},
}


function conllisonHappened() {
	floatingBalls.forEach(function(a) {
		if (player.x < a[0]+Ball.radius && player.x + player.width > a[0]-Ball.radius &&
		player.y < a[1]+Ball.radius && player.y + player.width > a[1]-Ball.radius
		&& a[3] === "white"){
			getBigger();
		}
		if (player.x < a[0]+Ball.radius && player.x + player.width > a[0]-Ball.radius &&
		player.y < a[1]+Ball.radius && player.y + player.width > a[1]-Ball.radius
		&& a[3] === "yellow"){
			getSmaller();
		}
	});	
}


function ifWin(){
	if (player.x >= canvasWidth - player.width && 
	player.y > gate.y && player.y + player.height < gate.y + gate.height){
			gameWin = true;
			//level += 1;
		}
}

function afterWin(){
	if (gameWin === true){
		ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.font = "48px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("YOU WIN!", 300, 300);
		ctx.font = "20px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("Go to next level pressing 'SpaceBar'", 270, 350);
	}
}
	
function ifDie(){
	if (player.x + player.width >= canvasWidth && 
	  !(player.y > gate.y && player.y + player.height < gate.y + gate.height)||
	    player.y + player.height >= canvasHeight) {
			gameDie = true;
		}
}

function afterDie(){
	if (gameDie === true){
		ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.font = "48px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("YOU DIE!", 300, 300);
		ctx.font = "20px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("Play this level again pressing 'R'", 270, 350);
	}
}
	
	
var interface = {
	title: function(){
		ctx.font = "16px Arial";
		ctx.fillStyle = "#66ffff";
		ctx.fillText("Fish on Diet", 15, 27);
	},
	drawCanvasBackground: function(){
		var grad = ctx.createRadialGradient(400,-120,200,400,0,600);
		grad.addColorStop(0, '#66ccff');
		grad.addColorStop(0.1, '#3399ff');
		grad.addColorStop(1, '#000033');
		ctx.fillStyle = grad;
		ctx.fillRect(0,0,canvasWidth,canvasHeight);
	},
	
}

var other = {
	testbulesquare: function(){
		ctx.fillStyle = "rgba(102, 204, 255, 0.9)";
    	ctx.fillRect(rectLeft1, 400, 70, 40);
	},
	testredcircle1: function(){
		ctx.beginPath();
		var cx = rectLeft2;
		var cy =180;
		var radius = 20;
		circle(ctx, cx, cy, radius);
		ctx.fillStyle = "rgba(102, 255, 102, 0.9)";
		ctx.fill();
	},
	testredcircle2: function(){
		ctx.beginPath();
		var cx = rectLeft3;
		var cy =220;
		var radius = 30;
		circle(ctx, cx, cy, radius);
		ctx.fillStyle = "rgba(255, 102, 153,0.9)";
		ctx.fill();
	},
}


function isPause(){
	pause = !pause;
}

function redrawAll() {
    // erase everything
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	interface.drawCanvasBackground();
	// the title
	interface.title();
	//player ana moving
    player.draw();
	//enemiesBalls
	movingBalls();
	// rectangle moving
	other.testbulesquare();
	other.testredcircle1();
	other.testredcircle2();
	//final goal
	gate.draw();

	//gameDie
	afterDie();
	//gameWin
	afterWin();
	
}


function onTimer() {
    if (quit) return;
	//update
	if (pause === false && gameDie === false && gameWin === false) {
		if (rectLeft1===0){ rectLeft1=canvasWidth}
		else {rectLeft1 = (rectLeft1 - 10);}
		rectLeft2 = (rectLeft2 + 20) % canvasWidth;
		rectLeft3 = (rectLeft3 + 5) % canvasWidth;
		bigPace = 3;
		conllisonHappened();
		ifWin();
		ifDie();
		//draw
		redrawAll();
	}
}


function onKeyDown(event) {

	
	//quit
    if (quit) return;
    if (event.keyCode === qCode) {
        clearInterval(intervalId);
        //ctx.clearRect(0, 0, 400, 400);
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.font = "48px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("Thank You!", 300, 300);
        quit = true;	
    }
	
	//pause
	if (event.keyCode === pCode) {isPause();}
	
	//player keybind
	if (event.keyCode === leftCode || left_press) { 
		movePlayer(ctx,-5, 0); 
		left_press = true;
	}
	if (event.keyCode === rightCode || right_press) { 
		movePlayer(ctx,5, 0); 		
		right_press = true;
	}
	if (event.keyCode === upCode || up_press) { 
		movePlayer(ctx,0, -5); 		
		up_press = true;
	}
	if (event.keyCode === downCode || down_press) {
		movePlayer(ctx,0, 5); 		
		down_press = true;
	}



	
	//current level again
	if (event.keyCode === currentLevelCode) { 
		player.x = playerInitX;
		player.y = playerInitY;
		player.width = playerInitWidth;
		player.height = playerInitHeight;
		gameDie= false; 
		interface.drawCanvasBackground();
	}
	
	//next level
	if (event.keyCode === nextLevelCode) { 
		player.x = playerInitX;
		player.y = playerInitY;
		player.width = playerInitWidth;
		player.height = playerInitHeight;
		
		gameWin = false; 
		interface.drawCanvasBackground();
		BallForSmall.initBalls();
		Ball.initBalls();
		waveSquare.draw();
		}
}

  function onKeyUp(event) {
	//player key release
	if (event.keyCode === leftCode) { 
		left_press = false;
	}
	if (event.keyCode === rightCode) { 
		right_press = false;
	}
	if (event.keyCode === upCode) { 
		up_press = false;
	}
	if (event.keyCode === downCode) {	
		down_press = false;
	}
}

function init (){
	BallForSmall.initBalls();
	Ball.initBalls();
	intervalId = setInterval(onTimer, timerDelay);
}


function run() {
    canvas.addEventListener('keydown', onKeyDown, false);
	canvas.addEventListener('keyup', onKeyUp, false);
    // make canvas focusable
    canvas.setAttribute('tabindex','0');
    canvas.focus();
	// interval setting
	init();	
}


run();