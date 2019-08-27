var angered = 0;
class Meeting extends Phaser.State {
	honkKeys; //[H, O, N, K] keys
	honkButt; // space to honk
	hkI; // next index of HONK to pressed
	honkAnchor; // where the honk word is placed before release
	timer; // top-left text
	livesText; // top-right text
	spawner; // generates bubble timeout
	time; // meeting clock time
	lives; // lives
	speed; // speed of bubble rise
	interval; // speed of bubble spawn
	bubbles; // bubble container
	letters; // holds 'h o n k' before release
	words; // holds active honks
	other; // falling extra honks
	stress; // stress bar
	pos; // x-pos of bubble spawns
	goose; // main char
	table; // midground
	sawMove; // if sin move
	sawTick; // sin move counter
	sawJump; // jump on honk
	sawAnim; // switch sprite timeout
	chatter; // bg noise
	chirp; // real honk sound
	startOver; // restart button
	emitter; // particle emitter
	stressBar; // stress bar
	gooseAnim = ["Shame", "Angery", "Panic", "Angery", "Greed", "Shine"]; // emotes
	init = () => {
		this.hkI = 0;
		this.honkAnchor = 0;
		this.time = 90;
		this.lives = 5;
		this.speed = 0.5;
		this.interval = 3100;
		this.bubbles = [];
		this.letters = [];
		this.words = [];
		this.other = [];
		this.stress = [];
		this.pos = [0, 150, 325, 500, 650];
		this.sawMove = true;
		this.sawTick = 0;
		this.sawJump = false;
	};
	create = () => {
		game.add.sprite(0, 0, "bgMeeting");

		this.goose = game.add.sprite(580, 240, "gooseEmotes");
		["Angry", "Shame", "Greed", "Shine", "Panic"].forEach((e, k) =>
			this.goose.animations.add(e, [2 * k, 2 * k + 1], 8, true)
		);
		this.goose.loadTexture("gStand");
		this.goose.anchor.setTo(0.5, 0);

		this.table = game.add.sprite(0, 0, "meetingTable");
		this.pos.forEach(p =>
			game.add.sprite(p, 650, "VC" + (Math.round(Math.random()) + 1))
		);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		let honkIntro = game.add.text(400, 30, "Try a honk~", {
			...wordStyle,
			fontSize: 64,
		});
		honkIntro.anchor.setTo(0.5, 0.5);
		setTimeout(() => {
			honkIntro.destroy();
			let black = game.add.sprite(400, 24, "stressBar");
			black.anchor.setTo(0.5, 0.5);
			black.tint = "#000";
			black.scale.setTo(1.025, 0.65);
			let white = game.add.sprite(400, 24, "stressBar");
			white.anchor.setTo(0.5, 0.5);
			white.scale.y = 0.5;
			this.stressBar = game.add.sprite(200, 24, "stressBar");
			this.stressBar.anchor.setTo(0, 0.5);
			this.stressBar.scale.y = 0.5;
			this.stressBar.tint = 0xff3300;
		}, 5000);

		this.spawner = setTimeout(() => {
			const callback = () => {
				if (this.bubbles.length < 10) {
					let bubble = game.add.sprite(
						this.pos[Math.floor(Math.random() * this.pos.length)] + 75,
						(Math.random() * game.world.height) / 4 +
							(game.world.height * 3) / 4,
						"bubble"
					);
					game.physics.enable(bubble, Phaser.Physics.ARCADE);
					this.bubbles.push(bubble);
					bubble.anchor.setTo(0.5, 0.5);

					this.speed += 0.2;
					this.interval = Math.max(1000, this.interval - 100);
				}
				this.spawner = setTimeout(callback, this.interval);
			};
			this.spawner = setTimeout(callback, this.interval);
		}, this.interval);

		this.honkButt = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		this.honkKeys = ["H", "O", "N", "K"].map(k =>
			game.input.keyboard.addKey(k.charCodeAt(0))
		);
		honks = honks.map(h => game.add.audio("honk" + h, 1));

		this.timer = game.add.text(
			30,
			50,
			"Meeting ends\nin: " + this.time,
			wordStyle
		);
		this.livesText = game.add.text(680, 50, "Lives: " + this.lives, wordStyle);

		this.chatter = game.add.audio("meeting");
		this.chirp = game.add.audio("chirp");
		this.chatter.play("", 0, 0.3, true);

		this.emitter = game.add.emitter(400, 0);
		this.emitter.makeParticles(["feather", "paper"]);
		this.emitter.width = 800;
		this.emitter.gravity = 800;
	};

	update = () => {
		this.goose.y = this.sawJump
			? this.goose.y - 2
			: Math.min(240, this.goose.y + 2);
		if (this.time > 0) {
			if (this.sawMove)
				this.goose.x =
					Math.sin((this.sawTick += game.time.physicsElapsed)) * 250 + 400;

			if (250 - Math.abs(400 - this.goose.x) < 0.01) {
				this.goose.scale.x *=
					Math.sign(this.goose.scale.x) === Math.sign(this.goose.x - 400)
						? 1
						: -1;
				if (this.lives === 5) this.goose.loadTexture("gPoint225");

				if (this.sawMove) {
					if (this.lives === 5)
						this.goose.x -= (Math.sign(400 - this.goose.x) * 25) / 2;
					this.sawAnim = setTimeout(() => {
						this.sawMove = true;
						if (this.lives > 0)
							this.swapGoose(
								this.lives === 5 ? "gStand" : this.gooseAnim[4 - this.lives]
							);
						if (this.lives === 5)
							this.goose.x += (Math.sign(400 - this.goose.x) * 25) / 2;
					}, 2000);
				}
				this.sawMove = false;
			}
		}

		if (this.lives > 0 && (this.time -= game.time.elapsedMS / 1000) > 0)
			this.timer.text =
				"Meeting ends\nin: " + Math.floor(this.time) + " minutes";
		if (this.lives <= 0) {
			if (this.lives === 0) {
				honks[Math.floor(Math.random() * honks.length)].play();
				this.bubbles.forEach(b => b.destroy());
				this.words.forEach(w => {
					w.forEach(l => l.destroy());
					w = [];
				});
				this.words = [];
				this.bubbles = [];
				this.chatter.stop();
				clearTimeout(this.spawner);
				clearTimeout(this.sawAnim);
				this.table.destroy();
				this.swapGoose("gEXangery215");
				this.lives--;
				setTimeout(() => this.lives--, 15000);
				this.stressBar.destroy();
				return;
			} else if (this.lives === -1) {
				this.swapGoose("gEXangery215");
				this.goose.scale.x += 0.01;
				this.goose.scale.y += 0.01;
			} else if (this.lives == -2) {
				this.goose.destroy();
				this.game.add.text(30, 450, "You've angered the goose.", {
					...wordStyle,
					fill: "#FFF",
					fontSize: 72,
				});
				this.startOver = this.game.add.text(400, 600, "Start over?", {
					...wordStyle,
					fill: "#FFF",
					fontSize: 72,
				});
				this.startOver.inputEnabled = true;
				this.startOver.anchor.setTo(0.5, 0.5);
				game.input.mouse.capture = true;
				this.lives--;
				return;
			} else {
				if (this.startOver.input.pointerOver()) {
					this.startOver.scale.setTo(1.1);
					if (game.input.activePointer.leftButton.justPressed()) {
						this.game.state.restart(true);
						angered++;
						return;
					}
				} else this.startOver.scale.setTo(1);
			}
		} else if (this.time <= 0) {
			if (Math.round(this.time) === 0) {
				honks[Math.floor(Math.random() * honks.length)].play();
				this.bubbles.forEach(b => b.destroy());
				this.words.forEach(w => {
					w.forEach(l => l.destroy());
					w = [];
				});
				this.words = [];
				this.bubbles = [];
				this.chatter.stop();
				clearTimeout(this.spawner);
				clearTimeout(this.sawAnim);
				this.table.destroy();
				this.swapGoose(this.lives > 2 ? "Greed" : "Shine");
				this.goose.scale.setTo(2, 2);
				this.time = -1;
				return;
			} else if (this.time === -1) {
			}
		}
		this.bubbles.forEach((b, k) => {
			if (b && b.body) {
				b.body.y -= this.speed;
				if (b.body.y <= 0) {
					b.destroy();
					this.livesText.text = "Lives: " + --this.lives;
					this.bubbles.splice(k, 1);
					this.swapGoose(this.gooseAnim[4 - this.lives]);
					if (this.lives === 1) this.goose.scale.setTo(1.2, 1.2);
					this.chirp.play("", 0, 0.3);
					this.emitter.start(true, 2000, null, 20);
					this.stressBar.scale.x = this.lives / 5;
					return;
				}
			}
		});
		if (this.honkKeys[this.hkI].justDown) {
			if (this.hkI == 0)
				this.honkAnchor = Math.random() * (game.world.width - 32 * 4);
			this.letters.push(
				game.add.text(
					this.honkAnchor + this.hkI * 32,
					game.world.height * 0.1,
					String.fromCharCode(this.honkKeys[this.hkI].keyCode),
					{
						...wordStyle,
						fontSize: 32,
					}
				)
			);
			this.chirp.play("", 0, 0.02);
			if (this.hkI == this.honkKeys.length - 1) {
				this.letters.forEach(l => {
					game.physics.arcade.enable(l, false);
					if (
						this.bubbles.length == 0 ||
						this.words.length >= this.bubbles.length
					)
						l.body.gravity.y = 300;
				});
				(this.words.length < this.bubbles.length
					? this.words
					: this.other
				).push([...this.letters]);
				this.letters = [];
				this.chatter.volume = 0.15;
				setTimeout(() => {
					this.chatter.volume = 0.3;
				}, 300);
				this.honk();
			}
			this.hkI = (this.hkI + 1) % this.honkKeys.length;
		}
		if (this.honkButt.justDown) this.honk();

		for (let k = 0; k < this.words.length; k++) {
			if (k < 0 || this.words.length === 0) break;
			let destroy = false;
			this.words[k].forEach(l => {
				if (l && l.body && !destroy && this.bubbles[k]) {
					if (l.body.y > game.world.height / 2 && l.style.fill != "white")
						l.setStyle({ ...l.style, fill: "white" });
					game.physics.arcade.moveToObject(l, this.bubbles[k], 400);
					//kinda not fast enough
					if (
						Phaser.Rectangle.contains(
							l.body,
							this.bubbles[k].x,
							this.bubbles[k].y
						)
					) {
						l.body.velocity.setTo(0, 0);
						this.bubbles[k].destroy();
						this.bubbles.splice(k, 1);
						destroy = true;
					}
					if (l.body.y > game.world.height) destroy = true;
				}
			});
			if (destroy) {
				this.words[k].forEach(l => l.destroy());
				this.words[k] = null;
				this.words.splice(k--, 1);
			}
		}
		this.other.forEach(o =>
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
		if (!this.sawJump) {
			this.swapGoose("gHonk215");
			this.goose.x -= (Math.sign(400 - this.goose.x) * 15) / 2;
			setTimeout(() => {
				this.sawJump = false;
				this.swapGoose(
					this.lives === 5 ? "gStand" : this.gooseAnim[4 - this.lives]
				);
				this.goose.x += (Math.sign(400 - this.goose.x) * 15) / 2;
			}, 100);
		}
		this.sawJump = true;
		honks[Math.floor(Math.random() * honks.length)].play();
	};

	// loads in new goose emote anim/still
	swapGoose = anim => {
		if (this.gooseAnim.includes(anim)) {
			this.goose.loadTexture("gooseEmotes");
			this.goose.animations.play(anim);
		} else this.goose.loadTexture(anim);
	};
}
