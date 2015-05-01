//REQOBJ 'MultiServer'
/* Copyright (C) Liam Feehery - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Liam Feehery <wfeehery17@archmereacademy.com>, April 2015
 * "Because Copyright"-Liam
 */
var connectionName='risk01';//"risk01-kM5Kzu0AIKmZ74WzrGh7LJ5=+0islyys-je1RGYD07GIp95YjU8nR=W45iOvwmQlG";
var GameServer=MultiServer.extend(
function GameServer(name,password,state,rules) {
	this.name=vsel(name,window.location.hashargs['roomid'],'GAME_'+Math.round(Math.abs(Math.secureRandom(10000))));
	GameEngine.apply(this);
}
GameServer.prototype.init=function() {
	xEventSource.apply(this);
	var self=this;
	this.entry=new DataConnection(connectionName);
	this.entry.onopen=this.dispatcherFor('entryopen');
	this.entry.onmessage=function(msg,uid) {
		var obj=JSON.parse(msg);
		obj.uid=uid;
		console.log(msg,obj);
		if(obj.action=='login')
			self.attemptLogin(obj);
		if(obj.action=='ping')
			self.connection.channels[uid].send(JSON.stringify({action:'pong',msg:'pong!'}));
	};
	this.connection.onclose=printme;
};
GameServer.prototype.ping=function() {
	this.connection.send(JSON.stringify({action:'ping'}));
};
GameServer.prototype.open=function() {
	//update hash
	var ha=window.location.hashargs;
	window.location.setHashArg('roomid',this.name);
	this.connection.setup(''+this.name);
};
GameServer.prototype.join=function() {
	this.connection.join(''+this.name);
};
GameServer.prototype.getPlayerByUID=function(uid) {
	for(var i=0;i<this.state.players.length;++i)
		if(this.state.players[i].uid==uid)
			return this.state.players[i];
};
GameServer.prototype.attemptLogin=function(pdata) {
	if(this.password!=null)
		if(pdata.svpassword!=this.password) {
			this.connection.channels[pdata.uid].send(JSON.stringify({result:'error',msg:'Incorrect server password',code:-1}));
			return false;
		}
	var player=this.engine.getPlayerByName(pdata.name);//get stored player
	//check player password
	if(isset(player) && player.password!=null)
		if(pdata.password!=player.password) {
			this.connection.channels[pdata.uid].send(JSON.stringify({result:'error',msg:'Incorrect password',code:-2}));
			return false;
		}
	//create player if not exist
	if(!isset(player))
		this.state.players.push(player=new Player(pdata));
	player.uid=pdata.uid;
	player.available=true;
	console.log('New player joined:'+pdata.name+' (uid:'+pdata.uid+')');
	this.connection.channels[pdata.uid].send(JSON.stringify({
		result:'success',
		msg:'Successfully logged in.',
		code:0,
		map:{name:this.state.map.name,resourceid:null}}));
	return true;
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