// Include the json parse/stringify library. We host it here if you want to use it:
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/json2.js, Script

// Include our utils script that has asset storage and bytearray utils etc.
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js, Script
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/class.js, Script
engine.ImportExtension('qt.core');
engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/class.js");
engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js");
SetLogChannelName("Police script"); //this can be anything, but best is your application name
Log("Script starting");

//Variable where we store the obj data.
var frametimma;
var pathWays;
var nextDest;
var curDest;
var orientationSet = false;
var playerToBeBusted;
var transfer = asset.RequestAsset("http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/navmesh/kartta.obj", "Binary", true);
transfer.Succeeded.connect(function(transfer) {
    pathWays = parseObjData(transfer);
});

//Boolean variable to check if police or entity has reached goal (global... i know).
var reachedGoal = true;
frame.Updated.connect(Update);

function Update (frametime) {
    if (!server.IsRunning()) {
        bustPlayers();
        if(pathWays && this.me.name != 'robotest')
            newDestination(pathWays, frametime);
        checkAnims();
        monitorPoliceAmount();
    } 
}

function monitorPoliceAmount() {
    if (new Date().getHours() > 18 && new Date().getHours() < 7) {

        var polices = scene.EntitiesOfGroup('Polices');
        if (polices.length < 7) {
            var avatarEntity = scene.CreateEntity(scene.NextFreeId(), ["RigidBody", "Avatar", "Mesh", "Script", "Placeable", "AnimationController", "ParticleSystem"]);
            avatarEntity.SetTemporary(true); // We never want to save the avatar entities to disk.               
            avatarEntity.SetName('robo');
            avatarEntity.group = "Polices";
            avatarEntity.rigidbody.mass = 0;
            avatarEntity.placeable.visible = true;
            avatarEntity.rigidbody.phantom = true;
            avatarEntity.rigidbody.useGravity = false;
            avatarEntity.mesh.materialRefs = new Array("http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/navmesh/robocop/robo_mat.material");
            avatarEntity.mesh.meshRef = "navmesh/robocop/robo.mesh";
            avatarEntity.mesh.skeletonRef = "http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/navmesh/robocop/robo.skeleton";
            avatarEntity.particlesystem.particleRef = "navmesh/robocop/stars_prop.particle";
            avatarEntity.particlesystem.enabled = true;
            avatarEntity.script.scriptRef = "http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/scripts/astar.js";
            avatarEntity.script.runOnLoad = true;
        } else if (polices.length > 2){
            var police = polices[random(polices.length)];
            scene.RemoveEntity(police.id);
        }
    } else {
        while (scene.EntitiesOfGroup('Polices').length > 2) {
            var police = scene.EntitiesOfGroup('Polices')[random(scene.EntitiesOfGroup('Polices').length)];
            scene.RemoveEntity(police.id);
        }

    }

}

function checkAnims() {
    if (this.me.animationcontroller.GetActiveAnimations().length < 1)
        this.me.animationcontroller.EnableExclusiveAnimation('walk', true, 1, 1, false);
}

function lookAt(source, destination) {
        var targetLookAtDir = new float3();
        targetLookAtDir.x = destination.x - source.x;
        targetLookAtDir.y = destination.y - source.y;
        targetLookAtDir.z = destination.z - source.z;
        targetLookAtDir.Normalize();
        //return Quat.RotateFromTo(source, destination);
        return Quat.LookAt(scene.ForwardVector(), targetLookAtDir, scene.UpVector(), scene.UpVector());
}

//police movement script. If you want to edit the movement change line 55 for the space in which the bot
//  can move. Now its from 15m to 20m distance. Also you can change speed of the police man by changing var speed.
function newDestination(destination, frametime) {
    //If bot reached its goal, random a new goal and check that its valid.
    var tm = this.me.placeable.transform;
    if (reachedGoal) {
        var nextDesti = destination[random(destination.length)];
        xNow = nextDesti[0];
        zNow = nextDesti[1];
        var dist = Math.sqrt(Math.pow((xNow - this.me.placeable.Position().x), 2) + 
            Math.pow((zNow - this.me.placeable.Position().z), 2));
    
        if (dist < 25  && dist > 15 && nextDest != nextDesti) {
            nextDest = nextDesti;
        } else 
            return;
    }

    var totalLat=0;
    var totalLon=0;
    var ratioLat;
    var ratioLon; 

    //Make relative values for walking.
    var relativeLon = nextDest[0] - this.me.placeable.Position().x;
    var relativeLat = nextDest[1] - this.me.placeable.Position().z;

    //Check ratio to walk
    if (Math.abs(relativeLat) >= Math.abs(relativeLon)) {
        ratioLon = Math.abs(relativeLon / relativeLat);
        ratioLat = 1;
    } else {
        ratioLat = Math.abs(relativeLat / relativeLon);
        ratioLon = 1;
    }


    //Moving the police.
    var time = frametime;
    var speed = 2.0; //Can be adjusted to a different value later.
    //Wher are we now.
    var yNow = this.me.placeable.transform.pos.y;
    var xNow = this.me.placeable.transform.pos.x;
    var zNow = this.me.placeable.transform.pos.z;

    //Movement.
    var lats = speed * time * ratioLat;
    var lons = speed * time * ratioLon;

    //Check in which quarter we are moving into.
    if (relativeLon >= 0) var finalMovementX = xNow + lons;
    else var finalMovementX = xNow - lons;

    if (relativeLat >= 0) var finalMovementZ = zNow + lats;
    else var finalMovementZ = zNow - lats;

    //Add movement value to total position value.
    totalLat += lats;
    totalLon += lons;
    tm.pos.x = finalMovementX;
    tm.pos.z = finalMovementZ;
    //Assign value to script owner - Police bot
    
    this.me.placeable.transform = tm;
    if (!orientationSet) {
        this.me.placeable.SetOrientation(lookAt(this.me.placeable.transform.pos, 
            new float3(xNow, this.me.placeable.transform.pos.y, zNow)));
        orientationSet = true;
    }
    //Check if we have reached goal and assign value to global parameter, so we can monitor 
    //  easily the functionality.
    if (totalLat > Math.abs(relativeLat) || totalLon > Math.abs(relativeLon)) {
        reachedGoal = true;
        totalLat = 0;
        totalLon = 0;
        orientationSet = false;
    } else
        reachedGoal = false;
}


//Parse .obj file verticles into an array so we can use it as the Police pathway.
function parseObjData(data) {
    //Variables for the function to handle data from server.
    var objText = data.RawData();
    var verticles;
    var obj = {};
    var graph;
    var vertexMatches = QByteArrayToString(objText).match(/^v( -?\d+(\.\d+)?){3}$/gm);
    var result;
    var values = String(vertexMatches).split(",");
    var xNz = [];

    for (i = 0; i < values.length; i++) {
        values[i] = String(values[i]).replace('v ', '');
    }

    for (i = 0; i < values.length; i++) {        
        values[i] = String(values[i]).split(" ");
    }
    if (values) {
        obj = values.map(function(vertex)
    {   
            vertex.splice(1, 1);
            values = vertex; 
            xNz.push(values);
        });
        
    }
    return xNz; 
}

//Function for bot to bust players that are spraying and within 30m. If you want to change the distance needed to bust
//  change 30 on line 164.
function bustPlayers() {
    /*var transform = this.me.placeable.transform;
    transform.pos.y = 9.9;
    this.me.placeable.transform = transform;
    */
    var Players = scene.EntitiesOfGroup('Player');

    for (var i in Players) {
        var json = null;
        var x = this.me.placeable.Position().x;
        var z = this.me.placeable.Position().z;
        //Calculating logic for distance.
        var distance = Math.sqrt(Math.pow((x - Players[i].placeable.Position().x), 2) + 
                Math.pow((z - Players[i].placeable.Position().z), 2));
        //distance has to be correlated to the desired value for police to bust player from (30m default)
        if (Players[i].dynamiccomponent.GetAttribute('spraying')) {
                //Get data from server, and change it so that the player is busted via police now.
                if (distance < 15) {

                    playerToBeBusted = Players[i];
                    var transfer = asset.RequestAsset("http://vm0063.virtues.fi/gangsters/","Binary", true);
                    transfer.Succeeded.connect(bustAndUpload);
                } else
                    continue; 
        }
    }
}

function bustAndUpload(players) {

    if (players.RawData() == [] || players.RawData() == "")
        return;

    var playersToString = QByteArrayToString(players.RawData());
    var json = JSON.parse(playersToString);
    var playerId = null;
    for (var i in json) {
        if (json[i].username == playerToBeBusted.name) {
                json[i].bustedviapolice = 1;
                json[i].points -= 30;
                json[i].busts += 1;
                playerId = json[i].id;
        }
    }
    var jsonNew = JSON.stringify(json);
    Log(jsonNew + " this is jsonnew");
    var qByteJson = EncodeString('UTF-8', json);
    //The player busted JSON data is modified and REX is doing animations for busting.
    if (jsonNew && playerId) {
        //Animation Code for Police and player.
        this.me.animationcontroller.PlayAnim('busted', 0, 'busted');
        playerToBeBusted.dynamiccomponent.SetAttribute('spraying', false);
        playerToBeBusted.animationcontroller.EnableExclusiveAnimation('busted', false, 1, 1, false);
        playerToBeBusted.animationcontroller.AnimationFinished.connect(function(){
            this.me.animationcontroller.StopAllAnims(0);
            this.me.animationcontroller.PlayLoopedAnim('walk', 0, 'walk');
        });

        /* Beta Patch code for the Django server, does not work ATM - Reported about bug. */
        /*http.client.Put("http://vm0063.virtues.fi/gangsters/" + playerId + '/', jsonNew, "application/json")
        .SetRequestHeader("Content-Type", "application/json")
        .SetRequestHeader('Content-Length', jsonNew.length.toString())
        .Finished.connect(function(req, status, error) {
              console.LogInfo(req.ResponseStatus() + " for " + req.method + " to " + req.UrlString());
                                console.LogInfo(error);
              //Log(req.Stream());
              if (status != 200)
                 console.LogError("POST failed!");
         });*/
         
         var transfer = asset.RequestAsset("http://vm0063.virtues.fi/police/" + playerId + "/","Binary", true);
         transfer.Succeeded.connect(function() { Log('Police busted succesfully.'); });
    }
}

function QByteArrayToString(qbytearray)
{
    var ts = new QTextStream(qbytearray, QIODevice.ReadOnly);
    return ts.readAll();
}

function DecodeString(encoding, qbytearray)
{
    var strEncoding = new QByteArray(encoding);
    var codec = QTextCodec.codecForName(strEncoding);
    return codec.toUnicode(qbytearray);
}

function EncodeString(encoding, string)
{
    var strEncoding = new QByteArray(encoding);
    var codec = QTextCodec.codecForName(strEncoding);
    return codec.fromUnicode(string);
}

function random(n) {
    seed = new Date().getTime();
    seed = (seed*9301+49297) % 233280;
    
    return (Math.floor((seed/(233280.0)* n)));
}