var Parser=function (){
	this.Parsers={};
};

var URL = require('url');

Parser.prototype={
	Get:function(url){
		var webaddress=URL.parse(url).hostname;
			if (webaddress.substring(0, 3)=='www')
				webaddress=webaddress.substring(4);

		if(this.Parsers[webaddress]==null)
		{
			this.Parsers[webaddress]=require("./Sepcialized/"+webaddress+".js");
		}
		return this.Parsers[webaddress];
	},

}

module.exports=Parser;
