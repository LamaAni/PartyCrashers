var Parser=function (){

};

var URL = require('url');

Parser.protoype={
	Make:function(url){
		var webaddress=URL.parse(url).hostname;
			if (webaddress.substring(0, 3)=='www')
				webaddress=webaddress.substring(4);
		return require("/Sepcialized/"+webaddress+".js");
	},

}

module.exports=Parser;
