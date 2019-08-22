var honkButt;
var honkKeys;
var hkI = 0,
	honkAnchor = 0;
var timer, livesText;
var spawner;
var start,
	time = 10,
	lives = 5;
var speed = 0.5,
	interval = 3100;
var bubbles = [],
	letters = [],
	words = [],
	other = [],
	pos = [0, 150, 325, 500, 650];
var goose, table;
var sawMove = true,
	sawTick = 0,
	sawJump = false;
var chatter, chirp;
var gooseAnim = ["Shame", "Angery", "Panic", "Angery", "Greed", "Shine"];

class Meeting extends Phaser.State {
	create = () => {
		start = game.time.totalElapsedSeconds();
		game.add.sprite(0, 0, "bgMeeting");

		goose = game.add.sprite(580, 240, "gooseEmotes");
		["Angry", "Shame", "Greed", "Shine", "Panic"].forEach((e, k) =>
			goose.animations.add(e, [2 * k, 2 * k + 1], 8, true)
		);
		goose.loadTexture("gStand");
		goose.anchor.setTo(0.5, 0);

		table = game.add.sprite(0, 0, "meetingTable");
		pos.forEach(p => game.add.sprite(p, 650, "vc"));
		game.physics.startSystem(Phaser.Physics.ARCADE);

		spawner = setTimeout(() => {
			const callback = () => {
				if (bubbles.length < 10) {
					let bubble = game.add.sprite(
						pos[Math.round(Math.random() * pos.length)] + 75,
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

		chatter = game.add.audio("meeting");
		chirp = game.add.audio("chirp");
		chatter.play("", 0, 0.3, true);
	};

	update = () => {
		goose.y = sawJump ? goose.y - 2 : Math.min(240, goose.y + 2);
		if (start) {
			if (sawMove)
				goose.x = Math.sin((sawTick += game.time.physicsElapsed)) * 250 + 400;

			if (250 - Math.abs(400 - goose.x) < 0.01) {
				goose.scale.x *=
					Math.sign(goose.scale.x) === Math.sign(goose.x - 400) ? 1 : -1;
				if (lives === 5) goose.loadTexture("gPoint225");

				if (sawMove) {
					if (lives === 5) goose.x -= (Math.sign(400 - goose.x) * 25) / 2;
					setTimeout(() => {
						sawMove = true;
						this.swapGoose(lives === 5 ? "gStand" : gooseAnim[4 - lives]);
						if (lives === 5) goose.x += (Math.sign(400 - goose.x) * 25) / 2;
					}, 2000);
				}
				sawMove = false;
			}
		}

		if (lives > 0 && start)
			timer.text =
				"Meeting ends\nin: " +
				(time - Math.floor(game.time.totalElapsedSeconds() - start)) +
				" minutes";
		if (lives <= 0) {
			if (lives === 0) {
				honks[Math.floor(Math.random() * honks.length)].play();
				bubbles.forEach(b => b.destroy());
				words.forEach(w => {
					w.forEach(l => l.destroy());
					w = [];
				});
				words = [];
				bubbles = [];
				chatter.stop();
				clearTimeout(spawner);
				table.destroy();
				this.swapGoose("gEXangery215");
				lives--;
				setTimeout(() => lives--, 15000);
				return;
			} else if (lives === -1) {
				this.swapGoose("gEXangery215");
				goose.scale.x += 0.01;
				goose.scale.y += 0.01;
			} else {
				goose.destroy();
			}
		} else if (
			time - Math.floor(game.time.totalElapsedSeconds() - start) <=
			0
		) {
			if (start > 0) {
				honks[Math.floor(Math.random() * honks.length)].play();
				bubbles.forEach(b => b.destroy());
				words.forEach(w => {
					w.forEach(l => l.destroy());
					w = [];
				});
				words = [];
				bubbles = [];
				chatter.stop();
				clearTimeout(spawner);
				table.destroy();
				this.swapGoose(lives > 2 ? "Greed" : "Shine");
				goose.scale.setTo(2, 2);
				start = 0;
			} else if (!start) {
			}
		}
		bubbles.forEach((b, k) => {
			if (b && b.body) {
				b.body.y -= speed;
				if (b.body.y <= 0) {
					b.destroy();
					livesText.text = "Lives: " + --lives;
					bubbles.splice(k, 1);
					this.swapGoose(gooseAnim[4 - lives]);
					chirp.play("", 0, 0.3);
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
			chirp.play("", 0, 0.02);
			if (hkI == honkKeys.length - 1) {
				letters.forEach(l => {
					game.physics.arcade.enable(l, false);
					if (bubbles.length == 0 || words.length >= bubbles.length)
						l.body.gravity.y = 300;
				});
				(words.length < bubbles.length ? words : other).push([...letters]);
				letters = [];
				chatter.volume = 0.15;
				setTimeout(() => {
					chatter.volume = 0.3;
				}, 300);
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
		if (!sawJump) {
			this.swapGoose("gHonk215");
			goose.x -= (Math.sign(400 - goose.x) * 15) / 2;
			setTimeout(() => {
				sawJump = false;
				this.swapGoose(lives === 5 ? "gStand" : gooseAnim[4 - lives]);
				goose.x += (Math.sign(400 - goose.x) * 15) / 2;
			}, 100);
		}
		sawJump = true;
		honks[Math.floor(Math.random() * honks.length)].play();
	};

	swapGoose = anim => {
		if (gooseAnim.includes(anim)) {
			goose.loadTexture("gooseEmotes");
			goose.animations.play(anim);
		} else goose.loadTexture(anim);
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
