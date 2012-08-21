function CameraApp (entity, comp){
/*
This script is made for the future, to be able to add watchers some logic, for example hoovering text for own players.
*/	this.teamCheck = false;
	this.me = entity;
	frame.Updated.connect(this, this.Update);
	this.log = scene.GetEntityByName('Logic');
}

CameraApp.prototype.CheckIdentity = function(frametime){

	this.pTeam = this.me.dynamiccomponent.GetAttribute('Team');
	var teams = ['Yellowpants', 'Kadunvaltaajat', 'Taistelutoverit'];
	for (i in teams){
		if (this.pTeam == teams[i])
			print('Player is on team' + teams[i]);
			
	}
	
}

CameraApp.prototype.AddTeamMembers = function(frametime){
        // Make hovering name tag for teammates
        var clientName = this.me.GetComponent("EC_Name");
		var Players = scene.GetEntitiesWithComponent('EC_Script', 'Player');
		for(i in Players){
			if (Players[i].dynamiccomponent.GetAttribute('Team') == this.pTeam) {
				var nameTag = Players[i].CreateLocalComponent("EC_HoveringText", 2, true);
				nameTag.text = Players[i].Name();
				var pos = nameTag.position;
				pos.y = 1.3;
				nameTag.position = pos;
				nameTag.fontSize = 65;
				var color = new Color(0.2, 0.2, 0.2, 1.0);
				nameTag.backgroundColor = color;
				var font_color = new Color(1.0, 1.0, 1.0, 1.0);                
				nameTag.fontColor = font_color;
				frame.Updated.connect(this, this.Update);
			}
			this.log.dynamiccomponent.SetAttribute('addedPlayer', false);
        }
}


CameraApp.prototype.Update = function(frametime) {
	if (server.IsRunning()){
		if(this.log.dynamiccomponent.GetAttribute('addedPlayer') == true){
			this.CheckIdentity(frametime);
			this.AddTeamMembers(frametime);
		}
	}
}