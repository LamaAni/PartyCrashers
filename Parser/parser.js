var Parser=function (){

};

var URL = require('url');

Parser.protoype={
	Make:function(url){
		var webaddress=URL.parse(url).hostname;
		return require("/Sepcialized/"+webaddress+".js");
	},

}

module.exports=Parser;