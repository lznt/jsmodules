function MaterialScript(entity, comp) {
	this.me = entity;
	frame.Updated.connect(this, this.Update);
	co=this.me.GetOrCreateComponent('EC_Script', '1');
	co.className = "SprayScriptApp.SprayingScript";
	team = this.me.dynamiccomponent.CreateAttribute('string', 'Team');
	//In future this will be a msg received from the server, telling what is the current team.
}

MaterialScript.prototype.UpdateMaterial = function(frametime){
		if (this.me.dynamiccomponent.GetAttribute('Team') == 'Taistelutoverit'){
			this.me.placeable.visible = true;
			this.me.material.inputMat = 'local://blue.material';
		}else if (this.me.dynamiccomponent.GetAttribute('Team') == 'Kadunvaltaajat'){
			this.me.placeable.visible = true;
			this.me.material.inputMat = 'local://red.material';
		}else if (this.me.dynamiccomponent.GetAttribute('Team') == 'Yellowpants'){
			this.me.placeable.visible = true;
			this.me.material.inputMat = 'local://yellow1.material';
		}
}

MaterialScript.prototype.Update = function(frametime) {
	
	if (server.IsRunning()){
		this.UpdateMaterial(frametime);
			
	}else{
			
	}
}