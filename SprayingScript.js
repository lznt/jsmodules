function SprayingScript(entity, comp) {
	this.me = entity;
	frame.Updated.connect(this, this.Update);
	this.spraying = false;
	this.role = this.me.dynamiccomponent.GetAttribute('Role');
	this.spray = this.me.dynamiccomponent.GetAttribute('Spraying');
	this.totalTime = 0;
	
}

SprayingScript.prototype.Spray = function(frametime){
	for(i in scriptObjects){
		if (scriptObjects[i].me == null){
			print('Entity removed or not initialized yet');
		}else{

			var pos = this.me.placeable.Position();
			var yNow = pos.y;
			var xNow = pos.x;
			var zNow = pos.z;
			//print (scriptObjects[i].me.dynamiccomponent.GetAttribute('Spraying'));
			var dist = Math.sqrt(Math.pow((xNow - scriptObjects[i].me.placeable.Position().x), 2) + 
				Math.pow((zNow - scriptObjects[i].me.placeable.Position().x), 2));
			
			//Here we can check how close the player is to the screen, and if the spraying is active atm.
			if(dist <= 25 && scriptObjects[i].me.dynamiccomponent.GetAttribute('Spraying') == true) {
					print('We are spraying');
					this.totalTime = this.totalTime + frametime;
					//ADD PARTICLESTARTING HERE
					if(this.totalTime >= 5){
						var team = scriptObjects[i].me.dynamiccomponent.GetAttribute('Team');
						print (this.me.dynamiccomponent.GetAttribute('busted'), scriptObjects[i].me.dynamiccomponent.GetAttribute('Busted'));
						//Prints will be replaced with adding the screen this teams logo. Currently no logic regarding that.
						if(team == 'Kadunvaltaajat'){
							print('Player is from Kadunvaltaajat');							
							if(this.me.dynamiccomponent.GetAttribute('Role') != 'Player' && scriptObjects[i].me.dynamiccomponent.GetAttribute('busted') != true)
								this.me.dynamiccomponent.SetAttribute('Team', team);
								
						}else if(team == 'Taistelutoverit'){
							print('Player is from Taistelutoverit');						
							if(this.me.dynamiccomponent.GetAttribute('Role') != 'Player' && scriptObjects[i].me.dynamiccomponent.GetAttribute('busted') != true)
								this.me.dynamiccomponent.SetAttribute('Team', team);
								
						}else if(team == 'Yellowpants'){
							print('Player is from Yellowpants');
							if(this.me.dynamiccomponent.GetAttribute('Role') != 'Player' && scriptObjects[i].me.dynamiccomponent.GetAttribute('busted') != true)
								this.me.dynamiccomponent.SetAttribute('Team', team);
						}
						
						scriptObjects[i].me.dynamiccomponent.SetAttribute('Spraying', false);
						this.totalTime = 0;
						
						if (scriptObjects[i].me.dynamiccomponent.GetAttribute('Busted') == false)
							this.me.dynamiccomponent.SetAttribute('ownerChanged', true);
						
					}
			}
		
			
		}	

	}
}

SprayingScript.prototype.Update = function(frametime) {
	if (server.IsRunning())
		this.Spray(frametime);
	
		
}