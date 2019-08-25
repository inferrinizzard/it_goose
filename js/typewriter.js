var spawnerT;

class TypeWriter extends Phaser.State {
	create = () => {
		spawnerT = setTimeout(() => {
			const callback = () => {
				console.log(game.time.totalElapsedSeconds());

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
	};
	update = () => {};
}
