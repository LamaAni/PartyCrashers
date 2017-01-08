var geocoder=require("geocoder-geojson");
geocoder.google('220 west 21st str')
  .then(geojson => console.log(geojson.features[0].geometry.coordinates))

// var NodeGeocoder = require('node-geocoder');
 
// var options = {
//   provider: 'google',
//   // Optional depending on the providers 
//   httpAdapter: 'https', // Default 
//   apiKey: 'AIzaSyAIp7ciCp2BTOA7yvw6N360OagC6W4OlMA', // for Mapquest, OpenCage, Google Premier 
//   formatter: null,        // 'gpx', 'string', ... 
// };
 

//  var geoc=new NodeGeocoder(options);

//  geocoder.geocode("220 west 21st st.", function ( err, data ) {
//   // do something with data 
//   console.log('data');
// });