/* Copyright (C) Liam Feehery - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Liam Feehery <wfeehery17@archmereacademy.com>, April 2015
 * "Because Copyright"-Liam
 * 
 * geom.js: Freestanding geometry library. Right now, it just contains a port of pnpoly, which determines if a point is inside a polygon
 */

function pnpoly(points,x,y) {
	var c=false;
	for(var i=0,j=points.length-1;i<points.length;j=i++)
		if ((((points[i][1] <= y) && (y < points[j][1])) || ((points[j][1] <= y) && (y < points[i][1]))) && (x < (points[j][0] - points[i][0]) * (y - points[i][1]) / (points[j][1] - points[i][1]) + points[i][0]))
			c =!c;
	return c;
}

var Polygon = Class.extend({
	init:function(points) {
		this.points=points||[];
		this.name='Polygon';
	},
	get length() {return this.points.length;},
	get path() {
		var result=new Path2D();
		result.moveTo(this.points[0][0],this.points[0][1]);
		this.points.forEach(function(point){
			result.lineTo(point[0],point[1]);
		});
		result.closePath();
		return result;
	},
	contains: function(point,y) {
		return pnpoly(this.points,vsel(point[0],point.x,point),vsel(point[1],point.y,y));
	},
	_area: function() {
		var area = 0,i,j,point1,point2;
		for (i = 0, j = this.length - 1; i < this.length; j=i,++i) {
			point1 = this.points[i];
			point2 = this.points[j];
			area += point1[0] * point2[1] - point1[1] * point2[0];
		}
		return area*.5;//multiplying is faster than division
	},
	get area(){return Math.abs(this._area())},
	get centroid () {
		var x = 0, y = 0, i, j, f, point1, point2;
		for (i = 0, j = this.length - 1; i < this.length; j=i,++i) {
			point1 = this.points[i];
			point2 = this.points[j];
			f = point1[0] * point2[1] - point2[0] * point1[1];
			x += (point1[0] + point2[0]) * f;
			y += (point1[1] + point2[1]) * f;
		}
		f = this._area() * 6;
		return [x / f, y / f];
	}
});
var Shape=Class.extend({
	init: function(polygons,fill,line,stroke,cap) {
		this.polygons=polygons||[];
		this.fill=vsel(fill,'#000000');
		this.line=vsel(line,0);
		this.stroke=vsel(stroke,'#000000');
		this.cap=vsel(cap,'butt');
		this.reload();
	},
	reload: function() {
		var _path=new Path2D();
		this.polygons.forEach(function(p){
			_path.addPath(p.path);
		},this);
		this.path=_path;
		this.centroid=vsel(this.largestPolygon(),{centroid:[-1,-1]}).centroid;
	},
	render: function(context) {
		context.save();
		context.fillStyle=this.fill;
		context.lineCap=this.cap;
		context.strokeStyle=this.stroke;
		context.lineWidth=this.line;
		if(this.stroke!=null)
			context.stroke(this.path);
		if(this.fill!=null)
			context.fill(this.path);
		context.restore();
	},
	contains: function(point,_y) {
		var x=vsel(point[0],point.x,point),y=vsel(point[1],point.y,_y);
		for(var i=0;i<this.polygons.length;++i)
			if(this.polygons[i].contains([x,y]))
				return this.polygons[i];
	},
	largestPolygon: function() {
		if(this.polygons.length==0)
			return undefined;
		var result=this.polygons[0],area=result.area;
		for(var i=0;i<this.polygons.length;++i) {
			var _area=this.polygons[i].area;
			if(_area>area) {
				area=_area;
				result=this.polygons[i];
			}
		}
		return result;
	}
});