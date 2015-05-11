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
//REQUIRES: Socket {}
var MultiServer=xEventSource.extend({
	connections:[],
	config:{'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]},
	sdpConstraints: {optional: [],mandatory:{OfferToReceiveAudio: true,OfferToReceiveVideo: true}},
	init:function(options){
		if(!options)
			throw new Error('Options required');
		this._super();
		this.signaler=options.signaler;
		this.connection=options.connection || new RTCPeerConnection(this.config);
	},
	offer:function() {
		var self=this;
		this.connection.createOffer(function (offerSDP) {
    		self.connection.setLocalDescription(new RTCSessionDescription(offerSDP),printmeWith('Yay!'),printmeWith('Oh.'));
			console.log('offer sdp', offerSDP.sdp);
			console.log('type',      offerSDP.type);
			console.log(offerSDP);
		},printme,this.sdpConstraints);
	}
});
var Client=xEventSource.extend({
	discovered:[],
	isConnected:false,
	init: function(){
		this.sdpConstraints = {optional: [],mandatory:{OfferToReceiveAudio: true,OfferToReceiveVideo: true}};
		this.config = {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]};
		this.connection=new RTCPeerConnection(this.config);
	},
	respond:function(offer) {
// 		this.connection = new RTCSessionDescription(offer);
		var self=this;
		this.remoteDescription = new RTCSessionDescription(offer);
        this.connection.setRemoteDescription(this.remoteDescription,withScope(function(){
        	console.log('foo');
        	self.connection.createAnswer(function(answer) {
				self.connection.setLocalDescription(answer);
				console.log('offer sdp', answer.sdp);
				console.log('type',      answer.type);
			}, printme, self.sdpConstraints);
        },this),function(e){console.error('problem:',e)});
	}
});

