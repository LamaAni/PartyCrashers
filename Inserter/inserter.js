var firebase=require("firebase");

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

		// we have events;
		var dbEvent={
			type: "Feature",
			id: "123",
			properties: {
				 TEL: "5551212"
				 NAME:ev.Name,
				 Venue:ev.Venue==null?"":ev.Venue.trim(),
				 ADRESS1:ev.Address.trim(),
				 CITY: "New York",
				 ZIP: "10001",
				 URL: "http://www.google.com",
				 START:startTimestap,
				 END:endTimestamp,
				 AREA:ev.Area
				},
			geometry: {
				    "type": "Point",
				     "coordinates": [-73.947298, 40.833854]
				  }
			};
		}

		// var key=dbEvent.Name+"_"+dbEvent.Venue+"_"+dbEvent.Start.toString();
		// dbEvent.key=key;
		// console.log(key);
		// this.Ref.get()
		this.Ref.push(dbEvent);
	},
}

module.exports=Inserter;
