function WatcherEntity(entity, comp){
	//This is the script for realxtend to recognize watcherplayers and create them to scene.
	//Users are hardcoded atm, in future they will be this way in the database.
	/*
	VARIABLES:
	players = an array that holds the player objects.
	player1, player2, player3 = three different player objects that have a name, a team and a variable set to check whether they have been already 
		added to the scene
	this.teams = an array that holds the names of 3 teams in the game.
	*/
	print('WatcherEntity');
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
/*
Function for handling connected users via realXtend viewer. They get their name and we check for their team. 
*/
WatcherEntity.prototype.ServerHandleUserConnected = function(connectionID, user) {
	/*
	VARIABLES:
	users = all authenticated users on server
	*/
	var users = server.AuthenticatedUsers();
	for(i in this.players){
		if (this.players[i].set == false && user.GetProperty("username") == this.players[i].name){
			this.avent = scene.CreateEntity(scene.NextFreeId(),["EC_Avatar", "EC_DynamicComponent", "EC_Script"]);
			this.avent.SetTemporary(true);
			this.avent.dynamiccomponent.CreateAttribute('string', 'Team');
			this.avent.SetName('Watcher' + user.GetProperty('username'));
			this.avent.dynamiccomponent.SetAttribute('Team', this.players[i].team);	
			this.players[i].set = true;
			this.CheckUsers(user);
			print('Handled user' + this.avent.name); 	
		}	
		
	}
}
/*
Handles disconnected users and removes them from scene.
*/
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

/*
Checks if a connecting player has left and changes the set to false, so that if he connects again he will be added again.
*/
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
		print(users);
		for(var i=0; i < users.length; i++){
			this.ServerHandleUserConnected(users[i].id, users[i]);
		}
	}			
}
