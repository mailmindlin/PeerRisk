/* Copyright (C) Liam Feehery - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Liam Feehery <wfeehery17@archmereacademy.com>, April 2015
 * "Because Copyright"-Liam
 */
function validator(button,validator) {
	return function(e){
		if(!e.char)
			e.char=String.fromCharCode(e.which);
		var val=$(this).val()+e.char;
		var result=validator(val);
		if(result) {
			button.addClass('valid');
			if(e.charCode==13)
				button.trigger('click');
		} else
			button.removeClass('valid');
	};
}
function beginServer(name) {
	setTimeout(function(){$('#server-setup1').transitionTo($('#server-terminal'),67)},0);
	$('#terminal-input').xwfocus(500);
	logger.log('Initializing server \''+name+'\'...');
	logger.log('Creating server object...');
	console.log(name);
	gameobjs.gameserver=new GameServer(name);
	gameobjs.gameserver.openChannel();
	logger.log('Done.');
}
function beginClient(name) {
	console.group('Initializing client...');
	gameobjs.gameclient=new GameClient({server:{name:name}});
	console.log('Connecting...');
	gameobjs.gameclient.join(5000,500).then(function() {
		console.log('Success!');
		$('#client-connecting-msg').html('Getting resource list...');
		gameobjs.gameclient.channel.send(JSON.stringify({action:'resourcemeta',vtype:'player'}));
	},function(){gameobjs.gameclient.destroy();delete gameobjs.gameclient;$('#userloginpage').transitionTo(36)});
	console.groupEnd();
}
function initEventHandlers() {
	$('#client-button').click(function(){
		console.log('a');
		var ha=window.location.hashargs;
		delete ha.server;
		ha.client=true;
		window.location.hashargs=ha;
// 		$('#c-username').xwfocus(500);
		setTimeout(function(){$('#filechooser').transitionTo(22)},2000);
		$('#filechooserloadingpage').transitionTo(62)});
	$('#setuppage').on('mousewheel',function(e) {
		if((os=='Mac'?(e.originalEvent.deltaY>20):e.originalEvent.deltaY>1))
			$('#aboutpage').transitionTo(25);
		return false;
	});
	$('#aboutpage').on('mousewheel',function(e) {
		if((os=='Mac'?(e.originalEvent.deltaY<-20):e.originalEvent.deltaY<-1))
			$('#setuppage').transitionTo(20);
		return false;
	});
	$('#server-button').click(function(){var ha=window.location.hashargs;delete ha.client;ha.server=true;window.location.hashargs=ha;$('#servername').xwfocus(500);$('#setup').transitionTo($('#server-setup1'),67);});
	$('#servername').on('input keypress',validator($('#ss1-button'),function(text){return text.length>1;}));//.on('change',function(e){beginServer($('#servername').val());});
	$('#ss1-button').on('click',function(e){beginServer($('#servername').val());});
	$('#tojoin').on('input keypress',validator($('#joinbutton'),function(text){return text.length>1;}));//.on('change',function(e){$('#joinbutton').trigger('click');});//.on('keypress',function(e){if(e.which==13){e.preventDefault();$(this).trigger('change');}});
	$('#c-username').on('input keypress',validator($('#userloginpage-submit'),function(text){return text.length>1;}));//.on('change',function(e){$('#userloginpage-submit').trigger('click')});
	$('#c-password').on('input keypress',validator($('#userloginpage-submit'),function(){return $('#c-username').val().length>1;}));
	$('#userloginpage-submit').click(function(){$('#tojoin').xwfocus(500);$('#userloginpage').transitionTo($('#joinserverpage'),45);});
	$('#joinbutton').click(function(e){$('.pt-page-current').transitionTo($('#client-connectingpage'),3);beginClient($('#tojoin').val());});
	$('#terminal-input').on('keypress',terminalKey);
	$('#terminal-text').on('focus click',function(e){$('#terminal-input').focus();return false;});
}
$(document).ready(function() {
	var cvs=$('canvas')[0];
	var ha=window.location.hashargs;
	initEventHandlers();
	console.log('Done.');
	var ha=window.location.hashargs;
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