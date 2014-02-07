//All planes have to have this script to monitor the current graffiti logo.

// Include the json parse/stringify library. We host it here if you want to use it:
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/json2.js, Script

// Include our utils script that has asset storage and bytearray utils etc.
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js, Script
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/class.js, Script

engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/class.js");
engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js");
SetLogChannelName("GraffitiScript"); //this can be anything, but best is your aplication name

var graffitiLinks = ["http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/graffiti/blue.material",
   "http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/graffiti/purple.material", "http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/graffiti/green.material"];
var scene = me.ParentScene();
//Interval so server is queried only once every 2seconds. (Roughly)
var interval = 0;
var currentData = "";

Log("Script starting...");

//Connect Update function to frametime signal. 
frame.Updated.connect(Update);

var myHandler = function (myAsset) {
    Log("Successfully connected");
    //Check if data on server has changed or not. No need to parse same data over and over again.
    if (String(myAsset.RawData()) == currentData) {
    	    Log("Nothing changed on serv.")
    	    return;
    } else
    	currentData = String(myAsset.RawData());
    
    var data = JSON.parse(myAsset.RawData());
    for(var i=0; i<data.length; ++i) {
          checkVenue(data[i]);
    }
    
    // Forget the disk asset so it wont be returned from cache next time you do the same request
    asset.ForgetAsset(myAsset.Name(), true);
}



//Simple logic to check which gang owns which plane 
function checkVenue (venueData) {
  var venueName = venueData.name;
  var venueGang = venueData.gang;
  //Syntax for graffitis
  var plane = scene.EntityByName("graffiti-plane-" + venueName);

  if (venueGang == "Blue Angels" && plane) {
    plane.mesh.materialRefs = new Array(graffitiLinks[0]);
    Log("Found something by Blue Angels");
  } else if (venueGang == "Purple Knights" && plane) {
    plane.mesh.materialRefs = new Array(graffitiLinks[1]);
    Log("Found something by Purple Knights");
  } else if (venueGang == "Green Shamans" && plane) {
    plane.mesh.materialRefs = new Array(graffitiLinks[2]);
    Log("Found something by Green Shamans");
  }
}

//Change later to work serverside
function Update () {
  if (!server.IsRunning()) {
      //GET venues    
      //Query server only every 2seconds ("roughly")
      if (interval > 50) {
        var transfer = asset.RequestAsset("http://vm0063.virtues.fi/venues/?active", "Binary", true);
        transfer.Succeeded.connect(myHandler);
        interval = 0;
      } else
        interval ++;
  } else {
        Log("This is the server...");
  }
}



