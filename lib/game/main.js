ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	
	'game.entities.player',
    'game.entities.onp',
	'game.levels.so1',
	'game.levels.so2'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	gravity: 500, // All entities are affected by this
	score: 0,
	playerFromRight: false,
	uid: "Me",
	interpolateFactor: 1,
	level: 1,
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	// Secondary Images
	img_point: new ig.Image('media/so/point.png'),
	
	// Put on some tunes
	bgtunes: new ig.Sound( 'media/so/bgmusic.mp3'),
	bgtunes2: new ig.Sound( 'media/so/bgmusic2.mp3'),
	bgtunes3: new ig.Sound( 'media/so/bgmusicold.mp3'),
	
	// Preload SFX
	snd_jump: new ig.Sound( 'media/so/jump.mp3'),
    snd_point: new ig.Sound( 'media/so/point.mp3'),

    // Talk Mode
    talk_mode: false,
	talk_string: "",
	talk_cursor_counter: 20,
	talk_history: new Array(),
	
	log: function(text) {
		var msg = new Array();
		var timer = new ig.Timer();
		timer.set(20);
		msg.ttl = timer;
		msg.text = text;
		this.talk_history[this.talk_history.length] = msg;
	},
	
	init: function() {
		// Set background
		this.clearColor = "#28CCFF";
	
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind(ig.KEY.UP_ARROW, 'jump');
		ig.input.bind(ig.KEY.SHIFT, 'shift');
		ig.input.bind(ig.KEY.BACKSPACE, 'backspace');
		ig.input.bind(ig.KEY.TAB, 'tab');
		ig.input.bind(ig.KEY.SPACE, 'space');
		ig.input.bind(ig.KEY.FORWARD_SLASH, 'forwardslash');
		ig.input.bind(ig.KEY.ENTER, 'enter');
		ig.input.bind(ig.KEY.A, 'a');
		ig.input.bind(ig.KEY.B, 'b');
		ig.input.bind(ig.KEY.C, 'c');
		ig.input.bind(ig.KEY.D, 'd');
		ig.input.bind(ig.KEY.E, 'e');
		ig.input.bind(ig.KEY.F, 'f');
		ig.input.bind(ig.KEY.G, 'g');
		ig.input.bind(ig.KEY.H, 'h');
		ig.input.bind(ig.KEY.I, 'i');
		ig.input.bind(ig.KEY.J, 'j');
		ig.input.bind(ig.KEY.K, 'k');
		ig.input.bind(ig.KEY.L, 'l');
		ig.input.bind(ig.KEY.M, 'm');
		ig.input.bind(ig.KEY.N, 'n');
		ig.input.bind(ig.KEY.O, 'o');
		ig.input.bind(ig.KEY.P, 'p');
		ig.input.bind(ig.KEY.Q, 'q');
		ig.input.bind(ig.KEY.R, 'r');
		ig.input.bind(ig.KEY.S, 's');
		ig.input.bind(ig.KEY.T, 't');
		ig.input.bind(ig.KEY.U, 'u');
		ig.input.bind(ig.KEY.V, 'v');
		ig.input.bind(ig.KEY.W, 'w');
		ig.input.bind(ig.KEY.X, 'x');
		ig.input.bind(ig.KEY.Y, 'y');
		ig.input.bind(ig.KEY.Z, 'z');
		ig.input.bind(ig.KEY._0, '_0');
		ig.input.bind(ig.KEY._1, '_1');
		ig.input.bind(ig.KEY._2, '_2');
		ig.input.bind(ig.KEY._3, '_3');
		ig.input.bind(ig.KEY._4, '_4');
		ig.input.bind(ig.KEY._5, '_5');
		ig.input.bind(ig.KEY._6, '_6');
		ig.input.bind(ig.KEY._7, '_7');
		ig.input.bind(ig.KEY._8, '_8');
		ig.input.bind(ig.KEY._9, '_9');
		
		ig.music.add(this.bgtunes);
		ig.music.add(this.bgtunes2);
		ig.music.add(this.bgtunes3);
		
		this.snd_point.volume = 0.12;
		ig.music.volume = 0.25; // 0.5
		ig.music.play();
		
		// Animate some stuff
		var wateranim = new ig.AnimationSheet('media/so/water.png', 16, 16);
		var lavaanim = new ig.AnimationSheet('media/so/lava.png', 16, 16);
		this.backgroundAnims = {
			'media/so/water.png': {
				0: new ig.Animation(wateranim, 0.1, [0,1,2,3,4,5,6,7]),
				1: new ig.Animation(wateranim, 0.1, [1,2,3,4,5,6,7,0]),
				2: new ig.Animation(wateranim, 0.1, [2,3,4,5,6,7,0,1]),
				3: new ig.Animation(wateranim, 0.1, [3,4,5,6,7,0,1,2]),
				4: new ig.Animation(wateranim, 0.1, [4,5,6,7,0,1,2,3]),
				5: new ig.Animation(wateranim, 0.1, [5,6,7,0,1,2,3,4]),
				6: new ig.Animation(wateranim, 0.1, [6,7,0,1,2,3,4,5]),
				7: new ig.Animation(wateranim, 0.1, [7,0,1,2,3,4,5,6])
			},
			'media/so/lava.png': {
				0: new ig.Animation(lavaanim, 0.2, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]),
				1: new ig.Animation(lavaanim, 0.2, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,0]),
				2: new ig.Animation(lavaanim, 0.2, [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,0,1]),
				3: new ig.Animation(lavaanim, 0.2, [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,0,1,2]),
				4: new ig.Animation(lavaanim, 0.2, [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,0,1,2,3]),
				5: new ig.Animation(lavaanim, 0.2, [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,0,1,2,3,4]),
				6: new ig.Animation(lavaanim, 0.2, [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,0,1,2,3,4,5]),
				7: new ig.Animation(lavaanim, 0.2, [7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,0,1,2,3,4,5,6])
			}
		};
		
		// Load the first level
		this.loadLevel( LevelSo1 );
		startWebSocket();
		
		// Welcome text
		this.log("          Welcome to the HTML5 Demo!");
		this.log(" ");
		this.log("Use the UP, DOWN, LEFT and RIGHT arrows to move");
		this.log("       Press the TAB key to start chatting")
		this.log("          Enter /help for more commands");
	},
	
	update: function() {		
		// Update all entities and BackgroundMaps
		this.parent();
		
		// screen follows the player
		var player = this.getEntitiesByType( EntityPlayer )[0];
		if( player ) {
		    this.screen.x = Math.min(Math.max(player.pos.x - ig.system.width/2, 0), this.collisionMap.width * this.collisionMap.tilesize - ig.system.width);
			this.screen.y = 0;
		}

		// enable/disable talk mode
		if (ig.input.released('tab')) {
			if (this.talk_mode)
				this.talk_mode = false;
			else
				this.talk_mode = true;
		}
		
		// talk mode activates
		if (this.talk_mode) {
			this.talk_cursor_counter--;
			if (this.talk_cursor_counter<0)
				this.talk_cursor_counter = 20;
			if (ig.input.released('backspace') && this.talk_string.length > 0) {
				this.talk_string = this.talk_string.substr(0,this.talk_string.length-1);
			}
			if (ig.input.released('enter') && this.talk_string.length > 0) {
				if (this.talk_string == "/help") {
					this.log("Commands Available:");
					this.log("/help - Shows this menu");
					this.log("/players - List players online");
					this.log("/register username password - Register an account");
					this.log("/login username password - Login as a user");
				} else if (this.talk_string == "/players") {
					this.log("Players Online:")
					this.log("* " + this.uid);
					for (var i=0; i<this.getEntitiesByType(EntityOnp).length; i++) {
						this.log("* " + this.getEntitiesByType(EntityOnp)[i].uid);
					}
				} else {
					if (this.talk_string.charAt(0) != '/')
						this.log("Me: " + this.talk_string);
					sendMessage("3 " + this.talk_string);
				}
				this.talk_string = "";
			}
			if (this.talk_string.length<40) {
				if (ig.input.released('a')) {
					if (ig.input.state('shift'))
						this.talk_string += "A";
					else
						this.talk_string += "a";
				}
				if (ig.input.released('b')) {
					if (ig.input.state('shift'))
						this.talk_string += "B";
					else
						this.talk_string += "b";
				}
				if (ig.input.released('c')) {
					if (ig.input.state('shift'))
						this.talk_string += "C";
					else
						this.talk_string += "c";
				}
				if (ig.input.released('d')) {
					if (ig.input.state('shift'))
						this.talk_string += "D";
					else
						this.talk_string += "d";
				}
				if (ig.input.released('e')) {
					if (ig.input.state('shift'))
						this.talk_string += "E";
					else
						this.talk_string += "e";
				}
				if (ig.input.released('f')) {
					if (ig.input.state('shift'))
						this.talk_string += "F";
					else
						this.talk_string += "f";
				}
				if (ig.input.released('g')) {
					if (ig.input.state('shift'))
						this.talk_string += "G";
					else
						this.talk_string += "g";
				}
				if (ig.input.released('h')) {
					if (ig.input.state('shift'))
						this.talk_string += "H";
					else
						this.talk_string += "h";
				}
				if (ig.input.released('i')) {
					if (ig.input.state('shift'))
						this.talk_string += "I";
					else
						this.talk_string += "i";
				}
				if (ig.input.released('j')) {
					if (ig.input.state('shift'))
						this.talk_string += "J";
					else
						this.talk_string += "j";
				}
				if (ig.input.released('k')) {
					if (ig.input.state('shift'))
						this.talk_string += "K";
					else
						this.talk_string += "k";
				}
				if (ig.input.released('l')) {
					if (ig.input.state('shift'))
						this.talk_string += "L";
					else
						this.talk_string += "l";
				}
				if (ig.input.released('m')) {
					if (ig.input.state('shift'))
						this.talk_string += "M";
					else
						this.talk_string += "m";
				}
				if (ig.input.released('n')) {
					if (ig.input.state('shift'))
						this.talk_string += "N";
					else
						this.talk_string += "n";
				}
				if (ig.input.released('o')) {
					if (ig.input.state('shift'))
						this.talk_string += "O";
					else
						this.talk_string += "o";
				}
				if (ig.input.released('p')) {
					if (ig.input.state('shift'))
						this.talk_string += "P";
					else
						this.talk_string += "p";
				}
				if (ig.input.released('q')) {
					if (ig.input.state('shift'))
						this.talk_string += "Q";
					else
						this.talk_string += "q";
				}
				if (ig.input.released('r')) {
					if (ig.input.state('shift'))
						this.talk_string += "R";
					else
						this.talk_string += "r";
				}
				if (ig.input.released('s')) {
					if (ig.input.state('shift'))
						this.talk_string += "S";
					else
						this.talk_string += "s";
				}
				if (ig.input.released('t')) {
					if (ig.input.state('shift'))
						this.talk_string += "T";
					else
						this.talk_string += "t";
				}
				if (ig.input.released('u')) {
					if (ig.input.state('shift'))
						this.talk_string += "U";
					else
						this.talk_string += "u";
				}
				if (ig.input.released('v')) {
					if (ig.input.state('shift'))
						this.talk_string += "V";
					else
						this.talk_string += "v";
				}
				if (ig.input.released('w')) {
					if (ig.input.state('shift'))
						this.talk_string += "W";
					else
						this.talk_string += "w";
				}
				if (ig.input.released('x')) {
					if (ig.input.state('shift'))
						this.talk_string += "X";
					else
						this.talk_string += "x";
				}
				if (ig.input.released('y')) {
					if (ig.input.state('shift'))
						this.talk_string += "Y";
					else
						this.talk_string += "y";
				}
				if (ig.input.released('z')) {
					if (ig.input.state('shift'))
						this.talk_string += "Z";
					else
						this.talk_string += "z";
				}
				if (ig.input.released('space')) {
					this.talk_string += " ";
				}
				if (ig.input.released('_0')) {
					this.talk_string += "0";
				}
				if (ig.input.released('_1')) {
					this.talk_string += "1";
				}
				if (ig.input.released('_2')) {
					this.talk_string += "2";
				}
				if (ig.input.released('_3')) {
					this.talk_string += "3";
				}
				if (ig.input.released('_4')) {
					this.talk_string += "4";
				}
				if (ig.input.released('_5')) {
					this.talk_string += "5";
				}
				if (ig.input.released('_6')) {
					this.talk_string += "6";
				}
				if (ig.input.released('_7')) {
					this.talk_string += "7";
				}
				if (ig.input.released('_8')) {
					this.talk_string += "8";
				}
				if (ig.input.released('_9')) {
					this.talk_string += "9";
				}
				if (ig.input.released('forwardslash') && !ig.input.state('shift')) {
					this.talk_string += "/";
				}
			}
		}
		if (this.talk_history.length>0) {
			if (this.talk_history[0].ttl.delta()>=0) {
				this.talk_history.splice(0,1);
			}
		}
	},
	
	draw: function() {
		// Draw all entities and BackgroundMaps
		this.parent();
		
		// Top-left banner
		this.font.draw( 'HTML5 Demo by iann0036 | UP, DOWN, LEFT, RIGHT to move | TAB for chat', 2, 2 );
		
		// Chat
		if (this.talk_mode) {
			ig.system.context.fillStyle = "rgba(0,0,0,0.7)";
			ig.system.context.fillRect(38,706,500,16);
			if (this.talk_cursor_counter<10)
				this.font.draw(this.talk_string, 20, 354);
			else
				this.font.draw(this.talk_string+"_", 20, 354);
		}
		for (var i=this.talk_history.length-1; i>=0; i--) {
			ig.system.context.fillStyle = "rgba(0,0,0,0.7)";
			ig.system.context.fillRect(38,676-((this.talk_history.length-i-1)*16),500,16);
			this.font.draw(this.talk_history[i].text, 20, 339-((this.talk_history.length-i-1)*8));
		}
		
		// Score
		this.img_point.draw(2,12);
		this.font.draw('x'+this.score,16,16);
	}
});

ig.Sound.channels = 10;
// Start the Game with 60fps, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, screen.availWidth/2, 384, 2 );

});
