var game = new Phaser.Game(500, 800, Phaser.AUTO, "content", true);

class mainMenu extends Phaser.State {
	preload = () => {
		game.load.path = "../assets/";

		["quail1"].forEach(img => game.load.image(img, img + ".png"));
	};
	create = () => {
		var q = game.add.sprite(0, 0, "quail1");
		q.x = game.world.width / 2 - q.width;
		q.y = game.world.height / 2 - q.height;
		q.scale.setTo(2, 2);
		var main = game.add.text(
			game.world.width / 2,
			game.world.height / 4,
			"«it goose.»",
			{
				fontSize: 64,
				align: "center",
			}
		);
		main.addColor("aliceblue");
		main.x -= main.width / 2;
		main.y -= main.height;
	};
	update = () => {};
}

game.state.add("MainMenu", mainMenu);
game.state.start("MainMenu");
