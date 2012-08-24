These files are the scripts that the GraffitiWars game entities use to make the logic work. All files are commented. Also check my
Naali repo for the Websocketserver.py file for some variable declarations and so on. 

BUGS: 
	1. Police attachment animation is off sync, check code of PoliceScript.js for more info
	2. ChatApplication.js is not able to add msgs from Mobile(dynamiccomponent of playerentity).
	3. Player entity's rotation when spraying is not flawless. Sometimes looks off. BotScript_application.js holds the logic for that.
	4. Sometimes the spraying does not end after 5 seconds.(Seems to be fixed when you remove the 2nd spray, maybe the sprays having same 
	name is the problem?)