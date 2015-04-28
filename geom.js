/**
 * Freestanding geometry library
 */

function pnpoly(points,x,y) {
	var c=false;
	for(var i=0,j=points.length-1;i<points.length;j=i++)
		if ((((points[i][1] <= y) && (y < points[j][1])) || ((points[j][1] <= y) && (y < points[i][1]))) && (x < (points[j][0] - points[i][0]) * (y - points[i][1]) / (points[j][1] - points[i][1]) + points[i][0]))
			c =!c;
	return c;
}