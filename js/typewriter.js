var spawnerT;
var honkLetters = ["H", "N", "K", "O"];
var honkKeys;
var letters = [];
var hlI = 0;
var speed,
	interval = 500,
	iMult = 6,
	fallSpeed = 2;
var score = 0;
var scoreText;
var missed = [];
var bar;
var printText = [""];
var nums = 0;
var end;

class TypeWriter extends Phaser.State {
	create = () => {
		game.add.sprite(0, 0, "typewriterBG");
		honkKeys = honkLetters.map(k =>
			game.input.keyboard.addKey(k.charCodeAt(0))
		);
		spawnerT = setTimeout(() => {
			const callback = () => {
				let letter = game.add.text(hlI * 64 + 400 - 96, 50, honkLetters[hlI], {
					...wordStyle,
					fontSize: 64,
				});
				letter.anchor.setTo(0.5, 0.5);
				letters.push({ sprite: letter, letter: hlI });
				game.physics.arcade.enable(letter);
				hlI = Math.floor(Math.random() * honkLetters.length);

				if (nums++ < 100) spawnerT = setTimeout(callback, interval);
			};
			spawnerT = setTimeout(callback, interval);
		}, interval);

		scoreText = game.add.text(50, 50, "Score: " + score, {
			...wordStyle,
			fontSize: 32,
			fill: "#FFF",
		});

		bar = game.add.sprite(400, 450, "stressBar");
		bar.anchor.setTo(0.5, 0.5);
		bar.tint = 0xff3300;
		bar.scale.setTo(1, 1);

		honks = honks.map(h => game.add.audio("honk" + h, 1));
		new Array(5).fill("tw").forEach((tw, k) => game.add.audio(tw + (k + 1)));
		end = game.add.text(400, 30, "");
		end.anchor.setTo(0.5, 0);
	};
	update = () => {
		if (nums >= 100) {
			bar.destroy();
			letters.forEach(l => l.sprite.destroy());
		}
		if (nums >= 100) {
			end.text = "Meeting notes:\n" + printText.join("\n");
			return;
		}
		[letters, missed].forEach(n =>
			n.forEach(l => (l.sprite.body.y += fallSpeed))
		);
		if (
			letters.length > 0 &&
			honkKeys[letters[0].letter].justDown &&
			Phaser.Rectangle.intersects(
				letters[0].sprite.getBounds(),
				bar.getBounds()
			)
		) {
			let deletter = letters.shift();
			let delSprite = deletter.sprite;
			score +=
				Math.round(8 * (1 - Math.abs(delSprite.y - bar.y) / bar.height)) / 4;
			scoreText.text = "Score: " + score;
			delSprite.destroy();
			game.sound.play("tw" + Math.ceil(Math.random() * 5));
			printText[printText.length - 1] += honkLetters[deletter.letter];
			if (
				printText[printText.length - 1].endsWith("honk") ||
				printText[printText.length - 1].length > 16
			)
				printText.push("");
		}
		if (letters.length && letters[0].sprite.top > bar.bottom)
			missed.push(letters.shift());
		if (missed.length && missed[0].sprite.top > game.world.height) {
			missed.shift().sprite.destroy();
			scoreText.text = "Score: " + --score;
		}
	};
}
