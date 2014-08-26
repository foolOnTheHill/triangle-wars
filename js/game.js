var score = 0;

var game = new Phaser.Game(400, 500, Phaser.AUTO, 'game_div');

game.state.add('start', start_state);
game.state.add('main', main_state);
game.state.add('end', end_state);
game.state.start('start');
