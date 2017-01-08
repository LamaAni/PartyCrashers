var Parser=require("../ParserBase.js");
Parser.CollectEvent=function($,query)
{
	var event={};
	event.values=[];

	event.values.push(query.find("h4").text());
	var addr=query.find('li').each(function(idx,item){
		event.values.push($(item).text());
	});

	// assume values order:
	// name;
	// galery name: remove first 5 vals.  (\nat )
	// area: remove first 7. (in the ).
	// address: as is.
	// media: need to collect all words.
	// reception date and time: Opening Reception on 2017-01-07 from 17:00 to 19:00.

	var i=0;
	event.Name=event.values[i];i=i+1;
	event.Venue=event.values[i].substring(5);i=i+1;
	event.Area=event.values[i].substring(7);i=i+1;
	event.Address=event.values[i].substring(5);i=i+1;
	//event.Theme=this.GetTypeWords(event.values[i]);i=i+1;
	event.DateAndTime=this.GetDateAndTime(event.values[i]);i=i+1;
	return event;
};
Parser.ParseEvents=function($)
{
	var events=[];
	var event_boxes=$("div .smart_details");
	var me=this;
	event_boxes.each(function(idx,el){
		jqel=$(el).parent();
		// parse data here. 
		var ev=me.CollectEvent($,jqel);
		//events.push(collectEvent($(event_boxes[i]));
		events.push(ev);
		//console.log(event_boxes[i]);
	});

	return events;
};

module.exports=Parser;