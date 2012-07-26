function BotScript(entity, comp) {
	this.me = entity;
	frame.Updated.connect(this, this.Update);
	var avatarurl = "default_avatar.avatar";
	var r = this.me.avatar.appearanceRef;
    r.ref = avatarurl;
    this.me.avatar.appearanceRef = r;
	this.totals = new float3(0,0,0);
	this.me.dynamiccomponent.CreateAttribute('float3', 'particlePos');
	this.me.dynamiccomponent.CreateAttribute('string', 'screenName');
	this.me.dynamiccomponent.SetAttribute('Spraying', false);
	this.totalTime = 0;
	this.totalLat = 0;
	this.totalLon = 0;
	
}

BotScript.prototype.MoveAvatar = function(frametime) {	
	//Set and get all the needed variables for moving, rotating and so on..
		var time = frametime;
		var speed = 5;
		var pos = this.me.placeable.Position();
		var yNow = pos.y;
		var xNow = pos.x;
		var zNow = pos.z;
		var angle = this.me.dynamiccomponent.GetAttribute("angleOfOrientation");
		var tm = this.me.placeable.transform;
		var toMoves = this.me.dynamiccomponent.GetAttribute("toMoves");
		var ratios = this.me.dynamiccomponent.GetAttribute("ratios");
		//Speed * time * ratio of distance. To go straight to the goal, not zig zag.
		var lats = speed * time * ratios.y;
		var lons = speed * time * ratios.x;
	
		//Check if toMove x and y axis are negative or positive, different cases determine which way to go. 
		//finalmovement becomes the tiny step we take each frametime towards our goal.
		if (toMoves.x >= 0)
			var finalMovementx = xNow + lons;
		else
			var finalMovementx = xNow - lons;
				
		if (toMoves.y >= 0)
			var finalMovementz = zNow + lats;
		else
			var finalMovementz = zNow - lats;
			
		reset = this.me.dynamiccomponent.GetAttribute("reset");
		
		if (reset == true){
		this.totals.y = 0;
		this.totals.x = 0;
		this.me.dynamiccomponent.SetAttribute('reset', false);
		}

		this.totals.y += lats;
		this.totals.x += lons;

		//Add later a amount to be the maximum of movement and teleport to the destination.
		
		tm.pos.x = finalMovementx;
		tm.pos.z = finalMovementz;
		
 		angleOfOrientation = Math.atan2(Math.abs(toMoves.y), Math.abs(toMoves.x));
		//print (toMoves.x, toMoves.y);

		if (toMoves.y>=0 && toMoves.x>=0){ 	
			tm.rot.y = (Math.PI + angleOfOrientation) * (180/Math.PI);
			tm.rot.y += 15;
		}
		else if (toMoves.y>=0 && toMoves.x<0){
			tm.rot.y = (Math.PI - angleOfOrientation) * (180/Math.PI);
			tm.rot.y +=15;
		}
		else if (toMoves.y<0 && toMoves.x>=0){ 
			tm.rot.y = (2*Math.PI - angleOfOrientation) * (180/Math.PI);
			tm.rot.y += 15;
		}
		else if (toMoves.y<0 && toMoves.x<0){ 
			tm.rot.y = angleOfOrientation * (180/Math.PI);
			tm.rot.y += 15;
		}
		
		this.me.placeable.transform = tm;	


		if (this.totals.y > Math.abs(toMoves.y) || this.totals.x > Math.abs(toMoves.x)) {
			this.me.dynamiccomponent.SetAttribute('ifToWalk', false);
		}
	
}

BotScript.prototype.UpdateClient = function(frametime){
	//Sets animation for player
	if (this.me.dynamiccomponent.GetAttribute("ifToWalk") == true && this.me.dynamiccomponent.GetAttribute("Busted") == false){
		this.me.animationcontroller.SetAnimationSpeed('Walk', '0.60');
		this.me.animationcontroller.EnableAnimation('Walk', true, 0.25, false);
	}
	else 
		this.me.animationcontroller.DisableAllAnimations();
}

BotScript.prototype.Spraying = function(frametime){
	Logic = scene.GetEntityByName('Logic');
	//Moves player to the sprayed location.
	var screen = scene.GetEntityByName(this.me.dynamiccomponent.GetAttribute('screenName'));
	print(screen.Name());
	var particlePos = this.me.dynamiccomponent.GetAttribute('particlePos');
	var tm = this.me.placeable.transform;
	var gao = screen.mesh.GetAdjustOrientation();
	var xNow = this.me.placeable.Position().x;
	var zNow = this.me.placeable.Position().z;
	var dlon = (particlePos.x - xNow) * 1000;
	var dlat = (particlePos.z - zNow) * 1000;
	var time = frametime;
	var speed = 3;
	
	if (Math.abs(dlat) >= Math.abs(dlon)){
		var ratioLon = Math.abs(dlon / dlat);
		var ratioLat = 1;

	}else{ //dlon > dlat
		var ratioLat = Math.abs(dlat / dlon);
		var ratioLon = 1
	}
	//Speed * time * ratio of distance. To go straight to the goal, not zig zag.
	var lats = speed * time * ratioLat;
	var lons = speed * time * ratioLon;

	//Check if toMove x and y axis are negative or positive, different cases determine which way to go. 
	//finalmovement becomes the tiny step we take each frametime towards our goal.
	if (dlon >= 0)
		var finalMovementx = xNow + lons;
	else
		var finalMovementx = xNow - lons;
			
	if (dlat >= 0)
		var finalMovementz = zNow + lats;
	else
		var finalMovementz = zNow - lats;

	this.totalLat += lats;
	this.totalLon += lons;

	//Add later a amount to be the maximum of movement and teleport to the destination.
	
	tm.pos.x = finalMovementx;
	tm.pos.z = finalMovementz;
	
	var angleOfOrientation = Math.atan2(Math.abs(dlon), Math.abs(dlat));

	if (dlat>=0 && dlon>=0){ 	
		tm.rot.y = (Math.PI + angleOfOrientation) * (180/Math.PI);
		tm.rot.y += 15;
	}
	else if (dlat>=0 && dlon<0){
		tm.rot.y = (Math.PI - angleOfOrientation) * (180/Math.PI);
		tm.rot.y +=15;
	}
	else if (dlat<0 && dlon>=0){ 
		tm.rot.y = (2*Math.PI - angleOfOrientation) * (180/Math.PI);
		tm.rot.y += 15;
	}
	else if (dlat<0 && dlon<0){ 
		tm.rot.y = angleOfOrientation * (180/Math.PI);
		tm.rot.y += 15;
	}
	print (finalMovementz, finalMovementx, xNow, zNow);
	print (this.totalLon, this.totalLat);
	this.me.placeable.transform = tm;	
	this.me.dynamiccomponent.SetAttribute('ifToWalk', true);
	
	if (this.totalLon > Math.abs(dlat) || this.totalLat > Math.abs(dlon)) {
		
		this.me.dynamiccomponent.SetAttribute('rdyToSpray', true);
		this.me.dynamiccomponent.SetAttribute('ifToWalk', false);
		this.me.dynamiccomponent.SetAttribute('Spraying', false);
		tm.pos.x = particlePos.x;
		tm.pos.z = particlePos.z;
		this.me.placeable.transform = tm;
		this.totalLat = 0;
		this.totalLon = 0;
		print('Spraying has ended, well done Sir.');
		this.totalTime = 0;
	}	
}
/*	this.me.dynamiccomponent.SetAttribute('ifTowalk', false);
	tm.pos.x = particlePos.x;
	tm.pos.z = particlePos.z;
	tm.rot.y = gao.Angle()*(180/Math.PI);
	particlePos.x -= tm.pos.x;
	particlePos.z -= tm.pos.z;
	tm.pos.y = -4;
	//tm.rot.y = gao.FromEulerZYX();

	this.me.placeable.transform = tm;*/
	
	


BotScript.prototype.Busted = function(frametime){
	//If player is busted, actions are halted for 5 seconds. 
	this.me.dynamiccomponent.SetAttribute('Spraying', false);
	this.me.dynamiccomponent.SetAttribute('ifToWalk', false);
	this.me.dynamiccomponent.SetAttribute('rdyToSpray', false);
	this.totalTime += frametime;
	print('Player /n ' + this.me.Name() + 'Busted for 5 seconds');
	
	if (this.totalTime >= 5){
		this.me.dynamiccomponent.SetAttribute('Busted', false);
		this.totalTime = 0;
		print('released');
	}
}

BotScript.prototype.Update = function(frametime) {
	if (server.IsRunning()){
		//Add all updates here
		if(this.me.dynamiccomponent.GetAttribute("ifToWalk") == true && this.me.dynamiccomponent.GetAttribute("Busted") == false && this.me.dynamiccomponent.GetAttribute('Spraying') == false)
			this.MoveAvatar(frametime);
		if(this.me.dynamiccomponent.GetAttribute('Spraying') == true && this.me.dynamiccomponent.GetAttribute('Busted') == false){
			this.Spraying(frametime);
		}
		if(this.me.dynamiccomponent.GetAttribute('Busted') == true){
			this.Busted(frametime);
		}
	}else
		this.UpdateClient(frametime);
		
}
