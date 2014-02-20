// Include the json parse/stringify library. We host it here if you want to use it:
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/json2.js, Script

// Include our utils script that has asset storage and bytearray utils etc.
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js, Script
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/class.js, Script
function Player(entity, comp) {
	this.me = entity;
	engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/class.js");
	engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js");
	SetLogChannelName("PlayerScript"); //this can be anything, but best is your aplication name
	frame.Updated.connect(this, this.Update);
	var interval;
	var currentData;
	this.latAndLon = [];
	this.spraying;
	this.gangsterSpraying;

	Log("Script created.");
}


//Get data from server as JSON and iterate it, then call checkVenue for further proceedings. (Checked)
function checkIfPlayerIsSpraying(venues) {
	if (interval > 50) {
		venues.name = "asset"
		//Check if data on server has changed or not. No need to parse same data over and over again.
		if (String(venues.RawData()) == currentData) {
			interval = 0;
			return;
		} else
    			currentData = String(venues.RawData());
    		//Make sure venuedata is parseable.
    		var data = JSON.parse(venues.RawData());
    		for(var i=0; i<data.length; ++i) {
    			haxMyMax(data[i]);
   			}
   		asset.ForgetAsset(venues.name, true);	
		interval = 0;

	} else
		interval ++;  
}

function haxMyMax (venueData) {
	var gangsterSpraying = venueData.gangsterSpraying;

	var latAndLon = [venueData.latitude, venueData.longitude];
	var spraying = venueData.sprayinginitialized;
	var players = asset.RequestAsset("http://vm0063.virtues.fi/gangsters/","Binary", true);
	players.Succeeded.connect(function(){
		checkVenueAndPlayer(players, gangsterSpraying, latAndLon, spraying);
	});
}

function checkVenueAndPlayer(players, gangsterSpraying, latAndLon, spraying) {
	if (players)
		players.name = 'playersAsset';

	var data = JSON.parse(players.RawData());
    	for(var i=0; i<data.length; ++i) {
    		if (data[i].id == gangsterSpraying) {
    			var player = scene.EntityByName(data[i].username);    			

    			Log("Gangster is " + player.name + " from server " + data[i].username);

    			if (player) {
    				Log("Is someone spraying ? " + player.name);
    				player.dynamiccomponent.SetAttribute("spraying", true);
    				movePlayer(player, latAndLon);
    			}
    		}
    	}
    	asset.ForgetAsset(players.name, true);
}

Player.prototype.OnScriptDestroyed = function() {
	frame.Updated.disconnect(this, this.Update);
}

function movePlayer(player, latAndLon) {
	//0,0 on the map. 
	var latZero =  65.012115;
	var lonZero = 25.473323;

	//Near letku puisto for testing.
	latAndLon[0] = 65.012981;
	latAndLon[1] = 25.473173;	
	//Hardcoded values for testing.

	var longitudeInMeters = CalcLong(lonZero, latAndLon[1], latZero, latAndLon[0]);
	var latitudeInMeters = CalcLat(latZero, latAndLon[0]);
	
	var dlon = latAndLon[1] - lonZero;
	var dlat = latAndLon[0] - latZero;

	latAndLon[0] = null;
	latAndLon[1] = null;

	if (dlon < 0) 
		longitudeInMeters = -longitudeInMeters;
	if (dlat > 0)
		latitudeInMeters = -latitudeInMeters;
	Log("Player " + this.me.name + " is spraying and we are moving him to " + latitudeInMeters + " -- " + longitudeInMeters);

	var placeable = player.placeable;
	var transform = placeable.transform;
	transform.pos.x = longitudeInMeters;
	transform.pos.y = 9,9; //Highest of Oulu3D
	transform.pos.z = latitudeInMeters;
	placeable.transform = transform;
	
	Log("lat and lon" + placeable.transform);
	player.animationcontroller.StopAllAnims(0);
	player.animationcontroller.PlayAnim('spray', 0, 'spray');

	player.animationcontroller.AnimationFinished.connect(function(){
		player.animationcontroller.StopAllAnims(0);
		
		//Do this later back on when the phone actually gives valid gps info.
		//player.dynamiccomponent.SetAttribute('spraying', false);
		player.animationcontroller.PlayLoopedAnim('stand', 0, 'stand');
	});
}	


function CalcLong(lon1, lon2, lat1, lat2){
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

function CalcLat(lat1, lat2){
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

Player.prototype.Update = function(frametime) {
	if (server.IsRunning()) {
		//GET venues    
	} else {
		var transfer = asset.RequestAsset("http://vm0063.virtues.fi/venues/?active", "Binary", true);
		transfer.Succeeded.connect(checkIfPlayerIsSpraying);

	}	
}
