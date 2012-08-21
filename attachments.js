function Attachments (entity, comp){
	this.me = entity;
	frame.Updated.connect(this, this.Update); 
	
	
	
}

Attachments.prototype.AnimateAttachments = function(){
	
}




Attachments.prototype.Update = function(frametime) {
	
	
	if (server.IsRunning()){
	
	}else
		this.AnimateAttachments();
}