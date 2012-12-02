require([
	'dojo/on',
	'frozen/GameCore'
], function(on, GameCore){
	// game state
	var wall = [];
	var bullets = [];

	var phraseBox = document.getElementById('phraseBox');

	function handleKeys(keyEvent){
		// check if correct letters were typed
		// if so, build up wall
		var letter;
		//console.dir(keyEvent)
		if(keyEvent.keyCode > 64 && keyEvent.keyCode < 91){
		 	letter = keyEvent.shiftKey ? String.fromCharCode(keyEvent.keyCode) : String.fromCharCode(keyEvent.keyCode + 32);
		}
		else{
			letter = String.fromCharCode(keyEvent.keyCode);
		}
		//console.log(letter);
	}

	on(document.body, 'keydown', handleKeys);

	function checkCollision(){
		// check for collision with wall
		// check for collision with player
	}

	function moveBullets(){
		checkCollision();
	}

	function setPhrase(){
		phraseBox.innerHTML = getNextKey();
	}
	function getNextKey(){
		return String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65);
	}

	function drawWall(){
		
	}

	function drawBullets(){
		
	}

	//setup a GameCore instance
	var game = new GameCore({
		canvasId: 'game',

		init: function(){
			this.inherited(arguments);

			setPhrase();
		},

		update: function(millis){
			moveBullets();
		},

		draw: function(context){
			drawWall();
			drawBullets();
			//context.clearRect(0, 0, this.width, this.height);
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