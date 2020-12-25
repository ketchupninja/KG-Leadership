console.log("Leadership v1.2 initialized");

function setBestLeader(traitName) {
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

	if (game.village.leader){
		game.village.leader.isLeader = false;
	}
		
	currentBest.isLeader = true;
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
	
	//Easy Astronomical Events
	if (e.key == "s" && game.calendar.observeRemainingTime > 0) { game.calendar.observeHandler(); }
});



