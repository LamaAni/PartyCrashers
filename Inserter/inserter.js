var firebase=require("firebase");

var geocoder=require("geocoder-geojson");

var options = {
  provider: 'google',
 
  // Optional depending on the providers 
  httpAdapter: 'https', // Default 
  apiKey: 'AIzaSyAIp7ciCp2BTOA7yvw6N360OagC6W4OlMA', // for Mapquest, OpenCage, Google Premier 
  formatter: null         // 'gpx', 'string', ... 
};

// firebase inserter.
var Inserter=function(){
	this.Config = {
	  apiKey: "AIzaSyBeaFhvd9_lGuyM5Esms3YnFlayi0exfDw",
	  authDomain: "partycrashers-b31af.firebaseapp.com",
	  databaseURL: "https://partycrashers-b31af.firebaseio.com",
	  storageBucket: "gs://partycrashers-b31af.appspot.com",
	};

	firebase.initializeApp(this.Config);

	this.Ref=firebase.database().ref();

}

Inserter.prototype={
	InsertEvent:function(ev){
		if(Array.isArray(ev)){
			for(var i=0;i<ev.length;i++)
				this.InsertEvent(ev[i]);
			return;
		}

		// get the date.
		//var baseDate=new Date(ev.Date); // string to date object;
		var startTime=ev.Time.trim().split(" ");
		var endTime=startTime[1];
		startTime=startTime[0];

		// now add the time to the date.
		var startTimestap=new Date(ev.Date+" "+startTime);
		var endTimestamp=new Date(ev.Date+" "+endTime);
		if(startTimestap.getTime()>endTimestamp.getTime())
		{
			endTimestamp=new Date(endTimestamp.getTime()+24*60*60*1000);
		}


		// // we have events;
		// var dbEvent={
		// 	Name:ev.Name,
		// 	Venue:ev.Venue==null?"":ev.Venue.trim(),
		// 	Address:ev.Address.trim(),
		// 	Start:startTimestap,
		// 	End:endTimestamp,
		// 	Area:ev.Area,
		// }

		// we have events;
		var dbEvent={
			type: "Feature",
			id: "123",
			properties: {
				 TEL: "5551212",
				 NAME:ev.Name,
				 Venue:ev.Venue==null?"":ev.Venue.trim(),
				 ADRESS1:ev.Address.trim(),
				 CITY: "New York",
				 ZIP: "10001",
				 URL: "http:\/\/www.google\.com\/",
				 START:startTimestap,
				 END:endTimestamp,
				 AREA:ev.Area,
				},
			geometry: {
				    type: "Point",
				    coordinates: [0, 0]
				  },
			};
		var me=this;

		function doPush(geojson)
		{
			var location =geojson.features.length>0 ? geojson.features[0].geometry.coordinates : "";
			if(location!="")
			{
				console.log("Adding event "+dbEvent.properties.NAME +" at ",location);
				dbEvent.geometry.coordinates=location;
				me.Ref.push(dbEvent);
			}
		}
		geocoder.google(dbEvent.properties.ADRESS1).then(geojson =>doPush (geojson)); 
		// var key=dbEvent.Name+"_"+dbEvent.Venue+"_"+dbEvent.Start.toString();
		// dbEvent.key=key;
		// console.log(key);
		// this.Ref.get()
		
	},
}

module.exports=Inserter;