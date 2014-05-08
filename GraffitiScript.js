//All planes have to have this script to monitor it.

// Include the json parse/stringify library. We host it here if you want to use it:
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/json2.js, Script

// Include our utils script that has asset storage and bytearray utils etc.
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js, Script
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/class.js, Script

engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/class.js");
engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js");
SetLogChannelName("GraffitiScript"); //this can be anything, but best is your aplication name

//Links for graffitimaterials.
var graffitiLinks = ["http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/graffiti/blue.material",
"http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/graffiti/purple.material", "http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/graffiti/green.material"];
var scene = me.ParentScene();
//Interval so server is queried only once every 2seconds. (Roughly)
var intervalli = 0;
//Variable to save current server data, and know if anything has changed.
var currentData = "";

var playersNVenuesLinked = [];

Log("Script starting...");

//Connect Update function to frametime signal. 
frame.Updated.connect(Update);

var myHandler = function (myAsset) {
	//Check if data on server has changed or not. No need to parse same data over and over again.

    	
	var data = JSON.parse(myAsset.RawData());
	for(var i=0; i<data.length; ++i) {
		checkVenue(data[i]);
	}
    // Forget the disk asset so it wont be returned from cache next time you do the same request
}

//Simple logic to check which gang owns which plane and if spraying is enabled.
function checkVenue (venueData) {
	//Variables for data we want to collect.
	var venueName = venueData.name;
	var venueGang = venueData.gang;
	var player = null;
	
	var plane = scene.EntityByName("graffiti-plane-" + venueName);
	//Check venue owner
	if (venueGang == "Blue Angels" || venueGang == "Blue Knights" && plane) {
		plane.mesh.materialRefs = new Array(graffitiLinks[0]);
	} else if (venueGang == "Purple Knights" && plane) {
		plane.mesh.materialRefs = new Array(graffitiLinks[1]);
	} else if (venueGang == "Green Shamans" && plane) {
		plane.mesh.materialRefs = new Array(graffitiLinks[2]);
	}
    
	
    var players = scene.EntitiesOfGroup('Player');
    for (var i in players) {
	//Make sure that particles are never enabled for nothing, before going further. (They stay sometimes on after quit.)
      if (players[i].dynamiccomponent.GetAttribute('spraying') == true) { player = players[i]; }
      else { disableAfterSpray(); continue; }
             	var bothEntities = new Object();
		//Put spraying particle on, if venue is spraying.
		var venueSpraying = venueData.sprayinginitialized;
		if (venueSpraying == 1 && plane.particlesystem && player) {
			if (player.dynamiccomponent.GetAttribute('gang') == "blue" 
	                        && player.dynamiccomponent.GetAttribute('venueSprayed') == venueData.name) {
				plane.particlesystem.particleRef = "http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle-graffiti-plane/bluespray.particle";
				Log('Blue Spraying');
                                        bothEntities.player = player;
                                        bothEntities.venue = plane;
                                        playersNVenuesLinked.push(bothEntities);
			} else if (player.dynamiccomponent.GetAttribute('gang') == "purple" 
	                        && player.dynamiccomponent.GetAttribute('venueSprayed') == venueData.name) {
				plane.particlesystem.particleRef = "http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle-graffiti-plane/purplespray.particle";
	            player.dynamiccomponent.SetAttribute('venueSprayed', 'EmptyVenue');	
	            Log('Purple Spraying');
                                        bothEntities.player = player;
                                        bothEntities.venue = plane;
                                        playersNVenuesLinked.push(bothEntities);
			} else if (player.dynamiccomponent.GetAttribute('gang') == "green" 
	                        && player.dynamiccomponent.GetAttribute('venueSprayed') == venueData.name) {
				plane.particlesystem.particleRef = "http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle-graffiti-plane/greenspray.particle";
				Log('Green Spraying');
                                        bothEntities.player = player;
                                        bothEntities.venue = plane;
                                        playersNVenuesLinked.push(bothEntities);
			} 	
	           plane.particlesystem.enabled = true;

		} else if (venueSpraying == 0 && plane && player) {
			plane.particlesystem.enabled = false;
                              plane.particlesystem.particleRef = "";
		}
	}
}

//Check if player already finished spraying
function disableAfterSpray() {
    for (var i in playersNVenuesLinked) {
        if (playersNVenuesLinked[i].player.dynamiccomponent.GetAttribute('spraying') == false) {
            playersNVenuesLinked[i].venue.particlesystem.enabled = false;
            playersNVenuesLinked.splice(i, 1);
            Log(playersNVenuesLinked);
        }
    }    
}

function Update (frametime) {
	if (!server.IsRunning()) {
		//GET venues    
		//Query server only every 2seconds ("roughly")
                    if (interval >= 150) {
                        interval = 0;
          		var transfer = asset.RequestAsset("http://vm0063.virtues.fi/venues/?active", "Binary", true);
          		transfer.Succeeded.connect(function(){
                 			myHandler(transfer);
          		});
                    }
                    else interval++;

	} 
}