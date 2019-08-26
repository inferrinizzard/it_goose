var spawnerT;
var honkLetters = ["H", "O", "N", "K"];
var honkKeys;
var letters = [];
var hlI = 0;
var speed, interval;
var score = 0;
var scoreText;
var missed = [];
var bar;

class TypeWriter extends Phaser.State {
	create = () => {
		honkKeys = honkLetters.map(k =>
			game.input.keyboard.addKey(k.charCodeAt(0))
		);
		spawnerT = setTimeout(() => {
			const callback = () => {
				let letter = game.add.text(hlI * 64 + 400 - 128, 50, honkLetters[hlI], {
					...wordStyle,
					fontSize: 64,
					fill: "#FFF",
				});
				letters.push({ sprite: letter, letter: hlI });
				game.physics.arcade.enable(letter);
				hlI = Math.floor(Math.random() * honkLetters.length);

				spawnerT = setTimeout(
					callback,
					(Math.round(Math.random() * 6) + 1) * 500
				);
			};
			spawnerT = setTimeout(
				callback,
				(Math.round(Math.random() * 6) + 1) * 500
			);
		}, (Math.round(Math.random() * 6) + 1) * 500);

		scoreText = game.add.text(50, 50, "Score: " + score, {
			...wordStyle,
			fontSize: 32,
			fill: "#FFF",
		});

		bar = game.add.sprite(200, 650, "stressBar");

		honks = honks.map(h => game.add.audio("honk" + h, 1));
		new Array(5).fill("tw").forEach((tw, k) => game.add.audio(tw + (k + 1)));
	};
	update = () => {
		[letters, missed].forEach(n => n.forEach(l => (l.sprite.body.y += 2)));
		if (
			letters.length > 0 &&
			honkKeys[letters[0].letter].justDown &&
			Phaser.Rectangle.intersects(
				letters[0].sprite.getBounds(),
				bar.getBounds()
			)
		) {
			let deletter = letters.shift().sprite;
			score +=
				Math.round(8 * (1 - Math.abs(deletter.y - bar.y) / bar.height)) / 4;
			scoreText.text = "Score: " + score;
			deletter.destroy();
			game.sound.play("tw" + Math.ceil(Math.random() * 5));
		}
		if (letters.length && letters[0].sprite.y > bar.bottom)
			missed.push(letters.shift());
		if (missed.length && missed[0].sprite.y > game.world.height) {
			missed.shift().sprite.destroy();
			scoreText.text = "Score: " + --score;
		}
	};
}
