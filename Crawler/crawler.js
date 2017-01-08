var Crawler=require("node-webcrawler");
var URL=require("url");
var PartyCrawler=function(){
	this.WebsiteObjects={}; //  a collection of website objects to crawl.
	this.LastCrawlStop=new Date();
	this.LastCrawlStarted=new Date();
	this.CrawlIntervalIndex=null;
	this.IntervalTime=10;
	this.Crawler=new Crawler({
		maxConnections:10,
		callback:function(error,rslt,$){
			console.log("Crawled website that dose not match a callback.");
		},
	});

	var me=this;
	this.Crawler.on('drain',function(){
		if(me.CrawlSequenceComplete!=null)
			me.CrawlSequenceComplete();
	});
}

PartyCrawler.prototype={
	// Makes the website object/s for the sepcific urls.
	AddWebsite:function(url){
		if(Array.isArray(url))
		{
			// check if array, if so go over all websites.
			for(var i=0;i<url.length;i++)
			{
				this.AddWebsite(url[i]);
			}
		}
		else
		{
			
			var webaddress=URL.parse(url).hostname;
			if (webaddress.substring(0, 3)=='www')
			{
				webaddress=webaddress.substring(4);
			}
			console.log("Adding website for "+webaddress+"..")
			if(this.WebsiteObjects[webaddress]==null)
			{
				try
				{
					var wo=require("./Specialized/"+webaddress+".js");
					wo.hostname=webaddress;
					//console.log(wo);
					this.WebsiteObjects[webaddress]=wo;
				}
				catch(e)
				{
					console.log("Website crawler for "+ webaddress +" not found.");
				}
			}
		}
	},
	IsStopped:function(){
		return this.LastCrawlStop.getTime()>this.LastCrawlStarted.getTime();
	},
	Stop:function(){
		this.LastCrawlStop=new Date();
	},
	CrawlInterval:function()
	{
		// calls the crawl interval if finished last.
		if(this.IsIntervalWorking)
		{
			// check if I need to reset the interval, since I finished the last list;
			if(this.Crawler.queueSize>0)
				return;

			this.IsIntervalWorking=false;
			this.CrawlInterval();
			return;
		}

		// check if need to stop everything.
		if(this.IsStopped)
		{
			try{clearInterval(this.CrawlIntervalIndex)}catch(e){}
			this.CrawlIntervalIndex=null;
		}

		// collecting base crawl objects.
		var cobjs=[];
		var keys=Object.keys(this.WebsiteObjects);
		console.log(this.WebsiteObjects);
		for(var i=0;i<keys.length;i++)
		{
			var hostname=keys[i];
			console.log("Preparing crawl for "+this.WebsiteObjects[hostname].hostname+"...");
			//console.log(this.WebsiteObjects[hostname]);
			cobjs.push(this.WebsiteObjects[hostname].MakeCrawls(this));
		}

		this.Queue(cobjs);
		// console.log("Pushing "+cobjs.length+" crawls");
		// this.Crawler.queue(cobjs);
	},
	// Initializes the crawl interval.
	Crawl:function(doInterval)
	{
		if(this.CrawlIntervalIndex!=null)
			return;

		this.IsIntervalWorking=false;
		this.LastCrawlStarted=new Date();

		if(doInterval)
		{
			var me=this;
			setInterval(function(){me.CrawlInterval();},this.IntervalTime);	
		}
		else this.CrawlInterval();
	},
	CrawlResult:function(rslt){
		console.log("crawl result returned");		
	},
	Queue:function(crawls){
		if(!Array.isArray(crawls))
		{
			crawls=[crawls];
		}
		else if(crawls.length==0)
			return;

		this.Crawler.queue(crawls);
		console.log("Pushed "+crawls.length+" crawls to queue.");
	},
	CrawlSequenceComplete:function(){
		console.log("Crawl sequence complete.");
	}
};

module.exports=PartyCrawler;

