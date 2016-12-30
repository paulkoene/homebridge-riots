var request = require("request");
module.exports = function(homebridge){
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-riots", "riots", Riots);
};
class Riots
{
  constructor(log, config)
  {
   this.log=log;
   this.config=config;
   this.services=[];
   this.services[this.services.push(new Service.AccessoryInformation())-1]
    .setCharacteristic(Characteristic.Manufacturer, "Riots")
    .setCharacteristic(Characteristic.Model, "Core")
    .setCharacteristic(Characteristic.SerialNumber, "0");
   switch(this.config.type)
   {
    case "light":
     this.services[this.services.push(new Service.LightSensor(this.config.name))-1]
      .getCharacteristic(Characteristic.CurrentAmbientLightLevel)
      .on('get', this.beginGetCurrentAmbientLightLevel.bind(this));
     break;
    case "air":
     this.services[this.services.push(new Service.TemperatureSensor(this.config.name))-1]
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', this.beginGetCurrentTemperature.bind(this));
     this.services[this.services.push(new Service.HumiditySensor(this.config.name))-1]
      .getCharacteristic(Characteristic.CurrentRelativeHumidity)
      .on('get', this.beginGetCurrentHumidity.bind(this));
     break;
   }
   this.lastUpdate = new Date(0);
  }
  beginGetCurrentHumidity(callback)
  { this.refreshData(this.endGetCurrentHumidity,callback,this); }
  endGetCurrentHumidity(callback,myself)
  { callback(null,myself.data.values[1].value); }
  beginGetCurrentTemperature(callback)
  { this.refreshData(this.endGetCurrentTemperature,callback,this); }
  endGetCurrentTemperature(callback,myself)
  { callback(null,myself.data.values[0].value); }
  beginGetCurrentAmbientLightLevel(callback)
  { this.refreshData(this.endGetCurrentAmbientLightLevel,callback,this); }
  endGetCurrentAmbientLightLevel(callback,myself)
  { callback(null,(myself.data.values[0].value>0)?myself.data.values[0].value:0.0001); }
  refreshData(end,callback,myself)
  {
   if((new Date() - myself.lastUpdate)  > 30000)
   {
    request.get({
    	url: myself.config.url
    }, function(err, response, body) {
        myself.data = JSON.parse(body);
	myself.lastUpdate = new Date();
        end(callback,myself);
    }.bind(this));
   } else end(callback,myself);
  }
  getServices() {
this.log("requesting services...");
   return this.services;
  }
}
