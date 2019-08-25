var spawnerT;
var honkLetters = ["H", "O", "N", "K"];
var honkKeys;
var letters = [];
var hlI = 0;
var speed, interval;
var score = 0;
var scoreText;
var bar;

class TypeWriter extends Phaser.State {
	create = () => {
		honkKeys = honkLetters.map(k =>
			game.input.keyboard.addKey(k.charCodeAt(0))
		);
		spawnerT = setTimeout(() => {
			const callback = () => {
				console.log(game.time.totalElapsedSeconds());
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
		});

		bar = game.add.sprite(200, 650, "stressBar");

		honks = honks.map(h => game.add.audio("honk" + h, 1));
	};
	update = () => {
		letters.forEach(l => (l.sprite.body.y += 2));
		if (
			letters.length > 0 &&
			honkKeys[letters[0].letter].justDown &&
			Phaser.Rectangle.intersects(
				letters[0].sprite.getBounds(),
				bar.getBounds()
			)
		) {
			let deletter = letters.shift().sprite;
			score += Math.abs(deletter.body.y - bar.body.y) / bar.height;
			scoreText.text = "Score:+ " + score;
			deletter.destroy();
		}
	};
}
