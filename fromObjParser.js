  function Start()
8          {
9               K3D.load("kartta.obj", loaded);		// loading file ...
10          }
11          
12          function loaded(data)
13          {
14               var m = K3D.parse.fromOBJ(data);	// done !
15               console.log(m);
16               
17               var stage = new Stage("c");  
18               var s = new Sprite(); 
19               stage.addChild(s);
20               
21               s.x = stage.stageWidth/2; 
22               s.y = stage.stageHeight/2 + 200;
23               s.z = 300;
24               s.scaleX = s.scaleY = s.scaleZ = 5;
25               
26               //	I need to index vertices and UVT with the same indices... 0, 1, 2, ...
27               var vts = K3D.edit.unwrap(m.i_verts, m.c_verts, 3);
28               
29               //  In my engine, Y goes down, but in my model, Y goes up
30               K3D.edit.transform(vts, K3D.mat.scale(1,-1,1));	
31               var uvt = K3D.edit.unwrap(m.i_uvt  , m.c_uvt  , 2);
32               var ind = [];
33               for(var i=0; i<m.i_verts.length; i++) ind.push(i);
34               
35               s.graphics.beginBitmapFill(new BitmapData("raptor.jpg"));
36               s.graphics.drawTriangles3D(vts, ind, uvt);
37               
38               stage.addEventListener(Event.ENTER_FRAME, 
39                    function(e) { s.rotationY += 0.01*(stage.mouseX - stage.stageWidth/2); } );
40          }