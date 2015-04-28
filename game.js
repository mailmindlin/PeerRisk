
function Game(map,rules) {
	this.map=map;
	this.ownership={};
	this.rules=rules||{};
	this.players={};
	this.currentPlayer=null;
}
Game.prototype.isValidMove=function(move) {
	if(move.playerName!=this.currentPlayer.name)
		return false;
	if(move.type=='DEPLOY') {
	} else if(move.type=='ATTACK') {
	
	}else if(move.type=='MOVE') {
	
	}else{
		return false;
	}
	return true;
};