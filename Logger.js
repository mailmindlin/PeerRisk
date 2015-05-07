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
function terminalKey(e) {
	if(!e.char)
		e.char=String.fromCharCode(e.which);
	var val=$('#terminal-input').val()+e.char;
	if(val.length==0)
		return;
	if(e.charCode==13) {
		$('#terminal-input').val('');
		logger.log('>'+val);
		doCommand(val,logger);
		return false;
	}
}
function doCommand(command, logger) {
	var logger=vsel(logger,console);
	var args=command.trim().split(' ');
	console.log(args,args[0].toLowerCase().trim());
	switch(args[0].toLowerCase().trim()) {
		case 'echo':
			logger.log('\t'+command.substr(command.indexOf(' ')));
			break;
		case 'hello':
			logger.log('\tHello!');
			break;
		case 'ping':
			gameobjs.gameserver.ping();
			break;
		default:
			logger.error('\tUnknown command \''+command+'\'.');
			return false;
	}
	return true;
}
window.logger=new Logger('#terminal-text','#terminal-input');