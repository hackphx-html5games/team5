require([
	'dojo/on',
	'frozen/GameCore',
	'frozen/ResourceManager'
], function(on, GameCore, ResourceManager){
	var CANVAS_WIDTH;
	var CANVAS_HEIGHT;
	var CASTLE_WIDTH = 450;
	var CASTLE_HEIGHT = 350;
	var BULLET_WIDTH = 55;
	var BULLET_HEIGHT= 25;
	var BULLET_POS_VERT_MAX;
	var BULLET_POS_VERT_MIN;
	var BULLET_SPEED_MIN = 1;
	var BULLET_SPEED_MAX = 2;
	

	var game;

	// game state
	var wall = [];
	var bullets = [];
	var currentChar;

	var phraseBox = document.getElementById('phraseBox');
	var wallNodes = [];

	var resourceManager = new ResourceManager();
	var castleImage = resourceManager.loadImage('resources/images/castle.png');
	var bulletImage = resourceManager.loadImage('resources/images/bullet.png');
	var bulletsound = resourceManager.loadSound('resources/sounds/bulletshoot.wav');

	var i;
	var j;

	for(i = 3; i > 0; i--){
		for(j = 1; j < 6; j++){
			wallNodes.push(document.getElementById('w' + i + 'r' + j));
		}
	}
	console.dir(wallNodes)
	for(i = 0; i < 15; i++){
		wall.push(i);
	}

	function randomInt(lower, upper){
		return Math.floor(Math.random() * (upper - lower + 1)) + lower;
	}

	function createWalls(){
		
	}

	function handleKeys(keyEvent){
		// check if correct letters were typed
		// if so, build up wall
		var letter;
		//console.dir(keyEvent)
		//if(keyEvent.keyCode > 64 && keyEvent.keyCode < 91){
		 	//letter = keyEvent.shiftKey ? String.fromCharCode(keyEvent.keyCode) : String.fromCharCode(keyEvent.keyCode + 32);
		//}
		//else{
			//letter = String.fromCharCode(keyEvent.keyCode);
		//}
		//console.log(letter);

		if(currentChar.charCodeAt(0) === keyEvent.keyCode){
			addCharToWall(currentChar);
			setPhrase();
		}
	}
	function addCharToWall(char){
		wallNodes[wall.pop()].innerHTML = char;
	}

	on(document.body, 'keydown', handleKeys);

	var collisionMatrix = [];
	for(i = 0; i < 3; i++){
		for(j = 0; j < 5; j++){
			if(!collisionMatrix[i]){
				collisionMatrix[i] = [];
			}
			collisionMatrix[i][j] = {
				x1: 500 + (50 * i),
				x2: 550 + (50 * i),
				y1: 170 + (70 * j),
				y2: 240 + (70 * j)
			};
		}
	}

	function checkCollision(bullet){
		// check for collision with wall
		// check for collision with player
		if(bullet[0] < CASTLE_WIDTH){
			game.isRunning = false;
		}
		var xpos = bullet[0];
		var ypos = bullet[1];
		if(collisionMatrix.some(function(column){
			return column.some(function(cell){
				return xpos >= cell.x1 && xpos <= cell.x2 && ypos >= cell.y1 && ypos <= cell.y2;
			});
		})){
			bullet[2] = 0;
		}
	}

	function newBullet(){
		return [CANVAS_WIDTH, randomInt(BULLET_POS_VERT_MIN, BULLET_POS_VERT_MAX), randomInt(BULLET_SPEED_MIN, BULLET_SPEED_MAX)];
	}
	function updateBullets(){
		if(!bullets.length){
			bullets.push(newBullet());
		}
		else{
			bullets = bullets.filter(function(bullet){
				return bullet[2] > 0;
			})
			bullets.forEach(function(bullet){
				bullet[0] -= bullet[2];
				checkCollision(bullet);
			})
			if(Math.random() < 0.01){
				bullets.push(newBullet());
				resourceManager.playSound(bulletsound);
			}
		}

	}

	function setPhrase(){
		phraseBox.innerHTML = currentChar = getNextKey();
	}
	function getNextKey(){
		return String.fromCharCode(randomInt(65, 90));
	}

	function drawWall(){
		
	}

	function drawBullets(context){
		bullets.forEach(function(bullet){
			context.drawImage(bulletImage, bullet[0], bullet[1], BULLET_WIDTH, BULLET_HEIGHT);
		});
	}

	//setup a GameCore instance
	game = new GameCore({
		canvasId: 'game',

		init: function(){
			this.inherited(arguments);

			CANVAS_WIDTH = this.canvas.width;
			CANVAS_HEIGHT = this.canvas.height;
			BULLET_POS_VERT_MAX = CANVAS_HEIGHT - CASTLE_HEIGHT;
			BULLET_POS_VERT_MIN = CANVAS_HEIGHT - BULLET_HEIGHT

			createWalls();
			setPhrase();
		},

		update: function(millis){
			if(!game.isRunning){
				return;
			}

			updateBullets();
		},

		draw: function(context){
			if(!game.isRunning){
				return;
			}

			context.clearRect(0, 0, this.width, this.height);
			this.context.drawImage(castleImage, 20, CANVAS_HEIGHT - CASTLE_HEIGHT, CASTLE_WIDTH, CASTLE_HEIGHT);
			drawWall();
			drawBullets(context);

			//context.fillRect(x, y, 50, 50);
		}
	});

	//if you want to take a look at the game object in dev tools
	console.log(game);

	//launch the game!
	on(document.getElementById('startGameButton'), 'click', function(event){
		event.target.parentNode.removeChild(event.target);
		game.run();
	});
});