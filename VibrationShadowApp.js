var awsIot = require('aws-iot-device-sdk');
var uuid = require('uuid');


var thingShadows = awsIot.thingShadow({
   keyPath: "./certs/5c0f673d72-private.pem.key",
  certPath: "./certs/5c0f673d72-certificate.pem.crt",
    caPath: "./certs/root-CA.crt",
  clientId: "RICH_Thing1",
    region: "us-west-2"
});

//
// Client token value returned from thingShadows.update() operation
//
var clientTokenUpdate;

//
// Simulated device values
//
var max_vibration = 500;

thingShadows.on('connect', function() {
  
    thingShadows.register( 'MAXvibration' );

    setTimeout( function() {
      var maxValueState = {"state":{"desired":{"max":max_vibration}}};

      clientTokenUpdate = thingShadows.update('MAXvibration', maxValueState  );
      console.log('Update shadow success!');

      if (clientTokenUpdate === null){
          console.log('update shadow failed, operation still in progress');
       }
     }, 5000 );

  });

thingShadows.on('status', 
    function(thingName, stat, clientToken, stateObject) {
       console.log('received '+stat+' on '+thingName+': '+
                   JSON.stringify(stateObject));

    });

thingShadows.on('delta', 
    function(thingName, stateObject) {
       console.log('received delta on '+thingName+': '+
                   JSON.stringify(stateObject));
    });

thingShadows.on('timeout',
    function(thingName, clientToken) {
       console.log('received timeout on '+thingName+
                   ' with token: '+ clientToken);
    });