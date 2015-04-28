var cvs,ctx,pts=[],drawn=[],pth=new Path2D(),img,cvsrect={x:0,y:0,w:100,h:100};
function clear(){drawn=[];pts=[];reloadPath();}function pop(){drawn.pop();pts.pop();reloadPath();}
function printme(e){console.log(e);}
function render() {
// 	ctx.clearRect(0,0,cvs.width,cvs.height);
// 	Graphics.drawImageRect(ctx,img,cvs,-cvsrect.x,-cvsrect.y,cvsrect.w,cvsrect.h);
// 	ctx.drawImage(img,(-cvsrect.x)/,-cvsrect.y,cvs.width*img.width/cvsrect.w,cvs.height*img.height/cvsrect.h);
	ctx.stroke(pth);
	requestAnimationFrame(render);
}
function reloadPath() {
	var p=new Path2D();
	if(drawn.length>0) {
		p.moveTo(drawn[0][0]+cvsrect.x,drawn[0][1]+cvsrect.y);
		drawn.forEach(function(e){p.lineTo(e[0]+cvsrect.x,e[1]+cvsrect.y);});
	}
	pth=p;
}
$(document).ready(function() {
	cvs=$('canvas')[0];
	window['gamescreen']=new GameScreen(cvs,{map:gm});
	console.log(gamescreen);
	gamescreen.renderFrame();
	return;
	ctx = cvs.getContext("2d");
	img=$('<img/>')
		.attr('src','stdmap.png')
		.addClass('hidden')
		.load(function() {
			render();
			console.log('done');
		})[0];
	img.crossOrigin = "Anonymous";
	$('body').on('mousewheel',function(e){
			e.preventDefault();
			e.stopImmediatePropagation();
			var o=e.originalEvent;
			console.log([o,o.deltaMode,o.deltaX,o.deltaY,o.deltaZ]);
			
			if(e.ctrlKey) {
				//get center
				var cx=o.offsetX*cvsrect.w/cvs.width,cy=o.offsetY*cvsrect.h/cvs.height;
				//scale factor
				var sx=o.deltaY/cvsrect.w,sy=o.deltaY/cvsrect.h;
				console.log([o.offsetX,o.offsetY,cx,cy,sx,sy]);
				//calculate new rectangle
				cvsrect.w+=o.deltaY;
				cvsrect.h+=o.deltaY;
// 				cvsrect.x=cvsrect.x-o.deltaY;
			} else {
				cvsrect.y=cvsrect.y+o.deltaY;
				cvsrect.x=cvsrect.x+o.deltaX;
// 				offsetY=Math.min(offsetY-o.deltaY,0);
			}
			//bound x,y
			cvsrect.x=Math.max(cvsrect.x,0);
			cvsrect.y=Math.max(cvsrect.y,0);
			console.log(cvsrect);
			reloadPath();
			return true;
		}).on('gesture',printme)
		.append(img);
	$(cvs).on('mousedown',function(e){
		if(e.button!=0)
			return;
		var cx=e.offsetX-cvsrect.x;
		var cy=e.offsetY-cvsrect.t;
		var x=cx/img.width*sizeX;
		var y=cy/img.height*sizeY;
		pts.push([x,y]);
		drawn.push([cx,cy]);
		pth.lineTo(e.offsetX,e.pageY);
	}).autoresize()
	.on('mousemove',function(e){
// 		console.log(gm.territoryAt(e.offsetX,e.offsetY));
	});
	gm.context=ctx;
});