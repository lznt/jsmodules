function BotAndPolice(entity, comp) {
	this.me = entity;
	frame.Updated.connect(this, this.Update);
	this.busted = false;
	this.role = this.me.dynamiccomponent.GetAttribute('Role');
	this.spray = this.me.dynamiccomponent.GetAttribute('Spraying');
}

function printObj(obj) {
  for (i in obj) {
    if (i == "locale") // This is a hack to avoid calling QLocale::toString in iteration, which would throw an overload resolution error inside Qt.
      print(i + ": locale"); 
    else
      print(i + ": " + obj[i]);
  }
}     



BotAndPolice.prototype.IfCloseTo = function(frametime){
	for(i in scriptObjects){
		if (scriptObjects[i].me == null){
			print('Entity removed or not initialized yet');
		
		}else{
			//print (scriptObjects[i].me);
			var pos = this.me.placeable.Position();
			var yNow = pos.y;
			var xNow = pos.x;
			var zNow = pos.z;
			
			var dist = Math.sqrt(Math.pow((xNow - scriptObjects[i].me.placeable.Position().x), 2) + 
				Math.pow((zNow - scriptObjects[i].me.placeable.Position().x), 2));
			
			//print (dist);
			//Here we can separate PoliceMan from Another player
			if(dist <= 25 && this.me.Id() != scriptObjects[i].me.Id() && this.me.dynamiccomponent.GetAttribute('Role') == 'Player' && this.me.dynamiccomponent.GetAttribute('Spraying') == true){
				this.busted = true;
				print('Busted in da hood');
				this.me.dynamiccomponent.SetAttribute('busted', true);
						
			}else{
				this.me.dynamiccomponent.SetAttribute('busted', false);
				this.busted = false;
				//this.me.dynamiccomponent.SetAttribute('ifToWalk', true);
			}
		}
	}

}


BotAndPolice.prototype.Update = function(frametime) {
	if (server.IsRunning())
		this.IfCloseTo(frametime);
	
		
}