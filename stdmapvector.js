var gm = new GameMap('stdmap.png','Standard');
gm.newContinent('Foo',50,[
		{name:'foo_1',polygons:[[[50,50],[50,100],[100,100],[100,50]],[[150,50],[150,100],[200,100],[200,50]]],id:0,line:1,color:'black',stroke:'#868800'}
		]);
/*gm.newContinent('North America',5,[
		{name:'Alaska',polygons:[],id:0,line:1,color:'black',stroke:'#868800'},
		{name:'Alberta',polygons:[],id:1},
		{name:'Central America',polygons:[],id:2},
		{name:'Eastern United States',polygons:[],id:3},
		{name:'Greenland',polygons:[],id:4},		
		{name:'Northwest Territory',polygons:[],id:5},
		{name:'Ontario',polygons:[],id:6},
		{name:'Quebec',polygons:[],id:7},
		{name:'Western United States',polygons:[],id:8}])
	.newContinent('South America',2,[	
		{name:'Argentina',polygons:[],id:10},		
		{name:'Brazil',polygons:[],id:11},
		{name:'Peru',polygons:[],id:12},
		{name:'Venezuela',polygons:[],id:13}])
	.newContinent('Europe',5,[
		{name:'Great Britain',polygons:[],id:20},
		{name:'Iceland',polygons:[],id:21},
		{name:'Northern Europe',polygons:[],id:22},
		{name:'Scandinavia',polygons:[],id:23},
		{name:'Southern Europe',polygons:[],id:24},
		{name:'Ukraine',polygons:[],id:25},
		{name:'Western Europe',polygons:[],id:26}])
	.newContinent('Africa',3,[
		{name:'Congo',polygons:[],id:30},
		{name:'East Africa',polygons:[],id:31},
		{name:'Egypt',polygons:[],id:32},
		{name:'Madagascar',polygons:[],id:33},
		{name:'North Africa',polygons:[],id:34},
		{name:'South Africa',polygons:[],id:35}])
	.newContinent('Australia',2,[
		{name:'Eastern Australia',polygons:[],id:40},
		{name:'Indonesia',polygons:[],id:41},
		{name:'New Guinea',polygons:[],id:42},
		{name:'Western Australia',polygons:[],id:43}])
	.newContinent('Asia',7,[
		{name:'Afghanistan',polygons:[],id:50},
		{name:'China',polygons:[],id:51},
		{name:'India',polygons:[],id:52},
		{name: 'Irktusk',polygons:[],id:53},
		{name:'Japan',polygons:[],id:54},
		{name:'Kamchatka',polygons:[],id:55},
		{name:'Middle East',polygons:[],id:56},
		{name:'Mongolia',polygons:[],id:57},
		{name:'Siam',polygons:[],id:58},
		{name:'Siberia',polygons:[],id:59},
		{name:'Ural',polygons:[],id:60},
		{name:'Yaktusk',polygons:[],id:61}])
	.applyMap({
		0:[5,1,55],
		1:[0,5,6,8],
		2:[3,8,13],
		3:[2,6,7,8],
		4:[5,6,7,21],
		6:[1,3,5,7,8],
		7:[3,4,6],
		8:[1,2,3,6],
		//south america
		10:[11,12],
		11:[10,12,13,34],
		12:[10,11,13],
		13:[2,11,12],
		//europe
		20:[21,22,23,26],
		21:[4,20,23],
		22:[20,23,24,25],
		23:[20,22,25],
		24:[22,25,26,32,34],
		25:[],
		26:[],
		27:[]
	});*/
// gm.territoryAt=function(x,y) {
// 	var p = this._context.getImageData(x, y, 1, 1).data;
// 	console.log(p);
// 	return this.continents[0].children[1];
// };
gm.load();