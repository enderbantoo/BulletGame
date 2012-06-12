var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

		//ctx.fillstyle = "black";
		//ctx.fillRect(0,0,700,600);
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = "blue";
		ctx.shadowBlur = 7;
		ctx.shadowColor = "black";
		ctx.lineWidth = "3";
		ctx.arc(50,50,5,0,2*Math.PI);
		ctx.stroke(); 
		ctx.fill();
		ctx.restore();
		
		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.fillStyle = "rgba(0,0,255,0.5)"
		ctx.transparency
		ctx.lineWidth = "3";
		ctx.arc(100,50,5,0,2*Math.PI);
		//ctx.stroke(); 
		ctx.fill();
		ctx.restore();