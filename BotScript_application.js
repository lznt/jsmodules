function BotScript(entity, comp) {
	this.me = entity;
	frame.Updated.connect(this, this.Update);
	var avatarurl = "default_avatar.avatar";
	var r = this.me.avatar.appearanceRef;
    r.ref = avatarurl;
    this.me.avatar.appearanceRef = r;
	this.totals = new float3(0,0,0);
				
	//this.me.CreateComponent('EC_Script','1');
	co=this.me.GetOrCreateComponent('EC_Script', '1');
	co.className = "BotAndPoliceApp.BotAndPolice";
	//this.me.script.className = "BotAndPoliceApp.BotAndPolice";
	
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
		
		var lats = speed * time * ratios.y;
		var lons = speed * time * ratios.x;

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
		
		//Set orientation and placeables + animations if walk = true
		//Add later a amount to be the maximum of movement and teleport to the destination.
		
		tm.pos.x = finalMovementx;
		tm.pos.z = finalMovementz;
		
 		angleOfOrientation = Math.atan2(Math.abs(toMoves.y), Math.abs(toMoves.x));
		print (toMoves.x, toMoves.y);

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
	if (this.me.dynamiccomponent.GetAttribute("ifToWalk") == true && this.me.dynamiccomponent.GetAttribute("busted") == false){
		this.me.animationcontroller.SetAnimationSpeed('Walk', '0.60');
		this.me.animationcontroller.EnableAnimation('Walk', true, 0.25, false);
	}
	else 
		this.me.animationcontroller.DisableAllAnimations();
}

BotScript.prototype.Update = function(frametime) {
	if (server.IsRunning()){
		//Add all updates here
		if(this.me.dynamiccomponent.GetAttribute("ifToWalk") == true)
			this.MoveAvatar(frametime);
	}else
		this.UpdateClient(frametime);
		
}
