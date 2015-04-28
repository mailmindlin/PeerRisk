$.fn._html=$.fn.html;
$.fn.html=function() {
	var m=this.data('mirror');
	if(m) {
		m.html.apply(m,arguments);
	}else
		this._html.apply(this,arguments);
};
$.fn.contextmenu = function(args) {
	var menu=$('<div></div>')
		.addClass('hidden')
		.addClass('context-menu')
		.attr('tabindex',-1);
	$(args.parent||'body').append(menu);
	menu.state={children:[]};
	menu.addChild=function(child) {
		var el=child.obj=$('<div></div>');
		if(child.type=='separator')
			el.addClass('context-menu-separator');
		else {
			el.addClass('context-menu-option').html('<span>'+child.text+'</span>');
			if(child.disabled)
				el.addClass('context-menu-disabled');
			if(child.click) {
				el.on('menuclick',child.click);
				el.on('mousedown',function(e){
					if(!el.hasClass('context-menu-disabled'))
						el.trigger('menuclick');
				});
			}
			el.data('mirror',el.find('span'));
		}
		menu.state.children.push(child);
		menu.append(el);
	};
	args.items.forEach(menu.addChild);
	$(this).each(function(e){this.oncontextmenu=function() {return false;}});
	$(this).mousedown(function(e) {
		if(e.button == 2) {
			menu.removeClass('hidden')
				.css({top:e.pageY,left:e.pageX,position:'fixed'})
				.focus();
			return false;
		} else if(e.button == 0)
			menu.focusout();
		return true;
	}).focusout(function(e) {
		menu.addClass('hidden');
	});
	menu.getChild=function(predicate) {
		for(var i=0;i<menu.state.children.length;++i)
			if(predicate(i,menu.state.children[i]))
				return menu.state.children[i].obj;
		return null;
	};
	return menu;
};
$(document).ready(function() {
	window['menu']=$(document).contextmenu({
		parent:'.background',
		items: [
			{text:'Back',disabled:(document.referrer==""),click:function(){window.history.go(-1);}},
			{text:'Forward',disabled:true,click:function(){window.history.go(1);}},
			{text:'Reload',click:function(){window.location.reload();}},
			{type:'separator'},
			{text:'Fullscreen',click:function(){
				if($('.background').fullscreen('toggle'))
					$(this).html('Exit Fullscreen');
				else
					$(this).html('Fullscreen');
			}}
		]
	});
});