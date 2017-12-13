/* jshint strict: false */
/*jshint undef:false */

var game = function() {

	var Q = window.Q = Quintus({ audioSupported: [ 'wav','mp3' ] })
	.include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
	.setup({width:760, height:640})
	.controls().touch()
	.enableSound();

	var next_level = 0;
	var current_level;
	
	/*--------------------------------------------------------------------------------------
									ANIMACIONES
	--------------------------------------------------------------------------------------*/
	Q.animations('pikachu', {
		stand_L:{ frames: [1], flip: "x"},
		stand_R:{ frames: [1]},
		move_L: { frames: [0,1,2], rate: 1/6, flip: "x", next: "stand_L"}, 
		move_R: { frames: [0,1,2], rate: 1/6, flip: false, next: "stand_R"}, 
		attack_L: { frames: [0,1], rate:1/2, loop: false, flip: "x", next: "stand_L", trigger:"cooldown"},
		attack_R: { frames: [0,1], rate:1/2, loop: false,  next: "stand_R", trigger:"cooldown"},
		hurt_L: { frames: [0], rate:1, loop: false, flip: "x"},
		hurt_R: { frames: [0], rate:1, loop: false}	
	});

	Q.animations('bulbasaur', {
		stand_L:{ frames: [2], flip: "x"},
		stand_R:{ frames: [2]},
		move_L: { frames: [0,1,2], rate: 1/6, flip: "x", next: "stand_L"}, 
		move_R: { frames: [0,1,2], rate: 1/6, flip: false, next: "stand_R"}, 
		attack_L: { frames: [0,1], rate:1/2, loop: false, flip: "x", next: "stand_L", trigger:"cooldown"},
		attack_R: { frames: [0,1], rate:1/2, loop: false,  next: "stand_R", trigger:"cooldown" },
		hurt_L: { frames: [0], rate:1, loop: false, flip: "x"},	
		hurt_R: { frames: [0], rate:1, loop: false}		
	});

	Q.animations('charmander', {
		stand_L:{ frames: [1], flip: "x"},
		stand_R:{ frames: [1]},
		move_L: { frames: [0,1,2], rate: 1/6, flip: "x", next: "stand_L"}, 
		move_R: { frames: [0,1,2], rate: 1/6, flip: false, next: "stand_R"}, 
		attack_L: { frames: [0,1], rate:1/2, loop: false, flip: "x", next: "stand_L", trigger:"cooldown"},
		attack_R: { frames: [0,1], rate:1/2, loop: false,  next: "stand_R", trigger:"cooldown"},
		hurt_L: { frames: [0], rate:1, loop: false, flip: "x"},	
		hurt_R: { frames: [0], rate:1, loop: false}		
	});

	Q.animations('squirtle', {
		stand_L:{ frames: [1], flip: "x"},
		stand_R:{ frames: [1]},
		move_L: { frames: [0,1,2], rate: 1/6, flip: "x", next: "stand_L"}, 
		move_R: { frames: [0,1,2], rate: 1/6, flip: false, next: "stand_R"}, 
		attack_L: { frames: [0,1,2], rate:1/2, loop: false, flip: "x", next: "stand_L", trigger:"cooldown"},
		attack_R: { frames: [0,1,2], rate:1/2, loop: false,  next: "stand_R", trigger:"cooldown"},
		hurt_L: { frames: [0], rate:1, loop: false, flip: "x"},	
		hurt_R: { frames: [0], rate:1, loop: false}		
	});

	Q.animations('machop', {
		stand_L:{ frames: [1], flip: "x"},
		stand_R:{ frames: [1]},
		move_L: { frames: [0,1,2], rate: 1/6, flip: "x", next: "stand_L"}, 
		move_R: { frames: [0,1,2], rate: 1/6, flip: false, next: "stand_R"}, 
		attack_L: { frames: [0,1,2,3], rate:1/4, loop: false, flip: "x", next: "stand_L", trigger:"cooldown"},
		attack_R: { frames: [0,1,2,3], rate:1/4, loop: false,  next: "stand_R", trigger:"cooldown"},
		hurt_L: { frames: [0], rate:1, loop: false, flip: "x"},	
		hurt_R: { frames: [0], rate:1, loop: false}	
	});

	Q.animations('gastly', {
		stand_L:{ frames: [1], flip: "x"},
		stand_R:{ frames: [1]},
		move_L: { frames: [0,1,2], rate: 1/3, flip: "x", next: "stand_L"}, 
		move_R: { frames: [0,1,2], rate: 1/3, flip: false, next: "stand_R"}, 
		hurt_L: { frames: [0], rate:1, loop: false, flip: "x"},	
		hurt_R: { frames: [0], rate:1, loop: false}	
	});

	//----------------------------------ENEMIGOS----------------------------------

	Q.animations('caterpie', {
		move_R: { frames: [0,1,2], rate: 1/3, flip: false}, 
		move_L: { frames: [0,1,2], rate: 1/3, flip: "x"}, 
		hurt: { frames: [0], rate:1, loop: false, trigger: "deadC"}		
	});

	Q.animations('rattata', {
		move_R: { frames: [0,1,2], rate: 1/3, flip: false}, 
		move_L: { frames: [0,1,2], rate: 1/3, flip: "x"}, 
		hurt: { frames: [0], rate:1, loop: false, trigger: "deadR"}		
	});

	Q.animations('weedle', {
		move_R: { frames: [0,1,2], rate: 1/3, flip: false}, 
		move_L: { frames: [0,1,2], rate: 1/3, flip: "x"}, 
		hurt: { frames: [0], rate:1, loop: false, trigger: "deadW"},
		attack_L: { frames: [0,1], rate:1/2, loop: false, flip: "x", next: "move_L" },
		attack_R: { frames: [0,1], rate:1/2, loop: false,  next: "move_R" }
	});

	Q.animations('ekans', {
		move_R: { frames: [0,1,2], rate: 1/2, flip: false}, 
		move_L: { frames: [0,1,2], rate: 1/2, flip: "x"}, 
		hurt: { frames: [0], rate:1, loop: false, trigger: "deadE"},
		attack_L: { frames: [0,1,2,3], rate:1/2, loop: false, flip: "x", next: "move_L" },
		attack_R: { frames: [0,1,2,3], rate:1/2, loop: false,  next: "move_R" }
	});

	Q.animations('nidoran', {
		move_R: { frames: [0,1,2], rate: 1/2, flip: false}, 
		move_L: { frames: [0,1,2], rate: 1/2, flip: "x"}, 
		hurt: { frames: [0], rate:1, loop: false, trigger: "deadNid"},
		attack_L: { frames: [0,1], rate:1/2, loop: false, flip: "x", next: "move_L" },
		attack_R: { frames: [0,1], rate:1/2, loop: false,  next: "move_R" }
	});

	Q.animations('tauros', {
		move_R: { frames: [0,1,2], rate: 1/2, loop:false,flip : false},
		move_L: { frames: [0,1,2], rate: 1/2, loop:false, flip: "x"}, 
		hurt: { frames: [0], rate:1, loop: false, trigger: "deadT"}		
	});

	Q.animations('geodude', {
		move_R: { frames: [0,1,2], rate: 1/2, loop:false,flip : false},
		move_L: { frames: [0,1,2], rate: 1/2, loop:false, flip: "x"}, 
		hurt: { frames: [0], rate:1, loop: false, trigger: "deadG"}		
	});

	Q.animations('pidgey', {
		move_UD: { frames: [0,1], rate: 1/3, flip: false}, 
		move_R: { frames: [0,1], rate: 1/3, flip: false}, 
		move_L: { frames: [0,1], rate: 1/3, flip: "x"}, 
		hurt_UD: { frames: [0], rate:1, loop: false, flip: false, trigger: "deadP"},
		hurt_R: { frames: [0], rate:1, loop: false, flip: false, trigger: "deadP"},
		hurt_L: { frames: [0], rate:1, loop: false, flip: "x", trigger: "deadP"}		
	});

	Q.animations('zubat', {
		move_UD: { frames: [0,1,2], rate: 1/3, flip: false}, 
		move_R: { frames: [0,1,2], rate: 1/3, flip: false}, 
		move_L: { frames: [0,1,2], rate: 1/3, flip: "x"}, 
		hurt_UD: { frames: [0], rate:1, loop: false, flip: false, trigger: "deadZ"},
		hurt_R: { frames: [0], rate:1, loop: false, flip: false, trigger: "deadZ"},
		hurt_L: { frames: [0], rate:1, loop: false, flip: "x", trigger: "deadZ"}
	});

	Q.animations('ditto', {
		move_R: { frames: [0,1,2], rate: 1/3, flip: false}, 
		move_L: { frames: [0,1,2], rate: 1/3, flip: "x"}, 
		hurt: { frames: [0], rate:1, loop: false, trigger: "deadD"}		
	});

	Q.animations('muk', {
		move_R: { frames: [0,1,2], rate: 1/3, flip: false}, 
		move_L: { frames: [0,1,2], rate: 1/3, flip: "x"}, 
		hurt: { frames: [0], rate:1, loop: false, trigger: "deadM"}		
	});

	Q.animations('snorlax', {
		move_R: { frames: [0,1], rate: 3/4, flip: false}, 
		move_L: { frames: [0,1], rate: 3/4, flip: "x"}
	}); 

	Q.animations('voltorb', {
		move_R: { frames: [0,1,2], rate: 1/3, flip: false}, 
		move_L: { frames: [0,1,2], rate: 1/3, flip: "x"}, 
		hurt: { frames: [0], rate:1, loop: false, trigger: "deadV"}		
	});

	Q.animations('magnemite', {
		move_R: { frames: [0,1,2], rate: 1/2, flip: false}, 
		move_L: { frames: [0,1,2], rate: 1/2, flip: "x"},  
		hurt: { frames: [0], rate:1, loop: false, trigger: "deadMag"}		
	});

	Q.animations('fearow', {
		move_R: { frames: [0,1,2], rate: 1/2, loop:false,flip : false},
		move_L: { frames: [0,1,2], rate: 1/2, loop:false, flip: "x"},  
		move_UD: { frames: [0,1,2,3], rate:1, loop: true}		
	});

	Q.animations('aerodactyl', {
		move_R: { frames: [0,1,2], rate: 1/2, loop:false,flip : false},
		move_L: { frames: [0,1,2], rate: 1/2, loop:false, flip: "x"},  
		move_UD: { frames: [0,1,2], rate:1, loop: true}		
	});

	//----------------------------------BOSSES----------------------------------

	Q.animations('primeape', {
		move_R: { frames: [0,1,2], rate: 1/3, flip: false}, 
		move_L: { frames: [0,1,2], rate: 1/3, flip: "x"}, 
		hurt: { frames: [0], rate:1, loop: false, trigger: "deadBP"}		
	});

	Q.animations('arbok', {
		move_R: { frames: [0,1,2], rate: 1/2, flip: false}, 
		move_L: { frames: [0,1,2], rate: 1/2, flip: "x"}, 
		hurt: { frames: [0], rate:1, loop: false, trigger: "deadBA"},
		attack_L: { frames: [0,1,2,3], rate:1/2, loop: false, flip: "x", next: "move_L" },
		attack_R: { frames: [0,1,2,3], rate:1/2, loop: false,  next: "move_R" }
	});

	Q.animations('magneton', {
		move_R: { frames: [0,1,2], rate: 1/2, flip: false}, 
		move_L: { frames: [0,1,2], rate: 1/2, flip: "x"}, 
		hurt: { frames: [0], rate:1, loop: false, trigger: "deadBM"}		
	});

	Q.animations('arcanine', {
		move_R: { frames: [0,1,2,3], rate: 1/2, flip: false}, 
		move_L: { frames: [0,1,2,3], rate: 1/2, flip: "x"}, 
		hurt: { frames: [0], rate:1, loop: false, trigger: "deadBArc"}		
	});

	//----------------------------------ATAQUES----------------------------------

	Q.animations('spark', {
		spark: { frames: [0,1,2,3], rate: 1/2, loop:true}	
	});

	Q.animations('leaf', {
		leaf_R: { frames: [0,1,2], rate: 1/2, loop:false},
		leaf_L: { frames: [0,1,2], rate: 1/2, loop:false, flip: "x"}
	});

	Q.animations('bubble', {
		bubble_R: { frames: [0,1,2,3], rate: 1/2, loop:false},
		bubble_L: { frames: [0,1,2,3], rate: 1/2, loop:false, flip: "x"}
	});

	Q.animations('fireball', {
		fireball_R: { frames: [0,1,2], rate: 1/2, loop:false},
		fireball_L: { frames: [0,1,2], rate: 1/2, loop:false, flip: "x"}
	});

	Q.animations('sting', {
		sting_R: { frames: [0,1,2], rate: 1/2, loop:false},
		sting_L: { frames: [0,1,2], rate: 1/2, loop:false, flip: "x"}
	});

	//----------------------------------OBSTACULOS----------------------------------

	Q.animations('tree', {
		tree: { frames: [0,1,2,3], rate: 1/2, loop:false, trigger:"chopped"}	
	});

	Q.animations('rock', {
		rock: { frames: [0,1,2,3,4], rate: 1/2, loop:false, trigger:"smashed"}	
	});

	Q.animations('ice', {
		ice: { frames: [0,1,2], rate: 1/2, loop:false, trigger:"melted"}	
	});

	Q.animations('tesla', {
		tesla: { frames: [0,1], rate: 1/2, loop:false}
	});

	Q.animations('explosion', {
		explosion: { frames: [0,1,2,3], rate: 1/2, loop:false, trigger:"explosion"}
	});

	Q.animations('bonfire', {
		bonfire: { frames: [0,1], rate: 1/2, loop:false},
		bonfire_out: { frames: [1,2,3,4,5], rate: 1/3, loop:false, trigger:"bonfire_out"}
	});

	Q.animations('portal', {
		portal: { frames: [0,1,2,3], rate: 1/2, loop:true}	
	});
	
	//----------------------------------ITEMS----------------------------------
	
	Q.animations('coin', {
		rotate: { frames: [0,1,2,3,4,3,2,1], rate: 1/2, loop:true}	
	});

	//----------------------------------EVOLUCIONES----------------------------------
	Q.animations('evolution', {
		evolution: { frames: [0,1,2], rate: 1/2, loop: true}
	});


	//----------------------------------------------------------------------------------------------------------------------------------------------------------

	Q.SPRITE_PLAYER = 1;
	Q.SPRITE_COLLECTABLE = 2;
	Q.SPRITE_ENEMY = 4;
	Q.SPRITE_TILED = 8;
	Q.SPRITE_ENEMY_PROYECTILE = 16;
	Q.SPRITE_PLAYER_PROYECTILE = 32;


	Q.component("player", {
		added: function() {

			this.entity.timer =  0;
			this.entity.cooldown = 0.75;

			this.entity.on("hit",function(collision) {
				if(collision.obj.isA("Coin")) {
					collision.obj.trigger("picked");
				}
				if(collision.obj.isA("Goal")) {
					collision.obj.trigger("goal");
					this.destroy();
				}
				if(collision.obj.isA("Rock") && this.isA("Machop") && this.p.fight) {
					collision.obj.trigger("smash");
				}
			});

			this.entity.on("cooldown", "rest");
		},

		extend: {
			step: function(dt) {
				this.timer += dt;

				if(this.p.y > 650) {
			    	this.die();
			    }

			    if (!this.p.fight){
			    	if (this.p.gravity != 0) {
						if (this.p.vx > 0) {
							this.play("move_R");
						}
						else if(this.p.vx < 0){
							this.play("move_L");
						}	
					}
					else {
						if(this.p.direction == "right") {
		    				this.play("move_R");
				    	}
				    	else if(this.p.direction == "left") {
				    	 	this.play("move_L");
				    	}
					}
			    }	
		    },

			die: function() {
		    	if (Q.state.get("lives") == 0) {
					this.destroy();
					Q.audio.stop();	
					Q.stageScene("endGame",2, { label: "You Died!" });	
				}
				//Si quedan vidas, restamos una y reiniciamos el nivel.	
				else {
					Q.state.inc("lives", (-1));
					Q.state.set("num_hearts",2);
					Q.state.get("hearts")[0].p.sheet = "ok";
					Q.state.get("hearts")[1].p.sheet = "ok";
					Q.state.get("hearts")[2].p.sheet = "ok";
		   			Q.stageScene(current_level);
				}    	
		    },

		    hit_me :function(){
		    	var n = Q.state.get("lives");
		    	var num_hearts	=Q.state.get("num_hearts");

		    	if(!this.p.hitting && (num_hearts>=0))
		    	{
			    	this.p.hitting=true;		    		
			    	
			    	if (this.p.gravity > 0) {
			    		if(Q.state.get("hearts")[num_hearts].p.sheet == "hurt"){
				    		Q.state.get("hearts")[num_hearts].p.sheet = "NA"
				    		Q.state.dec("num_hearts",1);
				    	}
				    	else
				    		Q.state.get("hearts")[num_hearts].p.sheet = "hurt"

				    	this.animate({ opacity: 0.5 },0.1,{callback:function(){
							
							this.animate({ opacity: 1},1.5,{callback:function(){this.p.hitting = false;}});
				    	}});
			    	}	

			    	else {
			    		Q.state.set("num_hearts",-1);
			    	}	    	
		    	}

		    	if (num_hearts < 0) {
		    		this.die();
			    }	    	
		    }
		}
	});


	/*--------------------------------------------------------------------------------------
										PIKACHU (PLAYER)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Pikachu", {
		init: function(p) {
			this._super(p, {
				sheet: "pikachu",
				sprite: "pikachu",
				frame: 1,
				fight: false,
				hitting: false,
				tipo: "player"
			});	

			this.add('2d, platformerControls, animation, tween, player');

			Q.input.on("fire",this,"attack");

			Q.input.on("action",this,"switch");
		},		

	    attack: function() {
	    	if (this.timer > this.cooldown) {
	    		this.p.sheet = "attack_pikachu";
	    		this.p.fight = true;
		    	if(this.p.direction == "right") {
		    		this.play("attack_R");
		    		Q.stage(0).insert(new Q.Spark({ x: (this.p.x + this.p.w + 1), y: (this.p.y), vx : 200}));
		    		Q.audio.play('thunder.wav');
		    	}
		    	else if(this.p.direction == "left") {
		    	 	this.play("attack_L");
		    	 	Q.stage(0).insert(new Q.Spark({ x: (this.p.x - this.p.w - 1), y: (this.p.y), vx : -200}));
		    	 	Q.audio.play('thunder.wav');
		    	}
		    }
	    },

	    rest: function() {
		    this.timer = 0;
		    this.p.fight = false;
		    this.p.sheet = "pikachu";
	    },

	    switch: function() {
	    	if (this.p.vy == 0) {
			    var next = new Q.Bulbasaur({ x: this.p.x, y: this.p.y, vx : 0, vy : 0 });
			    this.destroy();
			    Q.stage(0).insert(next);
			    Q.stage(0).add("viewport").follow(next,{ x: true, y: false });
			}
	    }
	});

	/*--------------------------------------------------------------------------------------
										BULBASAUR (PLAYER)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Bulbasaur", {
		init: function(p) {
			this._super(p, {
				sheet: "bulbasaur",
				sprite: "bulbasaur",
				frame: 2,
				fight: false,
				hitting: false,
				tipo: "player"
			});	

			this.add('2d, platformerControls, animation, tween, player');

			Q.input.on("fire",this,"attack");

			Q.input.on("action",this,"switch");
		},

	    attack: function() {
	    	if (this.timer > this.cooldown) {
	    		this.p.sheet = "attack_bulbasaur";
	    		this.p.fight = true;
		    	if(this.p.direction == "right") {
		    		this.play("attack_R");
		    		Q.stage(0).insert(new Q.Leaf({ x: (this.p.x + this.p.w + 4), y: (this.p.y), vx : 200}));
		    		Q.audio.play('leaves.wav');
		    	}
		    	else if(this.p.direction == "left") {
		    	 	this.play("attack_L");
		    	 	Q.stage(0).insert(new Q.Leaf({ x: (this.p.x - this.p.w - 4), y: (this.p.y), vx : -200}));
		    	 	Q.audio.play('leaves.wav');
		    	}
		    }
	    },

	    rest: function() {
		    this.timer = 0;
		    this.p.fight = false;
		    this.p.sheet = "bulbasaur";
	    },

	    switch: function() {
	    	if (this.p.vy == 0) {
			    var next = new Q.Charmander({ x: this.p.x, y: this.p.y, vx : 0, vy : 0 });
			    this.destroy();
			    Q.stage(0).insert(next);
			    Q.stage(0).add("viewport").follow(next,{ x: true, y: false });
			}
	    }
	});

	/*--------------------------------------------------------------------------------------
										CHARMANDER (PLAYER)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Charmander", {
		init: function(p) {
			this._super(p, {
				sheet: "charmander",
				sprite: "charmander",
				frame: 1,
				fight: false,
				hitting: false,
				tipo: "player"
			});	

			this.add('2d, platformerControls, animation, tween, player');

			Q.input.on("fire",this,"attack");

			Q.input.on("action",this,"switch");
		},

	    attack: function() {
	    	if (this.timer > this.cooldown) {
	    		this.p.sheet = "attack_charmander";
	    		this.p.fight = true;
		    	if(this.p.direction == "right") {
		    		this.play("attack_R");
		    		Q.stage(0).insert(new Q.Fireball({ x: (this.p.x + this.p.w + 1), y: (this.p.y), vx : 200}));
		    		Q.audio.play('fireball.wav');
		    	}
		    	else if(this.p.direction == "left") {
		    	 	this.play("attack_L");
		    	 	Q.stage(0).insert(new Q.Fireball({ x: (this.p.x - this.p.w - 1), y: (this.p.y), vx : -200}));
		    	 	Q.audio.play('fireball.wav');
		    	}
		    }
	    },

	    rest: function() {
		    this.timer = 0;
		    this.p.fight = false;
		    this.p.sheet = "charmander";
	    },

	    switch: function() {
	    	if (this.p.vy == 0) {
			    var next = new Q.Squirtle({ x: this.p.x, y: this.p.y, vx : 0, vy : 0 });
			    this.destroy();
			    Q.stage(0).insert(next);
			    Q.stage(0).add("viewport").follow(next,{ x: true, y: false });
			}
	    }
	});
	
	/*--------------------------------------------------------------------------------------
										SQUIRTLE (PLAYER)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Squirtle", {
		init: function(p) {
			this._super(p, {
				sheet: "squirtle",
				sprite: "squirtle",
				frame: 1,
				fight: false,
				hitting: false,
				tipo: "player"
			});	

			this.add('2d, platformerControls, animation, tween, player');		

			Q.input.on("fire",this,"attack");

			Q.input.on("action",this,"switch");
		},

	    attack: function() {
	    	if (this.timer > this.cooldown) {
	    		this.p.sheet = "attack_squirtle";
	    		this.p.fight = true;
		    	if(this.p.direction == "right") {
		    		this.play("attack_R");
		    		Q.stage(0).insert(new Q.Bubble({ x: (this.p.x + this.p.w + 1), y: (this.p.y), vx : 200}));
		    		Q.audio.play('bubble.wav');
		    	}
		    	else if(this.p.direction == "left") {
		    	 	this.play("attack_L");
		    	 	Q.stage(0).insert(new Q.Bubble({ x: (this.p.x - this.p.w - 1), y: (this.p.y), vx : -200}));
		    	 	Q.audio.play('bubble.wav');
		    	}
		    }
	    },

	    rest: function() {
		    this.timer = 0;
		    this.p.fight = false;
		    this.p.sheet = "squirtle";
	    },

	    switch: function() {
	    	if (this.p.vy == 0) {
			    var next = new Q.Machop({ x: this.p.x, y: this.p.y, vx : 0, vy : 0 });
			    this.destroy();
			    Q.stage(0).insert(next);
			    Q.stage(0).add("viewport").follow(next,{ x: true, y: false });
			}
	    }
	});

	/*--------------------------------------------------------------------------------------
										MACHOP (PLAYER)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Machop", {
		init: function(p) {
			this._super(p, {
				sheet: "machop",
				sprite: "machop",
				frame: 1,
				fight: false,
				hitting: false,
				tipo: "player"
			});

			this.add('2d, platformerControls, animation, tween, player');

			Q.input.on("fire",this,"attack");

			Q.input.on("action",this,"switch");
		},

	    attack: function() {
	    	if (this.timer > this.cooldown) {
		    	if(this.p.direction == "right") {
		    		this.p.sheet = "attack_machop";
		    		this.p.fight = true;
		    		this.play("attack_R");
		    	}
		    	else if(this.p.direction == "left") {
		    	 	this.p.sheet = "attack_machop";
		    	 	this.p.fight = true;
		    	 	this.play("attack_L");
		    	}
		    	Q.audio.play('machop.wav');
		    }
	    },

	    rest: function() {
		    this.timer = 0;
		    this.p.fight = false;
		    this.p.sheet = "machop";
	    },

	    switch: function() {
	    	if (this.p.vy == 0) {
			    var next = new Q.Gastly({ x: this.p.x, y: this.p.y, vx : 0, vy : 0 });
			    this.destroy();
			    Q.stage(0).insert(next);
			    Q.stage(0).add("viewport").follow(next,{ x: true, y: false });
			}
	    }
	});

	/*--------------------------------------------------------------------------------------
										GASTLY (PLAYER)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Gastly", {
		init: function(p) {
			this._super(p, {
				sheet: "gastly",
				sprite: "gastly",
				frame: 1,
				gravity: 0,
				fight: false,
				hitting: false,
				tipo: "player"
			});	

			this.add('2d, platformerControls, animation, tween, player');

			Q.input.on("fire",this,"attack");

			Q.input.on("action",this,"switch");

			this.on("bump.left",function(collision) {
				if(collision.obj.isA("Portal")) {
					this.p.x = collision.obj.p.x - this.p.w;
					Q.audio.play('portal.wav');
				}
			});

			this.on("bump.right",function(collision) {
				if(collision.obj.isA("Portal")) {
					this.p.x = collision.obj.p.x + this.p.w;
					Q.audio.play('portal.wav');
				}
			});
		},

	    attack: function() {},

	    switch: function() {
	    	if (this.p.vy == 0) {
			    var next = new Q.Pikachu({ x: this.p.x, y: this.p.y, vx : 0, vy : 0 });
			    this.destroy();
			    Q.stage(0).insert(next);
			    Q.stage(0).add("viewport").follow(next,{ x: true, y: false });
			}
	    }
	});


	//----------------------------------------------------------------------------------------------------------------------------------------------------------

	
	Q.component("defaultEnemy", {
		added:function(){
			this.entity.defeat = false;

			this.entity.on("bump.left,bump.right,bump.bottom",function(collision) {
				 if(collision.obj.p.tipo == "player" && !this.defeat) {
				 	collision.obj.hit_me();				 
				 }
			});
				
			this.entity.on("bump.top",function(collision) {
				if(collision.obj.p.tipo == "player") {
				 	if (collision.obj.p.gravity > 0) {
				 		this.defeat = true;
				 		this.hit();
				 		collision.obj.p.vy = -200;
				 	}
				 	else {
				 		collision.obj.die();
				 	}
			 	}
			 });
			
			this.entity.on("hit.sprite",function(collision) {			 
				if(collision.obj.p.tipo == "bullet") 
				{	
					 this.defeat = true;
					 this.hit();
					 collision.obj.destroy();
				}			 
			});
		}
	});

	//----------------------------------------------------------------------------------------------------------------------------------------------------------

	Q.component("normalEnemy", {
		extend: {
			step: function(dt) {
				if(this.p.y > 650) {
			    	this.die();
			    }else{
			    	if(this.p.vx>0){
			    		this.play("move_R");
			    	}else if(this.p.vx<0){
			    		this.play("move_L")
			    	}
			    }
		    },

		    die: function() {
				this.destroy();			
			}
		}
	});


	/*--------------------------------------------------------------------------------------
										CATERPIE (ENEMY)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Caterpie", {
		init: function(p) {
			this._super(p, {
				sheet: "caterpie",
				sprite: "caterpie",
				frame: 0,
				vx: 100
			});	

			this.add('2d, aiBounce, animation, defaultEnemy, normalEnemy');

			this.on("deadC","die");
		},				

	    hit: function(){
	    	this.p.sheet = "hurt_caterpie";
	    	this.p.vx=0;
	    	this.p.vy=0;
	    	this.play("hurt");
			Q.audio.play('caterpie.wav');
	    }	

	});



	/*--------------------------------------------------------------------------------------
										RATTATA (ENEMY)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Rattata", {
		init: function(p) {
			this._super(p, {
				sheet: "rattata",
				sprite: "rattata",
				frame: 0,
				vx: 100
			});	

			this.add('2d, aiBounce, animation, defaultEnemy, normalEnemy');
			
			this.on("deadR","die");
		},

	    hit: function(){
	    	this.p.sheet = "hurt_rattata";
	    	this.p.vx=0;
	    	this.p.vy=0;
	    	this.play("hurt");	    	
	    	Q.audio.play('rattata.wav');
	    },

	});

	//----------------------------------------------------------------------------------------------------------------------------------------------------------

	
	Q.component("shooterEnemy", {
		added:function(){
			this.entity.timer = 0;
			this.entity.cooldown = 4;

			this.entity.play("move_L");
		},

		extend: {
			step: function(dt) {
				this.timer += dt;
				if (this.timer > this.cooldown) {
					this.timer = 0;
					Q.stage(0).insert(new Q.Sting({ x: (this.p.x - this.p.w - 1), y: (this.p.y), vx : -200}));
					
				}
		    },

		    die: function() {
				this.destroy();			
			}
		}
	});

	/*--------------------------------------------------------------------------------------
										WEEDLE (ENEMY)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Weedle", {
		init: function(p) {
			this._super(p, {
				sheet: "weedle",
				sprite: "weedle",
				frame: 0,
			});	

			this.add('2d, animation, defaultEnemy, shooterEnemy');

			this.on("deadW","die");			
		},	

	    hit: function(){
	    	this.p.sheet = "hurt_weedle";
	    	this.play("hurt");
	    	Q.audio.play('weedle.wav');
	    }

	});

	/*--------------------------------------------------------------------------------------
										EKANS (ENEMY)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Ekans", {
		init: function(p) {
			this._super(p, {
				sheet: "ekans",
				sprite: "ekans",
				frame: 0,
			});	

			this.add('2d, animation, defaultEnemy, shooterEnemy');

			this.on("deadE","die");
		},

	    hit: function(){
	    	this.p.sheet = "hurt_ekans";
	    	this.play("hurt");
	    	Q.audio.play('ekans.wav');
	    }

	});

	/*--------------------------------------------------------------------------------------
										NIDORAN (ENEMY)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Nidoran", {
		init: function(p) {
			this._super(p, {
				sheet: "nidoran",
				sprite: "nidoran",
				frame: 0,
			});	

			this.add('2d, animation, defaultEnemy, shooterEnemy');

			this.on("deadNid","die");
		},

	    hit: function(){
	    	this.p.sheet = "hurt_nidoran";
	    	this.play("hurt");
	    	Q.audio.play('nidoran.wav');
	    }

	});

	//----------------------------------------------------------------------------------------------------------------------------------------------------------

	
	Q.component("angryEnemy", {
		extend: {
			step: function(dt) {
				if(this.p.y > 650) {
					this.enfado = true;
			    	this.die();
			    }
			    else{
			    	if (this.p.vx > 0) {
						this.play("move_R");
					}
					else if (this.p.vx < 0) {
						this.play("move_L");
					}
			    }	
		    },

		    die: function() {
		    	if(this.p.enfado){
					this.destroy();
					Q.stage(0).insert(new Q.Aranja({x:this.p.x,y:this.p.y}));				
				}
				else {
					this.p.sheet = this.p.enemy;
					this.p.enfado = true;
					this.defeat = false;
					this.p.vx = 200;
				}					
			}
		}
	});

	/*--------------------------------------------------------------------------------------
										TAUROS (ENEMY)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Tauros", {
		init: function(p) {
			this._super(p, {
				sheet: "tauros",
				sprite: "tauros",
				vx: 75,
				frame: 0,
				enfado:false,
				enemy: "tauros"
			});	

			this.add('2d, aiBounce,animation,defaultEnemy, angryEnemy');

			this.on("deadT","die");
		},		

		hit: function(){
	    	this.p.sheet = "hurt_tauros";
	    	this.p.vx=0;
	    	this.p.vy=0;
			this.play("hurt");
	    	Q.audio.play('tauros.wav');	    	
	    }
	    
	});

	/*--------------------------------------------------------------------------------------
										GEODUDE (ENEMY)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Geodude", {
		init: function(p) {
			this._super(p, {
				sheet: "geodude",
				sprite: "geodude",
				vx: 75,
				frame: 0,
				enfado:false,
				enemy:"geodude"
			});	

			this.add('2d, aiBounce,animation,defaultEnemy, angryEnemy');

			this.on("deadG","die");
		},

		hit: function(){
	    	this.p.sheet = "hurt_geodude";
	    	this.p.vx=0;
	    	this.p.vy=0;
			this.play("hurt");
	    	Q.audio.play('geodude.wav');	    	
	    },

	});

	//----------------------------------------------------------------------------------------------------------------------------------------------------------

	
	Q.component("flyingEnemy", {
		added:function(){
			this.entity.p.initialY = this.entity.p.y;
		},

		extend: {
			step: function(dt) {
				if(this.p.y - this.p.initialY >= this.p.rangeY && this.p.vy > 0) {
			        this.p.vy = -this.p.vy;
			    } 
			    else if(-this.p.y + this.p.initialY >= this.p.rangeY && this.p.vy < 0) {
			        this.p.vy = -this.p.vy;
			    }

			    if(this.p.vy == 0 && !this.p.dead){
			    	this.p.vy=75;
			    }

			    if(this.p.vy != 0){
			    	this.play("move_UD");
			    }
			    else {
			    	if(this.p.vx < 0) {
				    	this.play("move_L")
				    }	
				    if(this.p.vx > 0) {
				    	this.play("move_R")
				    }
			    }		    		    
		    },

		    die: function() {
				this.destroy();			
			}
		}
	});

	/*--------------------------------------------------------------------------------------
										PIDGEY (ENEMY)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Pidgey", {
		init: function(p) {
			this._super(p, {
				sheet: "pidgey",
				sprite: "pidgey",
				vy: 75,
				frame: 0,
				gravity: 0,
				rangeY: 40,
				dead: false
			});

			this.add('2d, aiBounce,animation,defaultEnemy, flyingEnemy');
			
			this.on("deadP","die");
		},

	    hit: function(){
	    	this.p.sheet = "hurt_pidgey";
	    	this.play("hurt_UD");
	    	this.p.dead = true;
	    	this.p.vx = 0;
			this.p.vy = 0;		
	    	Q.audio.play('pidgey.wav');
	    },

	});

	/*--------------------------------------------------------------------------------------
										ZUBAT (ENEMY)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Zubat", {
		init: function(p) {
			this._super(p, {
				sheet: "zubat",
				sprite: "zubat",
				vy: 75,
				frame: 0,
				gravity: 0,
				rangeY: 50,
				dead: false
			});	

			this.p.initialY = this.p.y;

			this.add('2d, aiBounce,animation,defaultEnemy, flyingEnemy');

			this.on("deadZ","die");
		},

	    hit: function(){	    	
	    	this.p.sheet = "hurt_zubat";
	    	this.play("hurt_UD");
	    	this.p.vx = 0;
			this.p.vy = 0;	
			this.p.dead = true;		
	    	Q.audio.play('zubat.wav');
	    },

	});

	//----------------------------------------------------------------------------------------------------------------------------------------------------------

	Q.component("elasticEnemy", {
		added:function(){
			this.entity.on("bump.top",function(collision) {
				if(collision.obj.p.tipo == "player") {
				 	if (collision.obj.p.gravity > 0) {
				 		this.hit();
				 		Q.audio.play('boing.wav');
				 		collision.obj.p.vy = -550;
				 	}
				 	else {
				 		collision.obj.die();
				 	}
			 	}
			 });
		},

		extend: {
			step: function(dt) {
				if (this.p.y > 650) {
			    	this.die();
			    }
			    else {
			    	if (this.p.vx>0){
			    		this.play("move_R");
			    	}
			    	else if (this.p.vx<0){
			    		this.play("move_L")
			    	}
			    }
		    },
		}
	});


	/*--------------------------------------------------------------------------------------
										DITTO (ENEMY)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Ditto", {
		init: function(p) {
			this._super(p, {
				sheet: "ditto",
				sprite: "ditto",
				frame: 0,
				vx: 100
			});	

			this.add('2d, aiBounce, animation, elasticEnemy');			

			this.on("deadD","die");
		},

	    hit: function(){
	    	this.p.sheet = "hurt_ditto";
	    	this.p.vx=0;
	    	this.play("hurt");
			Q.audio.play('ditto.wav');
	    },

	    
	    die: function() {
			this.p.sheet = "ditto";
			this.p.vx=100;
		}
	});

	/*--------------------------------------------------------------------------------------
										MUK (ENEMY)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Muk", {
		init: function(p) {
			this._super(p, {
				sheet: "muk",
				sprite: "muk",
				frame: 0,
				vx: 100
			});	

			this.add('2d, aiBounce, animation, elasticEnemy');

			this.on("deadM","die");
		},

	    hit: function(){
	    	this.p.sheet = "hurt_muk";
	    	this.p.vx=0;
	    	this.play("hurt");
			Q.audio.play('muk.wav');
	    },

	    die: function() {
			this.p.sheet = "muk";
			this.p.vx=100;
		}
	});


	/*--------------------------------------------------------------------------------------
										SNORLAX (ENEMY)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Snorlax", {
		init: function(p) {
			this._super(p, {
				sheet: "snorlax",
				sprite: "snorlax",
				frame: 0,
				vx: 0
			});	

			this.add('2d, aiBounce, animation');

			this.play("move_R");

			this.on("bump.top",function(collision) {
				if(collision.obj.p.tipo == "player") {
				 	if (collision.obj.p.gravity > 0) {
				 		Q.audio.play('boing.wav');
				 		collision.obj.p.vy = -550;
				 	}
				 	else {
				 		collision.obj.die();
				 	}
			 	}
			 });
		}
	});

	//----------------------------------------------------------------------------------------------------------------------------------------------------------

	Q.component("explosiveEnemy", {
		extend: {
			step: function(dt) {
				if(this.p.y > 650) {
			    	this.die();
			    }else{
			    	if(this.p.vx>0){
			    		this.play("move_R");
			    	}else if(this.p.vx<0){
			    		this.play("move_L")
			    	}
			    }
		    },

		    die: function() {
		    	var explosion = new Q.Explosion({ x: (this.p.x), y: (this.p.y) });
		    	this.destroy();
		    	Q.audio.play('explosion.wav');
		    	Q.stage(0).insert(explosion);			
			}
		}
	});

	/*--------------------------------------------------------------------------------------
										VOLTORB (ENEMY)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Voltorb", {
		init: function(p) {
			this._super(p, {
				sheet: "voltorb",
				sprite: "voltorb",
				frame: 0,
				vx: 100
			});	

			this.add('2d, aiBounce, animation, defaultEnemy, explosiveEnemy');

			this.on("deadV","die");
		},		

	    hit: function(){
	    	this.p.vx=0;
	    	this.p.vy=0;
	    	this.die();
			Q.audio.play('voltorb.wav');			
	    }
	    
	});

	/*--------------------------------------------------------------------------------------
										MAGNEMITE (ENEMY)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Magnemite", {
		init: function(p) {
			this._super(p, {
				sheet: "magnemite",
				sprite: "magnemite",
				frame: 1,
			});	

			this.add('2d, animation, defaultEnemy, explosiveEnemy');

			this.on("deadMag","die");

			this.play("move_R");
		},

	    hit: function(){
	    	this.die();
	    	Q.audio.play('magnemite.wav');
	    }
	});

	//----------------------------------------------------------------------------------------------------------------------------------------------------------

	Q.component("platformEnemy", {
		added:function(){
			this.entity.p.initialX = this.entity.p.x;
			this.entity.t = 0

			this.entity.on("bump.top",function(collision) {
				if(collision.obj.p.tipo == "player" && collision.obj.p.gravity > 0) {
					collision.obj.p.x = collision.obj.p.x + this.p.vx * this.t;
				}
			});
		},

		extend: {
			step: function(dt) {
				if(this.p.x - this.p.initialX >= this.p.rangeX && this.p.vx > 0) {
			        this.p.vx = -this.p.vx;
			    } 
			    else if(-this.p.x + this.p.initialX >= this.p.rangeX && this.p.vx < 0) {
			        this.p.vx = -this.p.vx;
			    }

			    if(this.p.vx>0){
			    	this.play("move_R");
			    }
			    else if(this.p.vx <0) {
			    	this.play("move_L")
			    }

			    this.t = dt;
		    }
		}
	});

	/*--------------------------------------------------------------------------------------
										FEAROW (ENEMY)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Fearow", {
		init: function(p) {
			this._super(p, {
				sheet: "fearow_side",
				sprite: "fearow",
				vx: 75,
				frame: 0,
				gravity: 0,
				rangeX: 100
			});				

			this.add('2d, aiBounce, animation, platformEnemy');
		}
		
	});

	/*--------------------------------------------------------------------------------------
										AERODACTYL (ENEMY)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Aerodactyl", {
		init: function(p) {
			this._super(p, {
				sheet: "aerodactyl_side",
				sprite: "aerodactyl",
				vx: 75,
				frame: 0,
				gravity: 0,
				rangeX: 100
			});

			this.add('2d, aiBounce, animation, platformEnemy');
		}

	});

//----------------------------------------------------------------------------------------------------------------------------------------------------------

	/*--------------------------------------------------------------------------------------
										PRIMEAPE (BOSS)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Primeape", {
		init: function(p) {
			this._super(p, {
				sheet: "primeape",
				sprite: "primeape",
				vx: 200,
				frame: 0,
			});	

			this.add('2d,aiBounce,animation,defaultEnemy');

			this.on("deadBP","die");

			this.KO = 0;
		},

		step: function(dt) {
	    	if (this.p.vx > 0) {
				this.play("move_R");
			}
			else if (this.p.vx < 0) {
				this.play("move_L");
			}

			this.p.y = this.p.y + dt * this.p.vy; 
	    },

		hit: function(){
	    	this.p.sheet = "hurt_primeape";
	    	this.p.vx=0;
	    	this.p.vy=0;
			this.play("hurt");
			Q.audio.play('primeape.wav');    	
	    },

	    die: function() {
	    	if(this.KO == 3){
				this.destroy();
				Q.stage(0).insert(new Q.Goal({ x: 3460, y: 75}));
				Q.stage(0).insert(new Q.Revive({ x: this.p.x, y: this.p.y}));
			}
			else {
				this.p.sheet = "primeape";
				this.KO += 1;
				this.defeat = false;
				this.p.vx = 200;
				this.p.vy = -200;
			}
					
		}
	});

	/*--------------------------------------------------------------------------------------
										ARBOK (BOSS)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Arbok", {
		init: function(p) {
			this._super(p, {
				sheet: "arbok",
				sprite: "arbok",
				frame: 0,
			});	

			this.add('2d, animation, defaultEnemy');

			this.on("deadBA","die");

			this.KO=0;

			this.timer = 0;
			this.cooldown = 3;

			this.play("move_R");
		},		

		step: function(dt) {
			this.timer += dt;
			if (this.timer > this.cooldown) {
				this.timer = 0;
				Q.stage(0).insert(new Q.Sting({ x: (this.p.x + this.p.w + 4), y: (this.p.y), vx : 200}));
				Q.stage(0).insert(new Q.Sting({ x: (this.p.x + this.p.w + 40), y: (this.p.y), vx : 200}));
				
			}
	    },

	    hit: function(){
	    	this.p.sheet = "hurt_arbok";
			this.play("hurt");
			Q.audio.play('arbok.wav');  
	    },

	    die: function() {
			if(this.KO == 3){
				this.destroy();
				Q.stage(0).insert(new Q.Goal({ x: 3375, y: 75}));
				Q.stage(0).insert(new Q.Revive({ x: this.p.x, y: this.p.y}));
			}
			else {
				this.p.sheet = "arbok";
				this.KO += 1;
				this.defeat = false;
				this.play("move_R");
			}		
		}
	});

	/*--------------------------------------------------------------------------------------
										MAGNETON (BOSS)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Magneton", {
		init: function(p) {
			this._super(p, {
				sheet: "magneton",
				sprite: "magneton",
				vx: 200,
				frame: 0,
			});	

			this.add('2d,aiBounce,animation,defaultEnemy');

			this.on("deadBM","die");

			this.KO = 0;

			this.division = new Array();
			this.division[0] = new Q.Magnemite({ x: 3232, y: 320 });
			this.division[1] = new Q.Magnemite({ x: 2600, y: 192 });
			this.division[2] = new Q.Magnemite({ x: 2960, y: 64 });
		},

		step: function(dt) {
	    	if (this.p.vx > 0) {
				this.play("move_R");
			}
			else if (this.p.vx < 0) {
				this.play("move_L");
			} 
	    },

		hit: function(){
	    	this.p.sheet = "hurt_magneton";
	    	this.p.vx=0;
	    	this.p.vy=0;
			this.play("hurt");
			Q.audio.play('magneton.wav');    	
	    },

	    die: function() {
	    	if(this.KO == 3){
				this.destroy();
				Q.stage(0).insert(new Q.Goal({ x: 3232, y: 32}));
				Q.stage(0).insert(new Q.Revive({ x: this.p.x, y: this.p.y}));
			}
			else {
				this.p.sheet = "magneton";
				Q.stage(0).insert(this.division[this.KO]);
				this.KO += 1;
				this.defeat = false;
				this.p.vx = 200;
				this.p.vy = -200;
			}
					
		}
	});

	/*--------------------------------------------------------------------------------------
										ARCANINE (BOSS)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Arcanine", {
		init: function(p) {
			this._super(p, {
				sheet: "arcanine",
				sprite: "arcanine",
				vx: 200,
				frame: 0,
			});	

			this.add('2d,aiBounce,animation,defaultEnemy');

			this.on("deadBArc","die");

			this.KO = 0;
		},

		step: function(dt) {
	    	if (this.p.vx > 0) {
				this.play("move_R");
			}
			else if (this.p.vx < 0) {
				this.play("move_L");
			}

			this.p.y = this.p.y + dt * this.p.vy; 
	    },

		hit: function(){
	    	this.p.sheet = "hurt_arcanine";
	    	this.p.vx=0;
	    	this.p.vy=0;
			this.play("hurt");
			Q.audio.play('arcanine.wav');    	
	    },

	    die: function() {
	    	if(this.KO == 3){
				this.destroy();
				Q.stage(0).insert(new Q.Goal({ x: 3232, y: 512}));
				Q.stage(0).insert(new Q.Revive({ x: this.p.x, y: this.p.y}));
			}
			else {
				this.p.sheet = "arcanine";
				this.KO += 1;
				this.defeat = false;
				this.p.vx = 200;
				this.p.vy = -200;
			}
					
		}
	});

//----------------------------------------------------------------------------------------------------------------------------------------------------------

	/*--------------------------------------------------------------------------------------
										SPARK (ATTACK)
	--------------------------------------------------------------------------------------*/
	
	Q.Sprite.extend("Spark", {
		init: function(p) {
			this._super(p, {
				sheet: "big_spark",
				sprite: "spark",
				gravity : 0,
				tipo: "bullet"		
			});	

			this.add('2d, animation');

			this.play("spark");

			this.on("hit",function(collision) {
				if(collision.obj.isA("Tesla")) {
					collision.obj.trigger("activated");
					this.destroy();
				}
				else {
					this.destroy();
				}
			});
		},

		step: function(dt) {
			this.p.x = this.p.x + this.p.vx * dt;
	    }
	});

	/*--------------------------------------------------------------------------------------
										LEAF (ATTACK)
	--------------------------------------------------------------------------------------*/
	
	Q.Sprite.extend("Leaf", {
		init: function(p) {
			this._super(p, {
				sheet: "leaf",
				sprite: "leaf",
				gravity : 0,
				tipo: "bullet"	
			});	

			this.add('2d, animation');
			
			this.on("hit",function(collision) {
				if(collision.obj.isA("Tree")) {
					collision.obj.trigger("chop");
					Q.audio.play('cut.wav');
					this.destroy();
				}
				else {
					this.destroy();
				}
			});
		},

		step: function(dt) {
			this.p.x = this.p.x + this.p.vx * dt;
			if (this.p.vx > 0) {
				this.play("leaf_R");
			}
			else {
				this.play("leaf_L");
			}
	    }
	});

	/*--------------------------------------------------------------------------------------
										BUBBLE (ATTACK)
	--------------------------------------------------------------------------------------*/
	
	Q.Sprite.extend("Bubble", {
		init: function(p) {
			this._super(p, {
				sheet: "bubble",
				sprite: "bubble",
				gravity : 0,
				tipo: "bullet"		
			});	

			this.add('2d, animation');
			

			this.on("hit",function(collision) {
				if(collision.obj.isA("Bonfire")) {
					collision.obj.trigger("extinguish");
					Q.audio.play('steam.wav');
					this.destroy();
				}
				else {
					this.destroy();
				}
			});
		},

		step: function(dt) {
			this.p.x = this.p.x + this.p.vx * dt;
			if (this.p.vx > 0) {
				this.play("bubble_R");
			}
			else {
				this.play("bubble_L");
			}
	    }
	});

	/*--------------------------------------------------------------------------------------
										FIREBALL (ATTACK)
	--------------------------------------------------------------------------------------*/
	
	Q.Sprite.extend("Fireball", {
		init: function(p) {
			this._super(p, {
				sheet: "fireball",
				sprite: "fireball",
				gravity : 0,
				tipo: "bullet"		
			});	

			this.add('2d, animation');

			this.on("hit",function(collision) {
				if(collision.obj.isA("Ice")) {
					collision.obj.trigger("melt");
					Q.audio.play('steam.wav');
					this.destroy();
				}
				else {
					this.destroy();
				}
			});
		},

		step: function(dt) {
			this.p.x = this.p.x + this.p.vx * dt;
			if (this.p.vx > 0) {
				this.play("fireball_R");
			}
			else {
				this.play("fireball_L");
			}
	    }
	});

	/*--------------------------------------------------------------------------------------
										STING (ATTACK)
	--------------------------------------------------------------------------------------*/
	
	Q.Sprite.extend("Sting", {
		init: function(p) {
			this._super(p, {
				sheet: "sting",
				sprite: "sting",
				gravity : 0		
			});	

			this.add('2d, animation');
			
			this.on("hit",function(collision) {
				if(collision.obj.p.tipo == "player") {
					if (collision.obj.p.gravity > 0) {
				 		collision.obj.hit_me();	
				 	}
				 	else {
				 		collision.obj.die();	
					}			 
				 }
				this.destroy();
			});
		},

		step: function(dt) {
			this.p.x = this.p.x + this.p.vx * dt;
			if (this.p.vx > 0) {
				this.play("sting_R");
			}
			else {
				this.play("sting_L");
			}
	    }
	});

//----------------------------------------------------------------------------------------------------------------------------------------------------------

	/*--------------------------------------------------------------------------------------
										TREE (OBSTACLE)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Tree", {
		init: function(p) {
			this._super(p, {
				sheet: "tree",
				sprite: "tree"	
			});	

			this.add('2d,animation,tween');

			this.on("chop", function() {
				this.play("tree");
			});

			this.on("chopped", function() {
				this.destroy();
			});
		}

	});

	/*--------------------------------------------------------------------------------------
										ROCK (OBSTACLE)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Rock", {
		init: function(p) {
			this._super(p, {
				sheet: "rock",
				sprite: "rock"	
			});	

			this.add('2d,animation,tween');

			this.on("smash", function() {
				this.play("rock");
			});

			this.on("smashed", function() {
				Q.audio.play('rock.wav');
				this.destroy();
			});
		}
	});

	/*--------------------------------------------------------------------------------------
										ICE (OBSTACLE)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Ice", {
		init: function(p) {
			this._super(p, {
				sheet: "ice",
				sprite: "ice"	
			});	

			this.add('2d,animation,tween');

			this.on("melt", function() {
				this.play("ice");
			});

			this.on("melted", function() {
				this.destroy();
			});
		}
	});

	/*--------------------------------------------------------------------------------------
										TESLA (OBSTACLE)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Tesla", {
		init: function(p) {
			this._super(p, {
				sheet: "tesla_off",
				sprite: "tesla",
				activated: false
			});	

			this.add('2d,animation,tween');

			this.on("activated", function() {
				if (!this.p.activated) {
					Q.audio.play('tesla.wav');
					this.p.activated = true;
					this.p.sheet = "tesla_on";
					Q.stage(0).insert(new Q.Coin({ x: 1392, y: 288 }));
				}				
			});

			this.play("tesla");
		}

	});

	/*--------------------------------------------------------------------------------------
										EXPLOSION (OBSTACLE)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Explosion", {
		init: function(p) {
			this._super(p, {
				sheet: "explosion",
				sprite: "explosion"
			});	

			this.add('2d,animation,tween');

			this.play("explosion");

			this.on("explosion", function() {
				this.destroy();
			});

			this.on("hit",function(collision) {
				if(collision.obj.p.tipo == "player") {
					if (collision.obj.p.gravity > 0) {
				 		collision.obj.hit_me();	
				 	}
				 	else {
				 		collision.obj.die();	
					}			 
				 }

				 if(collision.obj.isA("Brick")) {
					collision.obj.trigger("boom");	 
				 }
			});
		}
	});

	/*--------------------------------------------------------------------------------------
										BONFIRE (OBSTACLE)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Bonfire", {
		init: function(p) {
			this._super(p, {
				sheet: "bonfire",
				sprite: "bonfire",
				light: true,
				gravity : 0
			});	

			this.add('2d,animation,tween');

			this.on("extinguish", "put_out");
			this.on("bonfire_out", function() {
				this.destroy();
			});	

			this.on("hit",function(collision) {
				if(collision.obj.p.tipo == "player") {
					if (collision.obj.p.gravity > 0) {
				 		collision.obj.hit_me();	
				 	}
				 	else {
				 		collision.obj.die();	
					}			 
				 }
			});		
		},

		step: function() {
			if (this.p.light) {
				this.play("bonfire");
			}				
		},

		put_out: function() {
			this.p.light = false;
			this.play("bonfire_out");
		}

	});

	/*--------------------------------------------------------------------------------------
										PORTAL (OBSTACLE)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Portal", {
		init: function(p) {
			this._super(p, {
				sheet: "portal",
				sprite: "portal"	
			});	

			this.add('2d,animation,tween');

			this.play("portal");
		}

	});

	/*--------------------------------------------------------------------------------------
										GOAL (OBSTACLE)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Goal", {
		init: function(p) {
			this._super(p, {
				asset: "goal.png"
			});	

			this.add('2d');

			this.on("goal", "next_level");
		},

		next_level: function() {
			Q.stageScene("nextLevel",2, { label: "Congratulations" });
		}

	});

	/*--------------------------------------------------------------------------------------
										BRICK (OBSTACLE)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Brick", {
		init: function(p) {
			this._super(p, {
				asset: "brick.png",
				gravity : 0
			});	

			this.add('2d');

			this.on("boom", function() {
				this.destroy();
			});
		}
	});

//----------------------------------------------------------------------------------------------------------------------------------------------------------

	/*--------------------------------------------------------------------------------------
										BAYA (ITEM)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Aranja", {
		init: function(p) {
			this._super(p, {
				sheet: "aranja",
				sprite: "aranja",
				sensor : true,
				grados : 0,
				active : false			
			});	

			this.add('animation,tween');
			this.animate_aranja_loop1();
			this.timer=0;
		},
		animate_aranja_loop1:function(){
			this.animate({angle: this.p.grados+=360 },1.5,{callback:function(){
				this.animate_aranja_loop1()}});
		},
		sensor :function(collision) 
		 {
		 	if(collision.p.tipo == "player") {
					this.destroy();
					if(!this.p.taked)
					Q.state.get("hearts")[Q.state.get("num_hearts")].p.sheet = "ok";
					if(Q.state.get("num_hearts")<2)
					{
						Q.state.inc("num_hearts",1);
						Q.state.get("hearts")[Q.state.get("num_hearts")].p.sheet = "ok";
					}
					this.p.taked = true;
				}
			 
			 	
			 
		 },

		 step : function(dt){
			this.timer += dt;
		 	if (this.timer > 1 && !this.p.active){
		 		this.on("sensor");	
		 		this.p.active= true;
		 	}
		 }
	});

	/*--------------------------------------------------------------------------------------
										MONEDA (ITEM)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Coin", {
		init: function(p) {
			this._super(p, {
				sheet: "coin",
				sprite: "coin",
				sensor : true,		
			});	

			this.add('animation,tween');
			this.play("rotate");

			this.on("picked", "vanish");
		},

		vanish: function() {
			this.destroy();
			Q.audio.play('coin.wav');
			//Q.state.inc("coins",1);
		}

	});

	/*--------------------------------------------------------------------------------------
										CORAZON (ITEM)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Heart", {
		init: function(p) {
			this._super(p, {
				sheet: "ok",
				sprite: "heart",	
			});	
		}
	});
	
	/*--------------------------------------------------------------------------------------
										MAX_REVIVIR (ITEM)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Maxrevive", {
		init: function(p) {
			this._super(p, {
				sheet: "max-revive",
				sprite: "max-revive",
				sensor : true,
				grados : 0			
			});	

			this.add('animation,tween');
			this.animate_aranja_loop1();
		},
		animate_aranja_loop1:function(){
			this.animate({angle: this.p.grados+=90 },1.5,{callback:function(){
				this.animate_aranja_loop2()}});
		
		},
		animate_aranja_loop2:function(){
			this.animate({angle: this.p.grados-=90 },1.5,{callback:function(){
				this.animate_aranja_loop1()}});
		
		}
	});

	/*--------------------------------------------------------------------------------------
										REVIVIR (ITEM)
	--------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Revive", {
		init: function(p) {
			this._super(p, {
				sheet: "revive",
				sprite: "revive",
				sensor : true,
				transicion : 30	,
				active:false,
				taked : false,

			});	

			this.add('animation,tween');
			this.animate_revive_loop();
			this.timer =  0;
			
		},
		animate_revive_loop:function(){
			this.animate({y:this.p.y + (this.p.transicion=this.p.transicion*(-1))},1.5,{callback:function(){
				this.animate_revive_loop()}});
		
		},
		sensor :function(collision) 
		 {
		 	if(collision.p.tipo == "player") {
					this.destroy();
					if(!this.p.taked)
					Q.state.inc("lives",1);
					this.p.taked = true;
				}		 
		 },

		 step : function(dt){
			this.timer += dt;
		 	if (this.timer > 1 && !this.p.active){
		 		this.on("sensor");	
		 		this.p.active= true;
		 	}
		 }
	});
	
	
	/*--------------------------------------------------------------------------------------
									ESCAMA CORAZON (ITEM)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Scale", {
		init: function(p) {
			this._super(p, {
				sheet: "scale",
				sprite: "scale",
				sensor : true,
				grados : 0			
			});	

			this.add('animation,tween');
			this.animate_Scale_loop();
		},
		animate_Scale_loop:function(){
			this.animate({x:(this.p.x +Math.cos(this.p.grados +=0.05)*0.5 ), y : (this.p.y +Math.sin(this.p.grados )*0.5)},0.01,{callback:function(){
				this.animate_Scale_loop()}});
		
		}
		});

	/*--------------------------------------------------------------------------------------
										MEDALLA (ITEM)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Medals", {
		init: function(p) {
			this._super(p, {
				sheet: "medal",
				sprite: "medal",
				frame :0,
				sensor : true	
			});	
		}
	});


//----------------------------------------------------------------------------------------------------------------------------------------------------------

	Q.component("defaultEvo", {
		added:function(){
			this.entity.t = 0;
			this.entity.change = 10000;
			this.entity.change2 = 20000;
			this.entity.evo = false;
			this.entity.play("evolution");
		},

		extend: {
		    step: function(dt){}
		}
	});

	/*--------------------------------------------------------------------------------------
										PIKACHU (EVO)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Evo_pikachu", {
		init: function(p) {
			this._super(p, {
				sheet: "evo2_pikachu",
				sprite: "evolution",
				frame: 1,
				st1: "evo1_pikachu",
				st2: "evo2_pikachu",
				st3: "evo3_pikachu",
				gravity: 0
			});	

			this.add('2d, animation, defaultEvo');
		}	    
	});

	/*--------------------------------------------------------------------------------------
										BULBASAUR (EVO)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Evo_bulbasaur", {
		init: function(p) {
			this._super(p, {
				sheet: "evo2_bulbasaur",
				sprite: "evolution",
				frame: 1,
				st1: "evo1_bulbasaur",
				st2: "evo2_bulbasaur",
				st3: "evo3_bulbasaur",
				gravity: 0
			});	

			this.add('2d, animation, defaultEvo');
		}	    
	});

	/*--------------------------------------------------------------------------------------
										CHARMANDER (EVO)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Evo_charmander", {
		init: function(p) {
			this._super(p, {
				sheet: "evo2_charmander",
				sprite: "evolution",
				frame: 1,
				st1: "evo1_charmander",
				st2: "evo2_charmander",
				st3: "evo3_charmander",
				gravity: 0
			});	

			this.add('2d, animation, defaultEvo');
		}	    
	});

	/*--------------------------------------------------------------------------------------
										SQUIRTLE (EVO)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Evo_squirtle", {
		init: function(p) {
			this._super(p, {
				sheet: "evo2_squirtle",
				sprite: "evolution",
				frame: 1,
				st1: "evo1_squirtle",
				st2: "evo2_squirtle",
				st3: "evo3_squirtle",
				gravity: 0
			});	

			this.add('2d, animation, defaultEvo');
		}	    
	});

	/*--------------------------------------------------------------------------------------
										MACHOP (EVO)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Evo_machop", {
		init: function(p) {
			this._super(p, {
				sheet: "evo2_machop",
				sprite: "evolution",
				frame: 1,
				st1: "evo1_machop",
				st2: "evo2_machop",
				st3: "evo3_machop",
				gravity: 0
			});	

			this.add('2d, animation, defaultEvo');
		}	    
	});

	/*--------------------------------------------------------------------------------------
										GASTLY (EVO)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Evo_gastly", {
		init: function(p) {
			this._super(p, {
				sheet: "evo2_gastly",
				sprite: "evolution",
				frame: 1,
				st1: "evo1_gastly",
				st2: "evo2_gastly",
				st3: "evo3_gastly",
				gravity: 0
			});	

			this.add('2d, animation, defaultEvo');
		}	    
	});

	/*--------------------------------------------------------------------------------------
										ARCEUS (EVO)
	--------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Arceus", {
		init: function(p) {
			this._super(p, {
				sheet: "arceus",
				sprite: "evolution",
				frame: 1,
				gravity: 0
			});	

			this.add('2d, animation');
			this.play("evolution");
		}	    
	});

	

	/*--------------------------------------------------------------------------------------
									FUNCIONES DE CARGA
	--------------------------------------------------------------------------------------*/
	
	Q.load(["pikachu.png","pikachu.json","squirtle.png", "squirtle.json","bulbasaur.png", "bulbasaur.json","charmander.png", "charmander.json","machop.png", "machop.json","gastly.png", "gastly.json","caterpie.png", "caterpie.json","weedle.png", "weedle.json","ekans.png", "ekans.json","rattata.png", "rattata.json","tauros.png", "tauros.json","fearow.png", "fearow.json","aerodactyl.png", "aerodactyl.json","snorlax.png", "snorlax.json","muk.png", "muk.json","magnemite.png","magnemite.json","ditto.png","ditto.json","nidoran.png","nidoran.json"
			,"pidgey.png", "pidgey.json","zubat.png","zubat.json","geodude.png","geodude.json","voltorb.png","voltorb.json","primeape.png", "primeape.json","arbok.png", "arbok.json","magneton.png","magneton.json","arcanine.png","arcanine.json","spark.png", "spark.json","leaf.png","leaf.json","bubble.png","bubble.json","fireball.png","fireball.json","sting.png","sting.json","tree.png","tree.json","rock.png","rock.json","ice.png","ice.json","tesla.png","tesla.json","explosion.png","explosion.json","bonfire.png","bonfire.json","portal.png","portal.json","goal.png","brick.png"
			,"aranja.png","aranja.json","coin.png","coin.json","heart.png","heart.json","max-revive.png","max-revive.json","scale.png","scale.json","medals.png","medals.json","revive.png","revive.json","start.png","controls.png","credits.png","jugar.png","controles.png","creditos.png","back.png","caterpie.wav","weedle.wav","ekans.wav","nidoran.wav","rattata.wav","tauros.wav","pidgey.wav","zubat.wav","geodude.wav","muk.wav","ditto.wav","voltorb.wav","magnemite.wav","primeape.wav","arbok.wav","magneton.wav","arcanine.wav","coin.wav","cut.wav","rock.wav","steam.wav","tesla.wav",
			,"explosion.wav","boing.wav","forest.wav","cave.wav","city.wav","sunset.wav","start.wav","machop.wav","portal.wav","thunder.wav","fireball.wav","leaves.wav","bubble.wav","evo_pikachu.png","evo_bulbasaur.png","evo_charmander.png","evo_squirtle.png","evo_machop.png","evo_gastly.png","arceus.png","evo_pikachu.json","evo_bulbasaur.json","evo_charmander.json","evo_squirtle.json","evo_machop.json","evo_gastly.json","arceus.json","end.png","evolution.wav","victory.wav"], function() {
	
	//Personajes
		Q.compileSheets("pikachu.png","pikachu.json");
		Q.compileSheets("bulbasaur.png","bulbasaur.json");
		Q.compileSheets("charmander.png","charmander.json");
		Q.compileSheets("squirtle.png","squirtle.json");
		Q.compileSheets("machop.png","machop.json");
		Q.compileSheets("gastly.png","gastly.json");

	//Enemigos
		Q.compileSheets("caterpie.png","caterpie.json");
		Q.compileSheets("weedle.png","weedle.json");
		Q.compileSheets("rattata.png","rattata.json");
		Q.compileSheets("tauros.png","tauros.json");
		Q.compileSheets("fearow.png","fearow.json");
		Q.compileSheets("pidgey.png","pidgey.json");
		Q.compileSheets("zubat.png","zubat.json");
		Q.compileSheets("ekans.png","ekans.json");
		Q.compileSheets("geodude.png","geodude.json");
		Q.compileSheets("snorlax.png","snorlax.json");
		Q.compileSheets("aerodactyl.png","aerodactyl.json");
		Q.compileSheets("muk.png","muk.json");
		Q.compileSheets("voltorb.png","voltorb.json");
		Q.compileSheets("magnemite.png","magnemite.json");
		Q.compileSheets("ditto.png","ditto.json");
		Q.compileSheets("nidoran.png","nidoran.json");

	//Bosses
		Q.compileSheets("primeape.png","primeape.json");
		Q.compileSheets("arbok.png","arbok.json");
		Q.compileSheets("magneton.png","magneton.json");
		Q.compileSheets("arcanine.png","arcanine.json");

	//Ataques
		Q.compileSheets("spark.png","spark.json");
		Q.compileSheets("leaf.png","leaf.json");
		Q.compileSheets("bubble.png","bubble.json");
		Q.compileSheets("fireball.png","fireball.json");
		Q.compileSheets("sting.png","sting.json");


	//Obstaculos
		Q.compileSheets("tree.png","tree.json");
		Q.compileSheets("rock.png","rock.json");
		Q.compileSheets("ice.png","ice.json");
		Q.compileSheets("tesla.png","tesla.json");
		Q.compileSheets("explosion.png","explosion.json");
		Q.compileSheets("bonfire.png","bonfire.json");
		Q.compileSheets("portal.png","portal.json");


	//Items
		Q.compileSheets("aranja.png","aranja.json");
		Q.compileSheets("coin.png","coin.json");
		Q.compileSheets("heart.png","heart.json");
		Q.compileSheets("max-revive.png","max-revive.json");
		Q.compileSheets("scale.png","scale.json");
		Q.compileSheets("medals.png","medals.json");
		Q.compileSheets("revive.png","revive.json");

	//Evoluciones
		Q.compileSheets("evo_pikachu.png","evo_pikachu.json");
		Q.compileSheets("evo_bulbasaur.png","evo_bulbasaur.json");
		Q.compileSheets("evo_charmander.png","evo_charmander.json");
		Q.compileSheets("evo_squirtle.png","evo_squirtle.json");
		Q.compileSheets("evo_machop.png","evo_machop.json");
		Q.compileSheets("evo_gastly.png","evo_gastly.json");
		Q.compileSheets("arceus.png","arceus.json");

		
		Q.loadTMX("cave.tmx, forest.tmx, city.tmx, sunset.tmx, the_end.tmx, tiles.png", function() {
		    Q.audio.play('start.wav',{ loop: true });
		 	Q.stageScene("menu");
		});
    });
	
	
	/*--------------------------------------------------------------------------------------
										NIVEL 1
	--------------------------------------------------------------------------------------*/

	Q.scene("forest",function(stage) {
	 	Q.stageTMX("forest.tmx",stage);
	 	Q.audio.stop();
	 	Q.audio.play('forest.wav',{ loop: true });
	 	current_level = 'forest';

	 	Q.state.set("num_hearts",2);
		Q.state.get("hearts")[0].p.sheet = "ok";
		Q.state.get("hearts")[1].p.sheet = "ok";
		Q.state.get("hearts")[2].p.sheet = "ok";
		
		var player = stage.insert(new Q.Pikachu({ x: 400, y: 352 }));
		//var player = stage.insert(new Q.Pikachu({ x: 3460, y: 352 }));

	 	stage.add("viewport").follow(player,{ x: true, y: false });	
	});

	/*--------------------------------------------------------------------------------------
										NIVEL 2
	--------------------------------------------------------------------------------------*/

	Q.scene("cave",function(stage) {
	 	Q.stageTMX("cave.tmx",stage);
	 	Q.audio.stop();
	 	Q.audio.play('cave.wav',{ loop: true });
		current_level = 'cave';

		Q.state.set("num_hearts",2);
		Q.state.get("hearts")[0].p.sheet = "ok";
		Q.state.get("hearts")[1].p.sheet = "ok";
		Q.state.get("hearts")[2].p.sheet = "ok";

		//variables globales y HUD

		var player = stage.insert(new Q.Pikachu({ x: 96, y: 64 }));

	 	stage.add("viewport").follow(player,{ x: true, y: false });	
	});

	/*--------------------------------------------------------------------------------------
										NIVEL 3
	--------------------------------------------------------------------------------------*/

	Q.scene("city",function(stage) {
	 	Q.stageTMX("city.tmx",stage);
	 	Q.audio.stop();
	 	Q.audio.play('city.wav',{ loop: true });
		current_level = 'city';
		//variables globales y HUD

		Q.state.set("num_hearts",2);
		Q.state.get("hearts")[0].p.sheet = "ok";
		Q.state.get("hearts")[1].p.sheet = "ok";
		Q.state.get("hearts")[2].p.sheet = "ok";

		var player = stage.insert(new Q.Pikachu({ x: 400, y: 352 }));

	 	stage.add("viewport").follow(player,{ x: true, y: false });	
	});

	/*--------------------------------------------------------------------------------------
										NIVEL 4
	--------------------------------------------------------------------------------------*/

	Q.scene("sunset",function(stage) {
	 	Q.stageTMX("sunset.tmx",stage);
	 	Q.audio.stop();
	 	Q.audio.play('sunset.wav',{ loop: true });
		current_level = 'sunset';
		//variables globales y HUD

		Q.state.set("num_hearts",2);
		Q.state.get("hearts")[0].p.sheet = "ok";
		Q.state.get("hearts")[1].p.sheet = "ok";
		Q.state.get("hearts")[2].p.sheet = "ok";

		var player = stage.insert(new Q.Pikachu({ x: 250, y: 280 }));

	 	stage.add("viewport").follow(player,{ x: true, y: false });	
	});

	/*--------------------------------------------------------------------------------------
										NIVEL FINAL
	--------------------------------------------------------------------------------------*/

	Q.scene("the_end",function(stage) {
	 	Q.stageTMX("the_end.tmx",stage);
	 	Q.clearStage(1);
	 	Q.audio.stop();
	 	Q.audio.play('evolution.wav',{ loop: true });
		current_level = 'the_end';
		//variables globales y HUD
	});

	/*--------------------------------------------------------------------------------------
									HUD
	--------------------------------------------------------------------------------------*/
	//HUD
	Q.scene('HUD',function(stage) {

		Q.UI.Text.extend("Lifes",{ 
	        init: function(p) {
	            this._super({
	                label: "Lifes: 3",
	                color: "white",
	                x: 150,
	                y: 10
	            });

	            Q.state.on("change.lives",this,"lives");
	        },

	        lives: function(lives) {
	            this.p.label = "Lifes: " + lives;
	        }
		});

		var container = stage.insert(new Q.UI.Container({
		    x: Q.width/4, y: 0, fill: "rgba(0,0,0,0.5)"
		  }));
		 
		container.insert(new Q.Lifes());

		
		// array de corazones
		var corazones = [];
	

		 corazones[4] = container.insert(new Q.Heart({x:250,y:30}));
		 corazones[3] = container.insert(new Q.Heart({x:270,y:30}));
		 corazones[2] = container.insert(new Q.Heart({x:290,y:30}));
		 corazones[1] = container.insert(new Q.Heart({x:310,y:30}));
		 corazones[0] = container.insert(new Q.Heart({x:330,y:30}));
	
		Q.state.set({hearts :corazones ,num_hearts : 2});

		//ayuda para acceder a los corazones lo he puesto como variable global
		var cori = Q.state.get("hearts")[0];
	 	 corazones[4].p.sheet= "NA";
	 	 corazones[3].p.sheet= "NA";		
	});


	/*--------------------------------------------------------------------------------------
									PANTALLA INICIO
	--------------------------------------------------------------------------------------*/


	Q.scene("menu", function(stage) { 
	    // Background
	    stage.insert(new Q.Repeater({ asset: "start.png", w:760, h:640 }));

	    // Botón PLAY
	    var contJugar = stage.insert(new Q.UI.Container({ x: 105, y: 49 }));

	    var btJugar = contJugar.insert(new Q.UI.Button({ x: 20, y: 540, asset: "jugar.png"})); 

	    // Botón CONTROLS
	    var contControles = stage.insert(new Q.UI.Container({ x: 182 , y: 49 }));

	    var btControles = contControles.insert(new Q.UI.Button({ x: 195, y: 540, asset: "controles.png"})); 

	    // Boton CREDITS
	    var contCreditos = stage.insert(new Q.UI.Container({ x: 166 , y: 49 }));

	    var btCreditos = contCreditos.insert(new Q.UI.Button({ x: 465, y: 540, asset: "creditos.png"}));        

	    
	    btJugar.on("click",function() {
	        Q.clearStages();
	        Q.state.reset({lives: 3});
	        Q.audio.stop();	   
	        Q.stageScene('HUD',1);     
	        Q.stageScene('forest');
	    })

	    
	    btControles.on("click",function() {
	        Q.clearStages();
	        Q.stageScene('controls');
	    });

	    
	    btCreditos.on("click",function() {
	        Q.clearStages();
	        Q.stageScene('credits');
	    });

	});

	/*--------------------------------------------------------------------------------------
									PANTALLA CONTROLES
	--------------------------------------------------------------------------------------*/


	Q.scene("controls", function(stage) { 
	    // Background
	    stage.insert(new Q.Repeater({ asset: "controls.png", w:760, h:640 }));

	    // Botón BACK
	    var contBack = stage.insert(new Q.UI.Container({ x: 111, y: 49 }));

	    var btBack = contBack.insert(new Q.UI.Button({ x: 275, y: 540, asset: "back.png"}));      

	    
	    btBack.on("click",function() {
	        Q.clearStages();   
	        Q.stageScene('menu');
	    })
	});

	/*--------------------------------------------------------------------------------------
									PANTALLA CREDITOS
	--------------------------------------------------------------------------------------*/


	Q.scene("credits", function(stage) { 
	    // Background
	    stage.insert(new Q.Repeater({ asset: "credits.png", w:760, h:640 }));

	    // Botón BACK
	    var contBack = stage.insert(new Q.UI.Container({ x: 111, y: 49 }));

	    var btBack = contBack.insert(new Q.UI.Button({ x: 275, y: 540, asset: "back.png"}));      

	    
	    btBack.on("click",function() {
	        Q.clearStages();   
	        Q.stageScene('menu');
	    })
	});

	/*--------------------------------------------------------------------------------------
										GAME OVER
	--------------------------------------------------------------------------------------*/

	Q.scene('endGame',function(stage) {
	  var box = stage.insert(new Q.UI.Container({
	    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
	  }));
	  
	  var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
	                                           label: "Play Again" }))         
	  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
	                                        label: stage.options.label }));
	  button.on("click",function() {
	    Q.clearStages();
	    Q.audio.stop();
	     Q.audio.play('start.wav',{ loop: true });
	    Q.stageScene('menu');
	  });

	  box.fit(20);
	});

	/*--------------------------------------------------------------------------------------
										NEXT LEVEL
	--------------------------------------------------------------------------------------*/

	Q.scene('nextLevel',function(stage) {
		Q.audio.stop();
	 	Q.audio.play('victory.wav',{ loop: true });

		var box = stage.insert(new Q.UI.Container({
		    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
		}));
		  
	    var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
	                                           label: "Next Level" }))         
	    var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
	                                        label: stage.options.label }));
	    button.on("click",function() {
	   		next_level += 1;
			Q.clearStage(0);
			Q.clearStage(2);
			Q.audio.stop();

			if (next_level == 1) {		        
		        Q.stageScene('cave');
			}
			if (next_level == 2) {
		        Q.stageScene('city');
			}
			if (next_level == 3) {
		        Q.stageScene('sunset');
			}
			if (next_level == 4) {
		        Q.stageScene('the_end');
			}
	 	});

	 	box.fit(20);
	});

}

window.addEventListener("load", game);