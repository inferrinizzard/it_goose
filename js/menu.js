var game = new Phaser.Game(800, 800, Phaser.AUTO, "content", true);

var feather;
var playButt;

class MainMenu extends Phaser.State {
	preload = () => {
		game.load.path = "./assets/";

		["title", "titleScreen", "feather"].forEach(img =>
			game.load.image(img, img + ".png")
		);
	};
	create = () => {
		game.load.onLoadStart.add(() => {}, this);
		//loading state or cutscene?
		// game.load.onFileComplete.add(fileComplete, this);
		game.load.onLoadComplete.add(() => game.state.start("Play"), this);

		game.add.sprite(0, 0, "titleScreen");
		game.add.sprite(0, 25, "title");
		playButt = game.add.text(350, 380, "Play", {
			font: "Charter",
			fontSize: 72,
		});
		playButt.rotation = (Math.PI / 180) * 23;
		playButt.anchor.setTo(0.5, 0.5);
		playButt.inputEnabled = true;
		feather = game.add.sprite(0, 0, "feather");
		feather.anchor.setTo(0.125, 0.875);
		game.input.mouse.capture = true;
	};
	update = () => {
		if (playButt.input.pointerOver()) {
			playButt.scale.setTo(1.1);
			feather.rotation = (Math.PI / 180) * 23;
			if (game.input.activePointer.leftButton.justPressed()) this.loadGame();
		} else {
			playButt.scale.setTo(1);
			feather.rotation = 0;
		}
		feather.position.setTo(game.input.x, game.input.y);
	};

	loadGame = () => {
		["bgMeeting800", "gooseBoss", "vc", "bubble"].forEach(img =>
			game.load.image(img, img + ".png")
		);
		honks.forEach(h => game.load.audio("honk" + h, "honk" + h + ".mp3"));
		game.load.start();
	};
}

var againButt;
class GameOver extends Phaser.State {
	create = () => {
		game.add.sprite(0, 0, "titleScreen");
		game.add.sprite(0, 25, "title");
		let scoreText = game.add.text(320, 320, "Score:\n" + lives, {
			font: "Charter",
			fontSize: 72,
		});
		scoreText.rotation = (Math.PI / 180) * 23;
		againButt = game.add.text(280, 560, "Again?", {
			font: "Charter",
			fontSize: 72,
		});
		againButt.rotation = (Math.PI / 180) * 23;
		againButt.anchor.setTo(0.5, 0.5);
		againButt.inputEnabled = true;
		feather = game.add.sprite(0, 0, "feather");
		feather.anchor.setTo(0.125, 0.875);
		game.input.mouse.capture = true;
	};
	update = () => {
		if (againButt.input.pointerOver()) {
			againButt.scale.setTo(1.1);
			feather.rotation = (Math.PI / 180) * 23;
			if (game.input.activePointer.leftButton.justPressed()) {
				lives = 5;
				start = 0;
				interval = 3000;
				speed = 0.5;
				game.state.start("MainMenu");
			}
		} else {
			againButt.scale.setTo(1);
			feather.rotation = 0;
		}
		feather.position.setTo(game.input.x, game.input.y);
	};
}
