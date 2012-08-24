function BotScript(entity, comp) {
	/*
	VARIABLES:
	this.me = user of the script
	avatarurl = the appearance of the user of this script. (Will be different as we have different appearances for each team)
	this.totals = the totals float3 for MoveAvatar.
	particlePos = the position of a particle that the player is starting to spray. This is the spot on where the player stands while spraying.
	screenName = the name of the screen the player sprays.
	totalLat, totalLon = Same thing as this.totals for the spraying function
	this.players = starting value of players that have hovering text
	sprayFinished = For the ws.py to know that when a sprayimg has been sprayed
	*/
	this.me = entity;
	frame.Updated.connect(this, this.Update);
	var avatarurl = "default_avatar.avatar";
	var r = this.me.avatar.appearanceRef;
    r.ref = avatarurl;
    this.me.avatar.appearanceRef = r;
	this.totals = new float3(0,0,0);
	this.me.dynamiccomponent.CreateAttribute('float3', 'particlePos');
	this.me.dynamiccomponent.CreateAttribute('string', 'screenName');
	this.me.dynamiccomponent.CreateAttribute('bool', 'sprayFinished');
	this.me.dynamiccomponent.SetAttribute('Spraying', false);
	this.totalTime = 0;
	this.totalLat = 0;
	this.totalLon = 0;
	this.players = 0;
	this.dyco = this.me.dynamiccomponent;
}
	/*
	In this function we add the player some attachments, a hoodie and pants. Also we add some things to recognize them from each others.
	*/		
BotScript.prototype.AddAttachments = function(){
	
	var Players = scene.GetEntitiesWithComponent("EC_Script", "Player");
	for (i in Players){
		if(Players[i].dynamiccomponent.GetAttribute('Team') == 'Taistelutoverit' && Players[i].dynamiccomponent.GetAttribute('attachments') == false){
			//Hoodie
			var tm = Players[i].placeable.transform;
			var attachment = scene.CreateEntity(scene.NextFreeId(),["EC_Placeable", "EC_Mesh", "EC_Name", "EC_AnimationController"]);
			attachment.GetOrCreateComponent("EC_Script", 'Attachmentsplayer');
			attachment.name = Players[i].name+ 'hoodie';
			attachment.mesh.meshRef = new AssetReference('local://attachments/taistelutoverit_shirt.mesh');
			var meshlist = attachment.mesh.meshMaterial;
			meshlist = ['taistelutoverit_shirt.material'];
			attachment.mesh.meshMaterial = meshlist;
			attachment.SetTemporary(true);
			
			var parentRef = attachment.placeable.parentRef;
			parentRef.ref = Players[i];
			attachment.placeable.parentRef = parentRef;
			tm.pos.y = -0.85;
			attachment.placeable.transform = tm;
			Players[i].dynamiccomponent.SetAttribute('attachments', true);
			
			//Pants
			var attachment = scene.CreateEntity(scene.NextFreeId(),["EC_Placeable", "EC_Mesh", "EC_Name", "EC_AnimationController", "EC_DynamicComponent"]);
			attachment.name = Players[i].Name() + 'pants';
			attachment.GetOrCreateComponent("EC_Script", 'Attachmentsplayer');
			attachment.script.className = "BotScriptApp.Attachments";
			attachment.mesh.meshRef = new AssetReference('local://attachments/male_trousers_texture_lightbrown.mesh');
			var tm = attachment.placeable.transform;
			attachment.placeable.SetScale(1.02,1.02,1.02);
			attachment.SetTemporary(true);
			var meshlist = attachment.mesh.meshMaterial;
			meshlist = ['male_trousers_texture_lightbrown.material'];
			attachment.mesh.meshMaterial = meshlist;
			
			var parentRef = attachment.placeable.parentRef;
			parentRef.ref = Players[i];
			attachment.placeable.parentRef = parentRef;
			attachment.placeable.parentBone = "Bip01_Spine02";
			tm.pos.y = -0.88;
			attachment.placeable.transform = tm;
			Players[i].dynamiccomponent.SetAttribute('attachments', true);
			
		}else if(Players[i].dynamiccomponent.GetAttribute('Team') == 'Kadunvaltaajat' && Players[i].dynamiccomponent.GetAttribute('attachments') == false){
			//Hoodie
			var tm = Players[i].placeable.transform;
			var attachment = scene.CreateEntity(scene.NextFreeId(),["EC_Placeable", "EC_Mesh", "EC_Name", "EC_AnimationController"]);
			attachment.GetOrCreateComponent("EC_Script", 'Attachmentsplayer');
			attachment.name = Players[i].name+ 'hoodie';
			attachment.mesh.meshRef = new AssetReference('local://attachments/kadunvaltaajat_shirt.mesh');
			var meshlist = attachment.mesh.meshMaterial;
			meshlist = ['kadunvaltaajat_shirt.material'];
			attachment.mesh.meshMaterial = meshlist;
			attachment.SetTemporary(true);
			
			var parentRef = attachment.placeable.parentRef;
			parentRef.ref = Players[i];
			attachment.placeable.parentRef = parentRef;
			tm.pos.y = -0.85;
			attachment.placeable.transform = tm;
			
			//Pants
			var attachment = scene.CreateEntity(scene.NextFreeId(),["EC_Placeable", "EC_Mesh", "EC_Name", "EC_AnimationController", "EC_DynamicComponent"]);
			attachment.name = Players[i].Name() + 'pants';
			attachment.GetOrCreateComponent("EC_Script", 'Attachmentsplayer');
			attachment.script.className = "BotScriptApp.Attachments";
			attachment.mesh.meshRef = new AssetReference('local://attachments/male_trousers_texture_lightbrown.mesh');
			var tm = attachment.placeable.transform;
			attachment.placeable.SetScale(1.02,1.02,1.02);
			attachment.SetTemporary(true);
			var meshlist = attachment.mesh.meshMaterial;
			meshlist = ['male_trousers_texture_lightbrown.material'];
			attachment.mesh.meshMaterial = meshlist;
			
			var parentRef = attachment.placeable.parentRef;
			parentRef.ref = Players[i];
			attachment.placeable.parentRef = parentRef;
			attachment.placeable.parentBone = "Bip01_Spine02";
			tm.pos.y = -0.88;
			attachment.placeable.transform = tm;
			Players[i].dynamiccomponent.SetAttribute('attachments', true);
			
		}else if(Players[i].dynamiccomponent.GetAttribute('Team') == 'Kannuttajat' && Players[i].dynamiccomponent.GetAttribute('attachments') == false){
			//Hoodie
			var tm = Players[i].placeable.transform;
			var attachment = scene.CreateEntity(scene.NextFreeId(),["EC_Placeable", "EC_Mesh", "EC_Name", "EC_AnimationController"]);
			attachment.GetOrCreateComponent("EC_Script", 'Attachmentsplayer');
			attachment.name = Players[i].name + 'hoodie';
			print('printsomething');
			attachment.mesh.meshRef = new AssetReference('local://attachments/kannuttajat_shirt.mesh');
			var meshlist = attachment.mesh.meshMaterial;
			meshlist = ['kannuttajat_shirt.material'];
			attachment.mesh.meshMaterial = meshlist;
			attachment.SetTemporary(true);
			
			var parentRef = attachment.placeable.parentRef;
			parentRef.ref = Players[i];
			attachment.placeable.parentRef = parentRef;
			pos = attachment.placeable.Position();
			tm.pos.y = -0.85;
			attachment.placeable.transform = tm;
			Players[i].dynamiccomponent.SetAttribute('attachments', true);
			
			//Pants
			var attachment = scene.CreateEntity(scene.NextFreeId(),["EC_Placeable", "EC_Mesh", "EC_Name", "EC_AnimationController", "EC_DynamicComponent"]);
			attachment.name = Players[i].Name() + 'pants';
			attachment.GetOrCreateComponent("EC_Script", 'Attachmentsplayer');
			attachment.script.className = "BotScriptApp.Attachments";
			attachment.mesh.meshRef = new AssetReference('local://attachments/male_trousers_texture_lightbrown.mesh');
			var tm = attachment.placeable.transform;
			attachment.placeable.SetScale(1.02,1.02,1.02);
			attachment.SetTemporary(true);
			var meshlist = attachment.mesh.meshMaterial;
			meshlist = ['male_trousers_texture_lightbrown.material'];
			attachment.mesh.meshMaterial = meshlist;
			
			var parentRef = attachment.placeable.parentRef;
			parentRef.ref = Players[i];
			attachment.placeable.parentRef = parentRef;
			attachment.placeable.parentBone = "Bip01_Spine02";
			tm.pos.y = -0.88;
			attachment.placeable.transform = tm;
			Players[i].dynamiccomponent.SetAttribute('attachments', true);
		}
	}

}


/*
Adds Hoveringtext component to players, distinguishing them from each others.
*/
BotScript.prototype.AddHoveringText = function(){
	/*VARIABLES:
	Players = all entities in the scene that have a script named Player.(to distinguish players from other entities in the scene)
	nameTag = The hoveringtext component that is created for each Player.
	pos, color, font color = values of HoveringText, pretty self explaining.
	this.players is a changing value to check if hovering text is needed.
	*/
	var Players = scene.GetEntitiesWithComponent('EC_Script', 'Player');
	if(Players.length > this.players){
		for(i in Players){
			if (Players[i].dynamiccomponent.GetAttribute('Team') == 'Taistelutoverit' && !Players[i].hoveringtext) {
				var nameTag = Players[i].CreateComponent("EC_HoveringText", 2, true);
				nameTag.text = Players[i].Name();
				var pos = nameTag.position;
				pos.y = 1.3;
				nameTag.position = pos;
				nameTag.fontSize = 65;
				//var color = new Color(0, 0, 0, 0);
				//nameTag.backgroundColor = color;
				var font_color = new Color(0, 0.17, 0.91, 1.0);                
				nameTag.fontColor = font_color;
				this.players = Players.length;
				frame.Updated.connect(this, this.Update);				
				
			}else if (Players[i].dynamiccomponent.GetAttribute('Team') == 'Kadunvaltaajat' && !Players[i].hoveringtext){
				var nameTag = Players[i].CreateComponent("EC_HoveringText", 2, true);
				nameTag.text = Players[i].Name();
				var pos = nameTag.position;
				pos.y = 1.3;
				nameTag.position = pos;
				nameTag.fontSize = 65;
				var font_color = new Color(1.000000, 1.000000, 0.000000, 1.000000);                
				nameTag.fontColor = font_color;
				this.players = Players.length;
				frame.Updated.connect(this, this.Update);
				
			}else if(Players[i].dynamiccomponent.GetAttribute('Team') == 'Kannuttajat' && !Players[i].hoveringtext){
				var nameTag = Players[i].CreateComponent("EC_HoveringText", 2, true);
				nameTag.text = Players[i].Name();
				var pos = nameTag.position;
				pos.y = 1.3;
				nameTag.position = pos;
				nameTag.fontSize = 65;
				var color = new Color(0, 0, 0, 0);
				nameTag.backgroundColor = color;
				var font_color = new Color(1.000000, 0.250980, 1.000000, 1.000000);                
				nameTag.fontColor = font_color;
				this.players = Players.length;
				frame.Updated.connect(this, this.Update);
			}
		}
	}
}
/*
This is the actual movement function for the player. We get toMoves from websocketserver.py, which are the x and z that the player has to move
to get to the new goal. Calculated with Haversine formula in python(ws.py). This function makes the player move a bit for every frametimer. 
After the player has reached destination walking ends and needed values are changed to false.
*/
BotScript.prototype.MoveAvatar = function(frametime) {	
	/*
	VARIABLES:
	time = frametime of rex
	speed = a static value, 5 is for testing. 2-4 is suitable for walking.
	yNow, xNow, zNow = current position of player
	angle = angle that the player has to turn to face the destination.
	tm = transform of placeable object(used to set the new position of an entity).
	toMoves = a float3 that holds the movement of z and x in cartesian coordinates.
	ratios = the ratio that makes the player move as a straight line towards the goal(to avoid zigzag). See WS.PY for the calculating formula.
	lats = the distance to walk every frametime, speed * time * ratio.
	reset = makes sure that the totalLat and Lon are always 0 when move() is launched.
	this.totals = this value is used to check that if we have reached our goal, it gets the lats or lons depending if its lat or lon total. 
	
	*/
	if(this.me.dynamiccomponent.GetAttribute("ifToWalk") == true && this.me.dynamiccomponent.GetAttribute("Busted") == false && this.me.dynamiccomponent.GetAttribute('Spraying') == false){
		var time = frametime;
		var speed = 5;
		var pos = this.me.placeable.Position();
		var yNow = pos.y;
		var xNow = pos.x;
		var zNow = pos.z;
		var angle = this.me.dynamiccomponent.GetAttribute("angleOfOrientation");
		var tm = this.me.placeable.transform;
		var toMoves = this.me.dynamiccomponent.GetAttribute("toMoves");
		var ratios = this.me.dynamiccomponent.GetAttribute("ratios");
		var reset = this.me.dynamiccomponent.GetAttribute("reset");
		var lats = speed * time * ratios.y;
		var lons = speed * time * ratios.x;
		
		//Check if toMove x and y axis are negative or positive, different cases determine which way to go(4 quads). 
		//Finalmovement becomes the tiny step we take each frametime towards our goal, in the right direction.
		if (toMoves.x >= 0)
			var finalMovementx = xNow + lons;
		else
			var finalMovementx = xNow - lons;
				
		if (toMoves.y >= 0)
			var finalMovementz = zNow + lats;
		else
			var finalMovementz = zNow - lats;
			
		
		//Checks if reset is true, if so the move() function has been launched.
		if (reset == true){
		this.totals.y = 0;
		this.totals.x = 0;
		this.me.dynamiccomponent.SetAttribute('reset', false);
		}

		this.totals.y += lats;
		this.totals.x += lons;
		
		tm.pos.x = finalMovementx;
		tm.pos.z = finalMovementz;
		
		//Angle of orientation that the player uses to turn towards his goal.
 		angleOfOrientation = Math.atan2(Math.abs(toMoves.y), Math.abs(toMoves.x));
		//These 4 cases are for checking in what quad the player currently is in.
		if (toMoves.y>=0 && toMoves.x>=0){ 	
			tm.rot.y = (Math.PI + angleOfOrientation) * (180/Math.PI);
			tm.rot.y += 15;
		}
		else if (toMoves.y>=0 && toMoves.x<0){
			tm.rot.y = (Math.PI - angleOfOrientation) * (180/Math.PI);
			tm.rot.y +=15;
		}
		else if (toMoves.y<0 && toMoves.x>=0){ 
			tm.rot.y = (2*Math.PI - angleOfOrientation) * (180/Math.PI);
			tm.rot.y += 15;
		}
		else if (toMoves.y<0 && toMoves.x<0){ 
			tm.rot.y = angleOfOrientation * (180/Math.PI);
			tm.rot.y += 15;
		}
		//Add the tm.somethings to transform to make the actual changes happen.
		this.me.placeable.transform = tm;	


		if (this.totals.y > Math.abs(toMoves.y) || this.totals.x > Math.abs(toMoves.x)) {
			this.me.dynamiccomponent.SetAttribute('ifToWalk', false);
		}
	}
	
}
/*
This function updates the client side, enables the animations at the moment for players.
TODO: ANIMATION SYNCHRONIZATION IS MESSED ATM.
*/
BotScript.prototype.UpdateClient = function(frametime){
	var attachments = scene.GetEntitiesWithComponent("EC_Script", "Attachmentsplayer");
	if (!attachments == null)
		print('No attachments, sir');
	
	print(attachments);
	//With these you can modify the players outlook, thin, muscular, fat are the 4 options. The number is the effect 1.0 being 100%.
	this.me.mesh.SetMorphWeight("Morph_thin-arms-lower", 0.4);
	this.me.mesh.SetMorphWeight("Morph_thin-arms-upper", 0.4);
	this.me.mesh.SetMorphWeight("Morph_thin-legs-upper", 0.6);
	this.me.mesh.SetMorphWeight("Morph_thin-legs-lower", 0.6);
	//Adds animations for player + attachments.
	for(i in attachments){
		if (this.me.dynamiccomponent.GetAttribute("ifToWalk") == true && this.me.dynamiccomponent.GetAttribute("Busted") == false){
		
			if(attachments[i].Name() == this.me.Name()+'hoodie'){
				attachments[i].animationcontroller.SetAnimationSpeed('Walk', 0.6);
				this.me.animationcontroller.SetAnimationSpeed('Walk', 0.6);
				this.me.animationcontroller.PlayAnim('Walk', 0.25, 'Walk');
				attachments[i].animationcontroller.PlayAnim('Walk', 0.25, 'Walk');	
			}
			if(attachments[i].name == this.me.Name()+'pants'){
				this.me.animationcontroller.SetAnimationSpeed('Walk', 0.6);
				attachments[i].animationcontroller.SetAnimationSpeed('Walk', 0.6);
				this.me.animationcontroller.PlayAnim('Walk', 0.25, 'Walk');
				attachments[i].animationcontroller.PlayAnim('Walk', 0.25, 'Walk');
			}
			
		}else {
			this.me.animationcontroller.StopAnim('Walk', 0.25);
			attachments[i].animationcontroller.StopAnim('Walk', 0);
			//this.me.animationcontroller.DisableAllAnimations();
		}
	}
	
}
/*
This function is launched when player sends Spray() msg in websocketserver.py. If player is within 50m he walks to the destination and the spraying
starts as he is within 5m of the destination. Spraying will happen for 5 seconds. Other scripts relational: PoliceScript.js, ParticleScript.js, TeamMaterial.js
*/
BotScript.prototype.Spraying = function(frametime){
	//First check if player is busted.
	if(this.me.dynamiccomponent.GetAttribute('Spraying') == true && this.me.dynamiccomponent.GetAttribute('Busted') == false){

		Logic = scene.GetEntityByName('Logic');
		
		var screen = scene.GetEntityByName(this.me.dynamiccomponent.GetAttribute('screenName'));
		var particlePos = this.me.dynamiccomponent.GetAttribute('particlePos');
		var tm = this.me.placeable.transform;
		var gao = screen.mesh.GetAdjustOrientation();
		var xNow = this.me.placeable.Position().x;
		var zNow = this.me.placeable.Position().z;
		var dlon = (particlePos.x - xNow) * 1000;
		var dlat = (particlePos.z - zNow) * 1000;
		var time = frametime;
		var speed = 2;
		var dist = Math.sqrt(Math.pow((xNow - particlePos.x), 2) + 
						Math.pow((zNow - particlePos.z), 2));
		if(dist > 50){
			tm.pos.x = particlePos.x;
			tm.pos.z = particlePos.z;
			this.me.placeable.transform = tm;	
			this.me.dynamiccomponent.SetAttribute('rdyToSpray', true);
			this.me.dynamiccomponent.SetAttribute('ifToWalk', false);
			this.me.dynamiccomponent.SetAttribute('Spraying', false);
		}else{
		
			if (Math.abs(dlat) >= Math.abs(dlon)){
				var ratioLon = Math.abs(dlon / dlat);
				var ratioLat = 1;

			}else{ //dlon > dlat
				var ratioLat = Math.abs(dlat / dlon);
				var ratioLon = 1
			}
			//Speed * time * ratio of distance. To go straight to the goal, not zig zag.
			var lats = speed * time * ratioLat;
			var lons = speed * time * ratioLon;

			//Check if toMove x and y axis are negative or positive, different cases determine which way to go. 
			//finalmovement becomes the tiny step we take each frametime towards our goal.
			if (dlon >= 0)
				var finalMovementx = xNow + lons;
			else
				var finalMovementx = xNow - lons;
					
			if (dlat >= 0)
				var finalMovementz = zNow + lats;
			else
				var finalMovementz = zNow - lats;

			this.totalLat += lats;
			this.totalLon += lons;

			//Add later a amount to be the maximum of movement and teleport to the destination.
			
			tm.pos.x = finalMovementx;
			tm.pos.z = finalMovementz;
			
			var angleOfOrientation = Math.atan2(Math.abs(dlon), Math.abs(dlat));

			if (dlat>=0 && dlon>=0){ 	
				tm.rot.y = (Math.PI + angleOfOrientation) * (180/Math.PI);
				tm.rot.y += 15;
			}
			else if (dlat>=0 && dlon<0){
				tm.rot.y = (Math.PI - angleOfOrientation) * (180/Math.PI);
				tm.rot.y +=15;
			}
			else if (dlat<0 && dlon>=0){ 
				tm.rot.y = (2*Math.PI - angleOfOrientation) * (180/Math.PI);
				tm.rot.y += 15;
			}
			else if (dlat<0 && dlon<0){ 
				tm.rot.y = angleOfOrientation * (180/Math.PI);
				tm.rot.y += 15;
			}
			this.me.placeable.transform = tm;	
			this.me.dynamiccomponent.SetAttribute('ifToWalk', true);
			
			if (this.totalLon > Math.abs(dlat) || this.totalLat > Math.abs(dlon)) {
				
				this.me.dynamiccomponent.SetAttribute('rdyToSpray', true);
				this.me.dynamiccomponent.SetAttribute('ifToWalk', false);
				this.me.dynamiccomponent.SetAttribute('Spraying', false);
				tm.pos.x = particlePos.x;
				tm.pos.z = particlePos.z;
				this.me.placeable.transform = tm;
				this.totalLat = 0;
				this.totalLon = 0;
				print('Spraying has ended, well done Sir.');
				this.totalTime = 0;
			}	
		}
	}
}	
/*
This function is for Players busting each others while spraying, principle is the same as in Policemen busting players.
Easy to implement a way to make players bust each other only by pressing a button on phone.
*/
BotScript.prototype.BustEm = function(frametime){
	var Players = scene.GetEntitiesWithComponent('EC_Script', 'Player');
	Logic = scene.GetEntityByName('Logic');
	
	if(Players[0] == null)
		print('No other players in scene');
	else{
		for (i in Players){
			xNow = this.me.placeable.Position().x;
			zNow = this.me.placeable.Position().z;
			var player = Players[i].Name();
			var dist = Math.sqrt(Math.pow((xNow - Players[i].placeable.Position().x), 2) + 
				Math.pow((zNow - Players[i].placeable.Position().z), 2));
			Player = Players[i];
			if(dist <= 25 && Players[i].dynamiccomponent.GetAttribute('Spraying')==true && Players[i].Name() != this.me.Name()){
				print (dist);
				print('Do we enter here?');
				Logic.dynamiccomponent.SetAttribute('Busted', true); 
				Players[i].dynamiccomponent.SetAttribute('Busted', true);
				Logic.dynamiccomponent.SetAttribute('PlayerName', player);
				Players[i].dynamiccomponent.SetAttribute('Spraying', false);
				Logic.dynamiccomponent.SetAttribute('BustingPlayer', this.me.Name());
			
			}else{
				Logic.dynamiccomponent.SetAttribute('Busted', false);
				//Players[i].dynamiccomponent.SetAttribute('Busted', false);
			}
		}	
	}
}
/*
If a player is busted the following happens, this function is launched only if an external function changes the dynamiccomponent(busted)
*/
BotScript.prototype.Busted = function(frametime){
	if(this.me.dynamiccomponent.GetAttribute('Busted') == true){
		//If player is busted, actions are halted for 5 seconds. 
		this.me.dynamiccomponent.SetAttribute('Spraying', false);
		this.me.dynamiccomponent.SetAttribute('ifToWalk', false);
		this.me.dynamiccomponent.SetAttribute('rdyToSpray', false);
		this.totalTime += frametime;
		print('Player /n ' + this.me.Name() + 'Busted for 5 seconds');
		
		if (this.totalTime >= 5){
			this.me.dynamiccomponent.SetAttribute('Busted', false);
			this.totalTime = 0;
			print('released');
		}
	}
}
/*
This function deletes the connection for Update function first, then creates Connection boolean,
as false after that WS.py will remove the entity that has been disconnected.
*/
BotScript.prototype.OnScriptObjectDestroyed = function(){
	var Players = scene.GetEntitiesWithComponent('EC_Script', "Player");
	for (i in Players){
		if(Players[i].dynamiccomponent.GetAttribute('disconnected') == true){
			// Must remember to manually disconnect subsystem signals, otherwise they'll continue to get signalled
			if (this.isServer)
			{
				frame.Updated.disconnect(this, this.Update);
			}
			else
				frame.Updated.disconnect(this, this.Update);
				Players[i].dynamiccomponent.CreateAttribute('bool' ,'Connections');
				// Remove the actual entity, since it has been disconnected
			
		}
		
	}
	
}



BotScript.prototype.Update = function(frametime) {
	if (server.IsRunning()){

		this.AddAttachments();
		this.BustEm(frametime);
		this.AddHoveringText();
		this.MoveAvatar(frametime);
		this.Spraying(frametime);
		this.Busted(frametime);
		this.OnScriptObjectDestroyed();

	}else
		this.UpdateClient(frametime);
		
		
}
