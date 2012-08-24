function ParticleScript(entity, comp) {
	this.me = entity;
	frame.Updated.connect(this, this.Update);
	this.me.dynamiccomponent.SetAttribute('Spraying', false);
	//Create attributes for all Particles, set in WS.py Spray()
	this.me.dynamiccomponent.CreateAttribute('string' , 'particleName');
	this.me.dynamiccomponent.CreateAttribute('string', 'PlayerName');
	this.totalTime = 0;
}

/*
Script for enabling spraying material, so that if player is not busted and is spraying(spray() called) the script will wait for the player 
to be in front of the spray and enable the spray. After 5secs of spraying, it ends and sets values to default ones.  
*/
ParticleScript.prototype.EnableSpray = function(frametime) {
	/*
	Logic = Logic entity
	Players = Players with a script named Player
	Player = The player spraying, saved in ws.py
	this.totalTime = the totalTime variable to be able to wait 5 seconds.
	dist = distance between the spray and the player.
	*/
	var Logic = scene.GetEntityByName('Logic');
	var Players = scene.GetEntitiesWithComponent('EC_Script', 'Player');
	var Player = scene.GetEntityByName(this.me.dynamiccomponent.GetAttribute('PlayerName'));
	for (i in Players){
		if(Players[i].dynamiccomponent.GetAttribute('Busted') == true){
			this.me.particlesystem.enabled = false;
			this.totalTime = 0;
			this.me.dynamiccomponent.SetAttribute('Spraying', false);
		}else{
			if(Player != null)
				var dist = Math.sqrt(Math.pow((this.me.placeable.Position().x - Player.placeable.Position().x), 2) + 
					Math.pow((this.me.placeable.Position().z - Player.placeable.Position().z), 2));
			
			if(dist <= 5){
				//Start spraying and plus totalTime.
				Player.dynamiccomponent.SetAttribute('rdyToSpray', true);
				this.me.particlesystem.enabled = true;
				this.totalTime = this.totalTime + frametime;
				//End spraying if has been spraying for 5 seconds.
			}
			if(this.totalTime > 5){
				print(this.totalTime);
				this.me.particlesystem.enabled = false;
				this.me.particlesystem.enabled = false;
				this.totalTime = 0;
				this.me.dynamiccomponent.SetAttribute('Spraying', false);
				Player.dynamiccomponent.SetAttribute('sprayFinished', true);
			}
			
		}
		
	}

}

ParticleScript.prototype.Update = function(frametime) {
	if (server.IsRunning()){
		//Check that name is same as taken in spray(WS.py) and that Spraying is true.
		if (this.me.Name() == this.me.dynamiccomponent.GetAttribute('particleName') && this.me.dynamiccomponent.GetAttribute('Spraying') == true)
			this.EnableSpray(frametime);
	}
}