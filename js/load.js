class Load extends Phaser.State {
	preload = () => {
		game.load.path = "./assets/";

		["title", "titleScreen", "feather"].forEach(img =>
			game.load.image(img, img + ".png")
		);

		["bgMeeting800", "gooseBoss", "vc", "bubble"].forEach(img =>
			game.load.image(img, img + ".png")
		);
		honks.forEach(h => game.load.audio("honk" + h, "honk" + h + ".mp3"));
	};
	create = () => {
		game.load.start();
		game.load.onLoadStart.add(() => {}, this);
		// game.load.onFileComplete.add(fileComplete, this);
		game.load.onLoadComplete.add(() => {
			game.state.start("MainMenu");
		}, this);
	};
	update = () => {};
}
