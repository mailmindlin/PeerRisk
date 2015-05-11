var Player = Class.extend({
	init:function() {
		if(arguments.length==1) {
			this.name=arguments[0].name;
			this.password=vsel(arguments[0].password,null);
			this.color=vsel(arguments[0].color,'green');
		} else {
			this.name=arguments[0];
			this.password=vsel(arguments[1],null);
			this.color=vsel(arguments[2],'#'+Math.round(Math.abs(Math.random()*0xFFFFFF)).toString(16));
		}
		this.available=true;
	},
	get serialized() {
		return {name:this.name,password:this.password,color:this.color};
	}
});
var GameEngineState=function(){}
GameEngineState.map=gapi.drive.realtime.custom.collaborativeField('map');
GameEngineState.ownership=gapi.drive.realtime.custom.collaborativeField('ownership');
GameEngineState.server=gapi.drive.realtime.custom.collaborativeField('server');
GameEngineState.inEventQueue=gapi.drive.realtime.custom.collaborativeField('inEventQueue');
GameEngineState.outEventQueue=gapi.drive.realtime.custom.collaborativeField('outEventQueue');
var GameEngine=xEventSource.extend({
	init: function(data) {
		this.__defineGetter__('map',function(){return data.map});
		this.__defineGetter__('rules',function(){return data.rules});
		this.__defineGetter__('data',function(){return data.ngnstate});
		this.data.ownership=vsel(this.data.ownership,{});
		this.data.currentPlayer=null;
		this.data.moves=[];
		this.state={initialized:false,running:false,currentPlayer:-1,get players(){data.players}};
	}
});
GameEngine.prototype.addPlayer=function(player) {
	if(!this.state.running)
		this.state.players.push(player);
	else
		return false;
	return true;
};
GameEngine.prototype.init=function(){
	for(var i=0;i<this.map.continents.length;++i)
		for(var j=0;j<this.map.continents[i].children.length;++j)
			this.data.ownership[this.map.continents[i].children[j].id]={owner:null,armies:this.rules.unclaimedDefense};
	this.state.initialized=true;
};
GameEngine.prototype.randomInt=function(min,max) {
	return Math.round(Math.abs(Math.secureRandom(max-min))-min);
};
GameEngine.prototype.start=function() {
	this.state.running=true;
	this.data.currentPlayer=this.randomInt(0,this.state.players.length);
};
GameEngine.prototype.onPlayerMove=function(move) {
	//check validity
	if(move.playername!=this.state.players[this.state.currentPlayer].name)
		return {result:'error',msg:'Not your turn',code:-100};
	if(move.action=='DEPLOY') {
		
	}
};
GameEngine.prototype.getPlayerByName=function(name) {
	for(var i=0;i<this.state.players.length;++i)
		if(this.state.players[i].name==name)
			return this.state.players[i];
};