function GameServer(name,password,state) {
	this.name=name;
	this.password=password;
	this.state=state||{};
	if(typeof state === 'undefined')
		this.init();
}
GameServer.prototype.init=function() {
	
};
GameServer.prototype.save=function() {
	localStorage['gameserver:'+this.name]=JSON.stringify({name:this.name,password:this.password,state:this.state});
};
GameServer.available=function() {
	var result=[];
	var key;
	for(var i=0;(key=localStorage.key(i))!=null;++i)
		if(key.startsWith('gameserver:'))
			result.push(key.substr(11));
	return result;
};
GameServer.load=function(name) {
	var data=JSON.parse(localStorage['gameserver:'+name]);
	delete localStorage['gameserver:'+name];
	return new GameServer(data.name,data.password,data.state);
};