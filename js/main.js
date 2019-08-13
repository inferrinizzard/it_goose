var game = new Phaser.Game(800, 800, Phaser.AUTO, "content", true);

var honkButt;
var honkKeys;
var honks = ["English", "French", "Hindi", "Russian", "Japan"];
var presses = 0;
var hkI = 0;
var bubbles = [],
	letters = [];

class Play extends Phaser.State {
	preload = () => {
		game.load.path = "../assets/";

		["whitesquare"].forEach(img => game.load.image(img, img + ".png"));
		honks.forEach(h => game.load.audio("honk" + h, "honk" + h + ".mp3"));
	};
	create = () => {
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.gravity.y = 500;

		letters = game.add.group();
		bubbles = game.add.group();
		setInterval(() => {
			if (bubbles.totals < 10) {
				let bubble = bubbles.create(
					Math.random() * game.world.width,
					(Math.random() * game.world.height) / 4 + (game.world.height * 3) / 4,
					"whitesquare"
				);
				bubble.scale.setTo(2, 1);
				game.physics.arcade.enable(bubble);
				bubble.body.gravity = 0;
				bubble.body.velocity.y = -100;
			}
		}, 5000);

		honkButt = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		honkKeys = ["H", "O", "N", "K"].map(k =>
			game.input.keyboard.addKey(k.charCodeAt(0))
		);
		honks = honks.map(h => game.add.audio("honk" + h, 1));
	};
	update = () => {
		game.physics.arcade.collide(bubbles, letters);
		bubbles.forEach(b => (b.body.y -= 0.2));
		let temp = honkKeys[hkI];
		if (temp.justDown) {
			// console.log(presses++);
			this.spawnText(String.fromCharCode(honkKeys[hkI].keyCode));
			hkI = (hkI + 1) % honkKeys.length;
		}
		if (honkButt.justDown) {
			honks[Math.floor(Math.random() * honks.length)].play();
			letters.addChild(this.spawnText("honk.", 25));
		}
	};

	spawnText = (
		text,
		size = 15,
		style = {
			font: "Charter",
			fontSize: 32,
			fill: "aliceblue",
		}
	) => {
		let letter = game.add.text(
			Math.random() * game.world.width,
			game.world.height * 0.1,
			text,
			style
		);

		game.physics.p2.enable(letter, false);
		letter.body.setCircle(size);
		letter.bounce = 0.5;
		return letter;
	};
}

var feather;
var playButt;

class MainMenu extends Phaser.State {
	preload = () => {
		game.load.path = "../assets/";

		["title", "titleScreen", "feather"].forEach(img =>
			game.load.image(img, img + ".png")
		);
	};
	create = () => {
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
			if (game.input.activePointer.leftButton.justPressed())
				game.state.start("Play");
		} else {
			playButt.scale.setTo(1);
			feather.rotation = 0;
		}
		feather.position.setTo(game.input.x, game.input.y);
	};
}

game.state.add("Play", Play);
game.state.add("MainMenu", MainMenu);
game.state.start("MainMenu");
