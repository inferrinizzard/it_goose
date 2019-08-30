class WaterCooler extends Phaser.State {
	goose; // main char
	randall; // goblin boi
	stages; // anim step
	timer; // interval container
	jump; // hop flag
	bubble; // speech bubble
	bubbleText; // innner text
	timeout; // timeout container
	bg; // background
	gooseAnim = ["Shame", "Angery", "Panic", "Angery", "Greed", "Shine"]; // emotes

	init = () => (this.stages = 0);

	create = () => {
		// fade in
		game.camera.flash(0, 250);
		this.bg = game.add.sprite(0, 0, "bgWaterCooler");
		// load in goose emotes
		this.goose = game.add.sprite(999, 800, "gooseEmotes");
		["Angery", "Shame", "Greed", "Shine", "Panic"].forEach((e, k) =>
			this.goose.animations.add(e, [2 * k, 2 * k + 1], 4, true)
		);
		this.goose.loadTexture("gDed");
		this.goose.anchor.setTo(0.5, 1);
		// load in randall
		this.randall = game.add.sprite(-150, 800, "randall1");
		this.randall.anchor.setTo(0.5, 1);
		this.timer = setInterval(() => {
			this.jump = true;
			setTimeout(() => (this.jump = false), 100);
		}, 1000);
		// speech bubble
		this.bubble = game.add.sprite(550, 520, "bubble");
		this.bubbleText = game.add.text(0, -10, "#$^%&*", wordStyle);
		this.bubbleText.anchor.setTo(0.5, 0.5);
		this.bubble.addChild(this.bubbleText);
		this.bubble.anchor.setTo(0.5, 0.5);
		this.bubble.visible = false;

		honkSounds = honks.map(h => game.add.audio("honk" + h, 1));
	};
	update = () => {
		if (this.timeout) return;
		// slide in from right
		if (this.stages === 0) {
			this.goose.y = this.jump
				? this.goose.y - 2
				: Math.min(800, this.goose.y + 2);
			this.goose.x = this.goose.x > 550 ? this.goose.x - 1 : 550;
			if (this.goose.x <= 550) this.stages++;
			// angery, add bubble
		} else if (this.stages === 1) {
			clearInterval(this.timer);
			this.swapGoose("Angery");
			honkSounds[Math.floor(Math.random() * honkSounds.length)].play();
			this.bubble.visible = true;
			// word garble
			this.timer = setInterval(() => {
				let btArr = this.bubbleText.text.split("");
				let chars = btArr.splice(
					Math.floor(Math.random() * this.bubbleText.text.length),
					Math.floor(Math.random() * (this.bubbleText.text.length - 1))
				);
				this.bubbleText.text = btArr.join("") + chars.join("");
			}, 250);
			this.stages++;
			// slide in from left
		} else if (this.stages === 2) {
			this.randall.x = this.randall.x < 300 ? this.randall.x + 2 : 300;
			if (this.randall.x >= 300) this.stages++;
			// dialogue bits
		} else if (this.stages === 3) {
			clearInterval(this.timer);
			this.randall.loadTexture("randall2");
			this.bubble.position.setTo(300, 420);
			this.bubbleText.text = "Uh...hi boss";
			this.delay();
		} else if (this.stages === 4) {
			this.swapGoose("Shame");
			this.bubble.position.setTo(550, 520);
			this.bubbleText.text = "*honk noises*";
			honkSounds[Math.floor(Math.random() * honkSounds.length)].play();
			this.delay();
		} else if (this.stages === 5) {
			this.randall.loadTexture("randall3");
			this.bubble.position.setTo(300, 420);
			this.bubbleText.text = "Rough meeting?";
			this.delay();
		} else if (this.stages === 6) {
			this.swapGoose("Panic");
			this.bubble.position.setTo(550, 520);
			this.bubbleText.text = "*RANDALL*";
			honkSounds[Math.floor(Math.random() * honkSounds.length)].play();
			this.delay();
		} else if (this.stages == 7) {
			this.randall.loadTexture("randall3");
			this.bubble.position.setTo(300, 420);
			this.bubbleText.text = "...honk ?";
			this.delay();
		} else if (this.stages === 8) {
			this.swapGoose("gEXangery215");
			this.bubble.position.setTo(550, 520);
			this.bubbleText.text = "*HONK*";
			honkSounds[Math.floor(Math.random() * honkSounds.length)].play();
			this.stages++;
		} else if (this.stages === 9) {
			setTimeout(() => this.stages++, 1500);
			this.stages++;
			// ex angery growth
		} else if (this.stages === 10) {
			this.goose.scale.x += 0.01;
			this.goose.scale.y += 0.01;
			// load next scene
		} else if (this.stages === 11) {
			setTimeout(() => {
				let end = game.add.text(
					400,
					400,
					"You cannot deal with Randall\nat the moment.\nYou must return to write\nyour report.",
					{ ...wordStyle, fill: "white", fontSize: 42, align: "center" }
				);
				end.anchor.setTo(0.5, 0.5);
			}, 500);
			setTimeout(() => game.state.start("TypeWriter", true), 5000);
			game.camera.fade(0, 500);
			setTimeout(() => {
				[this.goose, this.randall, this.bg, this.bubble].forEach(s =>
					s.destroy()
				);
				game.camera.resetFX();
			}, 500);
			this.stages++;
		}
	};
	// loads in new this.goose emote anim/still
	swapGoose = anim => {
		if (this.gooseAnim.includes(anim)) {
			this.goose.loadTexture("gooseEmotes");
			this.goose.animations.play(anim);
		} else this.goose.loadTexture(anim);
	};

	// slows dialogue step
	delay = () => {
		this.timeout = setTimeout(() => {
			this.stages++;
			this.timeout = null;
		}, 2000);
	};
}
