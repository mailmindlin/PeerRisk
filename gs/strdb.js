/**
 * A JS String-based database (b/c why not?)
 * Table Format:
 * HL HL (HL = header length, in bytes)
 * RW RW (RW = row length, in bytes)
 * RS RS (RS = # of rows)
 * FF FF (FF = flags)
 * (json data about row) [{name:'ID',width:2,type:'string'},...]
 * 00 00 (0 padding)
 * ID ID ....
 * 
 */
var strdb=Class.extend({
	readNum:function(s,o,l) {var r=0;for(var i=0;i<l;++i)r=(r<<8)|s.charCodeAt(o+i);return r},
	writeNum:function(s,o,l) {
		//TODO implement
	}
	init:function(args) {
		if(args.from) {
			var s=this.str=args.from;
			//TODO fix these
			this.HL=this.readNum(0,4);
			this.RW=this.readNum(4,4);
			this.RS=this.readNum(8,4);
			this.FF=this.readNum(12,4);
			this.mutable=false;
		}else if(args){
			this.fields=args.fields;
			//build string
			var fieldstr=JSON.stringify(this.fields);
			this.str=;
		}
	},
	queryOne:function(param,predicate) {
		
	}
});