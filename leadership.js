console.log("Leadership v1.3 initialized");

//Initialize update function to run every n milliseconds
setInterval(update, 500);

//Find and return best leader for given trait
function findBestLeader(traitName) {
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

// https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript 
//==============================
document.onkeydown = keydown; 

function keydown (evt) { 
	if (!evt) evt = event; //???
	
	//Easy Pawse/Unpawse
	if (evt.keyCode == 32) { //Space
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
	if (evt.keyCode == 83 && game.calendar.observeRemainingTime > 0) { //"s" key
		game.calendar.observeHandler();
	}
	if (evt.keyCode == 83) {
		gamePage.togglePause();
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
});

//Returns true if most skilled kitten in this trait has a rank up available
function rankAvailable(traitName) {
	var bestKitten = findBestLeader(traitName);
	if (bestKitten.exp >= game.village.getRankExp(bestKitten.rank)) { return true; }
	else { return false; }
}

//Adds appropriate notifiers to village tab header
function rankNotify() {
	var bonfireName = game.villageTab.tabName;
	
	let traits = ["merchant", "engineer", "metallurgist", "chemist"]; //other traits not really important
	let notifyStrings = ["(MT)","(AN)", "(ML)", "(CM)"];
	
	for (var i = 0; i < traits.length; i++) {
		if (rankAvailable(traits[i])) {
			bonfireName += notifyStrings[i];
		}
	}
	game.villageTab.domNode.innerHTML = bonfireName;
}

function update() {
	rankNotify();
}
