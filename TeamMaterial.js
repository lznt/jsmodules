function MaterialScript(entity, comp) {
	this.me = entity;
	frame.Updated.connect(this, this.Update);
	//In future this will be a msg received from the server, telling what is the current team.
}

MaterialScript.prototype.UpdateMaterial = function(frametime){
		var screenvalue = this.me.dynamiccomponent.GetAttribute("screenvalues");
		
		if (screenvalue.x == 1){
			ifSprayed = this.me.dynamiccomponent.GetAttribute('ifSprayed');
			ifSprayed = false;
			this.me.dynamiccomponent.SetAttribute('ifSprayed', ifSprayed);
			this.me.placeable.visible = true;
			this.me.material.inputMat = 'local://blue.material';
		}else if (screenvalue.y == 1){
			ifSprayed = this.me.dynamiccomponent.GetAttribute('ifSprayed');
			ifSprayed = false;
			this.me.dynamiccomponent.SetAttribute('ifSprayed', ifSprayed);
			this.me.placeable.visible = true;
			this.me.material.inputMat = 'local://red.material';
		}else if (screenvalue.z == 1){
			print ('No team recognized');
			ifSprayed = this.me.dynamiccomponent.GetAttribute('ifSprayed');
			ifSprayed = false;
			this.me.dynamiccomponent.SetAttribute('ifSprayed', ifSprayed);
			this.me.placeable.visible = true;
			this.me.material.inputMat = 'local://yellow1.material';
		}
}

MaterialScript.prototype.Update = function(frametime) {
	
	if (server.IsRunning()){
	
	}else{
		if (this.me.dynamiccomponent.GetAttribute("ifSprayed") == true)
			this.UpdateMaterial(frametime);
			var ifSprayedGlobal = true;
			
	}
}