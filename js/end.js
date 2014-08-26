var end_state = {
	create: function() {

		this.bg1 = this.game.add.sprite(0, 0, 'background');
		this.bg2 = this.game.add.sprite(400, 0, 'background');

		this.end_text = this.game.add.text(200, 200, 'Game Over', {font: '50px Arial', fill: '#FFFFFF', align:'center'})
		this.end_text.anchor.setTo(0.5, 0.5)

		this.score_text = this.game.add.text(200, 260, 'Score: '+score, {font: '20px Arial', fill: '#FFFFFF', align:'center'})
		this.score_text.anchor.setTo(0.5, 0.5);

		this.restart_text = this.game.add.text(200, 420, 'Press \'space\' to restart', {font: '20px Arial', fill: '#FFFFFF', align:'center'});
		this.restart_text.anchor.setTo(0.5, 0.5);

		this.game.add.tween(this.end_text.scale).to({x:1.02, y:1.02}, 500).to({x:1, y:1}, 500).loop().start();
		this.game.add.tween(this.score_text.scale).to({x:1.02, y:1.02}, 500).to({x:1, y:1}, 500).loop().start();
		this.game.add.tween(this.restart_text.scale).to({x:1.04, y:1.04}, 500).to({x:1, y:1}, 500).loop().start();

		this.trigger = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},

	update: function() {
		if (this.trigger.isDown) {
			this.end_text.destroy();
			this.score_text.destroy();
			this.restart_text.destroy();

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
