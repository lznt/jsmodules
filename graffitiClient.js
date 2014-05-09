// Include the json parse/stringify library. We host it here if you want to use it:
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/json2.js, Script

// Include our utils script that has asset storage and bytearray utils etc.
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js, Script
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/class.js, Script


/*engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/class.js");
engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js");

SetLogChannelName("graffitiClient"); //this can be anything, but best is your aplication name
Log("Script starting...");



var myHandler = function (myAsset) {
    Log("successfully connected");
    var data = JSON.parse(myAsset.RawData());
    for(var i=0; i<data.length; ++i) {
        addAvatar(data[i]);
    }
    // Forget the disk asset so it wont be returned from cache next time you do the same request
    asset.ForgetAsset(myAsset.Name(), true);

}

var addAvatar = function(user){
    var avatarEntityName = user.username;
    Log(avatarEntityName);
    var avatarEntity = scene.CreateEntity(scene.NextFreeId(), ["Script", "Placeable", "AnimationController", "DynamicComponent"]);
    avatarEntity.SetTemporary(true); // We never want to save the avatar entities to disk.
    avatarEntity.SetName(avatarEntityName);
    avatarEntity.SetDescription(avatarEntityName);
    var script = avatarEntity.script;
    script.className = "GraffitiApp.Gangster";


    // Set random starting position for avatar
    var placeable = avatarEntity.placeable;
    var transform = placeable.transform;
    transform.pos.x = (Math.random() - 0.5);
    transform.pos.y = 11; //TODO put height DEFAULT variables
    transform.pos.z = (Math.random() - 0.5);
    placeable.transform = transform;
    Log("Created avatar for " + avatarEntityName);

}

if (server.IsRunning()) {
  Log("This is the server...");  
  //GET active users
  var transfer = asset.RequestAsset("http://vm0063.virtues.fi/gangsters/?active", "Binary", true);
  transfer.Succeeded.connect(myHandler);

} else {
    Log("This is the client...");

}*/