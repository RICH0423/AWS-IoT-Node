var awsIot = require('aws-iot-device-sdk');
var uuid = require('uuid');


var device = awsIot.device({
   keyPath: "./certs/5c0f673d72-private.pem.key",
  certPath: "./certs/5c0f673d72-certificate.pem.crt",
    caPath: "./certs/root-CA.crt",
  clientId: "RICH_Thing1",
    region: "us-west-2"
});


var delay = 1000;
var sub_topic = "topic_1";
var pub_topic = "topic_2";
var max_vibration = 0;
var pub_count = 20;
//
// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//
device
  .on('connect', function() {
    console.log('connect success!');

    device.subscribe(sub_topic);
    console.log('subscribe topic: ' + sub_topic);
    
    for (i = 1; i <= pub_count; i++) {
      var vibration_value = getRandomInt(0, 400);

      var data = {
        "id": uuid.v1(),
        "vibration": vibration_value
      };

      publishData(pub_topic, data, delay);
      delay += 5000;
    }
    
  });

// Receive message
device
  .on('message', function(topic, payload) {
    console.log('Receive message', topic, payload.toString());
  });


function publishData(topic, data, delay) {
  setTimeout(function() { 
    device.publish(topic, JSON.stringify(data));
     console.log('Publish vibration: ' + data.vibration + ' success!');
  }, delay);
    
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
