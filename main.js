/* Copyright (C) Liam Feehery - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Liam Feehery <wfeehery17@archmereacademy.com>, April 2015
 * "Because Copyright"-Liam
 */
var pts=[],pth=new Path2D();
window.gameobjs={};
function clear(){pts=[];reloadPath();}function pop(){pts.pop();reloadPath();}
function reloadPath() {
	var p=new Path2D();
	if(pts.length>0) {
		p.moveTo(pts[0][0],pts[0][1]);
		pts.forEach(function(e){p.lineTo(e[0],e[1]);});
	}
	pth=p;
}
function gotoServerSetup1() {
	setTimeout(function(){$('#servername').focus();},500);
	$('#setup').transitionTo($('#server-setup1'),44);
}
function gotoServerList() {
	$('#setup').transitionTo($('#server-list'),45);
}
function validateServerName(e) {
	if(!e.char)
		e.char=String.fromCharCode(e.which);
	var val=$('#servername').val()+e.char;
	if(val.length>0) {
		$('#ss1-button').addClass('valid');
		if(e.charCode==13)
			$('#ss1-button').trigger('click');
	} else
		$('#ss1-button').removeClass('valid');
}
function beginServer(name) {
	setTimeout(function(){$('#server-setup1').transitionTo($('#server-terminal'),67)},0);
	setTimeout(function(){$('#terminal-input').focus()},500);
	logger.log('Initializing server...');
	logger.log('Creating server object...');
	gameobjs.gameserver=new MultiServer();
	logger.log('Done.');
}
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
		default:
			logger.error('\tUnknown command \''+command+'\'.');
			return false;
	}
	return true;
}
$(document).ready(function() {
	var cvs=$('canvas')[0];
	var ha=window.location.hashargs;
// 	if(!(isset(ha['client'])||isset(ha['server']))) {
		$('#client-button').click(function(){window.location.hash+='client';gotoServerList();});
		$('#server-button').click(function(){window.location.hash+='server';gotoServerSetup1();});
		$('#servername').on('keypress',validateServerName);
		$('#ss1-button').click(function(e){beginServer($('#servername').val());});
		$('#terminal-input').on('keypress',terminalKey);
		$('#terminal-text').on('focus click',function(e){$('#terminal-input').focus();return false;});
		console.log('Done.');
// 	}
// 	if(window.location.hashargs['client']) {
// 		console.log('Initializing client...');
// 		window['gameclient']=new GameClient({server:{password:null},player:{name:'Foo',password:'Bar',color:'#00FFFF'}});
// 		if(window.location.hashargs['auto'])
// 			gameclient.join();
// // 		window['gamescreen']=new GameScreen(cvs,new Game(gm));
// // 		console.log(gamescreen);
// // 		gamescreen.renderFrame();
// 		return;
// 	}else if(window.location.hashargs['server']) {
// 		console.log('Initializing server...');
// 		window['gameserver']=new GameServer();
// 		if(window.location.hashargs['auto'])
// 			gameserver.open();
// 	}

	$(cvs).on('mousedown',function(e){
		if(e.button!=0)
			return;
		var pt=gamescreen.mapPoint([e.offsetX,e.offsetY])
		pts.push(pt);
		pth.lineTo(pt[0],pt[1]);
	});
});