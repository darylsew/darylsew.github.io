var boot = function(game){
	// console.log(game);
};

boot.prototype = {
	preload: function() {
		game.stage.backgroundColor = "#434343";
		game.load.image("loading", "assets/loadingbar.png");
	},

	create: function() {
		game.state.start("Preload");
	}
}