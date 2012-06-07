var canvas;
var ctx;
var player;
var myTowers = new Array();
var hitFlag = false;
var intervalId;
init()
keys = 0;
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
}

function bullet(angle, side)
{
	this.angle = angle;
	this.side = side; //0 is right, 1 is left, 2 is straight up, 3 is straight down.
	this.distance = 0;
}

function player(startX, startY, hp)
{
	this.x = startX;
	this.y = startY;
	this.hp = hp;
	this.direction = "neutral";
	
}


 function createTower(x, y, type){
 	var index = myTowers.length;
 	var newTower = new tower(x, y, type);
	myTowers[index]=newTower;
 }

function init()
{
	
	 canvas = document.getElementById("canvas");
	 ctx = canvas.getContext("2d");
	 	player = new player(250,250,10);
		player.direction = "right";
		createTower(75,75,"new");		
		createTower(600,75,"new");
		createTower(75,550,"new");
		createTower(600,550,"new");
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
	if (!isAlive())
		endGame();
		/*if (Math.abs(player.x - myTowers[i].bullets[j].x) < 5 &&
				Math.abs(player.y - myTowers[i].bullets[j].y < 5))
				hitFlag = true;*/
	//hitFlag = true;
}


function endGame()
{
	ctx.font = "20pt Arial";
	ctx.fillText("Game Over, Press P for New Game", 100, 200);
	clearInterval(intervalId);	
}

function checkHit()
{	
	if (hitFlag == true)
		player.hp--;	
	hitFlag = false;
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
		
		tower.bullets[tower.bullets.length] = new bullet(angle, side)
		tower.cooldown = 100;
	}
	else
		tower.cooldown -= 1;
	
	
	
}

function drawBullets(tower)
{
	for (var i = 0; i < tower.bullets.length; i++)
	{
		ctx.save();
		
		//setup
		ctx.translate(tower.x,tower.y)
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
		
		tower.bullets[i].distance +=5;
		if (tower.bullets[i].distance > 700)
			tower.bullets.splice(i,1)
	}
}
function movePlayer(){
	switch(player.direction) {
		case "neutral":
		break;
		case "left":
		player.x -=5;
		break;
		case "right":
		player.x +=5;
		break;
		case "up":
		player.y -=5;
		break;
		case "down":
		player.y +=5;
		break;
	}
	if (player.x <= 10)
		player.x = 10;
	if (player.x >=685)
		player.x = 685;
	if (player.y <= 10)
		player.y = 10;
	if (player.y >= 585)
		player.y = 585;
	
}



function drawPlayer()
{
	ctx.beginPath();
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
			ctx.rotate((Math.atan(slope)*(180/Math.PI))*Math.PI/180);
			break;
		case 1:
			ctx.rotate((180+(Math.atan(slope)*(180/Math.PI)))*Math.PI/180);
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
	