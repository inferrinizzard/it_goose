var honkButt;
var honkKeys;
var honks = ["English", "French", "Hindi", "Russian", "Japan"];
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
	pos = [0, 150, 325, 500, 650],
	targets = [];

class Play extends Phaser.State {
	create = () => {
		start = game.time.totalElapsedSeconds();
		game.add.sprite(0, 0, "bgMeeting800");
		game.add.sprite(580, 233, "gooseBoss");
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
					speed += 0.2;
					interval = Math.max(1000, interval - 100);
				}
				console.log(interval);
				spawner = setTimeout(callback, interval);
			};
			spawner = setTimeout(callback, interval);
		}, interval);

		honkButt = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		honkKeys = ["H", "O", "N", "K"].map(k =>
			game.input.keyboard.addKey(k.charCodeAt(0))
		);
		honks = honks.map(h => game.add.audio("honk" + h, 1));

		timer = game.add.text(30, 50, "Meeting ends\nin: " + time, {
			font: "Charter",
			fontSize: 24,
			fill: "#000",
		});
		livesText = game.add.text(680, 50, "Lives: " + lives, {
			font: "Charter",
			fontSize: 24,
			fill: "#000",
		});
	};
	update = () => {
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
			game.state.start("GameOver");
			clearTimeout(spawner);
		}

		game.physics.arcade.collide(bubbles, letters);
		[bubbles, targets].forEach(g =>
			g.forEach((b, k) => {
				if (b && b.body) {
					b.body.y -= speed;
					if (b.body.y <= 0) {
						b.destroy();
						livesText.text = "Lives: " + --lives;
						bubbles = bubbles.filter((f, fk) => fk != k);
						return;
					}
				}
			})
		);
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
					if (bubbles.length == 0) l.body.gravity.y = 300;
					l.bounce = 0.75;
				});
				words.push([...letters]);
				letters = [];
				honks[Math.floor(Math.random() * honks.length)].play();
				if (bubbles.length > 0) {
					// max = bubbles.reduce(
					// 	(max, b) =>
					// 		b.body.y < max.body.y && !targets.includes(b) ? b : max,
					// 	bubbles[0]
					// );
					max = bubbles.pop();
					targets.push(max);
				}
				// else
				// 	words[words.length - 1].forEach(l =>
				// 		setTimeout(() => l.destroy(), 5000)
				// 	);
			}
			hkI = (hkI + 1) % honkKeys.length;
		}
		if (honkButt.justDown) {
			honks[Math.floor(Math.random() * honks.length)].play();
			// this.spawnText("honk.", 25);
		}

		words.forEach((w, k) => {
			var destroy = false;
			w.forEach(l => {
				if (l && l.body) {
					if (l.body.y > game.world.height / 2 && l.style.fill != "white")
						l.setStyle({ ...l.style, fill: "white" });
					if (k < targets.length) {
						game.physics.arcade.moveToObject(l, targets[k], 400);
						if (Phaser.Rectangle.contains(l.body, targets[k].x, targets[k].y)) {
							l.body.velocity.setTo(0, 0);
							targets[k].destroy();
							targets.pop();
							destroy = true;
						}
					}
				}
				// if (l.body.y > game.world.height) destroy = true;
			});
			if (w.some(l => l && l.body && l.body.y > game.world.height)) w = null;
			if (destroy) {
				w.forEach(l => l.destroy());
				w = null;
			}
		});
		words.filter(w => w);
	};

	spawnText = (
		text,
		x,
		style = {
			font: "Charter",
			fontSize: 32,
			fill: "black",
		}
	) => {
		let letter = game.add.text(x, game.world.height * 0.1, text, style);
		letter.bounce = 1;
		return letter;
	};
}
