var game = new Phaser.Game(800, 800, Phaser.AUTO, "content", true);

var honks = ["English", "French", "Hindi", "Russian", "Japan"];
var wordStyle = { font: "Charter", fontSize: 24, fill: "#000" };

// console.log(window.innerHeight);
class MainMenu extends Phaser.State {
	feather;
	playButt;
	controls;
	back;
	controlText;
	preload = () => {
		game.load.path = "./assets/";

		["title", "titleScreenCleaned", "featherPointer"].forEach(img =>
			game.load.image(img, img + ".png")
		);
	};
	create = () => {
		if (window.innerHeight < 800) {
			game.scale.setUserScale(0.75);
			game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
		}
		game.load.onLoadStart.add(() => {
			[this.feather, bg, title, this.playButt, this.controls].forEach(s =>
				s.destroy()
			);
			game.add.text(200, 100, "Loading...", {
				...wordStyle,
				fontSize: 96,
				fill: "white",
			});
			let spinner = game.add.sprite(400, 400, "featherPointer");
			spinner.anchor.setTo(0.5, 0.5);
			setInterval(() => (spinner.rotation += 0.01), 1);
		}, this);
		// game.load.onLoadComplete.add(() => game.state.start("Meeting"), this);
		game.load.onLoadComplete.add(() => game.state.start("TypeWriter"), this);

		let bg = game.add.sprite(0, 0, "titleScreenCleaned");
		let title = game.add.sprite(0, 25, "title");
		this.playButt = game.add.text(300, 430, "Play", {
			...wordStyle,
			fontSize: 72,
		});
		this.controls = game.add.text(250, 550, "Controls", {
			...wordStyle,
			fontSize: 72,
		});
		this.back = game.add.text(100, 700, "←", { ...wordStyle, fontSize: 72 });
		[this.playButt, this.controls, this.back].forEach(s => {
			s.rotation = (Math.PI / 180) * 23;
			s.anchor.setTo(0.5, 0.5);
			s.inputEnabled = true;
		});
		this.back.kill();

		this.controlText = game.add.text(
			300,
			450,
			"Use the keys\n'H' 'O' 'N' 'K'",
			{
				...wordStyle,
				fontSize: 72,
			}
		);
		this.controlText.rotation = (Math.PI / 180) * 23;
		this.controlText.anchor.setTo(0.5, 0.5);
		this.controlText.kill();

		this.feather = game.add.sprite(0, 0, "featherPointer");
		this.feather.anchor.setTo(0.125, 0.875);
		game.input.mouse.capture = true;
	};
	update = () => {
		[this.playButt, this.controls, this.back].forEach(s => {
			if (s.input.pointerOver()) {
				s.scale.setTo(1.1);
				this.feather.rotation = (Math.PI / 180) * 23;
				if (game.input.activePointer.leftButton.justPressed()) {
					if (s == this.playButt) this.loadGame();
					if (s == this.controls) {
						this.playButt.kill();
						this.back.exists = true;
						this.controls.kill();
						this.controlText.exists = true;
					}
					if (s == this.back) {
						this.playButt.exists = true;
						this.back.kill();
						this.controls.exists = true;
						this.controlText.kill();
					}
				}
			} else if (
				[this.playButt, this.controls, this.back].every(
					c => !c.input.pointerOver()
				)
			) {
				s.scale.setTo(1);
				this.feather.rotation = 0;
			}
		});
		this.feather.position.setTo(game.input.x, game.input.y);
	};

	loadGame = () => {
		game.load.path = "./assets/";
		[
			"bgMeeting",
			"meetingTable",
			"vc",
			"bubble",
			"feather",
			"paper",
			"stressBar",
		].forEach(img => game.load.image(img, img + ".png"));
		game.load.path = "./assets/goose/";
		[
			"gBoss",
			"gDed",
			"gEXangery215",
			"gPoint225",
			"gHonk215",
			"gStand",
		].forEach(img => game.load.image(img, img + ".png"));
		game.load.spritesheet("gooseEmotes", "gooseEmotes.png", 200, 200, 10);

		game.load.path = "./assets/audio/";
		honks.forEach(h => game.load.audio("honk" + h, "honk" + h + ".mp3"));
		["meeting", "chirp"].forEach(a => game.load.audio(a, a + ".mp3"));
		new Array(5)
			.fill("tw")
			.forEach((tw, k) => game.load.audio(tw + (k + 1), tw + (k + 1) + ".mp3"));
		game.load.path = "./assets/";

		game.load.start();
	};
}

// lives = 5;
// start = 0;
// interval = 3000;
// speed = 0.5;

//todo: typewriter,  particles, restart mechanics
//shakey angery, rotate bubbles?
