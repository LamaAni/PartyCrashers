var wc=require("../WebsiteCrawler.js");

wc.MakeCrawls=function(crawler){
	return [{
		url:"http://www.nyartbeat.com/list/event_opening",
		Crawler:crawler,
		WebsiteCrawler:this,
		callback : function (error, result, $) {
			this.Crawler.CrawlResult({
				$:$,
				Result:result,
				Error:error,
				Request:this,
			});
	    }
	}]; 
}

module.exports=wc;