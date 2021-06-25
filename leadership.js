//Javascript addon for the web-game Kittensgame, designed to make
//provide keyboard shortcuts for common actions and make
//more information available to the player. 

console.log("Leadership v1.603 test initalized");
//v1.60X test
//Timesheet now includes counts of buildings at some milestones
//e.g. observatories, magnetos, steamworks

//Milestones reworked internally


//Initialize leadershipTick function to run every n milliseconds
setInterval(leadershipTick, 500);

//Returns worker that is best at given job
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
			
			//choose who has higher rank, else choose highest exp
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
//Handle hotkey presses
function keydown (evt) { 
	if (!evt) evt = event; 
	
	//Easy Pause/Unpause
	if (evt.keyCode == 192) { // ' or ~
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
	
	//Easy Leader Swapping
	if (evt.keyCode == 90) { setBestLeader("merchant"); } //z
	if (evt.keyCode == 88) { setBestLeader("engineer"); } //x, artisan
	if (evt.keyCode == 67) { setBestLeader("metallurgist"); } //c
	if (evt.keyCode == 86) { setBestLeader("chemist"); } //v
	
	
	//Easy Worker Assignment
	let workerAssignButtons = [81, 87, 69, 82, 84, 89]; //q, w, e, r, t, y
	
	//PATCH: STRANGE ACCELERATED BEHAVIOR WHEN HOLDING ASSIGN BUTTONS
	//attempted fix
	freeKitten = game.village.hasFreeKittens(1);
	
	if (freeKitten) {
		if (evt.keyCode == 81 && game.village.jobs[0].unlocked) { game.village.assignJob(game.village.getJob("woodcutter"), 1) ; } //q
		if (evt.keyCode == 87 && game.village.jobs[1].unlocked) { game.village.assignJob(game.village.getJob("farmer"),     1) ; } //w
		if (evt.keyCode == 69 && game.village.jobs[2].unlocked) { game.village.assignJob(game.village.getJob("scholar"),    1) ; } //e
		if (evt.keyCode == 82 && game.village.jobs[3].unlocked) { game.village.assignJob(game.village.getJob("hunter"),     1) ; } //r
		if (evt.keyCode == 84 && game.village.jobs[4].unlocked) { game.village.assignJob(game.village.getJob("miner"),      1) ; } //t
		if (evt.keyCode == 89 && game.village.jobs[6].unlocked) { game.village.assignJob(game.village.getJob("geologist"),  1) ; } //y
	}
	
	//Re-render village name on remote worker assign to accurately display unemployed kitten total
	if (workerAssignButtons.includes(e.key)) {
		game.render();
	}
	//Quicksave
	if (evt.keyCode == 70) { game.save(); } //f
	
}

document.onkeyup = keyup;

//Key Release 
function keyup (evt) {
	if (!evt) evt = event; 
	
	//Easy Astronomical Events
	if (evt.keyCode == 83 && game.calendar.observeRemainingTime > 0) { //"s" key released and astronomical event active
		game.calendar.observeHandler();
	}
	
}


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



class Milestone {
	

	
	constructor(label, condition, ids, outpost) {
		this.label = label;
		this.condition = condition;
		
		if (ids === undefined) {
			this.btr = [];
		} else {
			this.btr = ids; //list of building IDs of buildings to report
			//7 academy, 8 obs, 17 SW, 18 mag, 22 factory
		}
		
		this.fulfilled = false; 
		this.recorded = false;
		
		if (outpost === undefined) {
			this.outpost = false; //whether to report lunar outpost count 
		} else {
			this.outpost = true;
		}
	
		Milestone.allMilestones.push(this);
	}
	
		
	//Write down current game time , label, and any needed building counts to 'timesheet'
	record() {
		if (!this.recorded) {
			var readableSeason = game.calendar.season + 1;
			
			var time = game.calendar.year.toString() + "/" 
						+ readableSeason.toString() + "/" 
						+ game.calendar.day.toString();
						
			ret = this.label + " " + time
			
			
			for (id in btr) {
				ret += " with " + game.bld.buildingsData[id].val + " " + game.bld.buildingsData[id].name;
			}
			
			if (this.outpost) { ret += " with " + game.space.planets[1].buildings[0].val; }
			
			Milestone.timesheet.push(ret);
			this.recorded = true;
		}
	}
	
	//Check if condition has been fulfilled
	checkCND() {
		if (condition) { this.fulfilled = true; }
	}
	
	isFulfilled() {
		return this.fulfilled;
	}
	
}

//Milestone class has static list Timesheet (?)
Milestone.timesheet = [];
	
//List of unfulfilled milestones
Milestone.allMilestones = [];
	
//Also includes a building counts

//Initialize booleans used for milestoneCheck
//var hasIronHoes = false;

const ironHoes = new Milestone("Iron Hoes", () => (game.workshop.upgrades[1].researched) );
const kittens50 = new Milestone("50 Kittens", () => (game.village.sim.kittens.length >= 50) );
const astro = new Milestone("Astronomy", () => (game.science.techs[17].researched) );






/*
var hasAstronomy = false;
var acad130 = false;
var merchantLevelOne = false;

var hasSETI = false;
var hasGeodesy = false;

var outpost1 = false;
var aphys = false;

var cryo = false;


var orbitalLaunch = false;
var moonMission = false;

var master = false; */



var skillArray = [];


//Checks if several run-important milestones have been reached
//If they have, it marks the time they were achieved in console
function milestoneCheck() {
	
	for (ms in Milestone.allMilestones) {
		console.log(ms); //is ms actually a milestone???
		ms.checkCND();
		
		if (ms.isFulfilled) { 
			ms.record();
		}
	}
	
	/*
	//130 Academies
	if (game.bld.buildingsData[7].val >= 130 && !acad130) {
		acad130 = true;
		timesheet.push(currentTime("130 Academies"));
	}
	
	//Merchant Level 1
	var bestMerchant = findBestLeader("merchant");
	//Make sure kitten is actually a merchant, not default return
	if (bestMerchant.trait.name == "merchant") {
		if (bestMerchant.rank >= 1 && !merchantLevelOne) {
			merchantLevelOne = true;
			timesheet.push(currentTime("Merchant Level 1") + "academy count");
		}
	}
	
	//Geodesy
	if (game.workshop.upgrades[55].researched && !hasGeodesy) {
		hasGeodesy = true;
		timesheet.push(currentTime("Geodesy") + "SW count" + "mag count" + "Obs count");
	}
	
	


	//SETI
	
	if (game.workshop.upgrades[110].researched && !hasSETI) {
		hasSETI = true;
		timesheet.push(currentTime("SETI") + "obs count")
	}
	
	//Orbital Launch
	
	if (game.space.planets[0].unlocked && !orbitalLaunch) {
		orbitalLaunch = true;
		timesheet.push(currentTime("Orbital Launch") + "obs count");
	}
	
	//Moon mission
	
	if (game.space.planets[1].unlocked && !moonMission) {
		moonMission = true;
		timesheet.push(currentTime("Moon Mission") + "obs count");
	}
	
	//First Lunar Outpost
	if (game.space.planets[1].buildings[0].val >= 1 && !outpost1) {
		outpost1 = true;
		timesheet.push(currentTime("Outpost #1"));
	}
	
	//Astrophysicists
	if (game.workshop.upgrades[123].researched && !aphys) {
		aphys = true;
		timesheet.push(currentTime("Astrophysicists") + "Obs count");
	}
	
	//Cryochamber
	
	if (game.time.voidspaceUpgrades[0].val >= 1 && !cryo) {
		cryo = true;
		timesheet.push(currentTime("Cryochamber") +  "lunar count" + "factory count");
	}
	
	
	//Master
	
	//empty skillArray
	skillArray.splice(0, skillArray.length);
	//fill it
	skillArray.push(findBestWorker("scholar").skills["scholar"]);
	skillArray.push(findBestWorker("hunter").skills["hunter"]);
	skillArray.push(findBestWorker("geologist").skills["geologist"]);
	
	//Check for master EXP
	if (Math.max.apply(Math, skillArray) >= 9000) {
		master = true;
		timesheet.push(currentTime("Master"));
	}
	
	*/
}

//Repeats at regular intervals
function leadershipTick() {
	rankNotify();
	milestoneCheck();
	
}