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
var MultiServer=xEventSource.extend({
	channelname: 'foo',
	userid: 'helloworld',
	init:function(){
		this._super();
		if(!DataChannel)
			throw "Include \"//cdn.webrtc-experiment.com/DataChannel.js\".";
		this.channel=new DataChannel(this.channelname,{userid:this.userid});
		this.channel.ondatachannel=this.dispatcherFor('datachannel');
		this.channel.onmessage=this.dispatcherFor('message');
		this.channel.onopen=this.dispatcherFor('open');
		this.channel.onleave=this.dispatcherFor('leave');
		this.defaults['datachannel']=printmeWith('datachannel');//function(e){this.channel.join(e.source[0]);};
	},
	openChannel: function(name) {
		this.channel.open(name);
	},
	connect: function(name) {
		this.channel.connect(name);
	}
});
var Client=xEventSource.extend({
	init: function(name){
		if(!DataChannel)
			throw "Include \"//cdn.webrtc-experiment.com/DataChannel.js\".";
		xEventSource.apply(this);
		this.name=name;
		this.channel=new DataChannel('foo');
		this.channel.ondatachannel=this.dispatcherFor('datachannel');
		this.channel.onmessage=this.dispatcherFor('message');
		this.channel.onopen=this.dispatcherFor('open');
		this.channel.onleave=this.dispatcherFor('leave');
	}
});

