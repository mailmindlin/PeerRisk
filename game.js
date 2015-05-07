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
var GameClient=Client.extend({
	closed:false,
	init:function(data) {
		this.data=data;
		this._super(this.name,connectionName);
		this.name=vsel(data.server.name,window.location.hashargs['roomid'],undefined);
		this.player=new Player(data.player,null,randcolor());
// 		this.connection.onclose=this.dispatcherFor('close',function(type,event,userid){return new xEvent({type:type,source:event,uid:userid});});
		this.defaults['userleft']=this.defaults['close']=printmeWith('closed');
		this.defaults['open']=function(e){	
			console.log('opened!',e);
		};
		this.defaults['message']=withScope(this.onmessage,this);
	},
	destroy:function() {
		var chnl=this.channel;
		if(chnl) {
			chnl.onleave=undefined;
			chnl.ondatachannel=chnl.onmessage=chnl.onopen=function(){chnl.leave();};
		}
		try {
			chnl.leave();
		}catch(e){}
		this.closed=true;
		delete this.eventListeners;
		delete this.defaults;
		delete this.channel;
	},
	join: function(waittime,delay){
		window.location.setHashArg('roomid',this.name);
		this.uid=Math.round(this.name.hashCode()+Math.secureRandom());
		console.log('Connecting to game '+this.name);
		try{
			this.channel.join(''+this.name);
		}catch(e){}
		var self=this;
		return new Promise(function(resolve,reject) {
			var rnd=Math.round(Math.random()*10000);
			if(self.channel.joinedARoom)
				resolve();
			var fcbid;
			if(waittime>-1)
				//setup to fail in waittime ms
				fcbid=setTimeout(function(){
					//remove event listener
					self.removeListener('datachannel','jpl'+rnd);
					console.log('Failure.');
					if(isset(reject))
						reject(waittime);
				},waittime);
			self.addListener('datachannel',function(e){
				if(fcbid)
					window.clearTimeout(fcbid);
				else
					console.log('no fcbid');
				self.removeListener('datachannel','jpl'+rnd);
				console.log('Success!',e);
				self.channel.join(e.source[0]);
				console.log('Joined!',e.source[0]);
				resolve(e);
			},'jpl'+rnd);
		});
	},
	onmessage: function(e) {
		var msg=e.source[0],uid=e.source[1],latency=e.source[2];
		var obj=JSON.parse(msg);
		obj.uid=uid;
		console.log(msg,obj);
		if(obj.action=='ping')
			this.channel.channels[uid].send(JSON.stringify({action:'pong',msg:'pong!',src:'client'}));
		else if(obj.action=='pong')
			this.triggerEvent({cancellable:false,type:'pong',message:msg,uid:uid,obj:obj});
	},
	ping: function() {
		console.log('Pinging');
		this.channel.send(JSON.stringify({action:'ping'}));
		console.log('done?');
	},
	login: function() {
		if(!isset(this.connection))
			this.join();
		console.log('Logging in...');
		this.connection.send(JSON.stringify({action:'login',svpassword:this.data.server.password,password:this.player.password,name:this.player.name,color:this.player.color}));
		console.log('Done.');
	}
});