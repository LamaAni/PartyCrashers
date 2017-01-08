// tester file for cralwer + parser
var PartyCrawler=require("./Crawler/crawler.js");
var PartyParser=require("./Parser/parser.js");
var PartyInserter=require("./Inserter/inserter.js");
var parser=new PartyParser();
var crawler=new PartyCrawler();
var inserter=new PartyInserter();

crawler.AddWebsite("https://www.arthaps.com");
//crawler.AddWebsite("https://www.nyartbeat.com");
var events=[];
crawler.CrawlResult=function(rslt)
{
	var wp=parser.Get(rslt.Request.url);
	var locEvents=wp.ParseEvents(rslt.$);
	events=events.concat(locEvents);
	console.log(rslt.Request.url+": "+locEvents.length);
}

// var crawlCheckInterval=setInterval(function(){
// 	console.log("Crawl queue status: "+crawler.Crawler.queueSize);
// },100);
crawler.CrawlSequenceComplete=function()
{
	console.log("Found "+events.length+" on crawl.");
	console.log("Inserting..")
	inserter.InsertEvent(events);
	console.log("Insert complete.")
	//clearTimeout(crawlCheckInterval);
}
crawler.Crawl();

