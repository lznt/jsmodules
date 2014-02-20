// Include the json parse/stringify library. We host it here if you want to use it:
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/json2.js, Script

// Include our utils script that has asset storage and bytearray utils etc.
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js, Script
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/class.js, Script


engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/class.js");
engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js");

SetLogChannelName("gangsterscript"); //this can be anything, but best is your aplication name
Log("Script starting...");
var materialRefs = ["http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-blue/avatar-blue.material", 
	"http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-green/avatar-green.material", 
		"http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-purple/avatar-purple.material"];
var skeletonRefs = ["http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-blue/avatar-blue.skeleton", 
	"http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-green/avatar-green.skeleton",
			 "http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-purple/avatar-purple.skeleton"];
var meshRefs = ["http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-blue/avatar-blue.mesh",
	"http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-green/avatar-green.mesh",
		"http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-purple/avatar-purple.mesh"];
		 
var currentLat = 0;
var currentLon = 0;	 
var interval = 0;
frame.Updated.connect(Update);
var appearance;

var myHandler = function (myAsset) {
    Log("successfully connected");
    //Checker for null value and empty json.
    if (myAsset.RawData() == [] || myAsset.RawData() == "")
        return;

    var data = JSON.parse(myAsset.RawData());
    for(var i=0; i<data.length; ++i) {
        addAvatar(data[i]);
    }
    // Forget the disk asset so it wont be returned from cache next time you do the same request
    asset.ForgetAsset(myAsset.Name(), true);

}

var addAvatar = function(user){
	var avatarEntityName = user.username;
	Log("Adding new player " + avatarEntityName);
	//If entity already exists in view
	if (scene.EntityByName(avatarEntityName)) {
		Log("Entity already in Scene" + avatarEntityName);
		var avatarEntity = scene.EntityByName(avatarEntityName);
		if (avatarEntity.dynamiccomponent.GetAttribute('spraying') == true)
			return;
	} else {
		
		var avatarEntity = scene.CreateEntity(scene.NextFreeId(), ["RigidBody", "Avatar", "Mesh", "Script", "Placeable", "AnimationController", "DynamicComponent"]);
		avatarEntity.SetTemporary(true); // We never want to save the avatar entities to disk.               
		avatarEntity.SetName(avatarEntityName);
		avatarEntity.SetDescription(avatarEntityName);
		avatarEntity.dynamiccomponent.CreateAttribute('bool', 'spraying');
		avatarEntity.rigidbody.mass = 2;
		avatarEntity.placeable.visible = false;
		//appearance = avatarEntity.avatar.appearanceRef;
		
		
		if (user.color == "green") {			
			avatarEntity.mesh.materialRefs = new Array(materialRefs[1]);
			avatarEntity.mesh.meshRef = meshRefs[1];
			avatarEntity.mesh.skeletonRef = skeletonRefs[1];
		} else if (user.color == "blue") {
			avatarEntity.mesh.meshRef = meshRefs[0];
			avatarEntity.mesh.materialRefs = new Array(materialRefs[0]);
			avatarEntity.mesh.skeletonRef = skeletonRefs[0];
		} else if (user.color == "purple") {
			avatarEntity.mesh.meshRef = meshRefs[2];
			avatarEntity.mesh.materialRefs = new Array(materialRefs[2]);
			avatarEntity.mesh.skeletonRef = skeletonRefs[2];
		}
		avatarEntity.rigidbody.angularFactor = new float3(0,0,0);
		var script = avatarEntity.script;
		//script.scriptRef = new Array("http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/scripts/PlayerScript.js");
		script.className = "SAGScripts.Player";
		script.runOnLoad = true;
	}

          
	// Set starting position to match the current position in City.
	//var lat = user.latitude;
	//var lon = user.longitude;

	//insert player only once to the same spot.
	if (user.latitude == currentLat && user.longitude == currentLon)
		return;
	else {
		user.latitude = lat;
		user.longitude = lon;
	}
	
	//Test values GinaTricot oulu.
	var lat = 65.011802;
	var lon = 25.472868;

	//0,0 on the map.
	var latZero =  65.012115;
	var lonZero = 25.473323;
	//For testing, Near puistola. it seems that coordinates dont correlate to real world.
	//var lat = 65.012577;
	//var lon = 25.47171;
	var longitudeInMeters = CalcLong(lonZero, lon, latZero, lat);
	var latitudeInMeters = CalcLat(latZero, lat);

	var dlon = lon - lonZero;
	var dlat = lat - latZero;

	if (dlon < 0) 
		longitudeInMeters = -longitudeInMeters;
	if (dlat > 0)
		latitudeInMeters = -latitudeInMeters;

	avatarEntity.placeable.visible = true;
	var placeable = avatarEntity.placeable;
	var transform = placeable.transform;
	transform.pos.x = longitudeInMeters;
	transform.pos.y = 9,9; //Highest of Oulu3D
	transform.pos.z = latitudeInMeters;
	placeable.transform = transform;

	if (avatarEntity.dynamiccomponent.GetAttribute('spraying') == false)
		avatarEntity.animationcontroller.PlayLoopedAnim('stand', 0, 'stand');
	
	Log("Created avatar for " + avatarEntityName);
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

//TODO: make function that removes entities that are not on the ?active list.

function Update () {
    if (server.IsRunning()) {
        //GET active users
        if (interval > 50) {
            var transfer = asset.RequestAsset("http://vm0063.virtues.fi/gangsters/?active", "Binary", true);
            transfer.Succeeded.connect(myHandler);  
            interval = 0; 

        } else 
            interval++;
    } else {
    }
}