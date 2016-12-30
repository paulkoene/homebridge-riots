# homebridge-riots
homebridge plugin for interfacing wireless riots
# Installation
Install homebridge using: npm install -g homebridge
Install this plugin using: npm install -g homebride-riots
# Configuration
for each riot add the following block to the "accessories": [ ] container in the config.json file. For type either light or air can be specified. The ID in the URL part (ffffffffffffffffffffffffffffffff) needs to match the ID obtained from the Riots cloud. This can be found under configure -> riots core -> settings -> Rest API URL
```
{
 "accessory": "riots",
 "name": "eg location of core",
 "type": "light",
 "url": "https://my.riots.fi/api/core/ffffffffffffffffffffffffffffffff"
}
```
