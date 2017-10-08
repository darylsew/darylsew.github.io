var level = function(game){
	var player;
	var platforms;
	var cursors;
	var zKey;           // z for controlling select
	var jumpKey;
	var background;
	var stairs;
	var goals;          // only contains goals that have not yet been dealt with
	var completedGoals;
	var ground;
	var info;           // the information things
	var permaInfo;      // permanent info pieces that don't need to be re-rendered each time
	var infoTitle;
	var modal;
	var tutIcons;
	var hintButton;
	var srcText;        // word that says "source"
	var sources;        // group containing source information

	var textbox;       
	var overlay;
	var textPos;
	var rpgChar;
	var rpgCharPoint;
	var text;
	var okToExit;
	var spaceExit;
	var spaceGo;
	var animateGroup;       // group to be animated

	var idleTime;           // amount of time unmoving
	var idleMAX;      		// amt of time leading to idle anim
	var enteringStair;

	var walls;
	var facingRight;
	var flickerCountdown;
	var overlappedWithTrash;
	var modalUp;
	var trashModalUp;
	var trashStartTime;
	var str;                            // temporary string
	var multiplier;                		// multiplier for trash (41 tonnes/sec)
	var buttonLoc;                      // which button is being selected

	var nGoalsCompleted;                // number of goals completed
	var totGoals;                   	// total number of goals
	var goalComplete;                   // array of completed goals. The mapping is the goalResponse fcn
}

level.prototype = {
	highlightGoal: function() {
		if (animateGroup.length > 0) {
			animateGroup.getChildAt(0).tint = 0xff00ff;
		}
	},

	unhighlight: function() {
		if (animateGroup.length > 0) animateGroup.getChildAt(0).tint = 0xFFFFFF;
	},

	create: function() {
	    game.physics.startSystem(Phaser.Physics.ARCADE);
	    game.stage.smoothed = false;
	    Phaser.Canvas.setImageRenderingCrisp(game.canvas);  //for Canvas, modern approach
	    PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;  //for WebGL

	    // Background. Sprites are rendered in the order they're added.
	    background = game.add.tileSprite(0, game.world.height-480, 640, 480, "background");
	    background.smoothed = false;    

	     // Add walls
	    walls = game.add.group();
	    walls.enableBody = true;
	    leftWall = walls.create(14, 141, "wall");
	    leftWall.body.immovable = true;
	    leftWall.body.moves = false;
	    rightWall = walls.create(614, 141, "wall");
	    rightWall.body.immovable = true;

	    // FLOORS:
	    platforms = game.add.group();
	    platforms.enableBody = true;

	    // Add the couch and bed in parts. For ppl looking at this code, you should use p2 physics
	    // instead of arcade physics if you have irregularly shaped objects, but I am too lazy rn
	    couch1 = walls.create(42, 152, "couch1");
	    couch1.body.setSize(20, 139, 0, -42);
	    couch1.body.immovable = true;
	    couch2 = platforms.create(62, 207, "couch2");
	    couch2.body.immovable = true;

	    bed2 = platforms.create(332, 220, "bed2");
	    bed2.body.immovable = true;
	    bed3 = platforms.create(399, 209, "bed3");
	    bed3.body.immovable = true;
	    bed1right = platforms.create(425, 194, "bed1");
	    bed1right.body.immovable = true;

	    // Add bench platforms
	    bottomRightBench = platforms.create(440, 430, "bottomRightBench");
	    bottomRightBench.body.immovable = true;
	    bottomLeftStool = platforms.create(193, 428, "bottomLeftStool");
	    bottomLeftStool.body.immovable = true;
	    topOttoman = platforms.create(440, 218, "topOttoman");
	    topOttoman.body.immovable = true;

	    // Add first floor
	    firstFloor = platforms.create(26, 249, "ground");
	    firstFloor.body.immovable = true;

	    // Add ground
	    ground = platforms.create(26, 466, "ground");
	    ground.body.immovable = true;

	    // Staircases: stairUp = upper floor staircase, stairDown = lower floor staircase
	    stairs = game.add.group();
	    stairs.enableBody = true;
	    stairUp = stairs.create(558, 142, "stairUp");
	    stairDown = stairs.create(558, 359, "stairDown");

	    // Hard code all the goals lol
	    animateGroup = game.add.group();
	    completedGoals = game.add.group();
	    completedGoals.enableBody = false;
	    animateGroup.enableBody = true;

	    faucet = animateGroup.create(257, 365, "faucet");
	    faucet.animations.add("on", [1, 2, 3], 4, true);
	    faucet.frame = 0;
	    faucet.body.setSize(87, 58, 0, 0);

	    tv = animateGroup.create(139, 148, "tv");
	    tv.animations.add("on", [1, 2, 3, 4, 0], 8, false);
	    tv.frame = 0;
	    tv.body.setSize(44, 54, -8, 47);

	    pots = animateGroup.create(192, 371, "pots");
	    pots.animations.add("on", [0, 1, 2, 3, 4, 5, 6, 7, 8], 8, true);
	    pots.frame = 0;

	    bike = animateGroup.create(27, 387, "bike");
	    bike.animations.add("on", [1, 2, 3, 4], 4, true);
	    bike.frame = 1;

	    trash = animateGroup.create(371, 410, "trash");
	    trash.animations.add("open", [2, 3], 8, false);
	    trash.animations.add("close", [0, 1], 8, false);
	    trash.frame = 1;
	    overlappedWithTrash = false;    

	    thermostat = animateGroup.create(490, 332, "thermostat");
	    thermostat.animations.add("on", [0, 1, 2, 3], 5, true);
	    thermostat.frame = 0;

	    hangingLights = animateGroup.create(403, 58, "hangingLights");
	    hangingLights.animations.add("on", [0, 1, 2, 3], 4, true);
	    hangingLights.frame = 0;

	    standingLight = animateGroup.create(26, 138, "standingLight");
	    standingLight.animations.add("on", [0, 1], 15, true);
	    standingLight.frame = 0;
	    flickerCountdown = 30;

	    // Add the goals to the animate list:
	    goals = [];

	    animateGroup.forEach(function(e) { goals.push(e); });

	    // The player and its settings
	    player = game.add.sprite(32, game.world.height-32-42, "char");
	    player.animations.add("left", [0, 1, 2, 3], 6, true);
	    player.animations.add("right", [4, 5, 6, 7], 6, true);
	    player.animations.add("idle", [11, 12, 13, 14, 15], 6, true);
	    player.animations.add("doorLeft", [8, 9], 8, false);
	    player.animations.add("doorRight", [10, 9], 8, false);
	    player.frame = 7;
	    game.physics.arcade.enable(player);             // physics
	    player.body.bounce.y = 0.2;                     // bounce
	    player.body.gravity.y = 300;
	    player.body.collideWorldBounds = true;          // don't let it past the sides of the screen
	    facingRight = true;

	    //  Our controls.
	    cursors = game.input.keyboard.createCursorKeys();
	    zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
	    jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	    // Hidden elements belonging to the information modal
	    permaInfo = game.add.group();
	    overlay = permaInfo.create(0, 0, "overlay");
	    rpgChar = permaInfo.create(32, 16, "rpgChar");
	    rpgCharPoint = permaInfo.create(32, 16, "rpgCharPoint");
	    rpgCharPoint.visible = false;
	    rpgCharCompl = permaInfo.create(5, -37, "rpgCharCompl");           
	    rpgCharCompl.visible = false;
	    rpgCharThink = permaInfo.create(32, 16, "rpgCharThink");
	    rpgCharThink.visible = false;
	    rpgCharFret = permaInfo.create(32, 16, "rpgCharFret");
	    rpgCharFret.visible = false;
	    textbox = permaInfo.create(0, 309, "textbox");

	    // RPG MODAL TEXT & BUTTON INFORMATION
	    infoTitle = game.add.text(28, 332, "", { font: "20px Montserrat", fill: "#ff8063", wordWrap: true, wordWrapWidth: 584 });
	    permaInfo.add(infoTitle);
	    okToExit = false;
	    spaceExit = permaInfo.create(551, 463, "spaceExit");
	    spaceGo = permaInfo.create(585, 463, "spaceGo");
	    spaceExit.visible = false;
	    spaceGo.visible = false;
	    buttonSelect = permaInfo.create(476, 172, "buttonSelect");
	    buttonSelect.visible = false;
	    srcText = game.add.bitmapText(28, 458, "digitalfun", "sources: ", 8);   // the word "source"
	    permaInfo.add(srcText);
	    srcText.visible = false;
	    trashModalUp = false;
	    trashStartTime = 0;
	    str = "";
	    buttonLoc = 0;

	    // GOAL INFORMATION
	    goalComplete = [false, false, false, false, false, false, false, false];        // none completed
	    nGoalsCompleted = 0;
	    idleTime = 0;
	    idleMAX = 300;
	    multiplier = 41;
	    totGoals = 8;
	    enteringStair = false;

	    // ADD HINT BUTTON
	    hintButton = game.add.button(572, 27, "hintButton", this.highlightGoal);

	    // START RPG GAME SETUP: to do - move into loadInstructions function
	    info = game.add.group();   
	    sources = game.add.group();
	    modalUp = true;
	    textPos = 0;
	    permaInfo.visible = true;
	    infoTitle.text = "Hi there!";
	    spaceGo.visible = true;

	    tutIcons = permaInfo.create(308, 172, "tutIcons");
	    tutIcons.visible = false;

	    text = [
	        function() { infoTitle.text = "There are many ways you can get involved in action against climate change at home."; },
	        function() { infoTitle.text = "Can you find some of them in this house?"; },
	        function() { infoTitle.text = "Use the left and right arrow keys to move, the up arrow key to enter doorways, and SPACE to jump."; rpgChar.visible = false; rpgCharPoint.visible = true; tutIcons.visible = true;},
	        function() { infoTitle.text = "Interact with elements using the z-key."},
	        function() { infoTitle.text = "Good luck! Use the hint button in the top-right corner if you get stuck."; spaceGo.visible = false; spaceExit.visible = true; okToExit = true;}
	    ];
	},

	/* Updates the text in the speech box */
	updateText: function(txt) {
		infoTitle.text = txt;
	},

	updateAnim: function() {
	    // Only play goals that haven't yet been set to completed
	    var self = this;
	    animateGroup.forEach(
	        function(e) {
	            if (e.key == "trash") {
	                // Only open the trash when the player steps on it. Close it otherwise.
	                if (self.checkOverlap(player, trash)) {
	                    if (!overlappedWithTrash) {
	                        trash.play("open");
	                        overlappedWithTrash = true;
	                    }
	                }  else {
	                    if (overlappedWithTrash) {
	                        trash.play("close"); // has opened at least once         
	                        overlappedWithTrash = false;
	                    }
	                }
	            } else if (e.key == "standingLight" || e.key == "tv") {
	                // Animation logic for flickering standing light/lamp
	                if (flickerCountdown > 0) {
	                    if (animateGroup.contains(standingLight)) standingLight.play("on");   // probably should be separated
	                } else if (flickerCountdown < -40) {
	                    flickerCountdown = 30;
	                    if (animateGroup.contains(tv)) tv.play("on");
	                } else {
	                    standingLight.animations.stop();
	                    standingLight.frame = 0;
	                }

	                flickerCountdown--; 
	            } else {
	                e.play("on");
	            }
	        }
	    , this);
	},

	completeGame: function() {
		var self = this;
	    modalUp = true;
	    textPos = 0;
	    permaInfo.visible = true;
	    nGoalsCompleted = 0;           // reset/remove
	    hintButton.visible = false;

	    info = game.add.group();

	    text = [
	        function() { self.updateText("Looks like you've found everything you needed to."); spaceGo.visible = true; rpgCharThink.visible = false; rpgCharCompl.visible = true; },
	        function() { self.updateText("Thanks for playing!"); spaceGo.visible = false; spaceExit.visible = true; okToExit = true;}
	       	// Standalone game does not implement game exit
	    ];

	    infoTitle.text = "Oh?";
	    rpgChar.visible = false;
	    rpgCharThink.visible = true;
	},

	/* Function handles response when player tries to interact with a specific goal.
	The modal is raised and the appropriate information is shown. After interaction,
	the goal is removed from the universal goals group. Mistakes were made with what frame
	is the finished default... */
	interactWithGoal: function(goal) {
		var self = this;
		this.unhighlight();

	    modalUp = true;
	    textPos = 0;
	    completedGoals.add(goal);
	    animateGroup.removeChild(goal, false);
	    goal.animations.stop();                     // stop the animation
	    permaInfo.visible = true;

	    // These two will never exist before the first interactWithGoal() is called, because after the
	    // instruction modal leaves the screen, info and sources are both destroyed in clearModal()
	    info = game.add.group();                    // produce the temporary information group
	    sources = game.add.group();

	    switch (goal.key) {
	        case "bike":
	            var planeButton = game.make.button(310, 205, "transportPlane", 
	                function() { 
	                    self.updateText("Planes account for 12% of emissions from all transportation. In 2006, it's estimated aviation released 600 million tonnes of CO2 into the atmosphere.");
	                    self.addSourceButton([{name: "ICAO (UN)", loc: "https://www.icao.int/environmental-protection/Documents/EnvironmentReport-2010/ICAO_EnvReport10-Ch1_en.pdf", pos: 90}]);
	                });
	            var busButton = game.make.button(375, 205, "transportBus", 
	                function() {
	                self.updateText("For those of you in urban areas, replacing one car at home with public transportation such as the metro or the bus can save up to 30% in emissions.");
	                self.addSourceButton([{name: "APTA", loc: "https://www.ipcc.ch/pdf/assessment-report/ar4/wg3/ar4-wg3-chapter5.pdf", pos: 90}]);

	            });
	            var carButton = game.make.button(440, 205, "transportCar", 
	                function() {
	                    self.updateText("Road transport such as cars and trucks account for around 17% of worldwide emissions (2004). They are expected to grow to 80% higher by 2030.");
	                    self.addSourceButton([{name: "Ribeiro, Kobayashi, et al", loc: "https://www.ipcc.ch/pdf/assessment-report/ar4/wg3/ar4-wg3-chapter5.pdf", pos: 90}]);
	                });
	            var greenCarButton = game.make.button(505, 205, "transportGreenCar",
	                function() {
	                    self.updateText("Green cars offer an alternative to regular cars if you must drive. Hybrid cars drive more distance using the same tank of gas, and electric cars produce fewer emissions than their gas counterparts.");
	                    self.addSourceButton([{name: "UCSUSA", loc: "http://www.ucsusa.org/clean-vehicles/car-emissions-and-global-warming", pos: 90}]);
	                });
	            var bikeButton = game.make.button(570, 205, "transportBike", 
	                function() { 
	                    sources.destroy(true);
	                    sources = null;
	                    srcText.visible = false;            // hide this
	                    self.updateText("Walk and bike if possible; They release a whopping zero emissions and are good for exercise! :)")}
	                );

	            info.add(planeButton);
	            info.add(busButton);
	            info.add(carButton);
	            info.add(greenCarButton);
	            info.add(bikeButton);

	            buttonLoc = 0;
	            var infoSelect = info.create(308, 199, "iconSelect");

	            // ADD HOVER INFORMATION INTO BUTTONS
	            planeButton.onInputOver.add(function() { info.getChildAt(info.length-1).x = 308; buttonLoc = 0; });
	            busButton.onInputOver.add(function() { info.getChildAt(info.length-1).x = 373; buttonLoc = 1; });
	            carButton.onInputOver.add(function() { info.getChildAt(info.length-1).x = 438; buttonLoc = 2; });
	            greenCarButton.onInputOver.add(function() { info.getChildAt(info.length-1).x = 503; buttonLoc = 3; });
	            bikeButton.onInputOver.add(function() { info.getChildAt(info.length-1).x = 568; buttonLoc = 4; });

	            info.visible = false;

	            text = [
	                function() { 
	                    infoTitle.text = "To learn more about different types of transportation and their effects, try the buttons to the right."; 
	                    rpgChar.visible = false;
	                    rpgCharPoint.visible = true; 
	                    info.visible = true;

	                    buttonSelect.visible = true;
	                    spaceGo.visible = false;
	                    spaceExit.visible = true;
	                    okToExit = true;

	                    if (!goalComplete[0]) {
	                        goalComplete[0] = true;
	                        nGoalsCompleted++;
	                    }
	                }
	            ];

	            spaceGo.visible = true;
	            infoTitle.text = "Transportation makes up about 22% of emissions worldwide (2013).";
	            self.addSourceButton([{name: "WRI", loc: "http://www.wri.org/blog/2014/09/transport-sector-key-closing-world%E2%80%99s-emissions-gap", pos: 90}]);
	            bike.frame = 0;
	            break;

	        case "pots":
	            text = [
	                function() {
	                    self.updateText("Agriculture (farming) produces 29% of global emissions. This includes crop growing, raising animals, and transport.");
	                    self.addSourceButton([{name: "[1]", loc: "https://ccafs.cgiar.org/blog/eating-local-good-climate-thinking-beyond-food-miles", pos: 90}, {name: "[2]", loc: "https://www.nytimes.com/interactive/2015/12/03/upshot/what-you-can-do-about-climate-change.html?_r=0", pos: 110}, {name: "[3]", loc: "https://www.forbes.com/sites/jeffmcmahon/2014/10/27/foods-that-fight-climate-change/#eeec18370f28", pos: 130}]);
	                },
	                function() { self.updateText("While buying local produce is an option, consider that around 40-50% of food is wasted in the USA!"); rpgChar.visible = false; rpgCharFret.visible = true;},
	                function() {
	                    self.updateText("Can you finish all the food on your plate for one week?"); 
	                    rpgCharFret.visible = false;
	                    rpgChar.visible = true;
	                    if (!goalComplete[1]) {
	                        goalComplete[1] = true;
	                        nGoalsCompleted++;
	                    }
	                    spaceGo.visible = false;
	                    spaceExit.visible = true;

	                    okToExit = true;
	                }];
	            pots.frame = 8;

	            self.updateText("Here's some food for thought:");
	            spaceGo.visible = true;
	            break;
	        case "faucet":
	            text = [
	                function() { self.updateText("Although the earth is 71% water, only 0.3% of it is useable."); },
	                function() {  
	                    self.updateText("Just doing something small like turning off the tap while brushing your teeth can save 4 gallons per minute.");
	                    spaceGo.visible = false;
	                    spaceExit.visible = true;

	                    if (!goalComplete[2]) {
	                        goalComplete[2] = true;
	                        nGoalsCompleted++;
	                    }

	                    okToExit = true;
	                }
	            ];

	            self.addSourceButton([{name: "[1]", loc: "http://www.ngwa.org/Fundamentals/teachers/Pages/information-on-earth-water.aspx", pos: 90}, {name: "[2]", loc: "http://aquaholics.ucsd.edu/_files/WaterConservationFacts1.pdf", pos: 110}]);

	            self.updateText("Let's turn the faucet off so we don't waste water.");
	            spaceGo.visible = true;

	            faucet.frame = 0;
	            break;
	        case "trash":
	            spaceGo.visible = true;
	            trashStartTime = Math.floor(game.time.time);         // open modal time
	            text = [
	                function() { trashModalUp = true; }, 
	                function() { trashModalUp = false; infoTitle.text = "You can help by following the 3 R's: Reduce, Reuse, Recycle."; },
	                function() { infoTitle.text = "Recycle plastics and papers, choose reusable containers, and buy in bulk to reduce packaging waste."; spaceGo.visible = false;
	                    spaceExit.visible = true; okToExit = true;
	                    if (!goalComplete[3]) {
	                        goalComplete[3] = true;
	                        nGoalsCompleted++;
	                    } 
	                }];
	            infoTitle.text = "Each year the world produces 1.3 billion tonnes of trash. 12.8% of it is plastic alone!"
	            trash.frame = 4;
	            self.addSourceButton([{name: "[1]", loc: "http://kids.nationalgeographic.com/explore/science/plastic-pollution/#earth-day-pollution.jpg", pos: 90}, {name: "[2]", loc: "http://www.worldbank.org/en/news/feature/2012/06/06/report-shows-alarming-rise-in-amount-costs-of-garbage", pos: 110}]);
	            break;
	        case "thermostat":
	            text = [
	                function() { 
	                    self.updateText("Turning off or reducing your AC while you're out can save on money and emissions.");
	                    spaceGo.visible = false;
	                    spaceExit.visible = true;
	                    if (!goalComplete[4]) {
	                        goalComplete[4] = true;
	                        nGoalsCompleted++;
	                    }

	                    okToExit = true;
	                }
	            ];


	            infoTitle.text = "25% of emissions globally each year come from electricity and heat production."
	            self.addSourceButton([{name: "usa epa", loc: "https://www.epa.gov/ghgemissions/global-greenhouse-gas-emissions-data", pos: 90}]);
	            spaceGo.visible = true;

	            thermostat.frame = 0;
	            break;
	        case "hangingLights": 
	            rpgChar.visible = false;
	            rpgCharThink.visible = true;

	            infoTitle.text = "It looks like these lights aren't in use...";
	            text = [
	                function() { 
	                    infoTitle.text = "We can turn them off to save some energy.";
	                    spaceGo.visible = false;
	                    spaceExit.visible = true;
	                    okToExit = true;
	                    rpgCharThink.visible = false;
	                    rpgChar.visible = true;
	                    hangingLights.frame = 4;

	                    if (!goalComplete[5]) {
	                        goalComplete[5] = true;
	                        nGoalsCompleted++;
	                    }
	                }
	            ];

	            spaceGo.visible = true;
	            break;
	        case "tv":
	            self.updateText("Did you know?");
	            self.addSourceButton([{name: "[1]", loc: "https://energy.gov/energysaver/articles/3-easy-tips-reduce-your-standby-power-loads", pos: 90}, {name: "[2]", loc: "http://news.bbc.co.uk/2/hi/programmes/click_online/4929594.stm", pos: 110}, {name: "[3]", loc: "http://www.economist.com/node/5571582", pos: 130}]);
	            spaceGo.visible = true;
	            text = [
	                function() { self.updateText("Many electronic devices use energy even though they look like they're off. This is called 'standby power' or 'vampire power.'"); },
	                function() { self.updateText("In the UK in 2006, it was estimated that standby power produced over three million tonnes of CO2!"); rpgChar.visible = false; rpgCharFret.visible = true;},
	                function() { self.updateText("If convenient, try to unplug devices or use a power strip with a switch."); rpgCharFret.visible = false; rpgChar.visible = true;},
	                function() { self.updateText("Thankfully, new technology and laws are making this better every day."); rpgCharFret.visible = false; rpgCharPoint.visible = true;},
	                function() { self.updateText("The International Energy Agency (IEA) created the One Watt Initiative in 1999 to propel appliances towards using 1 watt in standby. Australia and the USA also took their own intiatives in 2000 and 2001 respectively."); 
	                    spaceGo.visible = false; spaceExit.visible = true; okToExit = true; 
	                    if (!goalComplete[6]) { goalComplete[6] = true; nGoalsCompleted++;}}
	            ];

	            tv.frame = 0;
	            break;
	        case "standingLight":
	            rpgChar.visible = false;
	            rpgCharThink.visible = true;

	            // Add buttons
	            var incLightButton = game.make.button(310, 205, "lightInc", 
	                function() { 
	                    self.updateText("Hmm maybe we should take a look at the other option..."); 
	                    rpgCharPoint.visible = false; rpgChar.visible = false;
	                    rpgCharThink.visible = true;                // set all the combos ugh
	                });
	            var fluorLightButton = game.make.button(375, 205, "lightFluor", 
	                function() { 
	                    self.updateText("That's a good choice! Fluorescent lights last longer and use 25 - 80% less energy -- this actually makes them cheaper in the long run too!"); 
	                    self.addSourceButton([{name: "USA dept of energy", loc: "https://energy.gov/energysaver/how-energy-efficient-light-bulbs-compare-traditional-incandescents", pos: 90}]);
	                    rpgCharPoint.visible = false; rpgCharThink.visible = false;
	                    rpgChar.visible = true; 
	                    spaceGo.visible = false; spaceExit.visible = true;
	                    okToExit = true;
	                });

	            incLightButton.visible = false;
	            fluorLightButton.visible = false;

	            info.add(incLightButton);
	            info.add(fluorLightButton);

	            buttonLoc = 0;
	            incLightButton.onInputOver.add(function() { info.getChildAt(info.length-1).x = 308; buttonLoc = 0; });
	            fluorLightButton.onInputOver.add(function() { info.getChildAt(info.length-1).x = 373; buttonLoc = 1; });

	            var infoSelect = info.create(308, 199, "iconSelect");
	            infoSelect.visible = false;

	            self.updateText("Looks like the lightbulb is out.");

	            text = [ 
	                function() { infoTitle.text = "What kind of lightbulb should we replace it with? ";},
	                function() { infoTitle.text = "We can pick incandescent bulbs,"; incLightButton.visible = true; rpgCharThink.visible = false; rpgCharPoint.visible = true; incLightButton.input.enabled = false;},
	                function() { infoTitle.text += " or compact fluorescent lightbulbs (CFLs)!"; fluorLightButton.visible = true; fluorLightButton.input.enabled = false;},
	                function() { infoTitle.text = "Which one should we pick?";
	                    infoSelect.visible = true;
	                    fluorLightButton.inputEnabled = true;       // make them clickable
	                    incLightButton.inputEnabled = true; 
	                    buttonSelect.visible = true;
	                    if (!goalComplete[7]) {
	                        goalComplete[7] = true;
	                        nGoalsCompleted++;
	                    }
	                }
                ];

	            spaceGo.visible = true;
	            standingLight.frame = 1;
	            break;
	        default: break;
	    }
	},

	/* Adds the sources to the screen.
	* Takes in an array of object literals with the properties:
	* name: text to display
	* loc: url location of source
	* pos: x-position to place hyperlink in */
	addSourceButton: function(arr) { 
	    if (sources != null) sources.destroy(true);          // empty out any previous sources on the screen if possible
	    sources = null;

	    sources = game.add.group();                         // re-add this in
	    srcText.visible = true;

	    for (var i = 0; i < arr.length; i++) {
	        var srcLoc = game.add.bitmapText(arr[i].pos, 458, "digitalfun", arr[i].name, 8);
	        srcLoc.inputEnabled = true;
	        srcLoc.events.onInputUp.add(this.hyperlink, {src: arr[i].loc});
	        sources.add(srcLoc);
	    }
	}, 

	/**	Hyperlinks in a new tab. Item refers to the source button that was clicked and link refers to the source location */
	hyperlink: function() {
		window.open(this.src, "_blank");
	},

	/* Function clears the modal off the screen, hiding the appropriate components */
	clearModal: function() {
	    permaInfo.visible = false;
	    trashModalUp = false;
	    tutIcons.visible = false;
	    infoTitle.text = "";
	    modalUp = false;
	    info.destroy(true);                          	// destroy all components of the info group
	    info = null;

	    srcText.visible = false;
	    if (sources != null) sources.destroy(true);    	// destroy all components of the sources group
	    sources = null;
	    str = "";
	    buttonLoc = 0;

	    textPos = 0; 
	    rpgCharPoint.visible = false;
	    rpgCharCompl.visible = false;
	    rpgCharThink.visible = false;        
	    rpgCharFret.visible = false;
	    rpgChar.visible = true;
	    okToExit = false;
	    text = [];

	    spaceGo.visible = false;
	    spaceExit.visible = false;
	    buttonSelect.visible = false;
	    idleTime = 0;
	},

	checkOverlap: function(obj1, obj2) {
    	return Phaser.Rectangle.intersects(obj1.body, obj2.body);
	},

	/* Responds to keyboard input. */
	inputResponse: function() {
		var self = this;
		if (!modalUp && !enteringStair) {
	        if (cursors.left.isDown) {
	            //  Move to the left
	            player.body.velocity.x = -100;
	            player.animations.play("left");
	            facingRight = false;
	            idleTime = 0;
	        } else if (cursors.right.isDown) {
	            //  Move to the right
	            player.body.velocity.x = 100;
	            player.animations.play("right");
	            facingRight = true;
	            idleTime = 0;
	        } else {
	            //  Stand still
	            if (idleTime >= idleMAX) {
	                player.animations.play("idle");
	            } else if (!enteringStair) { 
	                player.x = Math.round(player.x);        // Fix blurry idle image
	                player.y = Math.round(player.y);
	                player.animations.stop();
	                player.frame = facingRight ? 7 : 0;
	                idleTime+=1;
	            }
	        }
	            
	        // Allow the player to jump if they are touching the ground.
	        if (jumpKey.isDown && player.body.touching.down) {
	            player.body.velocity.y = -160;
	        }

	        // If the up key is pressed, we enter the staircase and move our player appropriately
	        // It might be better to use a cooldown counter instead of this
	        game.input.keyboard.onUpCallback = function(e) {
	            if (e.keyCode == Phaser.Keyboard.UP) {
	                // Checks if the player's contact box is entirely contained
	                // within that of the staircase 
	                if (Phaser.Rectangle.containsRect(player.body, stairUp.body)) {
	                    enteringStair = true;
	                    player.animations.stop();
	                    facingRight ? player.animations.play("doorRight") : player.animations.play("doorLeft");
	                    player.animations.currentAnim.onComplete.add(
	                        function() {
	                            player.y = 466 - 41;        // Math: ground floor position - height of sprite
	                            player.x = 568;             // Arbitrary lols })
	                            enteringStair = false;
	                            // Phaser.Keyboard.enabled = true;
	                        }, 
	                    this);

	                } else if (Phaser.Rectangle.containsRect(player.body, stairDown.body)) {
	                    enteringStair = true;
	                    player.animations.stop();
	                    facingRight ? player.animations.play("doorRight") : player.animations.play("doorLeft");
	                    player.animations.currentAnim.onComplete.add(
	                        function() {
	                            player.y = 249 - 41;
	                            player.x = 568;
	                            enteringStair = false;
	                        },
	                    this);
	                }
	            }

	            if (e.keyCode == Phaser.Keyboard.Z) {
	                goals.forEach(
	                    function(e) {
	                        // Find an overlap if one exists 
	                        if (self.checkOverlap(player, e)) {
	                            self.interactWithGoal(e);
	                            return false;
	                        }
	                    }
	                , this);
	            }
	        }
	    } else {
	        // Handle keyboard modal logic
	        game.input.keyboard.onUpCallback = function(e) {
	            if (e.keyCode == Phaser.Keyboard.SPACEBAR) {
	                // Exit if OK to, or if there's no text to show at all
	                if (okToExit || text.length == 0) {
	                	self.clearModal();
	                } else {
	                    // Otherwise we want to advance the text every time z is pressed
	                    if (textPos < text.length) {
	                        text[textPos]();          // call the function in the array  wtf
	                    }
	                }

	                textPos++;

	            } else if (e.keyCode == Phaser.Keyboard.Z && buttonLoc < info.length) {
	                // Selection of a button
	                var btn = info.getChildAt(buttonLoc);
	                btn.onInputUp.dispatch(btn, btn.game.input.activePointer, false);
	            } else if (e.keyCode == Phaser.Keyboard.RIGHT && buttonLoc < info.length-2) {
	                // Moving right on buttons
	                // Invariant: info.length is always 1 greater than the number of buttons
	                // Invariant: ButtonLoc is always strictly less than info.length-1 in a valid set of buttons
	                // However we use info.length-2 going right to account for the fact we don't move right when at the end
	                var iconSelectCase = info.getChildAt(info.length-1);
	                iconSelectCase.x = iconSelectCase.x + 65;
	                buttonLoc++;
	            } else if (e.keyCode == Phaser.Keyboard.LEFT && buttonLoc > 0 && buttonLoc < info.length-1) {
	                // Moving left on buttons
	                var iconSelectCase = info.getChildAt(info.length-1);        // invariant: this is always at the end
	                iconSelectCase.x = iconSelectCase.x - 65;      				// change pos of selector
	                buttonLoc--;
	            }
	        }
	    }
	},

	/* The update loop. */
	update: function() {
	    this.updateAnim();
	    game.physics.arcade.collide(player, walls);
	    game.physics.arcade.collide(player, platforms);
	    player.body.velocity.x = 0;

	    // Rsepond to input
	    this.inputResponse();

	    if (nGoalsCompleted == totGoals && modalUp == false) {
	        // Completed all goals so transition to the ending
	        this.completeGame();
	    }

	    if (trashModalUp) {
	        var secSinceUp = Math.floor(game.time.time);
	        var trashProduced = Math.floor((secSinceUp - trashStartTime)/1000) * multiplier;

	        str = "In the time that you have been reading, " + trashProduced + " tonnes of trash have been thrown away.";
	        infoTitle.text = str;
	    }
	}
}