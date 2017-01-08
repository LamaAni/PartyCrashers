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
}

PartyCrawler.prototype={
	// Makes the website object/s for the sepcific urls.
	AddWebsite:function(url){
		if(url.isArray())
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
				webaddress=webaddress.substring(4);
			if(this.WebsiteObjects[webaddress]==null){
				try{
					var wo=require("Specialized/"+webaddress+".js");
					this.WebsiteObjects[webaddress]=wo;
				}
				catch{
					console.log("Website crawler for "+ webaddress +" not found.");
				}
			}
		}
	},
	IsStopped:function(){
		return this.LastCrawlStop.getTime()>this.LastCrawlStarted.getTime():
	},
	Stop:function(){
		this.LastCrawlStop=new Date();
	},
	CrawlInterval:function(){
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
			try{clearInterval(this.CrawlIntervalIndex)}catch{}
			this.CrawlIntervalIndex=null;
		}

		// collecting base crawl objects.
		var cobjs=[];
		for(var i=0;i<this.WebsiteObjects.length;i++)
		{
			cobjs.push(this.WebsiteObjects[i].MakeCrawls());
		}

		this.Crawler.queue(cobjs);
	}
	// Initializes the crawl interval.
	Crawl:function()
	{
		if(this.CrawlIntervalIndex!=null)
			return;

		this.IsIntervalWorking=false;
		this.LastCrawlStarted=new Date();

		var me=this;
		setInterval(function(){me.CrawlInterval();},this.IntervalTime);
	},
	CrawlResult:function(rslt){

	}
};

module.exports=PartyCrawler;

