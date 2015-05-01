var Logger = Class.extend({
	stack:[],
	init:function(root,before) {
// 		this.before=before;
		this.stack.push(root);
	},
	log:function() {
		var el=$('<div></div>');
		el.html(arguments[0].replace(/\t/gm,'&nbsp;&nbsp;&nbsp;&nbsp;'));
		el.addClass('log-msg-info');
		$(this.stack[this.stack.length-1]).append(el);
	},
	get debug(){return this.log;},
	error:function() {
		var el=$('<div></div>');
		el.html(arguments[0].replace(/\t/gm,'&nbsp;&nbsp;&nbsp;&nbsp;'));
		el.addClass('log-msg-error');
		$(this.stack[this.stack.length-1]).append(el);
	},
	cls:function() {
		$(this.stack[0]).children().remove();
	},
	group:function(name) {
		console.group(name);
	},
	groupCollapsed:function(name) {
		console.groupCollapsed(name);
	},
	groupEnd:function() {
		console.groupEnd();
	}
});
window.logger=new Logger('#terminal-text','#terminal-input');