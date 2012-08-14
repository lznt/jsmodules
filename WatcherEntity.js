function WatcherEntity(entity, comp){
	//This is the script for realxtend to recognize players and create them to scene.
	//Have to figure out a way to authenticate users.
	this.players = [];
	frame.Updated.connect(this, this.Update);
	this.me = entity;
	this.player1 = new Object;
	this.player1.name = 'Mauno';
	this.player1.team = 'Kadunvaltaajat';
	this.player1.set = false;
	this.players[0] = this.player1;
	
	this.player2 = new Object;
	this.player2.name = 'Simo';
	this.player2.team = 'Kannuttajat';
	this.player2.set = false;
	this.players[1] = this.player2;

	this.player3 = new Object;
	this.player3.name = 'Aili';
	this.player3.team = 'Taistelutoverit';
	this.player3.set = false;
	this.players[2] = this.player3;
	
	this.teams = ['Kannuttajat', 'Taistelutoverit', 'Kadunvaltaajat'];
	
	server.UserConnected.connect(this.ServerHandleUserConnected);
	server.UserDisconnected.connect(ServerHandleUserDisconnected);
	
	
}

WatcherEntity.prototype.ServerHandleUserConnected = function(connectionID, user) {
	var users = server.AuthenticatedUsers();
    // Uncomment to test access control
	for(i in this.players){
		if (this.players[i].set == false && user.GetProperty("username") == this.players[i].name){
			this.avent = scene.CreateEntity(scene.NextFreeId(),["EC_Avatar", "EC_DynamicComponent", "EC_Script"]);
			this.avent.SetTemporary(true);
			this.avent.dynamiccomponent.CreateAttribute('string', 'Team');
			this.avent.SetName('Watcher' + user.GetProperty('username'));
			this.avent.dynamiccomponent.SetAttribute('Team', this.players[i].team);	
			this.players[i].set = true;
			this.CheckUsers(user);
			//this.avent.script.className = 'WatcherApp.WatcherScript';
			print('Handled user' + this.avent.name); 	
		}
		//this.AddLocalComponents();	
		
	}
}

function ServerHandleUserDisconnected(connectionID, user) {
	
	var avatarEntityName = "Watcher" + user.GetProperty('username');
	var avatarEntity = scene.GetEntityByName(avatarEntityName);
	if (avatarEntity != null) {
		scene.RemoveEntity(avatarEntity.id);
	
		if (user != null) {
			print("[Avatar Application] User " + user.GetProperty("username") + " disconnected, destroyed avatar entity.");
			
		}
	}
	
}


WatcherEntity.prototype.CheckUsers = function(user){
	
	for(var i = 0;i<this.players.length;i++){
		if (this.players[i].set == true && scene.GetEntityByName('Watcher'+this.players[i].name) == null){
			this.players[i].set = false;
			print(this.players[i].name);
		}
		
	}
}

WatcherEntity.prototype.Update = function(frametime) {
	
	if (server.IsRunning()){
		
		var users = server.AuthenticatedUsers();
		for(var i=0; i < users.length; i++){
			
			this.ServerHandleUserConnected(users[i].id, users[i]);
			
		}
	}		

		
		
}
