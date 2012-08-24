function MaterialScript(entity, comp) {
	/*
	This script makes sure that the screen that is sprayed will get the right sprayimage. To make sure we take the players name who pressed spray and save it to
	the screen's dynamiccomponent that player choosed to spray. BUG: Sometimes for somereason does not spray the image, spray effect works. (ParticleScript.js)
	Quickfix for bug: add the new spray image twice, cos sometimes the first one fails.
	*/

	this.me = entity;
	frame.Updated.connect(this, this.Update);
	this.me.dynamiccomponent.SetAttribute('Spraying', false);
	this.totalTime = 0;
	this.me.dynamiccomponent.CreateAttribute('string' , 'screenName');
	this.me.dynamiccomponent.CreateAttribute('string', 'PlayerName');
	
	//An object that holds in the teams sprayimage materials
	//.material files are located in the scenes folder.
	this.Teams = new Object;
	this.Teams.taistelutoverit = 'blue.material';
	this.Teams.kannuttajat = 'yellow1.material';
	this.Teams.kadunvaltaajat = 'red.material';
}
/*
This function is launched when someone is spraying.
*/
MaterialScript.prototype.Spray = function(frametime){
	var Logic = scene.GetEntityByName('Logic');
	this.Player = scene.GetEntityByName(this.me.dynamiccomponent.GetAttribute('PlayerName'));
	
	if(Logic.dynamiccomponent.GetAttribute('Busted') == true && Player != null){
		this.me.dynamiccomponent.SetAttribute('Spraying', false);
		this.totalTime = 0;
	
	}else{
		var playerId = this.me.dynamiccomponent.GetAttribute('PlayerId');
		var playerTeam = this.me.dynamiccomponent.GetAttribute('PlayerTeam');
		var playerPos = this.me.dynamiccomponent.GetAttribute('playerPos', playerPos);
		
		var pos = this.me.placeable.Position();
		var yNow = pos.y;
		var xNow = pos.x;
		var zNow = pos.z;
		this.totalTime = this.totalTime + frametime;
		
		
		//Calculate distance, not used atm.
		var dist = Math.sqrt(Math.pow((xNow - playerPos.x), 2) + 
					Math.pow((zNow - playerPos.z), 2));
		//Launch this if only if 5seconds have passed, after spray() was called from phone.
		if(this.totalTime>=5){
			if(playerTeam == 'Taistelutoverit'){
				this.me.material.inputMat = this.Teams.taistelutoverit;
				this.me.placeable.visible=true;
				this.me.dynamiccomponent.SetAttribute('Spraying', false);
				this.me.material.inputMat = this.Teams.taistelutoverit;
			}else if(playerTeam == 'Kadunvaltaajat'){
				this.me.material.inputMat = this.Teams.kadunvaltaajat;
				this.me.placeable.visible = true;
				this.me.dynamiccomponent.SetAttribute('Spraying', false);
				this.me.material.inputMat = this.Teams.kadunvaltaajat;
			}else if(playerTeam == 'Kannuttajat'){
				this.me.material.inputMat = this.Teams.kannuttajat;
				this.me.placeable.visible = true;
				this.me.dynamiccomponent.SetAttribute('Spraying', false);
				this.me.material.inputMat = this.Teams.kannuttajat;
			}
		this.totalTime = 0;
		var PlayerEn = scene.GetEntityByName(this.me.dynamiccomponent.GetAttribute('PlayerName'));
		PlayerEn.dynamiccomponent.SetAttribute('rdyToSpray', false);
		
		}
		
		
	}
	
}

MaterialScript.prototype.Update = function(frametime) {
	this.PlayerEn = scene.GetEntityByName(this.me.dynamiccomponent.GetAttribute('PlayerName'));
	if (server.IsRunning()){
		if(this.PlayerEn){
			if(this.PlayerEn.dynamiccomponent.GetAttribute('rdyToSpray') == true && this.me.dynamiccomponent.GetAttribute('screenName') == this.me.Name()){	
				this.Spray(frametime);
			}
		}
	}else{
			
	}
}