ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	
	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 20, y:16},
	offset: {x: 0, y: 0},
	
	maxVel: {x: 100, y: 300},
	friction: {x: 600, y: 0},
	
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.ACTIVE,
	
	animSheet: new ig.AnimationSheet( 'media/so/blob.png', 20, 16 ),	
	
	
	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	flip: false,
	accelGround: 400,
	accelAir: 400,
	jump: 400,
	health: 10,
	flip: false,
	zIndex: 20,
    timer: new ig.Timer(),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'run', 0.07, [0,1,2,3] );
		this.addAnim( 'jump', 0.07, [0,1,2,3] );
		this.addAnim('fall', 0.07, [0, 1, 2, 3]);

		this.timer.set(1);
		
		// am I coming back
		if (ig.game.playerFromRight == true) {
			this.pos.x = 1564;
			this.pos.y = 352;
			this.flip = true;
		}
	},
	
	
	update: function() {
		
	    // move left or right
	    var accel = this.standing ? this.accelGround : this.accelAir;
	    if( ig.input.state('left') ) {
	        this.accel.x = -accel;
	        this.flip = true;
	    }
	    else if( ig.input.state('right') ) {
	        this.accel.x = accel;
	        this.flip = false;
	    }
	    else {
	        this.accel.x = 0;
	    }
		
		
	    // jump
	    if( this.standing && ig.input.pressed('jump') ) {
	        this.vel.y = -this.jump;
	        ig.game.snd_jump.play();
	    }
		
		// bounds checking
		if (this.pos.y > ig.system.height) { // fell into water, lava
			this.pos.x = 17;
			this.vel.x = 0;
			this.vel.y = 0;
			if (ig.game.playerFromRight == true) {
				this.flip = true;
				this.pos.y = 1564;
			} else {
				this.flip = false;
				this.pos.y = 352;
			}
			
		}
		
		if (this.pos.x > ig.system.realWidth) { // next level
			ig.game.playerFromRight = false;
			ig.game.level = 2;
			ig.game.loadLevel(LevelSo2);
		}
		if (this.pos.x < 0-this.size.x) { // previous level
			ig.game.playerFromRight = true;
			ig.game.level = 1;
			ig.game.loadLevel(LevelSo1);
		}
		
	    // set the current animation, based on the player's speed
	    if( this.vel.y < 0 ) {
	        this.currentAnim = this.anims.jump;
	    }
	    else if( this.vel.y > 0 ) {
	        this.currentAnim = this.anims.fall;
	    }
	    else if( this.vel.x != 0 ) {
	        this.currentAnim = this.anims.run;
	    }
	    else {
	        this.currentAnim = this.anims.idle;
	    }
		
	    this.currentAnim.flip.x = this.flip;
		
	    // tell people where you are
		var dir = 0;
		if( ig.input.state('left') )
			dir = -1;
		else if( ig.input.state('right') )
			dir = 1;
		
	    if (this.timer.delta() >= 0) {
			sendMessage("2 " + Math.round(this.pos.x) + " " + Math.round(this.pos.y) + " " + dir + " " + ig.game.level);
	        this.timer.set(0.1);
	    }

		// move!
		this.parent();
	},
	
	draw: function() {
		this.parent();
		
		ig.game.font.draw( ig.game.uid, this.pos.x-Math.floor(ig.game.uid.length*2.5)+12-Math.min(Math.max(this.pos.x - ig.system.width/2, 0), ig.game.collisionMap.width * ig.game.collisionMap.tilesize - ig.system.width), this.pos.y-16 );
	}
});

});