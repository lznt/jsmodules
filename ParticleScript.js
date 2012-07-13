function ParticleScript(entity, comp) {
	this.me = entity;
	frame.Updated.connect(this, this.Update);
	this.me.dynamiccomponent.SetAttribute('ifSprayedPar', false);
	//In future this will be a msg received from the server, telling what is the current team.
}

ParticleScript.prototype.EnableSpray = function(frametime) {
	//Now just enabling, after the server sends the time to wait for the spraying to be done in mobile, its set here.
	this.me.particlesystem.enabled = true;
	var tm = this.me.placeable.transform;
	tm.rot.y+=3;
	this.me.placeable.transform = tm;
	
	
	//Add here some dynamiccomponent that illustrates the ending of a spraysession. Maybe a msg from the server.
	//For example a animationState dynamiccomponent that is set to false if animation is still going, otherwise its true and spraying stops.
	this.me.particlesystem.enabled = false;
	this.me.dynamiccomponent.SetAttribute('ifSprayedPar', false);
	tm.rot.y-=3;
	this.me.placeable.transform = tm;

}


ParticleScript.prototype.Update = function(frametime) {
	if (server.IsRunning()){
		if(this.me.dynamiccomponent.GetAttribute('ifSprayedPar') == true)
			this.EnableSpray(frametime);
	}
}