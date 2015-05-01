/* Copyright (C) Liam Feehery - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Liam Feehery <wfeehery17@archmereacademy.com>, April 2015
 * "Because Copyright"-Liam
 */
 var bdrawimg=true;
 var GameMap=Class.extend({
 	init:function(data) {
 		this.name=vsel(data.name,'GameMap'+Math.round(Math.random()*10000));
		this.continents=[];
		this.extraGraphics=[];
		this.mappingData=vsel(data.mappingData,[]);
		this.image=vsel(data.image,{width:1,height:1});
		if(isset(data.continents))
			for(var i=0;i<data.continents.length;++i)
				this.newContinent(data.continents[i].name,data.continents[i].bonus,data.continents[i].children);
		if(isset(data.extraGraphics))
			for(var i=0;i<data.extraGraphics.length;++i)
				this.registerGraphic(data.extraGraphics[i]);
 	},
 	load: function() {
		if(!isset(this.imageSrc))return this.onload();
		console.log('Loading '+this.imageSrc);
		var self=this;
		this.image=$('<img/>')
			.attr('src',this.imageSrc)
			.addClass('hidden')
			.load(function(){self.loaded=true;self.onload.apply(this,arguments);})[0];
	},
	onload: function(){
		console.log('Done loading.');
	},
	get width() {return this.image.width;},
	get height() {return this.image.height;},
	getTerritoryByName:function(name) {
		for(var i in this.continents)
			for(var j in this.continents[i].children)
				if(this.continents[i].children[j].name==name)
					return this.continents[i].children[j];
	},
	getTerritoryID: function(id) {
		for(var i in this.continents)
			for(var j in this.continents[i].children)
				if(this.continents[i].children[j].id==id)
					return this.continents[i].children[j];
	},
	newRoundedLine: function(points,width,color){
		return this.registerGraphic({width:width,color:color,points:points});
	},
	registerGraphic: function(g) {
		this.extraGraphics.push({width:g.width,color:g.color,points:g.points,fill:g.fill,lineCap:g.lineCap,shape:vsel(g.shape,new Shape([new Polygon(g.points)],vsel(g.fill,null),vsel(g.width,1),vsel(g.color,0),vsel(g.lineCap,'round')))});
		return this;
	},
	newContinent: function(name,bonus,children) {
	console.groupCollapsed("Loading Continent: "+name);
	children.forEach(function(child){
		console.groupCollapsed("Loading Territory: "+child.name);
		if(!isset(child.shape)) {
			console.groupCollapsed("Doing geometric stuff...");
			var _polygons=[];
			child.polygons.forEach(function(p) {
				if(p instanceof Polygon)
					_polygons.push(p);
				else
					_polygons.push(new Polygon(p));
				console.log("Loaded "+p.length+" points.");
			});
			child.shape=new Shape(_polygons,child.color,vsel(child.line,0),vsel(child.stroke,'black'));
			console.log("Geometrized "+_polygons.length+" polygons.");
			console.groupEnd();
		}
		if(!isset(child.center)) {
			
		}
		child.__defineGetter__('path',function(){return child.shape.path;});
		console.groupEnd();
	});
	this.continents.push({name:name,bonus:bonus,children:children});
	console.groupEnd();
	return this;
	},
	applyMap: function(data) {
		var errors=0;
		console.groupCollapsed("Mapping territory stuff...");
		console.log("Integrity checking...");
		//ensure validity
		console.log('Data length: '+Object.size(data),data);
		for(var i in data) {
			for(var j=0;j<data[i].length;++j)
				if((!data.hasOwnProperty(data[i][j]))) {
					console.error('Asymmetric data structure: data['+i+']['+j+'] ('+data[i][j]+') has no match in data['+data[i][j]+'] ('+data[data[i][j]]+').');
					++errors;
					continue;
				} else {
					var success=false;
					console.log(data[data[i][j]],data[i][j],i,j);
					for(var k=0;k<data[data[i][j]].length && !success;++k)
						success=data[data[i][j]][k]==i;
					if(!success) {
						console.error('Asymmetric data structure: data['+i+']['+j+'] ('+data[i][j]+') has no match in data['+data[i][j]+'] ('+data[data[i][j]]+').');
						++errors;
					} else {
						console.log(data[data[i][j]],data[i][j]);
					}
				}
		}
		console.log(errors+' errors.');
		console.log('\tDone.');
		this.mappingData.concat(data);
		console.log('Assimilated data.');
		console.groupEnd();
		return this;
	},
	get state() {
		var result={};
		result.continents=[];
		this.continents.forEach(function(continent){
			var children=[];
			continent.children.forEach(function(child){
				//convert Polygon's to point array
				var _polygons=[];
				child.polygons.forEach(function(polygon){_polygons.push(polygon.points);});
				children.push({name:child.name,id:child.id,polygon:_polygons,color:child.color,line:child.line,stroke:child.stroke});
			});
			result.continents.push({name:continent.name,bonus:continent.bonus,children:children});
		});
		result.mappingData=this.mappingData.slice();//copy array
		return result;
	},
	get serialized() {
		return JSON.stringify(this.state);
	},
	deserialize: function(str) {//STATIC
		var state= JSON.parse(str);
		var result=new GameMap();
		state.continents.forEach(function(continent){result.newContinent(continent.name,continent.bonus,continent.children);});
		result.applyMap(state.mappingData);
		return result;
	},
	render: function(context) {
		if(bdrawimg && isset(this.image.tagName))
			context.drawImage(this.image,0,0,this.width,this.height);
		this.continents.forEach(function(continent) {
			continent.children.forEach(function(child) {
				child.shape.render(context);
			});
		});
		this.extraGraphics.forEach(function(graphic) {
			graphic.shape.render(context);
		});
	},
	territoryAt: function(x,y) {
		console.groupCollapsed("Searching for coords ["+x+', '+y+']');
		for(var i=0;i<this.continents.length;++i) {
			console.group("Checking "+this.continents[i].name);
			for(var j=0;j<this.continents[i].children.length;++j) {
				console.log('Checking: '+this.continents[i].name+'$'+this.continents[i].children[j].name,this.continents[i].children[j]);
				if(this.continents[i].children[j].shape.contains([x,y])) {
					console.groupEnd();
					console.groupEnd();
					return this.continents[i].children[j];
				}
			}
			console.groupEnd();
		}
		console.groupEnd();
	}
});