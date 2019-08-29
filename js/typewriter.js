class TypeWriter extends Phaser.State {
	spawnerT;
	honkLetters;
	honkKeys;
	letters;
	hlI;
	// speed;
	interval;
	// iMult;
	fallSpeed;
	score;
	scoreText;
	missed;
	bar;
	printText;
	nums;
	end;
	wings;
	init = () => {
		this.honkLetters = ["H", "N", "K", "O"];
		this.letters = [];
		this.hlI = 0;
		this.interval = 500;
		// iMult = 6;
		this.fallSpeed = 2;
		this.score = 0;
		this.missed = [];
		this.printText = [""];
		this.nums = 0;
		this.wings = [];
	};
	create = () => {
		game.camera.flash(0, 250);
		game.add.sprite(0, 0, "typewriterBG");
		this.honkKeys = this.honkLetters.map(k =>
			game.input.keyboard.addKey(k.charCodeAt(0))
		);
		this.spawnerT = setTimeout(() => {
			callback = () => {
				let letter = game.add.text(
					this.hlI * 64 + 400 - 96,
					50,
					this.honkLetters[this.hlI],
					{
						...wordStyle,
						fontSize: 64,
					}
				);
				letter.anchor.setTo(0.5, 0.5);
				this.letters.push({ sprite: letter, letter: this.hlI });
				game.physics.arcade.enable(letter);
				this.hlI = Math.floor(Math.random() * this.honkLetters.length);

				if (this.nums++ < 100 && !game.paused)
					this.spawnerT = setTimeout(callback, this.interval);
			};
			this.spawnerT = setTimeout(callback, this.interval);
		}, this.interval);

		this.scoreText = game.add.text(50, 50, "Score: " + this.score, {
			...wordStyle,
			fontSize: 32,
		});

		this.bar = game.add.sprite(400, 450, "stressBar");
		this.bar.anchor.setTo(0.5, 0.5);
		this.bar.tint = 0xff3300;
		this.bar.scale.setTo(1, 1);

		this.wings = [
			game.add.sprite(100, 600, "LeftWing"),
			game.add.sprite(500, 600, "RightWing"),
		];

		honks = honks.map(h => game.add.audio("honk" + h, 1));
		new Array(5).fill("tw").forEach((tw, k) => game.add.audio(tw + (k + 1)));
		this.end = game.add.text(400, 30, "", { ...wordStyle, fontSize: 32 });
		this.end.anchor.setTo(0.5, 0);

		game.onResume.add(() => {
			if (nums < 100) callback();
		});
	};
	update = () => {
		[this.letters, this.missed].forEach(n =>
			n.forEach(l => (l.sprite.body.y += this.fallSpeed))
		);
		if (this.nums >= 100 && this.letters.length === 0) {
			this.bar.destroy();
			this.letters.forEach(l => l.sprite.destroy());
			this.end.text =
				"Meeting notes:\n" +
				this.printText.join("\r\n") +
				"\n" +
				this.scoreText.text;
			this.scoreText.destroy();
			return;
		}
		if (
			this.letters.length > 0 &&
			this.honkKeys[this.letters[0].letter].justDown &&
			Phaser.Rectangle.intersects(
				this.letters[0].sprite.getBounds(),
				this.bar.getBounds()
			)
		) {
			let deletter = this.letters.shift();
			let delSprite = deletter.sprite;
			this.score +=
				Math.round(
					8 * (1 - Math.abs(delSprite.y - this.bar.y) / this.bar.height)
				) / 4;
			this.scoreText.text = "Score: " + this.score;
			delSprite.destroy();
			game.sound.play("tw" + Math.ceil(Math.random() * 5));
			game.add
				.tween(this.wings[Math.floor(deletter.letter / 2)])
				.to({ y: 650 }, 100, Phaser.Easing.Bounce.In, true);
			game.add
				.tween(this.wings[Math.floor(deletter.letter / 2)])
				.to({ y: 600 }, 100, Phaser.Easing.Bounce.Out, true, 100);
			this.printText[this.printText.length - 1] += this.honkLetters[
				deletter.letter
			];
			if (
				this.printText[this.printText.length - 1].endsWith("honk") ||
				this.printText[this.printText.length - 1].length > 16
			)
				this.printText.push("");
		}
		if (this.letters.length && this.letters[0].sprite.top > this.bar.bottom)
			this.missed.push(this.letters.shift());
		if (this.missed.length && this.missed[0].sprite.top > game.world.height) {
			this.missed.shift().sprite.destroy();
			this.scoreText.text = "Score: " + --this.score;
		}
	};
}
