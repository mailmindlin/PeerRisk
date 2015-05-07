/* Copyright (C) Liam Feehery - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Liam Feehery <wfeehery17@archmereacademy.com>, April 2015
 * "Because Copyright"-Liam
 */
//some nice functions
function isset(a){return typeof a!=='undefined';}
window.vsel=function(){for(var i=0;i<arguments.length;++i)if(isset(arguments[i]))return arguments[i];};//return the first argument not undefined
function printme(){console.log(arguments)}
function printmeWith(text){return function(){console.log([text].concat(arguments))}}
function withScope(callback,scope){return function(){callback.apply(scope,arguments)}}
function pad(n, width, z) {z = z || '0';n = n + '';return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;}
function randcolor() {return '#'+pad(Math.floor(Math.random()*16777216).toString(16),6)}

// if(!String.prototype.includes)Object.defineProperty(String.prototype,'includes',{value:function(searchString,position){return this.indexOf(searchString,position)>-1;}});//polyfill (Chrome<41, Firefox<40, IE, Opera, Safari)
//thanks to http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
Object.defineProperty(String.prototype,'hashCode',{value:function(){var hash=0,i,chr,len;if(this.length==0)return hash;for(i=0,len=this.length;i<len;++i){chr=this.charCodeAt(i);hash=((hash<<5)-hash)+chr;hash|=0;}return hash;}});
Object.defineProperty(Math,'secureRandom',{value:function(mod){var b=new ArrayBuffer(8);var buf=new Uint8Array(b);var f=new Float32Array(b);window.crypto.getRandomValues(buf);var result=f[0];return isset(mod)?result%mod:result;}});
Object.defineProperty(Object,'size',{value:function(obj) {var size=0,key;for(key in obj)if(obj.hasOwnProperty(key))++size;return size;}});//size of object
Object.defineProperty(Array.prototype,'find',{value:Array.prototype.find || function(callback,thisArg){for(i=0;i<this.length;++i)if(callback.apply(vsel(thisArg,callback),[this[i],i,this]))return this[i];}});
Object.defineProperty(Array.prototype,'invert',{value:Array.prototype.invert || function (a){for(var i=0;i<=a.length/2;++i) {var x=a[i];a[i]=a[a.length-i-1];a[a.length-i]=x;}}});

//Fullscreen prefix fixer
Element.prototype.requestFullscreen = Element.prototype.requestFullscreen || Element.prototype.msRequestFullscreen || Element.prototype.webkitRequestFullscreen || Element.prototype.mozRequestFullscreen || function(){};
document.exitFullscreen=document.exitFullscreen || document.msExitFullscreen || document.webkitExitFullscreen || document.mozExitFullscreen || function(){};
window.requestAnimationFrame= window.requestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(c){window.setTimeout(c, 1000 / 60);};
if(!isset(document.fullscreenElement)) {
	if(isset(document.webkitFullscreenElement))
		document.__defineGetter__('fullscreenElement',function(){return document.webkitFullscreenElement;});
	else if(isset(document.mozFullscreenElement))
		document.__defineGetter__('fullscreenElement',function(){return document.mozFullscreenElement;});
	else
		document.fullscreenElement=null;
}

//webRTC prefix fixer
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCSessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
window.RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || null;
window.URL = window.URL || window.webkitURL;
window.isFirefox = !!navigator.mozGetUserMedia;
window.isChrome = !!navigator.webkitGetUserMedia;

//OS stuff (for commands)
a=navigator.appVersion;
window['os']=(a.includes('Win')&&'Windows')||(a.includes('Mac')&&'Mac')||(a.includes('X11')&&'UNIX')||(a.includes('Linux')&&'Linux')||'Unknown';
window['cmd']=(os=='Mac')?{ctrl:'⌘', shift:'⇧', meta:'⌥', alt:'⌃', caps:'⇪', fn:'Fn'}:{ctrl:'CTRL',shift:'SHIFT',meta:'WIN',alt:'ALT',caps:'Caps Lock'};
window['cmdchr']=(os=='Mac')?{16:'shift',17:'meta',18:'alt',91:'ctrl',93:'ctrl'}:{16:'shift',17:'ctrl',18:'alt',91:'meta',92:'meta'};
delete a;

//hash args (like GET arguments, but clientside)
window.location.__defineGetter__('hashargs',function(){
	var arr=window.location.hash.substr(1).split('&');
	var result={};
	for(var i=0;i<arr.length;++i)
		if(arr[i].includes('='))
			result[decodeURIComponent(arr[i].substr(0,arr[i].indexOf('=')))]=decodeURIComponent(arr[i].substr(arr[i].indexOf('=')+1));
		else if(arr[i].length>0){
			result[decodeURIComponent(arr[i])]=true;
		}
	return result;});
window.location.__defineSetter__('hashargs',function(nv){
	console.log(nv);
	window.location.hash='';
	for(var i in nv)
		window.location.hash+=encodeURIComponent(i)+(nv[i]===true?'':'='+encodeURIComponent(nv[i]))+'&';
});
window.location.addHashArg=function(k,v){window.location.hash+=encodeURIComponent(k)+(v===true?'':'='+encodeURIComponent(v))+'&';};
window.location.removeHashArg=function(k){var tmp=window.location.hashargs;delete tmp[k];window.location.hashargs=tmp;};
window.location.setHashArg=function(k,v){var ha=window.location.hashargs;if(ha[k]!=''+v){ha[k]=v;window.location.hashargs=ha;}};

//some nice jQuery plugins
$.fn.autoresize=function() {
	var self=$(this);
	function doResize() {
		self.attr('width',self.width())
			.attr('height',self.height())
			.trigger('autoresize');
		console.log('resized');
	}
	$(window).resize(doResize);
	self.resize(doResize);
	window.setTimeout(function(){self.resize();},10);
	return this;
};
$.fn.zoom=function(callback,thisarg) {
	var self=thisarg||$(this);
	$(this).on('mousewheel',function(e){
		if(e.ctrlKey) {
			var e2=Object.create(e);
			e2.type='zoom';
			e2.deltaY=e.originalEvent.deltaY;
			console.log(e2);
			callback.apply(self,[e2]);
		}
		return false;
	});
	return this;
};
$.fn.mousewheel=function(callback,thisarg) {var self=thisarg||$(this);$(this).on('mousewheel',function(e){if(e.ctrlKey) {var e2=Object.create(e);e2.deltaX=e.originalEvent.deltaX;e2.deltaY=e.originalEvent.deltaY;console.log(e2);callback.apply(self,[e2]);}});};
$.fn.fullscreen=function(e) {
	if(e=='toggle') {
		if(document.fullscreenElement) {
			document.exitFullscreen();
			return false;
		} else {
			$(this)[0].requestFullscreen();
			return true;
		}
	} else if((!isset(e)) || e) {
		$(this)[0].requestFullscreen();
		return true;
	} else {
		document.exitFullscreen();
		return false;
	}
};
$.fn.xwfocus=function(delay){var self=$(this);setTimeout(function(){self.focus()},delay);return this};
console.log('done');