ig.module(
	'game.entities.point'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPoint = ig.Entity.extend({
	
	size: {x: 10, y:10},
	offset: {x: 0, y: 0},
	gravityFactor: 0,
	
	type: ig.Entity.TYPE.B, // Other
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.LITE,
	
	animSheet: new ig.AnimationSheet( 'media/so/point.png', 10, 10 ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
	},
	
	collideWith: function(entity,direction) {
		ig.game.score++;
		this.kill();
		ig.game.snd_point.play();
	},
	
	update: function() {
		this.parent();
	},
	
	draw: function() {
		this.parent();
	}
});

});