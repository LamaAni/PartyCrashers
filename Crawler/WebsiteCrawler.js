var URL=require("url");
var WebsiteCrawler={
	// returns the crawl objects.
	MakeCrawls:function(crawler){
		return [{
			url:"http://www.nyartbeat.com/list/event_opening",
			Crawler:crawler;
			callback : function (error, result, $) {
				this.Crawler.CrawlResult({
					$:$,
					Result:result,
					Error:error,
				});
		    }
		}];
	}
}

module.exports=WebsiteCrawler;