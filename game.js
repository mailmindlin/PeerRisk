/* Copyright (C) Liam Feehery - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Liam Feehery <wfeehery17@archmereacademy.com>, April 2015
 * "Because Copyright"-Liam
 * Game client, with rendering and stuff
 */
function Game(map,rules,engine) {
	this.map=vsel(map,gm);
	this.rules=vsel(rules,{unclaimedDefense:0,singleplayer:true});
	this.engine=vsel(engine,new GameEngine(this.map,this.rules));
	this.selectedTerritory=null;
}
Game.prototype.init=function() {
	this.engine.init();
};
Game.prototype.onClick=function(e) {
	this.selectedTerritory=e.territory;
};
Game.prototype.render=function(context) {
	try {
		this.map.render(context);
	}catch(e) {
		console.error(e);
	}
};
function GameClient(data) {
	xEventSource.apply(this);
	this.data=data;
	this.name=vsel(data.server.name,window.location.hashargs['roomid'],undefined);
	this.player=new Player(data.player);

	this.connection=new DataConnection(connectionName);
	this.connection.onopen=this.dispatcherFor('open');
	this.connection.onmessage=withScope(this.onmessage,this);
	this.connection.onuserleft=this.dispatcherFor('userleft');
	this.connection.onclose=this.dispatcherFor('close',function(type,event,userid){return new xEvent({type:type,source:event,uid:userid});});
	this.defaults['userleft']=this.defaults['close']=printme;
	this.defaults['open']=function(e){
		
	};
}
GameClient.prototype=Object.create(xEventSource.prototype);
GameClient.prototype.join=function(waittime,delay){
	window.location.setHashArg('roomid',this.name);
	this.uid=Math.round(this.name.hashCode()+Math.secureRandom());
	console.log('Connecting to game '+this.name);
	try{
		this.connection.join(''+this.name);
	}catch(e){}	
	var self=this;
	return new Promise(function(resolve,reject) {
		var rnd=Math.round(Math.random()*10000);
		if(self.connection.detectedRoom)
			resolve();
		if(waittime>-1)
			//setup to fail in waittime ms
			fcbid=setTimeout(function(){
				//remove event listener
				self.removeListener('open','jpl'+rnd);
				console.log('Failure.');
				if(isset(reject))
					reject(waittime);
			},waittime);
		self.addListener('onopen',function(e){
			if(fcbid)
				window.clearTimeout(fcbid);
			self.removeListener('open','jpl'+rnd);
			console.log('Success!');
			resolve(e);
		},'jpl'+rnd);
	});
};
GameClient.prototype.onmessage=function(msg,uid) {
	var obj=JSON.parse(msg);
	obj.uid=uid;
	console.log(msg,obj);
	if(obj.action=='ping')
		this.connection.channels[uid].send(JSON.stringify({action:'pong',msg:'pong!',src:'client'}));
	else if(obj.action=='pong')
		this.triggerEvent({cancellable:false,type:'pong',message:msg,uid:uid,obj:obj});
};
GameClient.prototype.ping=function() {
	console.log('Pinging');
	this.connection.send(JSON.stringify({action:'ping'}));
};
GameClient.prototype.login=function() {
	if(!isset(this.connection))
		this.join();
	console.log('Logging in...');
	this.connection.send(JSON.stringify({action:'login',svpassword:this.data.server.password,password:this.player.password,name:this.player.name,color:this.player.color}));
	console.log('Done.');
};