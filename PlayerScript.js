// Include the json parse/stringify library. We host it here if you want to use it:
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/json2.js, Script

// Include our utils script that has asset storage and bytearray utils etc.
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js, Script
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/class.js, Script
var currentLatitude = null;
var currentLongitude = null;
var currentVenues = null;

function Player(entity, comp) {
	this.me = entity;
	engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/class.js");
	engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js");
	SetLogChannelName("PlayerScript"); //this can be anything, but best is your aplication name
	//Hook frame update to Update function.
	frame.Updated.connect(this, this.Update);
	//Interval to limit update to 2secs
	var interval;
	//Current data from server, to know if anything has changed.
	var currentData;
	//Save variables to self, coordinates, spraying boolean and which gangster is spraying.
	this.latAndLon = [];
	this.spraying;
	this.gangsterSpraying;

	Log("Script created.");
}


//Get data from server as JSON and iterate it, then call saveVenueGetGangsters for further proceedings. (Checked)
function checkIfPlayerIsSpraying(venues) {
	//Make sure we dont parse data if it has not been changed.
	if (currentVenues == venues.RawData())
		return;
	else
        currentVenues = venues.RawData();
	venues.name = "asset";
	var data = JSON.parse(venues.RawData());
	for(var i=0; i<data.length; ++i) {
		saveVenueGetGangsters(data[i]);
	}
		//asset.ForgetAsset(venues.name, true);
	
}

//Function that collects data from venueData and requests more data from server (gangsters)
function saveVenueGetGangsters (venueData) {
	//Get name for venue.
	var venueName = venueData.name;
	//Gangster currently spraying the venue.
	var gangsterSpraying = venueData.gangsterSpraying;
	//Latitude and longitude of current venue.
	var latAndLon = [venueData.latitude, venueData.longitude];
	//Boolean to know if spraying is initialized for this venue.
	var spraying = venueData.sprayinginitialized;
	//All players in the system, this because ?active is not always on time or can remove players really fast
	// if they idle.
	var players = asset.RequestAsset("http://vm0063.virtues.fi/gangsters/","Binary", true);
	//If we got data we call checkVenueAndPlayer and pass needed variables.
	players.Succeeded.connect(function(){
		checkVenueAndPlayer(players, gangsterSpraying, latAndLon, spraying, venueName);
	});
}


//This function will check if player is actually spraying this venue and if he exists in the scene(is active or not)
function checkVenueAndPlayer(players, gangsterSpraying, latAndLon, spraying, venueName) {
	var data = JSON.parse(players.RawData());
    	for(var i=0; i<data.length; ++i) {
    		//If the ID from venue matches to this current player.
    		if (data[i].id == gangsterSpraying) {
    			var player = scene.EntityByName(data[i].username);    			
    			
    			//If player exists in scene.
    			if (player) {
    				player.dynamiccomponent.SetAttribute("spraying", true);
    				//Call moveplayer with desired data.
    				movePlayer(player, latAndLon, venueName);
    			} else 
                    Log('No initial players in scene. ' + player);
    		}
    	}
    	//asset.ForgetAsset(players.name, true);
}

//Function to move player to the spraying destination.
/* Variables:
	latZero, lonZero = 0 coordinates on 3D map. 
	longitudeInMeters, latitudeInMeters = gps coordinates to match 3d scene values with Haversine formula (CalcLong & CalcLat).
	dlon, dlat = Check in which Quart the coordinates are.
	latAndLon[] = array to hold in coordinates where player is moving. Index 0 is latitude and 1 is longitude.
	placeable, transform = player placeable object to assign coordinates in 3d World.
	plane = The plane to which player is spraying, saved to a variable for orientation.
	*/
function movePlayer(player, latAndLon, venueName) {
    Log('We set the venueSprayed to player with value ' + venueName);
    player.dynamiccomponent.SetAttribute('venueSprayed', venueName);
	var latZero =  65.012115;
	var lonZero = 25.473323;

	var longitudeInMeters = CalcLong(lonZero, latAndLon[1], latZero, latAndLon[0]);
	var latitudeInMeters = CalcLat(latZero, latAndLon[0]);
	
	var dlon = latAndLon[1] - lonZero;
	var dlat = latAndLon[0] - latZero;

          
          
	var gps = player.dynamiccomponent.GetAttribute('posGPS');
	gps.x = latAndLon[1];
	gps.z = latAndLon[0];
	player.dynamiccomponent.SetAttribute('posGPS', new float3(gps.x, 0, gps.z));
          Log(player.dynamiccomponent.GetAttribute('posGPS') + " GPS coordinates in player when spraying");

	//Set to null for next time.
	latAndLon[0] = null;
	latAndLon[1] = null;
	
//Check in which quarter values are.
	if (dlon < 0) 
		longitudeInMeters = -longitudeInMeters;
	if (dlat > 0)
		latitudeInMeters = -latitudeInMeters;

	var placeable = player.placeable;
	var transform = placeable.transform;

	//Change robo to sprayed plane
	var plane = scene.EntityByName("graffiti-plane-" + venueName);
	transform.pos.x = longitudeInMeters;
	transform.pos.y = 7; //Highest of Oulu3D
	transform.pos.z = latitudeInMeters;
	placeable.SetOrientation(lookAtPoint(player.placeable.WorldPosition(), new float3(player.placeable.Position().x, plane.placeable.WorldPosition().y, player.placeable.Position().z)));
	//Assign new values to player placeable object.
	placeable.transform = transform;

	
    Log(plane + " and who " + player);
	//Enable spraying animation.
	player.animationcontroller.EnableExclusiveAnimation('spray', false, 1, 1, false);
          //Use lookAt to rotate player to look at the target.

	//When animation has finished stop animations and play stand animation.
	player.animationcontroller.AnimationFinished.connect(function(){
		player.dynamiccomponent.SetAttribute('spraying', false);
		player.animationcontroller.EnableExclusiveAnimation('stand', true, 1, 1, false);
	});
}	

function lookAtPoint(from, what) {
    var targetLookatDir = what.Sub(from);
    targetLookatDir = targetLookatDir.Normalized();
    var endRot = Quat.LookAt(scene.ForwardVector(), targetLookatDir, scene.UpVector(), scene.UpVector());
    return endRot;
}

//Haversine formula calculation functions to make GPS coordinates into 3d world coordinates.
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

//Haversine formula calculation functions to make GPS coordinates into 3d world coordinates.
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
	if (!server.IsRunning()) {
		//GET venues
            
                var transfer = asset.RequestAsset("http://vm0063.virtues.fi/venues/?active", "Binary", true);
                transfer.Succeeded.connect(checkIfPlayerIsSpraying);
            
	} else {
	//NOthing on srv side atm.
	}	
}