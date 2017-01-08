// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var Firebase = require("firebase");

var config = {
  apiKey: "AIzaSyBeaFhvd9_lGuyM5Esms3YnFlayi0exfDw",
  authDomain: "partycrashers-b31af.firebaseapp.com",
  databaseURL: "https://partycrashers-b31af.firebaseio.com",
  storageBucket: "gs://partycrashers-b31af.appspot.com",
};

firebase.initializeApp(config);


var ref = firebase.database().ref();

ref.on("value", function(snapshot) {
  console.log(snapshot.val());
  }, function (error) {
  console.log("Error: " + error.code);
});
