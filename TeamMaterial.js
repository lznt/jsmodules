function MaterialScript(entity, comp) {
	this.me = entity;
	frame.Updated.connect(this, this.Update);
	this.me.dynamiccomponent.SetAttribute('Spraying', false);
	this.totalTime = 0;
	this.me.dynamiccomponent.CreateAttribute('string' , 'screenName');
	this.me.dynamiccomponent.CreateAttribute('string', 'PlayerName');
	//co = this.me.GetOrCreateComponent("EC_Script" , "1");
	//co.className = "MaterialScriptApp.MaterialScript";
	
}

MaterialScript.prototype.Spray = function(frametime){
	var Logic = scene.GetEntityByName('Logic');
	this.Player = scene.GetEntityByName(this.me.dynamiccomponent.GetAttribute('PlayerName'));
	if(Logic.dynamiccomponent.GetAttribute('Busted') == true && Player != null){
		this.me.dynamiccomponent.SetAttribute('Spraying', false);
		this.totalTime = 0;
	
	}else{
		//Get attributes from dynamiccomponent and for calculating distance between entities, we get current position of this.me
		var playerId = this.me.dynamiccomponent.GetAttribute('PlayerId');
		var playerTeam = this.me.dynamiccomponent.GetAttribute('PlayerTeam');
		var playerPos = this.me.dynamiccomponent.GetAttribute('playerPos', playerPos);
		
		var pos = this.me.placeable.Position();
		var yNow = pos.y;
		var xNow = pos.x;
		var zNow = pos.z;
		
		
		this.totalTime = this.totalTime + frametime;
		
		
		//Calculate distance
		var dist = Math.sqrt(Math.pow((xNow - playerPos.x), 2) + 
					Math.pow((zNow - playerPos.z), 2));
		//Launch this if only if 5seconds have passed, after spray() was called from phone.
		if(this.totalTime>=5){
			if(playerTeam == 'Taistelutoverit'){
				this.me.material.inputMat = 'local://blue.material';
				this.me.placeable.visible=true;
				this.me.dynamiccomponent.SetAttribute('Spraying', false);
			
			}else if(playerTeam == 'Kadunvaltaajat'){
				this.me.material.inputMat = 'local://red.material';
				this.me.placeable.visible = true;
				this.me.dynamiccomponent.SetAttribute('Spraying', false);
				
			}else if(playerTeam == 'Yellowpants'){
				this.me.material.inputMat = 'local://yellow1.material';
				this.me.placeable.visible = true;
				this.me.dynamiccomponent.SetAttribute('Spraying', false);
			}
			this.totalTime = 0;
			this.Player.dynamiccomponent.SetAttribute('rdyToSpray', false);
		}
	}
	
}

MaterialScript.prototype.Update = function(frametime) {
	this.Player = scene.GetEntityByName(this.me.dynamiccomponent.GetAttribute('PlayerName'));
	if (server.IsRunning()){
		if(this.Player != null){
			if(this.Player.dynamiccomponent.GetAttribute('rdyToSpray') == true && this.me.dynamiccomponent.GetAttribute('screenName') == this.me.Name()){	
				this.Spray(frametime);
			}
		}
	}else{
			
	}
}