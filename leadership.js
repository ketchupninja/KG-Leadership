console.log("Leadership v1.21 initialized");

function setBestLeader(traitName) {
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
	//If someone else is the leader, unassigned them
	if (game.village.leader){
		game.village.leader.isLeader = false;
	}
	//Make this kitten know it's the leader
	currentBest.isLeader = true;
	//Make the rest of the game know this kitten is the leader
	game.village.leader = currentBest;
}

document.addEventListener('keydown', (e) => {
	//Easy Leader Swapping
	if (e.key == "z") { setBestLeader("merchant"); }
	if (e.key == "x") { setBestLeader("engineer"); }
	if (e.key == "c") { setBestLeader("metallurgist"); }
	if (e.key == "v") { setBestLeader("chemist"); }
	if (e.key == "b") { setBestLeader("manager"); }
	if (e.key == "n") { setBestLeader("scientist"); }
	if (e.key == "m") { setBestLeader("wise"); }
});

document.addEventListener('keypress', (e) => {
	//Easy Astronomical Events
	if (e.key == "s" && game.calendar.observeRemainingTime > 0) { game.calendar.observeHandler(); }
});


