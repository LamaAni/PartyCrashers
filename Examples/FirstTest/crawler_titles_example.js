var Crawler=require("node-webcrawler");
var url=require("url");
var fs=require("fs");
var dburl='mongodb://party_crashers:google123@ds145868.mlab.com:45868/partycrashers';
require("mongodb").MongoClient.connect(dburl, function(err,db){
	if(err)
	{
		console.log("error connecting to mongodb, ",err);
		return;
	}

var roll=db.collection("roll");
// http://www.nyartbeat.com/list/event_opening
var getTypeWords=function(txt){
	var re=new RegExp("([a-zA-Z]{3,})","igm");
	var words=[];
	var match=null;
	while(match=re.exec(txt))
	{
		words.push(match[0]);
	}
	return words;
}

var getTimeAndDate=function(txt) {
	var re=new RegExp("[0-9]+\/[0-9]+\/[0-9]+|[0-9]+-[0-9]+-[0-9]+|[0-9]+-[0-9]+|[0-9]+\/[0-9]+","igm");
	var datematch=re.exec(txt);
	var re=new RegExp("[0-9]+:[0-9]+");
	var timematch=re.exec(txt);

	//var d=new Date(datematch+' '+timematch);
	return datematch+' '+timematch;
}

var collectEvent=function($,query)
{
	var event={};
	event.values=[];

	event.name=query.find("h4").text();
	var addr=query.find('li').each(function(idx,item){
		event.values.push($(item).text());
	});

	// assume values order:
	// galery name: remove first 5 vals.  (\nat )
	// area: remove first 7. (in the ).
	// address: as is.
	// media: need to collect all words.
	// reception date and time: Opening Reception on 2017-01-07 from 17:00 to 19:00.

	var i=0;
	event.Venue=event.values[i].substring(5);i=i+1;
	event.Area=event.values[i].substring(7);i=i+1;
	event.Address=event.values[i].substring(5);i=i+1;
	event.Theme=getTypeWords(event.values[i]);i=i+1;
	event.Time=getTimeAndDate(event.values[i]);i=i+1;
	return event;
}

var nyartbeatCrawler=new Crawler({
	maxConnections:10,
	callback:function(error,rslt,$){
		// code to checkout the result.

		var events=[];
		var event_boxes=$("div .smart_details");

		event_boxes.each(function(idx,el){
			jqel=$(el).parent();
			// parse data here. 
			var ev=collectEvent($,jqel);
			//events.push(collectEvent($(event_boxes[i]));
			events.push(ev);
			//console.log(event_boxes[i]);
		});
		console.log(events);
		console.log("found "+events.length+" events");
		var fname="crawl.json";
		fs.writeFile(fname,JSON.stringify(events,null,''),function(err){
			if(err)
			{
				console.log("Error while writing to file: ",err);
			}
		});
		console.log("written to file.. "+fname);
		console.log("Pushing to database..");
		roll.insert(events,function(err,result){
			if(err)
			{
				console.log("Error commiting to mongodb.");
			}
			else
			{
				console.log("MongoDB commit result: "+result);
			}

		});
	}
});

nyartbeatCrawler.queue("http://www.nyartbeat.com/list/event_opening");
});
