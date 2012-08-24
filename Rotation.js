function RotateSomething(entity, comp) {
	this.me = entity;
	frame.Updated.connect(this, this.Update);
	tm = this.me.placeable.transform;
	tm.rot.x = 90;
	this.me.placeable.transform = tm;
}

/*
This script is for the STATS HERE text to rotate in the air.
Pretty self explaining.
*/
RotateSomething.prototype.Update = function(frametime) {
	if (server.IsRunning()){
		if (this.me.dynamiccomponent.GetAttribute('toRotate') == true){
			var tm = this.me.placeable.transform;
			tm.rot.y+=0.5;
			this.me.placeable.transform = tm;	
		
		
		}
	}
}

