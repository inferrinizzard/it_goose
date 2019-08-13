var game = new Phaser.Game(800, 800, Phaser.AUTO, "content", true);

var honkButt;
var honkKeys;
var honks = ["English", "French", "Hindi", "Russian", "Japan"];
var presses = 0;
var hkI = 0;
var bubbles = [],
	letters = [];

class mainMenu extends Phaser.State {
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

game.state.add("MainMenu", mainMenu);
game.state.start("MainMenu");
