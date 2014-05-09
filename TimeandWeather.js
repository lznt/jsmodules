// Include our utils script that has asset storage and bytearray utils etc.
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js, Script
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/class.js, Script
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/json2.js, Script

/* We are using OpenWeatherMap.org free API to get weather data for StreetArtGangs */

engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/class.js");
engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js");
SetLogChannelName("Time And Weather Script"); //this can be anything, but best is your aplication name

frame.Updated.connect(Update);

var interval = 45000;
var timeinterval = 1500;
var day = null;
var updateTimes = ['08:00', '14:00', '20:00'];
var entity = scene.EntityByName('WeatherEntity');

//Time for SkyX
function Update (frametime) {
           /*if (timeinterval >= 1500)
           {
            timeinterval = 0;
            //setTimeForSkyX();
            }else timeinterval++;*/

	if (interval >= 45000) {
		interval = 0;	
		getWeather();
	} else 
		interval++;
}


function setTimeForSkyX() {
	var date = new Date();
	var hrs = date.getHours();

	//Add 0 to time, so its 7:07 not 7:7
	if (date.getMinutes() < 10)
		this.me.skyx.time = date.getHours() + '.' + 0 + date.getMinutes();
	else 
		this.me.skyx.time = date.getHours() + '.' + date.getMinutes();
        Log (this.me.skyx.time);

}

/* Use OpenWeatherMap API to get current weather information from Oulu. 
	We use these to manipulate the scene into looking how Oulu actually is at the moment. 
	(API is called once a day.) */
function getWeather() {
	var url = 'http://api.openweathermap.org/data/2.1/weather/city/643492';
	var transfer = asset.RequestAsset(url, "Binary", true);
	transfer.Succeeded.connect(function(){
		var json = JSON.parse(transfer.RawData());
		var name = json.name;
		var wind = json.wind;
		var speedOfWind = wind.speed;
		var cloudPercentage = json.clouds.all;
		var weather = json.weather;

		for (var i in weather) {
			var mainWeather = weather[i].main;
			var desc = weather[i].description;
		}
		
		var desc = weather.description;

		this.me.skyx.cloudCoverage = cloudPercentage;
		this.me.skyx.windSpeed = speedOfWind;

		setWeather(mainWeather, desc);
	});
	
	Log('getWeather');

}

function setWeather(mainWeather, desc) {
/* Different weathers that can be manipulated in scene. */
		Log(mainWeather + "--" + desc);
		if (mainWeather == 'Snow' && desc != 'light snow') {
			/* Harder snow effect and streets get snowy. */
			entity.mesh.materialRefs = new Array('http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle/snowflakes_prop_mat.material');
			entity.mesh.meshRef = 'http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle/snowflakes_prop.mesh';
			entity.particlesystem.particleRef = 'http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle/snow_prop.particle';
                              entity.particlesystem.enabled = true;
		} else if (desc == 'light snow') {
			/* Add lighter snow effect, streets dont get snowy */
			entity.mesh.materialRefs = new Array('http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle/snowflakes_prop_mat.material');
			entity.mesh.meshRef = 'http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle/snowflakes_prop.mesh';
			entity.particlesystem.particleRef = 'http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle/lightsnow_prop.particle';
                              entity.particlesystem.enabled = true;
		}

		if (mainWeather == 'Rain' && desc == 'light rain') {
			//Light rain
			entity.mesh.materialRefs = new Array('http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle/rain_prop2_mat.material');
			entity.mesh.meshRef = 'http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle/rain_prop2.mesh';
			entity.particlesystem.particleRef = 'http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle/lightrain_prop.particle';
                              entity.particlesystem.enabled = true;
		} else if (mainWeather == 'Rain') {
			//Heavier or heavy rain. Also streets are flooded
			entity.mesh.materialRefs = new Array('http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle/rain_prop2_mat.material');
			entity.mesh.meshRef = 'http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle/rain_prop2.mesh';
			entity.particlesystem.particleRef = 'http://meshmoon.eu.scenes.2.s3.amazonaws.com/mediateam-b4527d/test2/particle/lightrain_prop.particle';

			this.me.fog.mode = 3;
			this.me.fog.startDistance = 2;
                              this.me.fog.endDistance = 100;
			this.me.fog.expDensity = 1,0;
                              entity.particlesystem.enabled = true;
		} else 
                        entity.particlesystem.enabled = false;

		if (mainWeather == 'Mist') {
			this.me.fog.mode = 2;
			this.me.fog.startDistance = 5;
			this.me.fog.expDensity = 0,01;
		} else {
			this.me.fog.mode = 0;
		}

		if (mainWeather == 'Thunderstorm') {
			/* Maybe some thundah? */
		}
}p('Polices');
		if (polices.length > 5) return;

		var avatarEntity = scene.CreateEntity(scene.NextFreeId(), ["RigidBody", "Avatar", "Mesh", "Script", "Placeable", "AnimationController", "DynamicComponent"]);
		avatarEntity.SetTemporary(true); // We never want to save the avatar entities to disk.               
		avatarEntity.SetName(avatarEntityName);
		avatarEntity.SetDescription(avatarEntityName);
		avatarEntity.group = "Player";
		avatarEntity.rigidbody.mass = 0;
		avatarEntity.dynamiccomponent.CreateAttribute('bool', 'spraying');
        avatarEntity.dynamiccomponent.CreateAttribute('string', 'gang');
        avatarEntity.dynamiccomponent.CreateAttribute('string' ,'venueSprayed');
		avatarEntity.placeable.visible = false;
	}

	//remove policeofficers at 6am-18pm
	if (new Date().getHours() >= 6 && new Date().getHours() < 18) {
		var polices = scene.EntitiesOfGroup('Polices');
		for (var i in polices) {
			if (polices.length > 2) {
				scene.RemoveEntity(polices[i].id);
			}
		}
	}
}