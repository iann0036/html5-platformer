ig.module(
	'game.entities.onp'
)
.requires(
	'impact.entity'
)
.defines(function () {

    EntityOnp = ig.Entity.extend({

        // The players (collision) size is a bit smaller than the animation
        // frames, so we have to move the collision box a bit (offset)
        size: { x: 20, y: 16 },
        offset: { x: 0, y: 0 },
		
		score: 0,

        maxVel: { x: 100, y: 300 },
        friction: { x: 600, y: 0 },
		gravityFactor: 0.1,

        type: ig.Entity.TYPE.A, // Player friendly group
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.NEVER,

        animSheet: new ig.AnimationSheet('media/so/blob-blue.png', 20, 16),


        // These are our own properties. They are not defined in the base
        // ig.Entity class. We just use them internally for the Player
        flip: false,
        accelGround: 400,
        accelAir: 400,
        jump: 400,
        health: 10,
        flip: false,
        zIndex: 19,
        uid: "Unknown",
		dir: 0,
		level: 0,
		moves: new Array(),
		timer: new ig.Timer(),

        init: function (x, y, settings) {
            this.parent(x, y, settings);

            // Add the animations
            this.addAnim('idle', 1, [0]);
            this.addAnim('run', 0.07, [0, 1, 2, 3]);
            this.addAnim('jump', 0.07, [0, 1, 2, 3]);
            this.addAnim('fall', 0.07, [0, 1, 2, 3]);
			this.timer.set(1);
        },


        update: function () {
			// updates
			/*
			if (this.moves.length > 1) {
				this.pos.x = this.moves[0].x+((this.moves[0].x-this.moves[1].x)*this.timer.delta()*(-10));
				this.pos.y = this.moves[0].y+((this.moves[0].y-this.moves[1].y)*this.timer.delta()*(-10));
				this.dir = this.moves[0].dir;
				this.level = this.moves[0].level;
				if (this.timer.delta() >= 0) {
					this.moves.shift();
					this.timer.set(0.1);
				}
			}
			*/
			if (this.timer.delta() >= 0 && this.moves.length > 0) {
				var move = this.moves.shift();
				if ((this.pos.x-move.x<6 && this.pos.x-move.x>-6))
					this.pos.x = move.x;
				else
					this.pos.x = (this.pos.x*ig.game.interpolateFactor+move.x)/(ig.game.interpolateFactor+1);
				if ((this.pos.y-move.y<6 && this.pos.y-move.y>-6))
					this.pos.y = move.y;
				else
					this.pos.y = (this.pos.y*ig.game.interpolateFactor+move.y)/(ig.game.interpolateFactor+1);
				this.dir = move.dir;
				this.level = move.level;
				this.timer.set(0.1);
			}

            // move left or right
            var accel = this.standing ? this.accelGround : this.accelAir;
            if (this.dir == -1) {
                this.accel.x = -accel;
                this.flip = true;
            }
            else if (this.dir == 1) {
                this.accel.x = accel;
                this.flip = false;
            }
            else {
                this.accel.x = 0;
            }


            // jump
            /*if (this.standing && ig.input.pressed('jump')) {
                this.vel.y = -this.jump;
            }*/

            // set the current animation, based on the player's speed
            if (this.vel.y < 0) {
                this.currentAnim = this.anims.jump;
            }
            else if (this.vel.y > 0) {
                this.currentAnim = this.anims.fall;
            }
            else if (this.vel.x != 0) {
                this.currentAnim = this.anims.run;
            }
            else {
                this.currentAnim = this.anims.idle;
            }

            this.currentAnim.flip.x = this.flip;


            // move!
            this.parent();
        },
	
		draw: function() {
			if (this.level == ig.game.level) {
				this.parent();
				
				ig.game.font.draw( this.uid, this.pos.x-8-Math.min(Math.max(ig.game.getEntitiesByType( EntityPlayer )[0].pos.x - ig.system.width/2, 0), ig.game.collisionMap.width * ig.game.collisionMap.tilesize - ig.system.width), this.pos.y-16 );
			}
		}
    });

});