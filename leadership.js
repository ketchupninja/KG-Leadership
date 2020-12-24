console.log("Leadership initialized");

function setBestLeader(traitName) {
	var currentBest = game.village.sim.kittens[0];
	
	for (var i = 0; i < game.village.sim.kittens.length; i++) {
		var thisKitten = game.village.sim.kittens[i];
		if(thisKitten.trait.name == traitName) {
			
			//choose who has more realExp
			var realExpCurrent = currentBest.exp + calcSpentExp(currentBest.rank);
			var realExpThis = thisKitten.exp + calcSpentExp(thisKitten.rank);
			
			if (realExpThis > realExpCurrent) {
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


function calcSpentExp(rank) {
	if (rank <= 0) {
		return 0;
	} else {
		var thisRankCost = 500*Math.pow(1.75, rank - 1);
		return (thisRankCost + calcSpentExp(rank - 1));
	}
}

document.addEventListener('keydown', (e) => {
	if (e.key == "z") {
		setBestLeader("merchant");
	}
	if (e.key == "x") {
		setBestLeader("artisan");
	}
	if (e.key == "c") {
		setBestLeader("metallurgist");
	}
	if (e.key == "v") {
		setBestLeader("chemist");
	}
	if (e.key == "b") {
		setBestLeader("manager");
	}
	if (e.key == "n") {
		setBestLeader("scientist");
	}
});



