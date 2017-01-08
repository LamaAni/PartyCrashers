var ParserBase={
	ParseEvents:function($)
	{

	},
	GetTypeWords:function(txt)
	{
		var re=new RegExp("([a-zA-Z]{3,})","igm");
		var words=[];
		var match=null;
		while(match=re.exec(txt))
		{
			words.push(match[0]);
		}
		return words;
	},
	GetDateAndTime:function(txt){
		var re=new RegExp("[0-9]+\/[0-9]+\/[0-9]+|[0-9]+-[0-9]+-[0-9]+|[0-9]+-[0-9]+|[0-9]+\/[0-9]+","igm");
		var datematch=re.exec(txt);
		var re=new RegExp("[0-9]+:[0-9]+");
		var timematch=re.exec(txt);

		//var d=new Date(datematch+' '+timematch);
		return datematch+' '+timematch;
	}
}

module.exports=ParserBase;