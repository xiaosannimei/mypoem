"use strict";
var MyPoem = function(text){
	if(text){
		var obj = JSON.parse(text);
		this.title = obj.title;
		this.content = obj.content;
		this.author = obj.author;
	}else{
		this.title = "";
	    this.content = "";
	    this.author = "";
	}
};
MyPoem.prototype = {
	toString : function(){
		return JSON.stringify(this)
	}
}

var ThePoem =  function(){
	LocalContractStorage.defineMapProperty(this,"data",{
		parse:function(text){
			return new MyPoem(text);
		},
		stringify:function(o){
			return o.toString();
		}
	});
  
};

ThePoem.prototype = {
	init:function(){

	},
	save:function(title,content,author){
		if(!title||!content||!author){
			throw new Error("empty title or content or author")
		}
		title = title.trim();
		content = content.trim();
		author = author.trim();
		if(title.length>30||content.length>1000||author.length>30){
			throw new Error("title or content exceed limit length")
		}


		var from = Blockchain.transaction.from;
		var myPoem = this.data.get(title);
		if(myPoem){
			throw new Error("poem has been accupied")
		}	
		myPoem = new MyPoem();
		myPoem.author = from + "_" + author;
		myPoem.title = title;
		myPoem.content = content;
		this.data.put(title,myPoem)
	},
	get:function(title){
		if(!title){
			throw new Error("empty title")
		}
		title = title.trim();
		return this.data.get(title);
	}
};
module.exports = ThePoem;