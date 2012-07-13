function RotateSomething(entity, comp) {
	this.me = entity;
	frame.Updated.connect(this, this.Update);
	tm = this.me.placeable.transform;
	tm.rot.x = 90;
	this.me.placeable.transform = tm;
}


RotateSomething.prototype.Update = function(frametime) {
	if (server.IsRunning()){
		if (this.me.dynamiccomponent.GetAttribute('toRotate') == true){
			var tm = this.me.placeable.transform;
			tm.rot.y+=0.5;
			this.me.placeable.transform = tm;	
		
		
		}
	}
}

