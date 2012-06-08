var canvas;
var ctx;
var player;
var myTowers = new Array();
var hitFlag = false;
var intervalId;
keys = 0;

//Magic Numbers
var standardBulletSpeed = 5;
var playerSpeed = 5;
var standardBase = 100;
var standardFireRate = 1;
var playerBase = 30;
var playerRate = 1;
var canvasWidth = 700;
var canvasHeight = 600;
var maxHP = 3;

init();

/*
canvas.onmousedown = moduleMouseDown;
canvas.onmouseup = moduleMouseUp;
canvas.onmousemove = captureMousePosition;
*/



function tower(x, y, type){
	//basic variables
	this.x = x;
	this.y = y;
	this.type = type;
	this.bullets = new Array();
	this.cooldown = 0;
	this.direction = "down";
}

function bullet(angle, side, x, y)
{
	this.angle = angle;
	this.side = side; //0 is right, 1 is left, 2 is straight up, 3 is straight down.
	this.distance = 0;
	this.originX = x;
	this.originY = y;
}

function player(startX, startY, hp)
{
	this.x = startX;
	this.y = startY;
	this.hp = hp;
	this.direction = "neutral";
	this.cooldown = 0;
	
}


function createTower(x, y, type){
 	var index = myTowers.length;
 	var newTower = new tower(x, y, type);
	myTowers[index]=newTower;
}

function restartGame() {
	player.hp = maxHP;
	
	for (var i = 0; i < myTowers.length; i++)
		myTowers[i].bullets.splice(0,myTowers[i].bullets.length);
	
	intervalId = setInterval(draw, 10);
	return intervalId;
}

function init()
{
	
	 canvas = document.getElementById("canvas");
	 ctx = canvas.getContext("2d");
	 	player = new player(250,250,maxHP);
		player.direction = "neutral";
		createTower(75,75,"new");		
		createTower(600,75,"new");
		createTower(75,550,"new");
		createTower(600,550,"new");
		
		//createTower(400,300,"new");
		
		//createModule(300,300,"sink",1,0);
		intervalId = setInterval(draw, 10);
		return intervalId;
}




function draw(){
	clear();
	ctx.strokeStyle = "black";	
	for(var i = 0; i < myTowers.length; i++)
	{
		drawTower(myTowers[i]);
		fire(myTowers[i]);
		drawBullets(myTowers[i]);
	}
	drawPlayer();
	movePlayer();
	checkHit();
	if (!isAlive()) {
		clear();
		drawPlayer();
		for(var i = 0; i < myTowers.length; i++)
		{
		drawTower(myTowers[i]);
		drawBullets(myTowers[i]);
		}
		endGame();
	}	
}


function endGame()
{
	ctx.save();
	ctx.fillStyle = "red";
	ctx.font = "20pt Arial";
	ctx.fillText("Game Over, Press P for New Game", 100, 200);
	clearInterval(intervalId);	
	ctx.restore();
}

function checkHit()
{	
	for (var i = 0; i < myTowers.length; i++) 
		for (var j = 0; j < myTowers[i].bullets.length; j++) {
			var x = myTowers[i].bullets[j].distance*Math.cos(myTowers[i].bullets[j].angle*Math.PI/180);
			var y = myTowers[i].bullets[j].distance*Math.sin(myTowers[i].bullets[j].angle*Math.PI/180);
		
			switch (myTowers[i].bullets[j].side) {
				case 0: //middle right
					x += myTowers[i].bullets[j].originX;
					y += myTowers[i].bullets[j].originY;
					break;
				case 1:
					x = myTowers[i].bullets[j].originX - x;
					y = myTowers[i].bullets[j].originY - y;
					break;
				case 2:
					x = myTowers[i].bullets[j].originX;
					y = -myTowers[i].bullets[j].distance;
					break;
				case 3:
					x = myTowers[i].bullets[j].originX;
					y = myTowers[i].bullets[j].distance;
					break;
			}
			if ((Math.abs(player.x - x) < 8) && (Math.abs(player.y - y) < 8))
				hitFlag = true;
		}

	if (hitFlag == true && player.cooldown < 0) {
		player.hp--;
		player.cooldown = playerBase;
	}
	hitFlag = false;
	player.cooldown -=playerRate;
}



function isAlive()
{
	if (player.hp > 0)
		 return true;
	else
		return false;
}

function fire(tower)
{
	if (tower.cooldown <= 0)
	{
		var slope = (player.y-tower.y)/(player.x-tower.x)
		var angle = (Math.atan(slope)*(180/Math.PI));
		var side;
		
		if (player.x > tower.x)
			side = 0;
		else if (player.x < tower.x)
			side = 1;
		else if (player.x == tower.x)	
		{
			if (player.y > tower.y)
				side = 3;
			else
				side = 2;
		}
		
		tower.bullets[tower.bullets.length] = new bullet(angle, side, tower.x, tower.y);
		tower.cooldown = standardBase;
	}
	else
		tower.cooldown -= standardFireRate;
	
	
	
}

function drawBullets(tower)
{
	for (var i = 0; i < tower.bullets.length; i++)
	{
		ctx.save();
		
		//setup
		ctx.translate(tower.bullets[i].originX,tower.bullets[i].originY)
		switch (tower.bullets[i].side) {
		case 0: // right
			ctx.rotate(tower.bullets[i].angle*Math.PI/180);
			break;
		case 1:
			ctx.rotate((180+tower.bullets[i].angle)*Math.PI/180);
			break;
		case 2:
			ctx.rotate((90) * Math.PI / 180);
			break;
		case 3:
			ctx.rotate((270) * Math.PI / 180);
			break;
		}
		
		ctx.beginPath();
		ctx.fillStyle = "blue";
		ctx.lineWidth = "3";
		ctx.arc(tower.bullets[i].distance,0,5,0,2*Math.PI);
		//ctx.fillRect(tower.bullets[i].distance,-5,5,10);
		ctx.stroke(); 
		ctx.fill();
		ctx.restore();
		
		/*var x = tower.bullets[i].distance*Math.cos(tower.bullets[i].angle*Math.PI/180);
		var y = tower.bullets[i].distance*Math.sin(tower.bullets[i].angle*Math.PI/180);
		
		ctx.fillText(tower.bullets[i].angle, 400, 100);
		ctx.beginPath();
		ctx.arc(x+tower.bullets[i].originX,y+tower.bullets[i].originY,10,0,2*Math.PI);
		ctx.stroke();
		ctx.fill();
		*/
		tower.bullets[i].distance += standardBulletSpeed;
		if (tower.bullets[i].distance > 700)
			tower.bullets.splice(i,1)
	}
}
function movePlayer(){
	switch(player.direction) {
		case "neutral":
		break;
		case "left":
		player.x -=playerSpeed;
		break;
		case "right":
		player.x +=playerSpeed;
		break;
		case "up":
		player.y -=playerSpeed;
		break;
		case "down":
		player.y +=playerSpeed;
		break;
	}
	if (player.x <= 10)
		player.x = 10;
	if (player.x >=canvasWidth - 15)
		player.x = canvasWidth - 15;
	if (player.y <= 10)
		player.y = 10;
	if (player.y >= canvasHeight - 15)
		player.y = canvasHeight - 15;
	
}



function drawPlayer()
{
	ctx.beginPath();
	if (player.cooldown > 0)
		ctx.fillStyle = "pink";
	else
		ctx.fillStyle = "Red";
	ctx.lineWidth = "3";
	ctx.arc(player.x,player.y,10,0,2*Math.PI);
	ctx.stroke(); 
	ctx.fill();
	ctx.font = '14px Ariel';
	ctx.fillText("HP: ",650,590);
	ctx.fillText(player.hp,670,590);
}


function drawTower(drawTower) {
	ctx.save();
	if (drawTower.direction == "down")
		drawTower.y += 1;
	else
		drawTower.y -= 1;
	if (drawTower.y >= 560)
		drawTower.direction = "up";
	if (drawTower.y <= 40)
		drawTower.direction ="down";
	ctx.strokeStyle = "black";
	ctx.beginPath();
	ctx.fillStyle = "grey";
	ctx.lineWidth = "3";
	ctx.arc(drawTower.x,drawTower.y,30,0,2*Math.PI);
	ctx.stroke(); 
	ctx.fill();
	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.fillStyle = "brown";
	ctx.strokeStyle = "brown";
	ctx.arc(drawTower.x,drawTower.y,10,0,2*Math.PI);
	ctx.stroke();
	ctx.fill();
	var slope = (player.y-drawTower.y)/(player.x-drawTower.x)
	var check;
	var cas;
	if (player.x > drawTower.x)
		cas = 0;
	else if (player.x < drawTower.x)
		cas = 1;
	else if (player.x == drawTower.x)	
	{
		if (player.y > drawTower.y)
			cas = 2;
		else
			cas = 3;
	}
	//ctx.fillText(Math.atan(slope)*(180/Math.PI), 200, 200)
	ctx.translate(drawTower.x,drawTower.y)
	switch (cas) {
		case 0: //middle right
			ctx.rotate(Math.atan(slope));
			break;
		case 1:
			ctx.rotate(180*Math.PI/180+Math.atan(slope));
			break;
		case 2:
			ctx.rotate((90) * Math.PI / 180);
			break;
		case 3:
			ctx.rotate((270) * Math.PI / 180);
			break;
	}
	ctx.fillRect(8,-5,30,10);
	ctx.restore();
	
	
	
	
	
}
function clear() 
{
 	ctx.clearRect(0, 0, canvas.width,canvas.height);
}




$("body").keydown(function(e){
	keys++;
		if (e.keyCode === 40) //down
		{
			player.direction = "down";
			return false;
		}
		else if (e.keyCode === 37) //left
		{
			player.direction = "left";
			return false;
		}
		else if (e.keyCode === 38) //up
		{
			player.direction = "up";
			return false;		
		}
		else if (e.keyCode == 39) //right
		{
			player.direction = "right";
			return false;
		}
		else if (e.keyCode == 32)
		{
			player.direction = "neutral";
			return false;
		}
		else if (e.keyCode == 80)
		{
			if (player.hp <= 0)
				restartGame();
			return false;
		}
		return true;
	})
	/*
$("body").keyup(function(e){
		
		if (keys < 0) {
			keys = 0;
			player.direction = "neutral";
		}
	})
	*/
	