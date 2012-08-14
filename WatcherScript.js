function WatcherScript(entity, comp){
	this.me = entity;
	frame.Updated.connect(this, this.Update);
	this.players = 0;
}


WatcherScript.prototype.AddLocalComponents = function(){
	var Players = scene.GetEntitiesWithComponent('EC_Script', 'Player');
	
	
	if(Players.length > this.players){
		for(i in Players){
			if (Players[i].dynamiccomponent.GetAttribute('Team') == 'Taistelutoverit') {
				print('everhere');
				var nameTag = Players[i].CreateComponent("EC_HoveringText", 2, true);
				nameTag.text = Players[i].Name();
				var pos = nameTag.position;
				pos.y = 1.3;
				nameTag.position = pos;
				nameTag.fontSize = 65;
				var color = new Color(0, 0, 128, 0.6);
				nameTag.backgroundColor = color;
				var font_color = new Color(192, 192, 192, 0.6);                
				nameTag.fontColor = font_color;
				this.players = Players.length;
				frame.Updated.connect(this, this.Update);
			}
		}
	}
}
WatcherScript.prototype.Update = function(frametime) {
	
	if (server.IsRunning()){
		this.AddLocalComponents();
		
	}		
}