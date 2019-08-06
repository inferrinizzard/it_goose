var game = new Phaser.Game(800, 800, Phaser.AUTO, "content", true);

var honkButt;
var honkKeys;
var honks = ["English", "French", "Hindi", "Russian", "Japan"];
var presses = 0;
var hkI = 0;

class mainMenu extends Phaser.State {
	preload = () => {
		game.load.path = "../assets/";

		["quail1"].forEach(img => game.load.image(img, img + ".png"));
		honks.forEach(h => game.load.audio("honk" + h, "honk" + h + ".mp3"));
	};
	create = () => {
		let q = game.add.sprite(0, 0, "quail1");
		q.x = game.world.width / 2 - q.width;
		q.y = game.world.height / 2 - q.height;
		q.scale.setTo(2, 2);
		// var main = game.add.text(
		// 	game.world.width / 2,
		// 	game.world.height / 4,
		// 	"«it goose.»",
		// 	{
		// 		fontSize: 64,
		// 		align: "center",
		// 	}
		// );
		// main.addColor("aliceblue");
		// main.x -= main.width / 2;
		// main.y -= main.height;

		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.gravity.y = 500;

		let letters = [];
		const addText = (x, y, text) => {
			letters = [
				...letters,
				game.add.text(x, y, text, {
					font: "Zapfino, Verdana",
					align: "center",
					fontSize: 32,
				}),
			];
		};

		honkButt = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		honkKeys = ["H", "O", "N", "K"].map(k =>
			game.input.keyboard.addKey(k.charCodeAt(0))
		);
		honks = honks.map(h => game.add.audio("honk" + h, 1));
	};
	update = () => {
		let temp = honkKeys[hkI];
		if (temp.justDown) {
			// console.log(presses++);
			this.spawnText(String.fromCharCode(honkKeys[hkI].keyCode));
			hkI = (hkI + 1) % honkKeys.length;
		}
		if (honkButt.justDown) {
			honks[Math.floor(Math.random() * honks.length)].play();
			this.spawnText("honk.", 25);
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
	};
}

game.state.add("MainMenu", mainMenu);
game.state.start("MainMenu");
