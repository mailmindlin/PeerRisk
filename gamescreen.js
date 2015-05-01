/* Copyright (C) Liam Feehery - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Liam Feehery <wfeehery17@archmereacademy.com>, April 2015
 * "Because Copyright"-Liam
 */
function GameScreen(canvas,game) {
	this.game=game;
	this.cvs=canvas;
	this.ctx=canvas.getContext('2d');
	this.offset=[0,0];//offset from upperleft corner in display pixels
	this.doRender=true;
	this.cirx=0;
	this.ciry=0;
	this.sf=Math.max(canvas.width/game.map.width,canvas.height/game.map.height);
	this.msf=function(){return canvas.width/game.map.width;};//Math.max(canvas.width/game.map.width,canvas.height/game.map.height);}//for Max Scale Factor
	var self=this;
	$(canvas).on('mousewheel',function(e){
		e.preventDefault();
		e.stopImmediatePropagation();
		if(e.ctrlKey) {
			var deltaS=-e.originalEvent.deltaY*.05;
			//so you can't zoom too far out or in
			if(self.sf+deltaS>10)
				deltaS=10-self.sf;
			if(self.sf+deltaS<self.msf())
				deltaS=self.msf()-self.sf;
			//TODO: cleanup/simplify
			self.offset[0]+=(e.offsetX-self.offset[0])/(self.sf+deltaS)*self.sf-e.offsetX+self.offset[0];
			self.offset[1]+=(e.offsetY-self.offset[1])/(self.sf+deltaS)*self.sf-e.offsetY+self.offset[1];
			self.sf+=deltaS;
			if(self.sf<1)
				self.sf=1;
		} else {
			self.offset[0]-=e.originalEvent.deltaX;
			self.offset[1]-=e.originalEvent.deltaY;
		}
		//bound the offset so you can't scroll off the map
		//TODO: maybe do something where you can wrap around when you scroll to the side
		var cw99=canvas.width-game.map.width*self.sf,ch99=canvas.height-game.map.height*self.sf;
		if(self.offset[0]<cw99)
			self.offset[0]=cw99;
		if(self.offset[1]<ch99)
			self.offset[1]=ch99;
		if(self.offset[0]>0)
			self.offset[0]=0;
		if(self.offset[1]>0)
			self.offset[1]=0;
		if(!Number.isFinite(self.sf))
			self.sf=self.msf();
		if(!Number.isFinite(self.offset[0]))
			self.offset[0]=0;
		if(!Number.isFinite(self.offset[1]))
			self.offset[1]=0;
// 		console.groupCollapsed('GameScreen transformations');
// 		console.log('scalar: '+self.sf);
// 		console.group('offset');
// 		console.log('x: '+self.offset[0]);
// 		console.log('y: '+self.offset[1]);
// 		console.groupEnd();
// 		console.groupEnd();
	}).on('click',function(e) {
		//scale coords
		var scaled=self.mapPoint(e.offsetX,e.offsetY);
		self.cirx=scaled[0];
		self.ciry=scaled[1];
// 		console.log(game.map.territoryAt(scaled[0],scaled[1]));
	}).autoresize();
}
GameScreen.prototype.__defineSetter__('width',function(n){this.dimensions[0]=n;});
GameScreen.prototype.__defineSetter__('height',function(n){this.dimensions[1]=n;});
GameScreen.prototype.__defineGetter__('width',function(){return this.dimensions[0];});
GameScreen.prototype.__defineGetter__('height',function(){return this.dimensions[1];});

GameScreen.prototype.__defineSetter__('offsetX',function(n){this.offset[0]=n;});
GameScreen.prototype.__defineSetter__('offsetY',function(n){this.offset[1]=n;});
GameScreen.prototype.__defineGetter__('offsetX',function(){return this.offset[0];});
GameScreen.prototype.__defineGetter__('offsetY',function(){return this.offset[1];});
GameScreen.prototype.renderFrame=function(){
// 	console.log(this);
	this.ctx.clearRect(0,0,2*this.cvs.width,2*this.cvs.height);
	this.ctx.save();
	//apply transformations
	this.ctx.translate(this.offsetX,this.offsetY);
	this.ctx.scale(this.sf,this.sf);
	this.game.render(this.ctx);
	//draw lines
	this.ctx.stroke(pth);
	//draw circle
// 	this.ctx.globalAlpha=.25;
// 	this.ctx.beginPath();
// 	this.ctx.fillStyle='lime';
// 	this.ctx.arc(this.cirx,this.ciry,3,0,2*Math.PI);
// 	this.ctx.fill();
// 	this.ctx.globalAlpha=1;
	this.ctx.restore();
	var self=this;
	if(this.doRender)
		requestAnimationFrame(function(){self.renderFrame.apply(self,[]);});
};
GameScreen.prototype.mapPoint=function(point,_) {
	return [(vsel(point[0],point.x,point)-this.offsetX)/this.sf,(vsel(point[1],point.y,_)-this.offsetY)/this.sf];
};
GameScreen.prototype.unmapPoint=function(point,_) {
	return [vsel(point[0],point.x,point)*this.sf+this.offsetX,vsel(point[1],point.y,_)*this.sf+this.offsetY];
};