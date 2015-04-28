function GameMap(imageSrc,name) {
	this.name=name||'GameMap'+Math.round(Math.random()*10000);
	this.continents=[];
	this.mappingData=[];
	this.imageSrc=imageSrc;
	this.loaded=false;
}
GameMap.prototype.load=function() {
	console.log('Loading '+this.imageSrc);
	var self=this;
	this.image=$('<img/>')
		.attr('src',this.imageSrc)
		.addClass('hidden')
		.load(function(){self.loaded=true;self.onload.apply(this,arguments);})[0];
};
GameMap.prototype.onload=function(){
	console.log('Done loading.');
};
GameMap.prototype.__defineGetter__('width',function(){
	return this.image.width;
});
GameMap.prototype.__defineGetter__('height',function(){
	return this.image.height;
});
GameMap.prototype.getTerritoryByName=function(name) {
	for(var continent in this.continents)
		for(var child in continent.children)
			if(child.name==name)
				return child;
};
GameMap.prototype.getTerritoryID=function(id) {
	for(var continent in this.continents)
		for(var child in continent.children)
			if(child.id==id)
				return child;
};
GameMap.prototype.newContinent=function(name,bonus,children) {
	children.forEach(function(child){
		if(!child.shape) {
			var _polygons=[];
			child.polygons.forEach(function(p) {
				if(p.name)
					_polygons.push(p);
				else
					_polygons.push(new Polygon(p));
			});
			console.log(_polygons);
			child.shape=new Shape(_polygons,child.color,child.line,child.stroke);
		}
		child.__defineGetter__('path',function(){return child.shape.path;});
	});
	this.continents.push({name:name,bonus:bonus,children:children});
	return this;
};
GameMap.prototype.territoryAt=function(ev) {
	if(!ev.originalEvent.region)
		return null;
	console.log(ev.originalEvent);
	return null;
};
GameMap.prototype.applyMap=function(data) {
	//ensure validity
	for(var i in data) {
		for(var j=0;j<data[i].length;++j)
			if(data[j].indexOf<0) {
				console.err('Asymmetric data structure: data['+i+']['+j+'] ('+data[i][j]+') has no match in data['+j+'] ('+data[j]+').');
				return false;
			}
	}
	this.mappingData.concat(data);
	return this;
};
GameMap.prototype.attach=function(context) {
	console.log('attaching');
	var blankPath=new Path2D();
	blankPath.moveTo(0,0);
	blankPath.lineTo(0,-1);
	context.hitRegions=[];
	context.xaddHitRegion=function(hr){context.hitRegions.push(hr);context.addHitRegion(hr);};
	context.xaddHitRegion({id:this.name,path:blankPath});
	this.continents.forEach(function(continent) {
		context.xaddHitRegion({id:this.name+'_'+continent.name,path:blankPath});
		continent.children.forEach(function(child) {
			try {
				context.xaddHitRegion({id:this.name+'_'+continent.name+'$'+child.name,path:child.shape.path,cursor:'pointer',parentID:this.name+'_'+continent.name});
			}catch(ex){}
		},this);
	},this);
};
GameMap.prototype.detach=function(context) {
	context.removeHitRegion({id:this.name});
};
GameMap.prototype.__defineSetter__('context',function(context) {
	if(this._context)
		this.detach(this._context);
	this._context=context;
	if(context)
		this.attach(context);
});
GameMap.prototype.__defineGetter__('state',function() {
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
});
GameMap.prototype.__defineGetter__('serialized',function() {
	return JSON.stringify(this.state);
});
GameMap.deserialize=function(str) {
	var state= JSON.parse(str);
	var result=new GameMap();
	state.continents.forEach(function(continent){result.newContinent(continent.name,continent.bonus,continent.children);});
	result.applyMap(state.mappingData);
	return result;
};
GameMap.prototype.render=function(context) {
	context.drawImage(this.image,0,0,this.width,this.height);
	this.continents.forEach(function(continent) {
		continent.children.forEach(function(child) {
			child.shape.render(context);
		});
	});
};
GameMap.prototype.territoryAt=function(x,y) {
	for(var i=0;i<this.continents.length;++i)
		for(var j=0;j<this.continents[i].children.length;++j) {
			console.log('checking:'+this.continents[i].name+'$'+this.continents[i].children[i].name,this.continents[i].children[i]);
			if(this.continents[i].children[j].shape.contains([x,y]))
				return this.continents[i].children[j];
		}
};