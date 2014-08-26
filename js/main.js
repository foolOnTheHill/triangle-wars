
var main_state = {

	create: function() {

		this.bg1 = this.game.add.sprite(0, 0, 'background');
		this.bg2 = this.game.add.sprite(400, 0, 'background');

		this.player = this.game.add.sprite(200, 470, 'player');
		this.player.anchor.setTo(0.5, 0.5);

		this.player.alive = true;
		this.player_hp = 100;

		this.player.body.collideWorldBounds = true;

		this.hp_bar = this.game.add.sprite(10, 10, 'energy');
		
		this.bullets = this.game.add.group();
		this.enemies = this.game.add.group();
		this.combos = this.game.add.group();
		this.reds = this.game.add.group();
		this.enemyBullets = this.game.add.group();
		this.powerups = this.game.add.group();

		this.bullets.createMultiple(50, 'bullet');
		this.enemies.createMultiple(30, 'enemy');
		this.combos.createMultiple(200, 'meteor');
		this.reds.createMultiple(200, 'red');
		this.enemyBullets.createMultiple(40, 'meteor');
		this.powerups.createMultiple(10, 'powerup');

		this.timer = this.game.time.events.loop(300, this.add_enemies, this);
	
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.trigger = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		this.score = 0;
		this.score_text = this.game.add.text(200, 16, '0', {font: '20px Arial', fill: '#FFFFFF'});
		this.score_text.anchor.setTo(0.5, 0.5);

		this.shoot_sound = this.game.add.sound('shoot');
		this.shoot_sound.volume = 0.4;

		this.hit_sound = this.game.add.sound('hit');
		this.hit_sound.volume = 0.5;

		this.explode_sound = this.game.add.sound('explosion');
		this.explode_sound.volume = 0.2;

		this.enemy_shoot = this.game.add.sound('enemy_shoot');
		this.enemy_shoot.volume = 0.3;

		this.game_over_se = this.game.add.sound('over');
		this.game_over_se.volume = 0.4;

		this.powerup_se = this.game.add.sound('power');
		this.powerup_se.volume = 1;

		this.bulletTime = 0;
		this.bonusTime = this.game.time.now + 10000;

		this.emitter = this.game.add.emitter(0, 0, 200);
		this.emitter.makeParticles('bullet');
		this.emitter.gravity = 0;
	},

	add_single_enemy: function(x, y) {
		var e = this.enemies.getFirstDead();
		if (e) {
			e.outOfBoundsKill = true;
			e.alive = true;
			e.reset(x, y);
			e.body.velocity.y = Math.random()*100 + 200;
		}
	},

	add_meteors: function() {
		for (var i = 10; i < 300; i += 20) {
			var e = this.combos.getFirstDead();

			if (e) {
				e.outOfBoundsKill = true;
				e.alive = true;
				e.reset(Math.random()*100 + i, Math.random()*100);
				e.body.velocity.y += 100;
			}
		}
	},

	add_red: function() {
		var e = this.reds.getFirstDead();
		
		if (e) {
			e.outOfBoundsKill = true;
			e.alive = true;
			
			if (Math.random() > 0.5) {
				e.reset(375, Math.random()*100);
				e.body.velocity.x = -220;
				e.body.velocity.y = 220;
			} else {
				e.reset(0, Math.random()*100);
				e.body.velocity.x = 220;
				e.body.velocity.y = 220;
			}
		}
	},

	add_enemies: function () {

		if (Math.random() > 0.94) {
			this.add_meteors();
		}

		if (Math.random() > 0.97) {
			this.add_red();	
		}

		this.enemyShoot();

		var x = Math.min((Math.random()*(400/24)*25) + 5, 350);
		var y = -25;
		this.add_single_enemy(x, y);		
	},

	update: function() {
		this.updateBg();

		if (!this.player.alive) {
			this.player.body.velocity.x = 0;
			this.player.body.velocity.y = 0;
			return;
		}
		
		this.updatePlayer();
		this.powerUps();
		
		this.game.physics.overlap(this.enemies, this.bullets, this.enemyHit, null, this);
		this.game.physics.overlap(this.reds, this.bullets, this.enemyHit, null, this);
		this.game.physics.overlap(this.player, this.enemies, this.playerHit, null, this);
		this.game.physics.overlap(this.player, this.combos, this.playerHit, null, this);
		this.game.physics.overlap(this.player, this.reds, this.playerHit, null, this);
		this.game.physics.overlap(this.player, this.enemyBullets, this.playerHit, null, this);
		this.game.physics.overlap(this.player, this.powerups, this.getPowerUp, null, this);
	},

	powerUps: function() {
		if (this.game.time.now > this.bonusTime) {
			this.bonusTime = this.game.time.now + 25000;

			var b = this.powerups.getFirstDead();
			if (b) {
				b.outOfBoundsKill = true;
				
				var x = Math.max(25, Math.random()*400 - b.width - 5);

				this.game.add.tween(b.scale).to({x:1.15, y:1.15}, 400).to({x:1, y:1}, 400).loop().start()

				b.reset(x, -20);
				b.body.velocity.y = 100;
			}
		}
	},

	getPowerUp: function(player, powerup) {
		this.powerup_se.play();
		powerup.kill();
		this.updateHp(-50);		
	},

	updateBg: function() {
		this.bg1.x -= 1;
		this.bg2.x -= 1;

		if (this.bg1.x == -400) {
			this.bg1.x = 0;
		}

		if (this.bg2.x == 0) {
			this.bg2.x = 400;
		}
	},

	updateScore: function() {
		this.score += 1;
		this.score_text.content = this.score;
		this.score_text.anchor.setTo(0.5, 0.5);
	},

	updateHp: function(damage) {
		this.player_hp = Math.min(100, Math.max(0, this.player_hp - damage));
		this.hp_bar.width = this.player_hp;

		if (this.player_hp <= 0) {
			this.gameOver();
		}
	},

	gameOver: function() {

		if (!this.player.alive) {
			return;
		}
		this.player.alive = false;

		this.game_over_se.play();
		this.game.time.events.remove(this.timer);

		var t = this.game.add.tween(this.player.scale).to({x:0, y:0}, 300);
		t.onComplete.add(function() {
			this.bullets.callAll("kill");
			this.powerups.callAll("kill");
			this.hp_bar.destroy();
			this.score_text.destroy();
			score = this.score;
			this.game.state.start('end');
		}, this);

		t.start()

	},

	updatePlayer: function() {

		if (this.trigger.isDown && this.game.time.now > this.bulletTime) {
			this.bulletTime = this.game.time.now + 150;
			this.playerShoot(this.player.body.x+this.player.width/2, this.player.y - 25)
		}

		if(this.cursors.left.isDown) {
			this.player.body.velocity.x = -200;
		} else if (this.cursors.right.isDown) {
			this.player.body.velocity.x = 200;
		} else {
			var v = this.player.body.velocity.x;
			
			if (v > 0) {
				this.player.body.velocity.x = Math.max(0, v - 10);
			} else {
				this.player.body.velocity.x = Math.min(0, v + 10);
			}

		}

		if(this.cursors.up.isDown) {
			this.player.body.velocity.y = -300;
		} else if (this.cursors.down.isDown) {
			this.player.body.velocity.y = 300;
		} else {
			var v = this.player.body.velocity.y;
			
			if (v > 0) {
				this.player.body.velocity.y = Math.max(0, v - 10);
			} else {
				this.player.body.velocity.y = Math.min(0, v + 10);
			}
		}		
	},

	playerShoot: function(x, y) {
		var b = this.bullets.getFirstDead();
		if (b) {
			b.outOfBoundsKill = true;
			b.reset(x - b.width/2, y);
			b.body.velocity.y = -450;
			this.shoot_sound.play();
		}
	},

	enemyShoot: function() {
		var bul = this.enemyBullets;
		var sound = this.enemy_shoot;
		this.enemies.forEachAlive(function(e) {
			if (Math.random() > 0.8) {
				var b = bul.getFirstDead();
				if (b) {
					b.outOfBoundsKill = true;

					var x = e.body.x + e.width/2;
					var y = e.body.y + 25;

					b.reset(x - b.width/2, y);
					b.body.velocity.y = 500;
					sound.play();
				}
			}

			if (Math.random() > 0.93) {
				var posX = e.body.x;

				if (posX >= 200) {
					e.body.velocity.x = -100;
				} else {
					e.body.velocity.x = 100;
				}
			}

		});
	},

	enemyHit: function(enemy, bullet) {
		this.explode_sound.play();

		this.emitter.x = enemy.x+enemy.width/2;
		this.emitter.y = enemy.y+enemy.height/2;

		enemy.kill();	
		bullet.kill();

		this.emitter.start(true, 250, null, 20);
		this.updateScore();
	},

	playerHit: function(player, enemy) {

		if (!enemy.alive) {
			return;
		}
		enemy.alive = false;
		
		enemy.kill();
		this.updateHp(5);
		this.player.body.velocity.y = 100;
		this.hit_sound.play();
	}

};

