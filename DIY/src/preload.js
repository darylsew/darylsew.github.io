var preload = function(game){}

preload.prototype = {
	preload: function() {
		// setting up loading bar
		var loadingBar = this.add.sprite(220, 236, "loading");
		// loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadingBar);

	    // Loading game assets
	 	// Background
	    game.load.image("ground", "assets/floor.png");
	    game.load.image("wall", "assets/wall.png");
	    game.load.image("background", "assets/bg.png");

	    // Staircases
	    game.load.image("stairUp", "assets/stairUp.png");
	    game.load.image("stairDown", "assets/stairDown.png");

	    // Bench type elements that need to be jumped over
	    game.load.image("bottomRightBench", "assets/bottomRightBench.png");
	    game.load.image("bottomLeftStool", "assets/bottomLeftStool.png");
	    game.load.image("topOttoman", "assets/topOttoman.png");
	    game.load.image("couch1", "assets/couch1.png");
	    game.load.image("couch2", "assets/couch2.png");
	    game.load.image("bed1", "assets/bed1.png");
	    game.load.image("bed2", "assets/bed2-2.png");
	    game.load.image("bed3", "assets/bed3-2.png");

	    // Spritesheet for the goals
	    game.load.spritesheet("faucet", "assets/faucetAnim.png", 87, 101);
	    game.load.spritesheet("standingLight", "assets/standingLightAnim.png", 59, 111);
	    game.load.spritesheet("tv", "assets/tvAnim.png", 147, 101);
	    game.load.spritesheet("pots", "assets/potsAnim.png", 71, 27);
	    game.load.spritesheet("bike", "assets/bikeAnim.png", 146, 79);
	    game.load.spritesheet("trash", "assets/trashAnim.png", 40, 56);
	    game.load.spritesheet("thermostat", "assets/thermostatAnim.png", 64, 60);
	    game.load.spritesheet("hangingLights", "assets/hangingLightsAnim.png", 93, 119);

	    // Bike goal buttons
	    game.load.image("transportBike", "assets/transport/bike.png");
	    game.load.image("transportCar", "assets/transport/car.png");
	    game.load.image("transportGreenCar", "assets/transport/greencar.png");
	    game.load.image("transportPlane", "assets/transport/plane.png");
	    game.load.image("transportBus", "assets/transport/bus.png");

	    // Lightbulb options
	    game.load.image("lightInc", "assets/lightInc.png");
	    game.load.image("lightFluor", "assets/lightFluor.png");

	    // RPG Elements
	    game.load.image("overlay", "assets/overlay-2.png");
	    game.load.image("textbox", "assets/textbox.png");
	    game.load.image("rpgCharPoint", "assets/rpg/rpgCharPoint.png");
	    game.load.image("rpgCharCompl", "assets/rpg/rpgCharCompl.png");
	    game.load.image("rpgCharFret", "assets/rpg/rpgCharFret.png");
	    game.load.image("rpgChar", "assets/rpg/rpgChar.png");                              // bunny character popup
	    game.load.image("rpgCharThink", "assets/rpg/rpgCharThink.png");                   // bunny character popup    

	    // Buttons
	    game.load.image("spaceGo", "assets/rpg/spaceGo.png");
	    game.load.image("spaceExit", "assets/rpg/spaceExit.png");
	    game.load.image("buttonSelect", "assets/rpg/buttonSelect.png");
	    game.load.image("iconSelect", "assets/rpg/iconSelect.png");
	    game.load.image("tutIcons", "assets/rpg/tut.png");
	    game.load.image("hintButton", "assets/hintButton.png");

	    // Character spritesheet
	    game.load.spritesheet("char", "assets/bunnySpriteComp.png", 26, 42);

	    // Font
	    game.load.bitmapFont("digitalfun", "assets/fonts/digitalfun.png", "assets/fonts/dig.fnt");   // white digifun		
	},

	create: function() {
		game.state.start("Level");
	}
}