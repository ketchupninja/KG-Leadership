console.log("Leadership v1.52 initalized");

//Initialize leadershipTick function to run every n milliseconds
setInterval(leadershipTick, 500);


function findBestWorker(jobName) {
		if(game.village.sim.kittens.length == 0) {
			return;
		}
		
		var currentBest = game.village.sim.kittens[0];
		
		for (var i = 0; i < game.village.sim.kittens.length; i++) {
			var thisKitten = game.village.sim.kittens[i];
			
			if (thisKitten.skills[jobName] > currentBest.skills[jobName]) {
				currentBest = thisKitten;
			}
			
		}
		
		return currentBest;
}

//Find and return best leader for given trait
function findBestLeader(traitName) {
	
	if (game.village.sim.kittens.length == 0) {
		return;
	}
	
	//Best kitten with the trait found so far.
	//Initializes to the first kitten in the game's internal list, which
	//probably won't actually have the correct trait.
	var currentBest = game.village.sim.kittens[0];
	
	for (var i = 0; i < game.village.sim.kittens.length; i++) {
		var thisKitten = game.village.sim.kittens[i];
		if(thisKitten.trait.name == traitName) {
			
			//choose who has higher rank, else use exp
			if (thisKitten.rank > currentBest.rank) {
				currentBest = thisKitten;
			} else if (thisKitten.rank == currentBest.rank && thisKitten.exp > currentBest.exp) {
				currentBest = thisKitten;
			}
		}
	}
	return currentBest;
}

//Given a trait, set the best kitten with that trait to be leader.
function setBestLeader(traitName) {
	
	var bestLeader = findBestLeader(traitName);
	
	//If someone else is the leader, unassigned them
	if (game.village.leader){
		game.village.leader.isLeader = false;
	}
	
	//Make this kitten know it's the leader
	bestLeader.isLeader = true;
	//Make the rest of the game know this kitten is the leader
	game.village.leader = bestLeader;
}

//Find kitten with the given job
function findJobKitten(jobName) {
	
	for (var i = 0; i < game.village.sim.kittens.length; i++) {
		var thisKitten = game.village.sim.kittens[i];
		
		if (thisKitten.job == jobName) {
			return thisKitten;
		}
	}
	
	return null; //No valid kitten found
}


// https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript 
//==============================
document.onkeydown = keydown; 

function keydown (evt) { 
	if (!evt) evt = event; //???
	
	//Easy Pawse/Unpawse
	if (evt.keyCode == 192) { //' or ~
		gamePage.togglePause();
	}
	
	//Easy Leader Rank Up
	if (evt.ctrlKey && evt.keyCode == 90) { //CTRL + Z, upgrade merchant
		var bestMerchant = findBestLeader("merchant");
		game.village.sim.promote(bestMerchant, bestMerchant.rank + 1);
		//promote function will not upgrade if exp or gold cost cannot be afforded
	}
	
	if (evt.ctrlKey && evt.keyCode == 88) { //CTRL + X, upgrade artisan/engineer
		var bestEngineer = findBestLeader("engineer");
		game.village.sim.promote(bestEngineer, bestEngineer.rank + 1);
	}
	
	if (evt.ctrlKey && evt.keyCode == 67) { //CTRL + C, upgrade metallurgist
		var bestMetallurgist = findBestLeader("metallurgist");
		game.village.sim.promote(bestMetallurgist, bestMetallurgist.rank + 1);
	}
	
	if (evt.ctrlKey && evt.keyCode == 86) { //CTRL + V,  upgrade chemist
		var bestChemist = findBestLeader("chemist");
		game.village.sim.promote(bestChemist, bestChemist.rank + 1);
	}
}

document.onkeyup = keyup;

function keyup (evt) {
	if (!evt) evt = event; //???
	
	//Easy Astronomical Events
	if (evt.keyCode == 83 && game.calendar.observeRemainingTime > 0) { //"s" key released and astronomical event active
		game.calendar.observeHandler();
	}
	
}

//==============================


//Listener to handle hotkeys
document.addEventListener('keydown', (e) => {
	//Easy Leader Swapping
	if (e.key == "z") { setBestLeader("merchant"); }
	if (e.key == "x") { setBestLeader("engineer"); } //artisan
	if (e.key == "c") { setBestLeader("metallurgist"); }
	if (e.key == "v") { setBestLeader("chemist"); }
	if (e.key == "b") { setBestLeader("manager"); }
	if (e.key == "n") { setBestLeader("scientist"); }
	if (e.key == "m") { setBestLeader("wise"); }
	
	
	//Easy Worker Assignment
	let workerAssignButtons = ["q", "w", "e", "r", "t", "y"];
	
	if (e.key == "q") { game.village.assignJob(game.village.getJob("woodcutter"), 1) ; }
	if (e.key == "w") { game.village.assignJob(game.village.getJob("farmer"), 1) ; }
	if (e.key == "e") { game.village.assignJob(game.village.getJob("scholar"), 1) ; }
	if (e.key == "r") { game.village.assignJob(game.village.getJob("hunter"), 1) ; }
	if (e.key == "t") { game.village.assignJob(game.village.getJob("miner"), 1) ; }
	if (e.key == "y") { game.village.assignJob(game.village.getJob("geologist"), 1) ; }
	
	if (workerAssignButtons.includes(e.key)) {
		game.render();
	}
	//Quicksave
	if (e.key == "f") { game.save(); }
	
	
});

//Returns true if most skilled kitten in this trait has a rank up available
function rankAvailable(traitName) {
	var bestKitten = findBestLeader(traitName);
	if (bestKitten.exp >= game.village.getRankExp(bestKitten.rank)) { return true; }
	else { return false; }
}

//Adds appropriate notifiers to village tab header
function rankNotify() {
	//String that will become new tabname.
	var bonfireName = game.villageTab.tabName;
	
	let traits = ["merchant", "engineer", "metallurgist"]; //other traits not really important
	let notifyStrings = ["(MT)","(AN)", "(ML)"];
	
	for (var i = 0; i < traits.length; i++) {
		if (rankAvailable(traits[i])) {
			bonfireName += notifyStrings[i];
		}
	}
	
	//Only show (CM) after Chemist is usable
	if (game.science.techs[42].unlocked) { //oil processing
		if (rankAvailable("chemist")) {
			bonfireName += "(CM)";
		}
	}
	game.villageTab.domNode.innerHTML = bonfireName;
}

//Returns in game time as a string formatted year/season/day
//Input only affects what is logged to console, not return value.
function currentTime(reason) {
	var readableSeason = game.calendar.season + 1;
	
	var time = game.calendar.year.toString() + "/" 
	+ readableSeason.toString() + "/" 
	+ game.calendar.day.toString();
	
	var output = reason + " " + time;
	
	return output
}
	
//Initialize booleans used for milestoneCheck
var hasIronHoes = false;
var kittens50 = false;
var hasAstronomy = false;
var merchantLevelOne = false;
var hasGeodesy = false;
var ships300 = false;
var outpost1 = false;
var outpost2 = false;
var outpost3 = false;
var heliosLaunched = false;

var master = false;
var masterInfo = "";

//List used to store recorded times
var timesheet = [];

//Checks if several run-important milestones have been reached
//If they have, it marks the time they were achieved in console
function milestoneCheck() {
	//Iron Hoes
	if (game.workshop.upgrades[1].researched && !hasIronHoes) {
		hasIronHoes = true;
		timesheet.push(currentTime("Iron Hoes"));
	}
	
	//50 Kittens
	if (game.village.sim.kittens.length >= 50 && !kittens50) {
		kittens50 = true;
		timesheet.push(currentTime("50 Kittens"));
	}
	
	//Astronomy
	if (game.science.techs[17].researched && !hasAstronomy) {
		hasAstronomy = true;
		timesheet.push(currentTime("Astronomy"));
	}
	
	//Merchant Level 1
	var bestMerchant = findBestLeader("merchant");
	//Make sure kitten is actually a merchant, not default return
	if (bestMerchant.trait.name == "merchant") {
		if (bestMerchant.rank >= 1 && !merchantLevelOne) {
			merchantLevelOne = true;
			timesheet.push(currentTime("Merchant Level 1"));
		}
	}
	
	//Geodesy
	if (game.workshop.upgrades[55].researched && !hasGeodesy) {
		hasGeodesy = true;
		timesheet.push(currentTime("Geodesy"));
	}
	
	//300 Ships
	if (game.resPool.resources[49].value >= 300 && !ships300) {
		ships300 = true;
		timesheet.push(currentTime("300 Ships"));
	}
	
	//First Lunar Outpost
	if (game.space.planets[1].buildings[0].val >= 1 && !outpost1) {
		outpost1 = true;
		timesheet.push(currentTime("Outpost #1"));
	}
	
	//Second Lunar Outpost
	if (game.space.planets[1].buildings[0].val >= 2 && !outpost2) {
		outpost2 = true;
		timesheet.push(currentTime("Outpost #2"));
	}
	
	//Third Lunar Outpost
	if (game.space.planets[1].buildings[0].val >= 3 && !outpost3) {
		outpost3 = true;
		timesheet.push(currentTime("Outpost #3"));
	}
	
	//Helios Launch
	if (game.space.programs[4].val == 1 && !heliosLaunched) {
		heliosLaunched = true;
		timesheet.push(currentTime("Helios Launched"));
	}
	
	//Master
	bestScholar = findBestWorker("scholar").skills["scholar"];
	bestHunter = findBestWorker("hunter").skills["hunter"];
	bestGeo = findBestWorker("geologist").skills["geologist"];
	let array = [bestScholar, bestHunter, bestGeo];
	
	if (Math.max(array) >= 9000) {
		master = true;
		masterInfo = currentTime("Master");
	}
	
}
	
//Repeats at regular intervals
function leadershipTick() {
	rankNotify();
	milestoneCheck();
	
}

//Initialize leadershipTick function to run every n milliseconds
setInterval(leadershipTick, 500);


function findBestWorker(jobName) {
		if(game.village.sim.kittens.length == 0) {
			return;
		}
		
		var currentBest = game.village.sim.kittens[0];
		
		for (var i = 0; i < game.village.sim.kittens.length; i++) {
			var thisKitten = game.village.sim.kittens[i];
			
			if (thisKitten.skills[jobName] > currentBest.skills[jobName]) {
				currentBest = thisKitten;
			}
			
		}
		
		return currentBest;
}

//Find and return best leader for given trait
function findBestLeader(traitName) {
	
	if (game.village.sim.kittens.length == 0) {
		return;
	}
	
	//Best kitten with the trait found so far.
	//Initializes to the first kitten in the game's internal list, which
	//probably won't actually have the correct trait.
	var currentBest = game.village.sim.kittens[0];
	
	for (var i = 0; i < game.village.sim.kittens.length; i++) {
		var thisKitten = game.village.sim.kittens[i];
		if(thisKitten.trait.name == traitName) {
			
			//choose who has higher rank, else use exp
			if (thisKitten.rank > currentBest.rank) {
				currentBest = thisKitten;
			} else if (thisKitten.rank == currentBest.rank && thisKitten.exp > currentBest.exp) {
				currentBest = thisKitten;
			}
		}
	}
	return currentBest;
}

//Given a trait, set the best kitten with that trait to be leader.
function setBestLeader(traitName) {
	
	var bestLeader = findBestLeader(traitName);
	
	//If someone else is the leader, unassigned them
	if (game.village.leader){
		game.village.leader.isLeader = false;
	}
	
	//Make this kitten know it's the leader
	bestLeader.isLeader = true;
	//Make the rest of the game know this kitten is the leader
	game.village.leader = bestLeader;
}

//Find kitten with the given job
function findJobKitten(jobName) {
	
	for (var i = 0; i < game.village.sim.kittens.length; i++) {
		var thisKitten = game.village.sim.kittens[i];
		
		if (thisKitten.job == jobName) {
			return thisKitten;
		}
	}
	
	return null; //No valid kitten found
}


// https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript 
//==============================
document.onkeydown = keydown; 

function keydown (evt) { 
	if (!evt) evt = event; //???
	
	//Easy Pawse/Unpawse
	if (evt.keyCode == 192) { //' or ~
		gamePage.togglePause();
	}
	
	//Easy Leader Rank Up
	if (evt.ctrlKey && evt.keyCode == 90) { //CTRL + Z, upgrade merchant
		var bestMerchant = findBestLeader("merchant");
		game.village.sim.promote(bestMerchant, bestMerchant.rank + 1);
		//promote function will not upgrade if exp or gold cost cannot be afforded
	}
	
	if (evt.ctrlKey && evt.keyCode == 88) { //CTRL + X, upgrade artisan/engineer
		var bestEngineer = findBestLeader("engineer");
		game.village.sim.promote(bestEngineer, bestEngineer.rank + 1);
	}
	
	if (evt.ctrlKey && evt.keyCode == 67) { //CTRL + C, upgrade metallurgist
		var bestMetallurgist = findBestLeader("metallurgist");
		game.village.sim.promote(bestMetallurgist, bestMetallurgist.rank + 1);
	}
	
	if (evt.ctrlKey && evt.keyCode == 86) { //CTRL + V,  upgrade chemist
		var bestChemist = findBestLeader("chemist");
		game.village.sim.promote(bestChemist, bestChemist.rank + 1);
	}
}

document.onkeyup = keyup;

function keyup (evt) {
	if (!evt) evt = event; //???
	
	//Easy Astronomical Events
	if (evt.keyCode == 83 && game.calendar.observeRemainingTime > 0) { //"s" key released and astronomical event active
		game.calendar.observeHandler();
	}
	
}

//==============================


//Listener to handle hotkeys
document.addEventListener('keydown', (e) => {
	//Easy Leader Swapping
	if (e.key == "z") { setBestLeader("merchant"); }
	if (e.key == "x") { setBestLeader("engineer"); } //artisan
	if (e.key == "c") { setBestLeader("metallurgist"); }
	if (e.key == "v") { setBestLeader("chemist"); }
	if (e.key == "b") { setBestLeader("manager"); }
	if (e.key == "n") { setBestLeader("scientist"); }
	if (e.key == "m") { setBestLeader("wise"); }
	
	
	//Easy Worker Assignment
	if (e.key == "q") { game.village.assignJob(game.village.getJob("woodcutter"), 1) ; }
	if (e.key == "w") { game.village.assignJob(game.village.getJob("farmer"), 1) ; }
	if (e.key == "e") { game.village.assignJob(game.village.getJob("scholar"), 1) ; }
	if (e.key == "r") { game.village.assignJob(game.village.getJob("hunter"), 1) ; }
	if (e.key == "t") { game.village.assignJob(game.village.getJob("miner"), 1) ; }
	if (e.key == "y") { game.village.assignJob(game.village.getJob("geologist"), 1) ; }
	
	//Quicksave
	if (e.key == "f") { game.save(); }
	
	
});

//Returns true if most skilled kitten in this trait has a rank up available
function rankAvailable(traitName) {
	var bestKitten = findBestLeader(traitName);
	if (bestKitten.exp >= game.village.getRankExp(bestKitten.rank)) { return true; }
	else { return false; }
}

//Adds appropriate notifiers to village tab header
function rankNotify() {
	//String that will become new tabname.
	var bonfireName = game.villageTab.tabName;
	
	let traits = ["merchant", "engineer", "metallurgist"]; //other traits not really important
	let notifyStrings = ["(MT)","(AN)", "(ML)"];
	
	for (var i = 0; i < traits.length; i++) {
		if (rankAvailable(traits[i])) {
			bonfireName += notifyStrings[i];
		}
	}
	
	//Only show (CM) after Chemist is usable
	if (game.science.techs[42].unlocked) { //oil processing
		if (rankAvailable("chemist")) {
			bonfireName += "(CM)";
		}
	}
	game.villageTab.domNode.innerHTML = bonfireName;
}

//Returns in game time as a string formatted year/season/day
//Input only affects what is logged to console, not return value.
function currentTime(reason) {
	var readableSeason = game.calendar.season + 1;
	
	var time = game.calendar.year.toString() + "/" 
	+ readableSeason.toString() + "/" 
	+ game.calendar.day.toString();
	
	var output = reason + " " + time;
	
	return output
}
	
//Initialize booleans used for milestoneCheck
var hasIronHoes = false;
var kittens50 = false;
var hasAstronomy = false;
var merchantLevelOne = false;
var hasGeodesy = false;
var ships300 = false;
var outpost1 = false;
var outpost2 = false;
var outpost3 = false;
var heliosLaunched = false;

var master = false;
var masterInfo = "";

//List used to store recorded times
var timesheet = [];

//Checks if several run-important milestones have been reached
//If they have, it marks the time they were achieved in console
function milestoneCheck() {
	//Iron Hoes
	if (game.workshop.upgrades[1].researched && !hasIronHoes) {
		hasIronHoes = true;
		timesheet.push(currentTime("Iron Hoes"));
	}
	
	//50 Kittens
	if (game.village.sim.kittens.length >= 50 && !kittens50) {
		kittens50 = true;
		timesheet.push(currentTime("50 Kittens"));
	}
	
	//Astronomy
	if (game.science.techs[17].researched && !hasAstronomy) {
		hasAstronomy = true;
		timesheet.push(currentTime("Astronomy"));
	}
	
	//Merchant Level 1
	var bestMerchant = findBestLeader("merchant");
	//Make sure kitten is actually a merchant, not default return
	if (bestMerchant.trait.name == "merchant") {
		if (bestMerchant.rank >= 1 && !merchantLevelOne) {
			merchantLevelOne = true;
			timesheet.push(currentTime("Merchant Level 1"));
		}
	}
	
	//Geodesy
	if (game.workshop.upgrades[55].researched && !hasGeodesy) {
		hasGeodesy = true;
		timesheet.push(currentTime("Geodesy"));
	}
	
	//300 Ships
	if (game.resPool.resources[49].value >= 300 && !ships300) {
		ships300 = true;
		timesheet.push(currentTime("300 Ships"));
	}
	
	//First Lunar Outpost
	if (game.space.planets[1].buildings[0].val >= 1 && !outpost1) {
		outpost1 = true;
		timesheet.push(currentTime("Outpost #1"));
	}
	
	//Second Lunar Outpost
	if (game.space.planets[1].buildings[0].val >= 2 && !outpost2) {
		outpost2 = true;
		timesheet.push(currentTime("Outpost #2"));
	}
	
	//Third Lunar Outpost
	if (game.space.planets[1].buildings[0].val >= 3 && !outpost3) {
		outpost3 = true;
		timesheet.push(currentTime("Outpost #3"));
	}
	
	//Helios Launch
	if (game.space.programs[4].val == 1 && !heliosLaunched) {
		heliosLaunched = true;
		timesheet.push(currentTime("Helios Launched"));
	}
	
	//Master
	bestScholar = findBestWorker("scholar").skills["scholar"];
	bestHunter = findBestWorker("hunter").skills["hunter"];
	bestGeo = findBestWorker("geologist").skills["geologist"];
	let array = [bestScholar, bestHunter, bestGeo];
	
	if (Math.max(array) >= 9000) {
		master = true;
		masterInfo = currentTime("Master");
	}
	
}
	
//Repeats at regular intervals
function leadershipTick() {
	rankNotify();
	milestoneCheck();
	
}
