var canvas;
var ctx;
var player;
var myTowers = new Array();
var myMonsters = new Array();
var hitFlag = false;
var intervalId;
moveKeys = 0;
var timer = 0;
var kills = 0;
var monsterCreated = false;
var railOffset;
var maxRail = 2000;

//Magic Numbers
var standardBulletSpeed = 5;
var playerBulletSpeed = 30;
var playerSpeed = 5;
var standardBase = 100;
var standardFireRate = 1;
var playerBase = 30;
var playerRate = 1;
var canvasWidth = 700;
var canvasHeight = 600;
var maxHP = 5;
var playerFireBase = 30;
var playerFireRate = 10;
var monsterSpeed = 5;
init();

/*
canvas.onmousedown = moduleMouseDown;
canvas.onmouseup = moduleMouseUp;
canvas.onmousemove = captureMousePosition;
*/
//initialization

function init()
{
	railOffset = 2000;
	 canvas = document.getElementById("canvas");
	 ctx = canvas.getContext("2d");
	 	player = new player(250,250,maxHP);
		player.direction = "neutral";
		createTower(75,75,"new");		
		createTower(600,75,"new");
		createTower(75,550,"new");
		createTower(600,550,"new");
		createTower(75,1075,"new");		
		createTower(600,1075,"new");
		createTower(75,1550,"new");
		createTower(600,1550,"new");
		createTower(75,2075,"new");		
		createTower(600,2075,"new");
		createTower(75,2550,"new");
		createTower(600,2550,"new");
		
		
		intervalId = setInterval(draw, 10);
		return intervalId;
}


function endGame()
{
	ctx.save();
	ctx.fillStyle = "red";
	ctx.font = "20pt Arial";
	ctx.fillText("Game Over, Press P for New Game", 100, 200);
	ctx.fillText("Current Score: ",100,400);
	ctx.fillText(timer,285,400);
	clearInterval(intervalId);	
	ctx.restore();
}

function restartGame() {
	railOffset = 2000;
	player.hp = maxHP;
	timer = 0;
	kills = 0;
	moveKeys = 0;
	myMonsters.splice(0, myMonsters.length)
	player.direction = "neutral";
	for (var i = 0; i < myTowers.length; i++)
		myTowers[i].bullets.splice(0,myTowers[i].bullets.length);
	
	intervalId = setInterval(draw, 10);
	return intervalId;
}


//draw function

function draw(){
	clear();
	ctx.strokeStyle = "black";	
	for(var i = 0; i < myTowers.length; i++)
	{
		drawTower(myTowers[i]);
		moveTower(myTowers[i]);
		fire(myTowers[i]);
		drawBullets(myTowers[i]);
	}
	drawPlayer();
	movePlayer();
	playerFire();
	drawPlayerBullets();
	for (var i = 0; i < myMonsters.length; i++)
	{
		drawMonster(myMonsters[i]);
		moveMonster(myMonsters[i]);
		checkMonster(myMonsters[i]);
	}
	checkHit();
	if (!isAlive()) {
		clear();
		for(var i = 0; i < myTowers.length; i++)
			drawTower(myTowers[i]);	
		drawPlayer();
		for(var i = 0; i < myTowers.length; i++)
			drawBullets(myTowers[i]);
		endGame();
	}
	timer +=0.01;
	if (timer % 2 > 1 && monsterCreated == false)	
	{
		monsterCreated = true;
		createMonster();
	}
	if (timer % 2 < 1)
		monsterCreated = false;
		
	railOffset-=1;
}


// "tower" code


function tower(x, y, type){
	//basic variables
	this.x = x;
	this.y = y;
	this.type = type;
	this.bullets = new Array();
	this.cooldown = 0;
	this.direction = "down";
}

function createTower(x, y, type){
 	var index = myTowers.length;
 	var newTower = new tower(x, y, type);
	myTowers[index]=newTower;
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
		case 1: //left
			ctx.rotate((180+tower.bullets[i].angle)*Math.PI/180);
			break;
		case 2: //up
			ctx.rotate((270) * Math.PI / 180);
			break;
		case 3://down
			ctx.rotate((90) * Math.PI / 180);
			break;
		}
		
		ctx.beginPath();
		ctx.fillStyle = "blue";
		ctx.lineWidth = "3";
		ctx.arc(tower.bullets[i].distance,0,5,0,2*Math.PI);
		ctx.stroke(); 
		ctx.fill();
		ctx.restore();
		
		tower.bullets[i].distance += standardBulletSpeed;
		if (tower.bullets[i].distance > 700)
			tower.bullets.splice(i,1)
	}
}

function fire(tower)
{
	if (tower.cooldown <= 0)
	{
		var slope = (player.y-(tower.y-railOffset))/(player.x-tower.x);
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
		
		tower.bullets[tower.bullets.length] = new bullet(angle, side, tower.x, tower.y-railOffset);
		tower.cooldown = standardBase;
	}
	else
		tower.cooldown -= standardFireRate;
	
	
}

function moveTower(tower)
{
	/*if (tower.direction == "down")
		tower.y += 1;
	else
		tower.y -= 1;
	if (tower.y >= 560)
		tower.direction = "up";
	if (tower.y <= 40)
		tower.direction ="down";*/
}

function drawTower(drawTower) {
	ctx.save();
	ctx.strokeStyle = "black";
	ctx.beginPath();
	ctx.fillStyle = "grey";
	ctx.lineWidth = "3";
	ctx.arc(drawTower.x,drawTower.y-railOffset,30,0,2*Math.PI);
	ctx.stroke(); 
	ctx.fill();
	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.fillStyle = "brown";
	ctx.strokeStyle = "brown";
	ctx.arc(drawTower.x,drawTower.y-railOffset,10,0,2*Math.PI);
	ctx.stroke();
	ctx.fill();
	var slope = (player.y-(drawTower.y-railOffset))/(player.x-drawTower.x)
	var check;
	var cas;
	if (player.x > drawTower.x)
		cas = 0;
	else if (player.x < drawTower.x)
		cas = 1;
	else if (player.x == drawTower.x)	
	{
		if (player.y > drawTower.y-railOffset)
			cas = 2;
		else
			cas = 3;
	}
	ctx.translate(drawTower.x,drawTower.y-railOffset)
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


//"monster" code
function monster(x,y,type)
{
	this.x=x;
	this.y=y;
	this.type = "type";
	this.speed = monsterSpeed;
	this.direction = "right";
	this.hp = 1;
}

function createMonster()
{
	var monst = new monster(0,50+railOffset,"normal");
	myMonsters.push(monst);
}

function moveMonster(monster)
{
	if (monster.direction == "right")
		monster.x += monster.speed;
	else
		monster.x -= monster.speed;
	if (monster.x >= 690)
		monster.direction = "left";
	if (monster.x <= 10)
		monster.direction ="right";
}
function checkMonster(monster, index)
{
	for (var i = 0; i < player.bullets.length; i++) 
		if ((Math.abs(player.bullets[i].originX - monster.x) < 10) && (Math.abs((player.bullets[i].originY - player.bullets[i].distance) - (monster.y - railOffset)) < 45)) {
			monster.hp--;
			if (monster.hp <= 0) {
				kills++;
				myMonsters.splice(index, 1);
			}
		}
}
function drawMonster(monster)
{
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = "orange";
	ctx.arc(monster.x,monster.y-railOffset,20,0,2*Math.PI);
	ctx.stroke();
	ctx.fill();
	
	ctx.fillStyle = "red";

	ctx.beginPath();
	ctx.arc(monster.x-6,monster.y-railOffset-6,2,0,2*Math.PI);
	ctx.stroke();
	ctx.fill();
	ctx.beginPath();
	ctx.arc(monster.x-6,monster.y-railOffset+6,2,0,2*Math.PI);
	ctx.stroke();
	ctx.fill();
	ctx.beginPath();
	ctx.arc(monster.x+6,monster.y-railOffset-6,2,0,2*Math.PI);
	ctx.stroke();
	ctx.fill();
	ctx.beginPath();
	ctx.arc(monster.x+6,monster.y-railOffset+6,2,0,2*Math.PI);
	ctx.stroke();
	ctx.fill();
	ctx.restore();
	
}

//projectile code
function bullet(angle, side, x, y)
{
	this.angle = angle;
	this.side = side; //0 is right, 1 is left, 2 is straight up, 3 is straight down.
	this.distance = 0;
	this.originX = x;
	this.originY = y;
}

//playerCode
function player(startX, startY, hp)
{
	this.x = startX;
	this.y = startY;
	this.hp = maxHP;
	this.direction = "neutral";
	this.hitCooldown = 0;
	this.firing = false;
	this.bullets = new Array();
	this.cooldown = 0;
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
					y = myTowers[i].bullets[j].originY-myTowers[i].bullets[j].distance;
					break;
				case 3:
					x = myTowers[i].bullets[j].originX;
					y = myTowers[i].bullets[j].originY+myTowers[i].bullets[j].distance;
					break;
			}
			if ((Math.abs(player.x - x) < 8) && (Math.abs(player.y - y) < 8))
				hitFlag = true;
		}

	if (hitFlag == true && player.hitCooldown < 0) {
		player.hp--;
		player.hitCooldown = playerBase;
	}
	hitFlag = false;
	player.hitCooldown -=playerRate;
}


function isAlive()
{
	if (player.hp > 0)
		 return true;
	else
		return false;
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
	ctx.save();
	ctx.beginPath();
	if (player.hitCooldown > 0)
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
	ctx.fillStyle = "red";
	ctx.fillText("Kills: ", 50, 15);
	ctx.fillText(kills,80,15);
	ctx.fillStyle = "black";
	ctx.fillText(Math.round(timer*Math.pow(10,2))/Math.pow(10,2),30,590);
	ctx.restore();
}

function playerFire() {
	if (player.firing && player.cooldown <= 0)
	{
		player.cooldown = playerFireBase;
		player.bullets[player.bullets.length] = new bullet(270,2,player.x,player.y);
		
	}
	for (var i = 0; i < player.bullets.length; i++)
	{
		player.bullets[i].distance += playerBulletSpeed;	
		if (player.bullets[i].distance > 700)
			player.bullets.splice(i,1);
	}
	player.cooldown -=playerFireRate;
}

function drawPlayerBullets() {
	for (var i = 0; i < player.bullets.length; i++)
	{
		ctx.save();
		ctx.fillStyle = "aqua";
		ctx.lineWidth = "1";
		ctx.translate(player.bullets[i].originX,player.bullets[i].originY);
		ctx.scale(0.25, 1);
		ctx.beginPath();
		ctx.arc(-20,- player.bullets[i].distance,10,0,2*Math.PI);
		ctx.stroke(); 
		ctx.fill();
		ctx.beginPath();
		ctx.arc(20,- player.bullets[i].distance,10,0,2*Math.PI);
		ctx.stroke(); 
		ctx.fill();
		
		ctx.restore();
	}
}

function clear() 
{
 	ctx.clearRect(0, 0, canvas.width,canvas.height);
}




$("body").keydown(function(e){
	
		if (e.keyCode === 40) //down
		{
			moveKeys++;
			player.direction = "down";
			return false;
		}
		else if (e.keyCode === 37) //left
		{
			moveKeys++;
			player.direction = "left";
			return false;
		}
		else if (e.keyCode === 38) //up
		{
			moveKeys++;
			player.direction = "up";
			return false;		
		}
		else if (e.keyCode == 39) //right
		{
			moveKeys++;
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
		else if (e.keyCode == 90)
		{
			player.firing = true;
		}
		return true;
	})
	
$("body").keyup(function(e){
		
		/*if (keys < 0) {
			keys = 0;
			player.direction = "neutral";
		}*/
		if (e.keyCode == 90)
		{
			player.firing = false;
		}
		else if (e.keyCode >= 37 && e.keyCode <=40)
			moveKeys--;
		if (moveKeys <=0)
			player.direction = "neutral";
	})
	