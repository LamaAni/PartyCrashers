var wc=require("../WebsiteCrawler.js");

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getMonthName(date)
{
	return monthNames[date.getMonth()].toLowerCase();
}

wc.MakeCrawlPageURL=function(date, idx)
{
	// example: https://www.arthaps.com/all-events/january/07/2017/in/all_neighborhoods/500
	var url="https://www.arthaps.com/all-events/"+
		getMonthName(date)+
		"/"+
		date.getDate()+
		"/"+
		date.getFullYear()+
		"/in/all_neighborhoods"+
		(idx==0?"":"/"+idx*10);
	return url;
}

wc.MakeCrawls=function(crawler){
	console.log("Finding pages to crawl in arthaps.com..");
	this.CrawlForPages(crawler, 10, new Date());
	return [];
}

wc.CrawlForPages=function(crawler,curIdx,date){
	// call to crawll for total number of pages that may exist in on the website.
	var crawlURL=this.MakeCrawlPageURL(date,curIdx);
	var pageNumberCrawl={
		url:crawlURL,//"http://www.nyartbeat.com/list/event_opening",
		Crawler:crawler,
		LastPageCrawlIdx:curIdx,
		PageCrawlDate:date,
		WebsiteCrawler:this,
		callback : function (error, result, $) {
			// checking to see if we finished scanning for the pages.
			var isNoEvents=$("div .no-events").text().trim().toLowerCase().includes("no events yet");
			if(isNoEvents)
			{
				// crawl for pages.
				console.log("Finished crawling for pages, max index: "+this.LastPageCrawlIdx);
				this.WebsiteCrawler.CrawlForEventPages(this.Crawler,this.PageCrawlDate,this.LastPageCrawlIdx);
			}
			else
			{
				// move next...
				this.WebsiteCrawler.CrawlForPages(this.Crawler, this.LastPageCrawlIdx+10, this.PageCrawlDate);
			}
	    }
	};
	//console.log("Checking for pages in arthaps.com, idx:"+curIdx+", url:"+crawlURL);
	crawler.Queue(pageNumberCrawl);
}

wc.CrawlForEventPages=function(crawler,date,maxIndex){
	// searches through the directory for event pages.
	var urls=[];
	for(var i=0;i<maxIndex;i++)
	{
		urls.push({
			url:this.MakeCrawlPageURL(date,i),//"http://www.nyartbeat.com/list/event_opening",
			Crawler:crawler,
			WebsiteCrawler:this,
			callback : function (error, result, $) {

				// found urls
				var urlsFound=[];
				$('[itemprop="name"]').each(function(idx,elm){
					urlsFound.push("https://www.arthaps.com"+$(elm).attr('href'));
				});

				this.WebsiteCrawler.CrawlEventPages(this.Crawler,urlsFound);
		    }
		});
	}

	crawler.Queue(urls);
}

wc.CrawlEventPages=function(crawler,urls)
{
	// creating the crawls for the event page.
	var pageCrawls=[];
	for(var i=0;i<urls.length;i++)
	{
		pageCrawls.push({
			url:urls[i],
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
		});	
	}
	crawler.Queue(pageCrawls); 
}

module.exports=wc;