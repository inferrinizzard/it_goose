var game = new Phaser.Game(800, 800, Phaser.AUTO, "content", true);

var feather;
var playButt, controls, back;
var controlText;
var honks = ["English", "French", "Hindi", "Russian", "Japan"];
var wordStyle = { font: "Charter", fontSize: 24, fill: "#000" };

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
		game.load.onLoadComplete.add(() => game.state.start("Meeting"), this);

		game.add.sprite(0, 0, "titleScreen");
		game.add.sprite(0, 25, "title");
		playButt = game.add.text(350, 380, "Play", { ...wordStyle, fontSize: 72 });
		controls = game.add.text(300, 500, "Controls", {
			...wordStyle,
			fontSize: 72,
		});
		back = game.add.text(100, 700, "←", { ...wordStyle, fontSize: 72 });
		[playButt, controls, back].forEach(s => {
			s.rotation = (Math.PI / 180) * 23;
			s.anchor.setTo(0.5, 0.5);
			s.inputEnabled = true;
		});
		back.kill();

		controlText = game.add.text(380, 400, "Controls\ngo here", {
			...wordStyle,
			fontSize: 72,
		});
		controlText.rotation = (Math.PI / 180) * 23;
		controlText.anchor.setTo(0.5, 0.5);
		controlText.kill();

		feather = game.add.sprite(0, 0, "feather");
		feather.anchor.setTo(0.125, 0.875);
		game.input.mouse.capture = true;
	};
	update = () => {
		[playButt, controls, back].forEach(s => {
			if (s.input.pointerOver()) {
				s.scale.setTo(1.1);
				feather.rotation = (Math.PI / 180) * 23;
				if (game.input.activePointer.leftButton.justPressed()) {
					if (s == playButt) this.loadGame();
					if (s == controls) {
						playButt.kill();
						back.exists = true;
						controls.kill();
						controlText.exists = true;
					}
					if (s == back) {
						playButt.exists = true;
						back.kill();
						controls.exists = true;
						controlText.kill();
					}
				}
			} else if (
				[playButt, controls, back].every(c => !c.input.pointerOver())
			) {
				s.scale.setTo(1);
				feather.rotation = 0;
			}
		});
		feather.position.setTo(game.input.x, game.input.y);
	};

	loadGame = () => {
		["bgMeeting", "gooseBoss", "vc", "bubble", "meetingTable"].forEach(img =>
			game.load.image(img, img + ".png")
		);
		honks.forEach(h => game.load.audio("honk" + h, "honk" + h + ".mp3"));
		game.load.audio("meetingAudio", "meeting.mp3");
		game.load.start();
	};
}

var againButt;
class GameOver extends Phaser.State {
	create = () => {
		game.add.sprite(0, 0, "titleScreen");
		game.add.sprite(0, 25, "title");
		let scoreText = game.add.text(
			260,
			300,
			"You made it \n" +
				Math.min(Math.round(game.time.totalElapsedSeconds() - start), time) +
				" minutes\ninto your\nmeeting",
			{
				font: "Charter",
				fontSize: 72,
			}
		);
		scoreText.rotation = (Math.PI / 180) * 23;
		againButt = game.add.text(200, 700, "Again?", {
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
				bubbles.forEach(b => b.destroy());
				bubbles = [];
				game.state.start("MainMenu");
			}
		} else {
			againButt.scale.setTo(1);
			feather.rotation = 0;
		}
		feather.position.setTo(game.input.x, game.input.y);
	};
}
