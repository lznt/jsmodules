function PoliceScript (entity, comp){
	//Constructing variables we need
	/*
	this.move: Keeps in track not to go to MovePolice function before calculations have been done.
	this.calc: Keeps track that we do not go to Calculate or MovePolice before we have gotten the position where to go.
	this.calculate: Keeps track that we do not go to calculate after its been ran, unless calc has been ran again.
	this.dest: The destination variable for GetDestination and Calculate to use.
	this.totalLat, this.totalLon: For calculate function the totalLat and totalLon to determine when to stop moving.
	this.setted: If entity has been set for the first time, this is true. If not then false.
	rnd: The array of 16 spots(0-15). For the random function to determine starting point.
	this.curPos: Current position of avatar, see constructor end to check what different numbers present.
	*/

	this.animating = false;
	this.me = entity;
	frame.Updated.connect(this, this.Update);
	//Logic has attribute id to give all policemen their identical name. 
	Logic = scene.GetEntityByName('Logic');
	var id=Logic.dynamiccomponent.GetAttribute('id');
	Logic.dynamiccomponent.SetAttribute('id', (id + 1));
	this.me.SetName("Police" + String(Logic.dynamiccomponent.GetAttribute('id')));
	var rnd = new Array(16);
	var avatarurl = "avatar_police.avatar";
	var r = this.me.avatar.appearanceRef;
    r.ref = avatarurl;
    this.me.avatar.appearanceRef = r;
	
	this.attacments = false;
	this.move = false;
	this.calc = true;
	this.calculate = false;
	this.dest;
	this.totalLat;
	this.totalLon;
	this.setted = false;
	this.curPos = random(rnd.length);
	this.me.dynamiccomponent.CreateAttribute('string', 'PlayerName');
	

	/* Referencelist for numbers
	A = ASEMAKTORIK = array([65.014685,25.471802])
	B = ASEMAKKIRKK = array([65.014172,25.473626])
	C = ASEMAKISOK = array([65.013642,25.475589])
	D = ASEMAKUUSIK = array([65.013117,25.477477])
	E = TORIKHALLIK = array([65.013955,25.470729])
	F = KIRKKOKHALLIK = array([65.013484,25.472564])
	G = KIRKKOKHALLIK2 = array([65.013212,25.472209])
	H = ISOKHALLIK = array([65.012691,25.474184])
	I = TORIKPAKKAHK = array([65.013185,25.469527])
	J = KIRKKOKPAKKAHK = array([65.01265,25.471405])
	K = ISOKPAKKAHK = array([65.012124,25.473433])
	L = UUSIKPAKKAHK = array([65.011607,25.475353])
	M = TORIKKAUPPURIK = array([65.01231,25.468261])
	N = KIRKKOKKAUPPURIK = array([65.011798,25.470171])
	O = ISOKKAUPPURIK = array([65.011267,25.472134])
	P = UUSIKKAUPPURIK = array([65.010742,25.474119])
	*/
	
	//Init places to go and place them in this.points array.
	this.points = [];
	
	A = new Object();
	A.lat=65.014680;
	A.lon=25.471775;
	A.next = [1, 4];
	this.points[0] = A;
	
	B = new Object();
	B.lat = 65.014168;
	B.lon = 25.473652;
	B.next = [0, 2, 5];
	this.points[1] = B;
	
	C = new Object();
	C.lat = 65.013635;
	C.lon = 25.4756;
	C.next = [1, 3, 7];
	this.points[2] = C;
	
	D = new Object();
	D.lat = 65.013123;
	D.lon = 25.477509;
	D.next = [2, 11];
	this.points[3] = D;

	E = new Object();
	E.lat = 65.013966;
	E.lon = 25.470697;
	E.next = [0, 5, 8];
	this.points[4] = E;
	
	F = new Object();
	F.lat = 65.013459;
	F.lon = 25.472574;
	F.next = [1, 4, 6];
	this.points[5] = F;
	
	G = new Object();
	G.lat = 65.013205;
	G.lon = 25.472252;
	G.next = [5, 7, 9];
	this.points[6] = G;
	
	H = new Object();
	H.lat = 65.012695;
	H.lon = 25.474184;
	H.next = [2, 6, 10];
	this.points[7] = H;
	
	I = new Object();
	I.lat = 65.01318;
	I.lon = 25.469522;
	I.next = [4, 9, 12];
	this.points[8] = I;
	
	J = new Object();
	J.lat = 65.012654;
	J.lon = 25.471453;
	J.next = [6, 8, 10, 13];
	this.points[9] = J;
	
	K = new Object();
	K.lat = 65.012122;
	K.lon = 25.473374;
	K.next = [7, 9, 11];
	this.points[10] = K;	
		
	L = new Object();
	L.lat = 65.011605;
	L.lon = 25.475353;
	L.next = [3, 10, 15];
	this.points[11] = L;
	
	M = new Object();
	M.lat = 65.012292;
	M.lon = 25.468251;
	M.next = [8, 13];
	this.points[12] = M;
	
	N = new Object();
	N.lat = 65.011798;
	N.lon = 25.470171;
	N.next = [9, 12, 14];
	this.points[13] = N;
	
	O = new Object();
	O.lat = 65.011277;
	O.lon = 25.472102;
	O.next = [10, 13, 15];
	this.points[14] = O;
	
	P = new Object();
	P.lat = 65.010737;
	P.lon = 25.474066;
	P.next = [11, 14];
	this.points[15] = P;

}

//Our own random function to make a random
function random(n) {
	seed = new Date().getTime();
	seed = (seed*9301+49297) % 233280;
	
	return (Math.floor((seed/(233280.0)* n)));
}

/*
Calculates the distance from GPS coords to realXtend coordinates, with haversine formula. Same principle as in websocketserver.py - move()
*/
PoliceScript.prototype.Calculate = function(){
	/* 
	VARIABLES:
	lat1, lon1 = 0,y,0 of our 3d map in real coordinates
	lat, lon = new coordinates that the police gets from pre-destined objects.
	pos = own position(current)
	latitudeInMeters = distance to be walked calculated with haversine(z axis)
	longitudeInMeters = distance to be walked calculated with haversine(x axis)
	dlon, dlat = to check on what quad the new destination is in.
	relativeLat, relativeLon = the distance to be walked
	*/
	var lat1 = 65.012124;
	var lon1 = 25.473395;
	var lat = this.dest[0];
	var lon = this.dest[1];
	var lat2 = lat;
	var lon2 = lon;
	var pos = this.me.placeable.Position();
	
	var latitudeInMeters = this.CalcLat(lat1, lat2);
	var longitudeInMeters = this.CalcLong(lon1, lon2, lat1, lat2);
	
	
	var dlon = lon2 - lon1;
	var dlat = lat2 - lat1;
	
	if (dlon < 0) 
		longitudeInMeters = -longitudeInMeters;
	if (dlat > 0)
		latitudeInMeters = -latitudeInMeters;

	this.relativeLon = longitudeInMeters - pos.x;
	this.relativeLat = latitudeInMeters - pos.z;

	
	if (Math.abs(this.relativeLat) >= Math.abs(this.relativeLon)){
		this.ratioLon = Math.abs(this.relativeLon / this.relativeLat);
		this.ratioLat = 1;
	}else{ //relativeLon > relativeLat
		this.ratioLat = Math.abs(this.relativeLat / this.relativeLon);
		this.ratioLon = 1;
	}
	
	this.totalLat = 0;
	this.totalLon = 0;
	//If policebot is setted for the first time setted == false
	//This way the bot will be placed on a position and will not walk until it takes a new position.
	if (this.setted == false){
		var tm = this.me.placeable.transform;
		tm.pos.x = longitudeInMeters;
		tm.pos.z = latitudeInMeters;
		tm.pos.y = -4;
		this.me.placeable.transform = tm;
		this.setted = true;
		this.calc = true;
		this.calculate = false;
		this.me.placeable.visible = true;
	}else{
		this.calculate = false;
		this.move = true;
	}
}

PoliceScript.prototype.GetDestination = function() {
	//Get next destination in relation to current position, from all possible goals. 
	var index = random(this.points[this.curPos].next.length);
	this.curPos = this.points[this.curPos].next[index];
	this.dest = [this.points[this.curPos].lat, this.points[this.curPos].lon];
	this.calc = false;
	this.calculate = true;

}

PoliceScript.prototype.CalcLong = function(lon1, lon2, lat1, lat2){
	var radius = 6371; // km
	var dlat = 0;
	var dlon = (lon2-lon1) * (Math.PI/180);
	var a = Math.sin(dlat/2) * Math.sin(dlat/2) + Math.cos(lat1*(Math.PI/180)) 
		* Math.cos(lat2*(Math.PI/180)) * Math.sin(dlon/2) * Math.sin(dlon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = radius * c;
	
	var longitudeInMeters = d * 1000;
	
	return longitudeInMeters;
}

PoliceScript.prototype.CalcLat = function(lat1, lat2){
	var radius = 6371; //km
	
	var dlat = (lat2-lat1) * (Math.PI/180);
	var dlon = 0;
	
	var a = Math.sin(dlat/2) * Math.sin(dlat/2) + Math.cos(lat1*(Math.PI/180)) 
		* Math.cos(lat2*(Math.PI/180)) * Math.sin(dlon/2) * Math.sin(dlon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = radius * c;
	
	var latitudeInMeters = d * 1000;
	
	return latitudeInMeters;
}

PoliceScript.prototype.MovePolice = function(frametime){
	
	//The function to actually move policeman in the scene. Same principle as in BotScript_application.js
	var time = frametime;
	var speed = 2.0;
	var pos = this.me.placeable.Position();
	var tm = this.me.placeable.transform;
	var yNow = pos.y;
	var xNow = pos.x;
	var zNow = pos.z;
	var lats = speed * time * this.ratioLat;
	var lons = speed * time * this.ratioLon;
	
	if (this.relativeLon >= 0)
		var finalMovementx = xNow + lons;
	else
		var finalMovementx = xNow - lons;
			
	if (this.relativeLat >= 0)
		var finalMovementz = zNow + lats;
	else
		var finalMovementz = zNow - lats;
	
	this.totalLat += lats;
	this.totalLon += lons;
	
	tm.pos.x = finalMovementx;
	tm.pos.z = finalMovementz;
	this.me.placeable.transform = tm;
	
	//Not working always!!!!!!
	angleOfOrientation = Math.atan2(Math.abs(this.relativeLat), Math.abs(this.relativeLon));

	if (this.relativeLat>=0 && this.relativeLon>=0){ 	
		tm.rot.y = (Math.PI + angleOfOrientation) * (180/Math.PI);
		tm.rot.y += 15;
	}
	else if (this.relativeLat>=0 && this.relativeLon<0){
		tm.rot.y = (Math.PI - angleOfOrientation) * (180/Math.PI);
		tm.rot.y +=15;
	}
	else if (this.relativeLat<0 && this.relativeLon>=0){ 
		tm.rot.y = (2*Math.PI - angleOfOrientation) * (180/Math.PI);
		tm.rot.y += 15;
	}
	else if (this.relativeLat<0 && this.relativeLon<0){ 
		tm.rot.y = angleOfOrientation * (180/Math.PI);
		tm.rot.y += 15;
	}
	
	this.me.placeable.transform = tm;	
	
	var pos = this.me.placeable.Position();
	var tm = this.me.placeable.transform;
	var yNow = pos.y;
	var xNow = pos.x;
	var zNow = pos.z;
	
	//If we are at destination.
	if (this.totalLat > Math.abs(this.relativeLat) || this.totalLon > Math.abs(this.relativeLon)) {
		this.move = false;
		this.calc = true;

	}
}
/*
The function that adds attachments for police officers, Script is basically empty, needed only to later on get the attachment entity.
*/
PoliceScript.prototype.AddAttachments = function(){
	var Policemen = scene.GetEntitiesWithComponent("EC_Script", "Police");
	var n = 0;
	this.policeattachments = [];
	for (i in Policemen){
		if(Policemen[i].dynamiccomponent.GetAttribute('attachments') == false){
			var attachment = scene.CreateEntity(scene.NextFreeId(),["EC_Placeable", "EC_Mesh", "EC_Name", "EC_AnimationController", "EC_DynamicComponent"]);
			attachment.name = 'Pants' + Policemen[i].name;
			attachment.GetOrCreateComponent("EC_Script", 'Attachments');
			attachment.dynamiccomponent.CreateAttribute('bool', 'Animating');
			attachment.dynamiccomponent.SetAttribute('Animating', false);
			attachment.script.className = "BotScriptApp.Attachments";
			attachment.mesh.meshRef = new AssetReference('local://attachments/male_trousers_texture_lightbrown.mesh');
			var tm = attachment.placeable.transform;
			attachment.placeable.SetScale(1.02, 1.02, 1.02);
			attachment.SetTemporary(true);

			//These add attachments for player. Not used prolly..
			var meshlist = attachment.mesh.meshMaterial;
			meshlist = ['male_trousers_texture_lightbrown.material'];
			attachment.mesh.meshMaterial = meshlist;
			
			
			var parentRef = attachment.placeable.parentRef;
			parentRef.ref = Policemen[i];
			attachment.placeable.parentRef = parentRef;
			attachment.placeable.parentBone = "Bip01_Spine02";
			tm.pos.y = -0.88;
			attachment.placeable.transform = tm;
			Policemen[i].dynamiccomponent.SetAttribute('attachments', true);

		}

	}

}

PoliceScript.prototype.UpdateClient = function(frametime){
	//Animations for policeman.

	var attachments = scene.GetEntitiesWithComponent("EC_Script", "Attachments");

	this.me.mesh.SetMorphWeight("Morph_muscular-arms-lower", 0.4);
	this.me.mesh.SetMorphWeight("Morph_muscular-arms-upper", 0.5);
	this.me.mesh.SetMorphWeight("Morph_muscular-body-upper", 0.6);
	this.me.mesh.SetMorphWeight("Morph_muscular-legs-upper", 0.6);
	this.me.mesh.SetMorphWeight("Morph_muscular-legs-lower", 0.6);
	this.me.animationcontroller.SetAnimationSpeed('Walk', 0.6);
	this.me.animationcontroller.PlayAnim('Walk', 0.25, 'Walk');
	//TOFIX: ANIMATIONS DON'T SYNC. APPEARING TO BE A BUG IN REX(???)
	for(i in attachments){
		//if(attachments[i].name == 'Pants'+this.me.Name()){
			//attachments[i].animationcontroller.SetAnimationSpeed('Walk', 0.6);

			//attachments[i].animationcontroller.PlayAnim('Walk', 0.25, 'Walk');
			
		//}
	}
}

PoliceScript.prototype.BustAPlayer = function(frametime){
	//Get players.
	var Players = scene.GetEntitiesWithComponent('EC_Script', 'Player');
	Logic = scene.GetEntityByName('Logic');
	
	//Checks all players and if someone is spraying and in 25m of policeofficer, busted is saved for that player. Also into logic,
	//Because logic sends that value to ws.py which then gives the sendAll function to send our server the info of that bust.
	if (Players[0] == null){
		//print('No players in the scene');
	}else{
		for (i in Players){
			xNow = this.me.placeable.Position().x;
			zNow = this.me.placeable.Position().z;
			var player = Players[i].Name();

			//Get actual distance between players.
			var dist = Math.sqrt(Math.pow((xNow - Players[i].placeable.Position().x), 2) + 
				Math.pow((zNow - Players[i].placeable.Position().z), 2));
			
			Player = Players[i];
			if(dist <= 25 && Players[i].dynamiccomponent.GetAttribute('Spraying')==true){
				print (dist);
				print('Do we enter here?');
				Logic.dynamiccomponent.SetAttribute('Busted', true); 
				Players[i].dynamiccomponent.SetAttribute('Busted', true);
				Logic.dynamiccomponent.SetAttribute('PlayerName', player);
				Players[i].dynamiccomponent.SetAttribute('Spraying', false);
				Logic.dynamiccomponent.SetAttribute('BustingOfficer', this.me.Name());
			
			}else{
				Logic.dynamiccomponent.SetAttribute('Busted', false);
				//Players[i].dynamiccomponent.SetAttribute('Busted', false);
			}
		}
	}
	
	
}

PoliceScript.prototype.Update = function(frametime) {

	if (server.IsRunning()){
		//Commented out because of attachments animations not syncing with the avatars
		//this.AddAttachments();
		
		
		if(this.calc == true)
			this.GetDestination();
		else		
			if(this.calculate == true)
				this.Calculate();
		else	
			if(this.move == true)
				this.MovePolice(frametime);
				
		this.BustAPlayer(frametime);
		
	}else
		this.UpdateClient(frametime);
		
		
}