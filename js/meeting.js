var honkButt;
var honkKeys;
var hkI = 0,
	honkAnchor = 0;
var max;
var timer, livesText;
var spawner;
var start;
var time = 90,
	lives = 5;
var speed = 0.5,
	interval = 3100;
var bubbles = [],
	letters = [],
	words = [],
	other = [],
	pos = [0, 150, 325, 500, 650];
var goose;
var sawMove = true;
var sawTick = 0;
var sawJump = false;
var chatter;

class Meeting extends Phaser.State {
	create = () => {
		start = game.time.totalElapsedSeconds();
		game.add.sprite(0, 0, "bgMeeting");
		goose = game.add.sprite(580, 233, "gooseBoss");
		goose.anchor.setTo(0.5, 0);
		game.add.sprite(0, 0, "meetingTable");
		pos.forEach(p => game.add.sprite(p, 650, "vc"));
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.gravity.y = 500;

		spawner = setTimeout(() => {
			const callback = () => {
				if (bubbles.length < 10) {
					let bubble = game.add.sprite(
						pos[Math.round(Math.random() * pos.length)],
						(Math.random() * game.world.height) / 4 +
							(game.world.height * 3) / 4,
						"bubble"
					);
					game.physics.enable(bubble, Phaser.Physics.ARCADE);
					bubbles.push(bubble);
					bubble.anchor.setTo(0.5, 0.5);

					speed += 0.2;
					interval = Math.max(1000, interval - 100);
				}
				spawner = setTimeout(callback, interval);
			};
			spawner = setTimeout(callback, interval);
		}, interval);

		honkButt = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		honkKeys = ["H", "O", "N", "K"].map(k =>
			game.input.keyboard.addKey(k.charCodeAt(0))
		);
		honks = honks.map(h => game.add.audio("honk" + h, 1));

		timer = game.add.text(30, 50, "Meeting ends\nin: " + time, wordStyle);
		livesText = game.add.text(680, 50, "Lives: " + lives, wordStyle);

		chatter = game.add.audio("meetingAudio");
		chatter.play("", 0, 0.3, true);
	};

	//game.sound.setDecodedCallback([ explosion, sword, blaster ], start, this);
	update = () => {
		goose.y = sawJump ? goose.y - 2 : Math.min(233, goose.y + 2);
		if (sawMove)
			goose.x = Math.sin((sawTick += game.time.physicsElapsed)) * 250 + 400;

		if (250 - Math.abs(400 - goose.x) < 0.01) {
			goose.scale.setTo(Math.sign(goose.x - 400), 1);
			sawMove = false;
			setTimeout(() => (sawMove = true), 2000);
		}

		timer.text =
			"Meeting ends\nin: " +
			(time - Math.floor(game.time.totalElapsedSeconds() - start)) +
			" minutes";
		if (
			time - Math.floor(game.time.totalElapsedSeconds() - start) <= 0 ||
			lives <= 0
		) {
			honks[Math.floor(Math.random() * honks.length)].play();
			bubbles.forEach(b => b.destroy());
			words.forEach(w => {
				w.forEach(l => l.destroy());
				w = [];
			});
			words = [];
			bubbles = [];
			GOScreen = true;
			// game.state.start("MainMenu");
			chatter.stop();
			clearTimeout(spawner);
			return;
		}

		bubbles.forEach((b, k) => {
			if (b && b.body) {
				b.body.y -= speed;
				if (b.body.y <= 0) {
					b.destroy();
					livesText.text = "Lives: " + --lives;
					bubbles.splice(k, 1);
					return;
				}
			}
		});
		if (honkKeys[hkI].justDown) {
			if (hkI == 0) honkAnchor = Math.random() * game.world.width;
			letters.push(
				this.spawnText(
					String.fromCharCode(honkKeys[hkI].keyCode),
					honkAnchor + hkI * 32
				)
			);
			if (hkI == honkKeys.length - 1) {
				letters.forEach(l => {
					game.physics.arcade.enable(l, false);
					if (bubbles.length == 0 || words.length >= bubbles.length)
						l.body.gravity.y = 300;
				});
				(words.length < bubbles.length ? words : other).push([...letters]);
				letters = [];
				chatter.volume = 0.15;
				console.log(chatter.volume);

				setTimeout(() => (chatter.volume = 0.3), 300);
				this.honk();
			}
			hkI = (hkI + 1) % honkKeys.length;
		}
		if (honkButt.justDown) this.honk();

		for (let k = 0; k < words.length; k++) {
			if (k < 0 || words.length === 0) break;
			let destroy = false;
			words[k].forEach(l => {
				if (l && l.body && !destroy && bubbles[k]) {
					if (l.body.y > game.world.height / 2 && l.style.fill != "white")
						l.setStyle({ ...l.style, fill: "white" });
					game.physics.arcade.moveToObject(l, bubbles[k], 400);
					//kinda not fast enough
					if (Phaser.Rectangle.contains(l.body, bubbles[k].x, bubbles[k].y)) {
						l.body.velocity.setTo(0, 0);
						bubbles[k].destroy();
						bubbles.splice(k, 1);
						destroy = true;
					}
					if (l.body.y > game.world.height) destroy = true;
				}
			});
			if (destroy) {
				words[k].forEach(l => l.destroy());
				words[k] = null;
				words.splice(k--, 1);
			}
		}
		other.forEach(o =>
			o.forEach(l => {
				if (
					l &&
					l.body &&
					l.body.y > game.world.height / 2 &&
					l.style.fill != "white"
				)
					l.setStyle({ ...l.style, fill: "white" });
			})
		);
	};

	honk = () => {
		sawJump = true;
		setTimeout(() => (sawJump = false), 100);
		honks[Math.floor(Math.random() * honks.length)].play();
	};

	spawnText = (
		text,
		x,
		style = {
			...wordStyle,
			fontSize: 32,
		}
	) => {
		let letter = game.add.text(x, game.world.height * 0.1, text, style);
		letter.bounce = 1;
		return letter;
	};
}
