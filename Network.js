// var stunServerList=[
// 	'stun://stun.l.google.com:19302',
// 	'stun://stun1.l.google.com:19302',
// 	'stun://stun2.l.google.com:19302',
// 	'stun://stun3.l.google.com:19302',
// 	'stun://stun4.l.google.com:19302',
// 	'stun://stun01.sipphone.com',
// 	'stun://stun.ekiga.net',
// 	'stun://stun.fwdnet.net',
// 	'stun://stun.ideasip.com',
// 	'stun://stun.iptel.org',
// 	'stun://stun.rixtelecom.se',
// 	'stun://stun.schlund.de',
// 	'stun://stunserver.org',
// 	'stun://stun.softjoys.com',
// 	'stun://stun.voiparound.com',
// 	'stun://stun.voipbuster.com',
// 	'stun://stun.voipstunt.com',
// 	'stun://stun.voxgratia.org',
// 	'stun://stun.xten.com'
// ];
var connectionName='risk02';//"risk01-kM5Kzu0AIKmZ74WzrGh7LJ5=+0islyys-je1RGYD07GIp95YjU8nR=W45iOvwmQlG";
var MultiServer=xEventSource.extend({
	channelname: 'foo',
	userid: 'helloworld',
	resources:[],
	init:function(name,connection){
		this._super();
		if(!DataChannel)
			throw "Include \"//cdn.webrtc-experiment.com/DataChannel.js\".";
		this.name=name;
		this.connection=vsel(connection,connectionName);
		this.channel=new DataChannel(this.connection);
		this.channel.userid=name;
		this.channel.ondatachannel=this.dispatcherFor('datachannel');
		this.channel.onmessage=this.dispatcherFor('message');
		this.channel.onopen=this.dispatcherFor('open');
		this.channel.onleave=this.dispatcherFor('leave');
		this.defaults['datachannel']=function(e) {
			this.channel.join(e.source[0]);
		}//printmeWith('datachannel');//function(e){this.channel.join(e.source[0]);};
		this.defaults['message']=printmeWith('msg');
		this.defaults['open']=this.onopen;
	},
	openChannel: function() {
// 		this.channel.open(this.connection,{userid:this.name});
		this.channel.userid=this.name;
		this.channel.connect(this.connection);
	},
	onopen: function(e) {
		console.log(e);
		for(var i=0;i<this.resources.length;++i) {
			var resource=this.resources[i];
			this.channel.send((typeof resource === 'string')?resource:((resource.serialized)?resource.serialized:JSON.stringify(resource)));
		}
	},
	connect: function(name) {
		this.channel.connect(name);
	}
});
var Client=xEventSource.extend({
	discovered:[],
	isConnected:false,
	init: function(name,server,connection){
		if(!DataChannel)
			throw "Include \"//cdn.webrtc-experiment.com/DataChannel.js\".";
		this._super();
		this.name=name;
		this.server=server;
		this.connection=vsel(connection,connectionName);
		this.channel=new DataChannel(this.connection);
		this.channel.ondatachannel=this.dispatcherFor('datachannel');
		this.channel.onmessage=this.dispatcherFor('message');
		this.channel.onopen=this.dispatcherFor('open');
		this.channel.onleave=this.dispatcherFor('leave');
		this.addListener('datachannel',this.datachannel);
	},
	connect:function() {
		this.channel.connect(this.name);
	},
	datachannel:function(e) {
		var data=e.source[0];
		if(data.id==this.connection && data.owner==this.name) {
			this.channel.join(data);
			this.isConnected=true;
		}
	}
});

