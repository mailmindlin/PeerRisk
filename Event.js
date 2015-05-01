var xEvent=Class.extend({init:function(data) {
		var data=vsel(data,{});
		for(var i in data)
			if(data.hasOwnProperty(i) && i!='cancellable' && i!='type' && i!='target')
				this[i]=data[i];
		this._cancellable=vsel(data.cancellable,true);
		this._type=data.type;
		this._cancelled=false;
		this._defaultPrevented=false;
		this._target=vsel(data.target,null);
	},
	get cancellable(){return this._cancellable;},
	get type(){return this._type;},
	get cancelled(){return this._cancelled;},
	get target(){return this._target;},
	get defaultPrevented(){return this._defaultPrevented;},
	cancel:function(){this._cancelled=vsel(this._cancellable,true);},
	preventDefault:function(){this._defaultPrevented=true;},
	dispatch:function(src){return vsel(src,this._target).dispatchEvent(this)},
	});
var xEventSource=Class.extend({
	init:function(){
		this.eventListeners={};
		this.defaults={};
	},
	addListener: function(evt,callback,id) {
		if(!this.eventListeners.hasOwnProperty(evt))
			this.eventListeners[evt]=[];
		this.eventListeners[evt].push([callback,id]);
	},
	removeListener: function(type,id) {
		if(this.eventListeners.hasOwnProperty(type))
			for(var i in this.eventListeners[type])
				if(this.eventListeners[type][i][1]==id)
					this.eventListeners[type].splice(i);
	},
	triggerEvent: function(data) {this.dispatchEvent(new xEvent(data));},
	dispatchEvent: function(event) {
		console.log('Dispatching event: '+JSON.stringify(event));
		if(this.eventListeners.hasOwnProperty(event.type)) {
			for(var evl in this.eventListeners[event.type]) {
				var fn=this.eventListeners[event.type][evl][0];
				try {
					if(fn(event)==false) {
						event.preventDefault();
						event.cancel();
					}
					if(event.cancelled)
						return event;
				}catch(e){
					console.error(e);
					return event;
				}
				if(event.defaultPrevented)
					return event;
			}
		}
		if((!event.defaultPrevented)&&(!event.cancelled)&&this.defaults.hasOwnProperty(event.type)) {
			this.defaults[event.type](event);
			console.log('default');
		}
		return event;
	},
	dispatcherFor: function(type,converter){var self=this;return function(){self.dispatchEvent(vsel(converter,function(type,e){return new xEvent({type:type,source:e})}).apply(this,[type].concat(arguments)))}}
});