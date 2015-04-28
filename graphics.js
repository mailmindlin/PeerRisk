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
function Polygon(points) {
	this.points=points||[];
	this.name='Polygon';
}
Polygon.prototype.__defineGetter__('path',function() {
	var result=new Path2D();
	result.moveTo(this.points[0][0],this.points[0][1]);
	this.points.forEach(function(point){
		result.lineTo(point[0],point[1]);
	});
	return result;
});
Polygon.prototype.contains=function(point,y) {
	return pnpoly(this.points,vsel(point[0],point.x,point),vsel(point[1],point.y,y));
};
function Shape(polygons,fill,line,stroke) {
	this.polygons=polygons||[];
	this.fill=fill||'#000000';
	this.line=line||0;
	this.stroke=stroke||'#000000';
	this.reload();
}
Shape.prototype.reload=function() {
	this.path=new Path2D();
	this.polygons.forEach(function(p){
		this.path.addPath(p.path);
	},this);
};
Shape.prototype.render=function(context) {
	context.save();
	context.fillStyle=this.fill;
	context.strokeStyle=this.stroke;
	context.lineWidth=this.line;
	context.stroke(this.path);
	context.fill(this.path);
	context.restore();
};
Shape.prototype.contains=function(point,_y) {
	var x=vsel(point[0],point.x,point),y=vsel(point[1],point.y,_y);
	var result=isset(this.polygons.find(function(polygon){return polygon.contains([x,y]);}));
	return result;
};