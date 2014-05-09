// Include the json parse/stringify library. We host it here if you want to use it:
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/json2.js, Script

// Include our utils script that has asset storage and bytearray utils etc.
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js, Script
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/class.js, Script
engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/class.js");
engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js");
SetLogChannelName("CameraScript"); //this can be anything, but best is your aplication name
frame.Updated.connect(this, this.Update);

function Update(frametime){
	if (!server.IsRunning())
		checkSituation();
}

function checkSituation() {
	var paulaInScene = false;
	var players = scene.EntitiesOfGroup('Player');
	var paulanTestiEntity = scene.Entities();
	for (var i in paulanTestiEntity) {
		if (paulanTestiEntity[i].name.description == 'Paula A') paulaInScene = true;
	}

	for (var i in players) {
		if (players[i].dynamiccomponent.GetAttribute('spraying') && paulaInScene) checkAndSetCamera(players[i]);
	}
}

function checkAndSetCamera(player) {
	var cameras = scene.EntitiesOfGroup('Cameras');
	for (var i in cameras) {
		var dist = Math.sqrt(Math.pow((player.placeable.transform.pos.x - cameras[i].placeable.Position().x), 2) + 
    		Math.pow((player.placeable.transform.pos.z - cameras[i].placeable.Position().z), 2));
		if (dist < 50) {
			cameras[i].camera.SaveScreenshot(true);
		}
	}
}
