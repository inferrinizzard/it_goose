var game = new Phaser.Game(800, 800, Phaser.AUTO, "content", true);

var honkButt;
var honkKeys;
var honks = ["English", "French", "Hindi", "Russian", "Japan"];
var presses = 0;
var hkI = 0;
var honkAnchor = 0;
var bubbles = [],
	letters = [],
	words = [],
	pos = [0, 150, 325, 500, 650];

class Play extends Phaser.State {
	preload = () => {
		game.load.path = "../assets/";

		["bgMeeting800", "gooseBoss", "vc", "bubble"].forEach(img =>
			game.load.image(img, img + ".png")
		);
		honks.forEach(h => game.load.audio("honk" + h, "honk" + h + ".mp3"));
	};
	create = () => {
		game.add.sprite(0, 0, "bgMeeting800");
		game.add.sprite(580, 233, "gooseBoss");
		pos.forEach(p => game.add.sprite(p, 650, "vc"));
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.gravity.y = 500;

		setInterval(() => {
			if (bubbles.length < 10) {
				let bubble = game.add.sprite(
					pos[Math.round(Math.random() * pos.length)],
					(Math.random() * game.world.height) / 4 + (game.world.height * 3) / 4,
					"bubble"
				);
				game.physics.enable(bubble, Phaser.Physics.ARCADE);
				bubbles.push(bubble);
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
		bubbles.forEach((b, k) => {
			b.body.y -= 0.2;
			if (b.body.y <= 0) {
				b.destroy();
				bubbles = bubbles.filter((f, fk) => fk != k);
				return;
			}
		});
		if (honkKeys[hkI].justDown) {
			// console.log(presses++);
			if (hkI == 0) honkAnchor = Math.random() * game.world.width;
			letters.push(
				this.spawnText(
					String.fromCharCode(honkKeys[hkI].keyCode),
					honkAnchor + hkI * 32
				)
			);
			if (hkI == honkKeys.length - 1) {
				letters.forEach(l => game.physics.p2.enable(l, false));
				words.push([...letters]);
				letters = [];
				honks[Math.floor(Math.random() * honks.length)].play();
			}
			hkI = (hkI + 1) % honkKeys.length;
		}
		if (honkButt.justDown) {
			honks[Math.floor(Math.random() * honks.length)].play();
			this.spawnText("honk.", 25);
		}
	};

	spawnText = (
		text,
		x,
		size = 15,
		style = {
			font: "Charter",
			fontSize: 32,
			fill: "black",
		}
	) => {
		let letter = game.add.text(x, game.world.height * 0.1, text, style);
		// letter.body.setCircle(size);
		letter.bounce = 1;
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
game.state.start("Play");
