// Include the json parse/stringify library. We host it here if you want to use it:
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/json2.js, Script

// Include our utils script that has asset storage and bytearray utils etc.
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js, Script
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/class.js, Script


engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/class.js");
engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js");

SetLogChannelName("EventLogging"); //this can be anything, but best is your aplication name
Log("Script starting");
frame.Updated.connect(Update);

var interval = 0; 
var sentPlayers = [];

function Update(frametime) {
	if(!server.IsRunning()) {
		if (sentPlayers.length > 0) {
			sentPlayersLoop:
			for (var i in sentPlayers) {
				var players = scene.EntitiesOfGroup('Player');
				for (var n in players) {
					if (players[n].dynamiccomponent.GetAttribute('spraying') == true && sentPlayers[i].name != players[n].name) { LogPlayerInfoOnSpray(); break sentPlayersLoop; }
					else if (players[n].dynamiccomponent.GetAttribute('spraying') == false && sentPlayers[i].name == players[n].name) { sentPlayers.splice(i, 1); break sentPlayersLoop; }
				}

				var transfer = asset.RequestAsset("http://vm0063.virtues.fi/gangsters/","Binary", true);
    			transfer.Succeeded.connect(function(){
    				var json = JSON.parse(transfer.RawData());
    				for (var n in json) {
                        if (sentPlayers[i] == null) break;
						if (json[n].bustedviapolice != 0 && sentPlayers[i].name != json[n].name) { GetWatcherAndPlayerInfo(json[n].name, 2); break}
						else if (json[n].bustedviapolice == 0 && sentPlayers[i].name == json[n].name) { sentPlayers.splice(i, 1); break  }

						if (json[n].busted != 0 && sentPlayers[i].name != json[n].name) { GetWatcherAndPlayerInfo(json[n].name, 3); break  }
						else if (json[n].busted == 0 && sentPlayers[i].name == json[n].name) { sentPlayers.splice(i, 1); break  }
                      
    				}
    			});

			}
		} else {
			var players = scene.EntitiesOfGroup('Player');
			for (var n in players) {
				if (players[n].dynamiccomponent.GetAttribute('spraying') == true) LogPlayerInfoOnSpray();
			}
				var transfer = asset.RequestAsset("http://vm0063.virtues.fi/gangsters/","Binary", true);
    			transfer.Succeeded.connect(function(){
    				var json = JSON.parse(transfer.RawData());
    				for (var n in json) {
    					if (json[n].bustedviapolice != 0) GetWatcherAndPlayerInfo(json[n].name, 2);
    					if (json[n].busted != 0) GetWatcherAndPlayerInfo(json[n].name, 3);

    				}
    			});
		}

	}
}

//Check if any player is spraying.
function LogPlayerInfoOnSpray(){
	var Players = scene.EntitiesOfGroup('Player');
	for (var i in Players) {
		if (Players[i].dynamiccomponent.GetAttribute('spraying') == true) {
			GetWatcherAndPlayerInfo(Players[i].name, 1);
		}
	}
}

//Get desired information from players, when someone is spraying.
function GetWatcherAndPlayerInfo(player, eventId) {
	var player = scene.EntityByName(player);
          if(!player) return
          Log(sentPlayers.indexOf(player));
          if (sentPlayers.indexOf(player) != -1) return;
	Log("Player that we are sending to GA " + player);
	sentPlayers.push(player);
	
         
          
	var name = player.name;
	var gang = player.dynamiccomponent.GetAttribute('gang');
	var pos = String(player.dynamiccomponent.GetAttribute('posGPS').x) + ',' + String(player.placeable.transform.pos.y) + ',' + String(player.dynamiccomponent.GetAttribute('posGPS').z);
	Log(pos);
	pos = pos.split(",").join('%2C');
	var transfer = asset.RequestAsset("http://vm0063.virtues.fi/events/" + eventId + "/playername" + '/' + name + '/playergang' + '/' + gang 
		+ '/playerpos' + '/' + pos + '/', "Binary", true);
	transfer.Succeeded.connect(function(){
		Log('Transfer succeeded to GameAnalytics');
	});
	
}

 + '/' + name + '/playergang' + '/' + gang 
		+ '/playerpos' + '/' + pos + '/', "Binary", true);
	transfer.Succeeded.connect(function(){
		Log('Transfer succeeded to GameAnalytics');
	});
	
}

