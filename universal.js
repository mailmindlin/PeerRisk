function isset(a){return typeof a!=='undefined';}
String.prototype.includes=String.prototype.includes || function(searchString,position){return this.indexOf(searchString,position)>-1;};
Element.prototype.requestFullscreen = Element.prototype.requestFullscreen || Element.prototype.msRequestFullscreen || Element.prototype.webkitRequestFullscreen || Element.prototype.mozRequestFullscreen || function(){};
document.exitFullscreen=document.exitFullscreen || document.msExitFullscreen || document.webkitExitFullscreen || document.mozExitFullscreen || function(){};
if(!isset(document.fullscreenElement)) {
	if(isset(document.webkitFullscreenElement))
		document.__defineGetter__('fullscreenElement',function(){return document.webkitFullscreenElement;});
	else if(isset(document.webkitFullscreenElement))
		document.__defineGetter__('fullscreenElement',function(){return document.mozFullscreenElement;});
	else
		document.webkitFullscreenElement=null;
}
window.requestAnimationFrame= window.requestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(c){window.setTimeout(c, 1000 / 60);};
{
	a=navigator.appVersion;
	window['os']=(a.includes('Win')&&'Windows')||(a.includes('Mac')&&'Mac')||(a.includes('X11')&&'UNIX')||(a.includes('Linux')&&'Linux')||'Unknown';
	window['cmd']=(os=='Mac')?{ctrl:'⌘', shift:'⇧', meta:'⌥', alt:'⌃', caps:'⇪', fn:'Fn'}:{ctrl:'CTRL',shift:'SHIFT',meta:'WIN',alt:'ALT',caps:'Caps Lock'};
	window['cmdchr']=(os=='Mac')?{16:'shift',17:'meta',18:'alt',91:'ctrl',93:'ctrl'}:{16:'shift',17:'ctrl',18:'alt',91:'meta',92:'meta'};
	delete a;
}
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
$.fn.autoresize=function() {
	var self=$(this);
	function doResize() {
		self.attr('width',self.width())
			.attr('height',self.height());
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
if(!Array.prototype.find)
	Array.prototype.find=function(callback,thisArg){for(i=0;i<this.length;++i)if(callback.apply(vsel(thisArg,callback),[this[i],i,this]))return this[i];};
window.vsel=function(){for(var i=0;i<arguments.length;++i)if(isset(arguments[i]))return arguments[i];};
console.log('done');