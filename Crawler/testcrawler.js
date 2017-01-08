var PartyCrawler=require("./crawler.js");
var crawler=new PartyCrawler();
crawler.AddWebsite("https://www.arthaps.com");
crawler.Crawl();