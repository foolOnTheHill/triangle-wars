var start_state = {
	preload: function() {
		this.game.stage.backgroundColor = '#000000';

		this.game.load.image('background', 'assets/starfield.png');
		this.game.load.image('player', 'assets/nave.png');
		this.game.load.image('bullet', 'assets/bullet.png');
		this.game.load.image('enemy', 'assets/enemy.png');
		this.game.load.image('meteor', 'assets/meteor.png');
		this.game.load.image('red', 'assets/red.png');
		this.game.load.image('energy', 'assets/energy_bar.png');
		this.game.load.image('powerup', 'assets/powr.png');

		this.game.load.audio('shoot', 'assets/Laser_Shoot2.wav');
		this.game.load.audio('hit', 'assets/Hit_Hurt.wav');
		this.game.load.audio('explosion', 'assets/Explosion.wav')
		this.game.load.audio('enemy_shoot', 'assets/Laser_Shoot.wav');
		this.game.load.audio('over', 'assets/GameOver.wav');
		this.game.load.audio('power', 'assets/Powerup.wav');
	},

	create: function() {

		this.bg1 = this.game.add.sprite(0, 0, 'background');
		this.bg2 = this.game.add.sprite(400, 0, 'background');

		this.name_text = this.game.add.text(200, 150, 'Triangle Wars', {font: '55px Arial', fill: '#FFFFFF', align:'center'})
		this.name_text.anchor.setTo(0.5, 0.5)

		this.instr_text = this.game.add.text(200, 280, 'Use the arrows to move and \'space\' to shoot', {font: '17px Arial', fill: '#FFFFFF', align:'center'})
		this.instr_text.anchor.setTo(0.5, 0.5);

		this.start_text = this.game.add.text(200, 400, 'Press \'space\' to start', {font: '20px Arial', fill: '#FFFFFF', align:'center'});
		this.start_text.anchor.setTo(0.5, 0.5);

		this.game.add.tween(this.name_text.scale).to({x:1.02, y:1.02}, 500).to({x:1, y:1}, 500).loop().start();
		this.game.add.tween(this.instr_text.scale).to({x:1.02, y:1.02}, 500).to({x:1, y:1}, 500).loop().start();
		this.game.add.tween(this.start_text.scale).to({x:1.04, y:1.04}, 500).to({x:1, y:1}, 500).loop().start();

		this.trigger = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},

	update: function() {
		if (this.trigger.isDown) {
			this.name_text.destroy();
			this.instr_text.destroy();
			this.start_text.destroy();

			this.game.state.start('main');
		}

		this.updateBg();
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
	}
};
