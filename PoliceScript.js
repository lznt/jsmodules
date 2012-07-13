function PoliceScript (entity, comp){

	this.me = entity;
	frame.Updated.connect(this, this.Update);
	var avatarurl = "default_avatar.avatar";
	var r = this.me.avatar.appearanceRef;
    r.ref = avatarurl;
    this.me.avatar.appearanceRef = r;
	this.move = false;
	this.calc = true;
	this.calculate = false;
	var rnd = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
	this.curPos = 0 //TO FIX = random(rnd);
	this.dest;
	this.totalLat;
	this.totalLon;
	//this.setted = false;
	
	
	
	//Initialize positions
	/* Referencelist for letters
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



PoliceScript.prototype.GetDestination = function() {
	//NOT WORKING IF curPos is not 0
	var index = random(this.points[this.curPos].next.length);
	this.curPos = this.points[this.curPos].next[index];
	this.dest = [this.points[this.curPos].lat, this.points[this.curPos].lon];
	
	this.calc = false;
	this.calculate = true;

}

PoliceScript.prototype.Calculate = function(){

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
	
	/*if (this.setted == false){
		var tm = this.me.placeable.transform;
		tm.pos.x = this.relativeLat;
		tm.pos.z = this.relativeLon;
		this.me.placeable.transform = tm;
		this.setted = true;
	}*/
	
	this.calculate = false;
	this.move = true;
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
	
	
	var time = frametime;
	var speed = 3.0;
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
	
	angleOfOrientation = Math.atan2(Math.abs(this.relativeLat), Math.abs(this.relativeLon)) * (180/Math.PI);
	if (this.relativeLat>=0 && this.relativeLon>=0) 
		tm.rot.y = angleOfOrientation;
	
	else if (this.relativeLat>=0 && this.relativeLon<0) 
		tm.rot.y = Math.PI - angleOfOrientation;
	
	else if (this.relativeLat<0 && this.relativeLon>=0) 
		tm.rot.y = 2*Math.PI - angleOfOrientation;
		
	else if (this.relativeLat<0 && this.relativeLon<0) 
		tm.rot.y = Math.PI + angleOfOrientation;
	
	this.me.placeable.transform = tm;
	
	var pos = this.me.placeable.Position();
	var tm = this.me.placeable.transform;
	var yNow = pos.y;
	var xNow = pos.x;
	var zNow = pos.z;
	
	if (this.totalLat > Math.abs(this.relativeLat) || this.totalLon > Math.abs(this.relativeLon)) {
		this.move = false;
		this.calc = true;
	}
}

PoliceScript.prototype.UpdateClient = function(frametime){

		this.me.animationcontroller.SetAnimationSpeed('Run', '1.6');
		this.me.animationcontroller.EnableAnimation('Run', true, 0.25, false);
}

function random(n) {
	seed = new Date().getTime();
	seed = (seed*9301+49297) % 233280;
	
	return (Math.floor((seed/(233280.0)* n)));
}

PoliceScript.prototype.Update = function(frametime) {
	if (server.IsRunning()){

		if(this.calc == true)
			this.GetDestination();
	else	
		if(this.calculate == true)
			this.Calculate();
	else	
		if(this.move == true)
			this.MovePolice(frametime);
	}else
		this.UpdateClient(frametime);
}