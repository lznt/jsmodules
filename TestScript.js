// Include the json parse/stringify library. We host it here if you want to use it:
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/json2.js, Script

// Include our utils script that has asset storage and bytearray utils etc.
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js, Script
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/class.js, Script

engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/class.js");
engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js");
SetLogChannelName("Test script"); //this can be anything, but best is your application name

Log("Script starting");

var graffitiLinks = ["http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/graffiti/blue.material",
"http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/graffiti/purple.material", "http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/graffiti/green.material"];

var materialRefs = ["http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-blue/avatar-blue.material", 
	"http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-green/avatar-green.material", 
		"http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-purple/avatar-purple.material"];
var skeletonRefs = ["http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-blue/avatar-blue.skeleton", 
	"http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-green/avatar-green.skeleton",
			 "http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-purple/avatar-purple.skeleton"];
var meshRefs = ["http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-blue/avatar-blue.mesh",
	"http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-green/avatar-green.mesh",
		"http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/avatars/avatar-purple/avatar-purple.mesh"];


var oldRandom;
var pathWays = null;
var playerCount=0;
var json;
frame.Updated.connect(Update);

var transfer = asset.RequestAsset("http://vm0063.virtues.fi/gangsters/", "Binary", true);
transfer.Succeeded.connect(function(transfer){
	json = JSON.parse(transfer.RawData());
	for (var i in json) {
           	addAvatar(json[i]);
	}
});

var transfer = asset.RequestAsset("http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/navmesh/kartta.obj", "Binary", true);
transfer.Succeeded.connect(function(transfer) {
    pathWays = parseObjData(transfer);
});
var inter = 5.3;
function Update(frametime) {
    if(!server.IsRunning()) {
		if (inter > 300) {
			inter = 0;
			moveTestPlayers(pathWays);
		} else {
			inter = inter + 1;
		}
    }
}

function searchDest(pathWays, player) {
	var dist = 50;
	while (dist > 30) {
		var nextDesti = pathWays[random(pathWays.length)];
           	var dist = Math.sqrt(Math.pow((nextDesti[0] - player.placeable.Position().x), 2) + 
                Math.pow((nextDesti[1] - player.placeable.Position().z), 2));
	}
	return nextDesti;
}

function moveTestPlayers(pathWays) {
	if (!pathWays) return;
	var players = scene.EntitiesOfGroup('Player');
    if (players.length < 1) return;
    var randomNo = random(players.length);

    var player = players[randomNo];

    var newPos = searchDest(pathWays, player);

    var xNow = newPos[0];
    var zNow = newPos[1];
    Log(oldRandom + "--" + randomNo);
    //Check if we wanna launch spraying for one of the players.
    if ((oldRandom + randomNo) > 7) {
          Log('lets spray' + player);
    	launchSprayEvent(player);
    	oldRandom = randomNo;
    	return;
    }
    oldRandom = randomNo;

    var tm = player.placeable.transform;
    tm.pos.x = xNow;
    tm.pos.z = zNow;
    player.placeable.transform = tm;
}

//Launch if our random if is filling the exact info.
function launchSprayEvent(player) {
	var dist = 0;
	var plane = null;
	var planes = scene.EntitiesOfGroup('graffiti');
	for (var i in planes) {
		var xNow = planes[i].placeable.Position().x;
		var zNow = planes[i].placeable.Position().z;
                    
		if (Math.sqrt(Math.pow((xNow - player.placeable.Position().x), 2) + 
            Math.pow((zNow - player.placeable.Position().z), 2)) <= dist || dist == 0) {
			dist = Math.sqrt(Math.pow((xNow - player.placeable.Position().x), 2) + 
            	Math.pow((zNow - player.placeable.Position().z), 2));
			plane = planes[i];
		} else continue;

		player.dynamiccomponent.SetAttribute('spraying', true);
                    Log(player.placeable.pos + " --- " + plane.placeable.pos);
		var tm = player.placeable.transform;
		tm.pos.x = plane.placeable.Position().x;
		tm.pos.z = plane.placeable.Position().z;
                    tm.pos.y = 9;
		player.placeable.transform = tm;
                    Log(player.pos + " --- " + plane.pos);
                    
                    if (player.dynamiccomponent.GetAttribute('gang') == "blue") {
                        //Add particle effect to plane and also change plane logo.
                        plane.mesh.materialRefs = new Array(graffitiLinks[0]);
                        plane.particlesystem.particleRef = "http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle-graffiti-plane/bluespray.particle";
                    } else if (player.dynamiccomponent.GetAttribute('gang') == "green") {
                        plane.mesh.materialRefs = new Array(graffitiLinks[2]);
                        plane.particlesystem.particleRef = "http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle-graffiti-plane/greenspray.particle";
                    } else if (player.dynamiccomponent.GetAttribute('gang') == "purple") {
                        plane.mesh.materialRefs = new Array(graffitiLinks[1]);
                        plane.particlesystem.particleRef = "http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle-graffiti-plane/purplespray.particle";
                    } 
                    plane.particlesystem.enabled = true;
		player.animationcontroller.EnableExclusiveAnimation('spray', false, 1, 1, false);
		player.animationcontroller.AnimationFinished.connect(function(){
			player.dynamiccomponent.SetAttribute('spraying', false);
			player.animationcontroller.EnableExclusiveAnimation('stand', true, 1, 1, false);
                              plane.particlesystem.enabled = false;
		});
	}
}

function random(n) {
    seed = new Date().getTime();
    seed = (seed*9301+49297) % 233280;
    
    return (Math.floor((seed/(233280.0)* n)));
}



//Parse .obj file verticles into an array so we can use it as the Police pathway.
function parseObjData(data) {
    //Variables for the function to handle data from server.
    var objText = data.RawData();
    var verticles;
    var obj = {};
    var graph;
    var vertexMatches = String(objText).match(/^v( -?\d+(\.\d+)?){3}$/gm);
    var result;
    var values = String(vertexMatches).split(",");
    var xNz = [];

    for (i = 0; i < values.length; i++) {
        values[i] = String(values[i]).replace('v ', '');
    }

    for (i = 0; i < values.length; i++) {        
        values[i] = String(values[i]).split(" ");
    }
    if (values) {
        obj = values.map(function(vertex)
    {   
            vertex.splice(1, 1);
            values = vertex; 
            xNz.push(values);
        });
    }
    return xNz; 
}

function addAvatar(avatar) {
	if (scene.EntitiesOfGroup('Player').length > 5)
		return;

	var avatarEntity = scene.CreateEntity(scene.NextFreeId(), 
		["RigidBody", "Avatar", "Mesh", "Script", "Placeable", "AnimationController", "DynamicComponent"]);
	avatarEntity.SetTemporary(true); // We never want to save the avatar entities to disk.               
	avatarEntity.SetName("Player" + scene.EntitiesOfGroup('Player').length);
	avatarEntity.SetDescription("Player" + scene.EntitiesOfGroup('Player').length);
	avatarEntity.group = "Player";
	avatarEntity.rigidbody.mass = 2;
	avatarEntity.dynamiccomponent.CreateAttribute('bool', 'spraying');
          avatarEntity.dynamiccomponent.CreateAttribute('string', 'gang');
          avatarEntity.dynamiccomponent.CreateAttribute('string' ,'venueSprayed');
	avatarEntity.placeable.visible = false;
	//Put right gang color for the player.

          Log('Pelaajia skenessa ' + playerCount);
	if (playerCount < 2) {			
		avatarEntity.mesh.materialRefs = new Array(materialRefs[1]);
		avatarEntity.mesh.meshRef = meshRefs[1];
		avatarEntity.mesh.skeletonRef = skeletonRefs[1];
           	avatarEntity.dynamiccomponent.SetAttribute('gang', 'blue');
                    playerCount++;
	} else if (playerCount < 3) {
		avatarEntity.mesh.meshRef = meshRefs[0];
		avatarEntity.mesh.materialRefs = new Array(materialRefs[0]);
		avatarEntity.mesh.skeletonRef = skeletonRefs[0];
                    avatarEntity.dynamiccomponent.SetAttribute('gang', 'green');
                    playerCount++;
	} else {
		avatarEntity.mesh.meshRef = meshRefs[2];
		avatarEntity.mesh.materialRefs = new Array(materialRefs[2]);
		avatarEntity.mesh.skeletonRef = skeletonRefs[2];
                    avatarEntity.dynamiccomponent.SetAttribute('gang', 'purple');          
                    playerCount++;
	}

	//Set angularfactor to 0 0 0, so player wont fall down.
	avatarEntity.rigidbody.angularFactor = new float3(0,0,0);
	var script = avatarEntity.script;
	//Add player script to all players.
	script.className = "SAGScripts.Player";
	script.runOnLoad = true;

	var placeable = avatarEntity.placeable;
	var transform = placeable.transform;
	transform.pos.x = 0;
	transform.pos.y = 11; //Highest of Oulu3D
	transform.pos.z = 0;
	placeable.transform = transform;
}
