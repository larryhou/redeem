// ==UserScript==  
// @name         Redeem Code Vampire
// @version      1.1.0
// @author       larryhou@github.com
// @namespace    https://github.com/larryhou
// @description  Redeem Code Vampire for OSX Server
// @include      https://developer.apple.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// ==/UserScript==

function install(callback)
{	
	if (location.href.indexOf("https://developer.apple.com/devcenter/mac/loadredemptioncode.action") != 0 ) return;
	
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js";

	var cb = document.createElement("script");
	cb.type = "text/javascript";
	cb.textContent = "jQuery.noConflict();(" + callback.toString() + ")(jQuery);";
	script.addEventListener('load', function() 
	{
		document.head.appendChild(cb);
	});
	
	document.head.appendChild(script);	
}


// https://developer.apple.com/devcenter/mac/loadredemptioncode.action?seedId=13CB96H8S4

install(function($)
{
	if (document.location.href.indexOf("v=1") >= 0)
	{
		parent.count++;
		
		var data = JSON.parse(document.body.innerText);
		$(parent.document).find("p[id='content']").append(data.seedCodeString + "|" + parent.count + ", ");
		parent.document.body.scrollTop = parent.document.body.scrollHeight;
		if (parent.count < 500)
		{
			location.reload();
		}
		else
		{
			if (parent.page < 20)
			{
				$(parent.document).find("button").click();
			}
		}
		return;
	}
	
	var list = location.href.match(/p=(\d+)/);
	if (list)
	{
		window.page = parseInt(list[1]);
	}
	else
	{
		window.page = 1;
	}
	
	window.count = 0;
	$(document).ready(function() {
		$("<iframe width='1024' height='40' id='kernel'/>").prependTo("body");
		$("<p style='font-family: Consolas'>[" + new Date() + "]page: " + window.page + "</p>").appendTo("body");		
		$("#kernel").attr("src", document.location.href + "&v=1");
		$("<button id='ghost'>click</button>").appendTo("body");
		$("#ghost").click(function()
		{
			var page = parent.page + 1;
			var url = parent.document.location.href;
			if (parent.page ==  1)
			{
				url += "&p=" + page;
			}
			else
			{
				url = url.replace(/p=\d+/, "p=" + page);
			}
			
			window.open(url, "_blank");
			window.focus();
		});
		
		$("<p id='content' style='font-family: Consolas'/>").appendTo("body");
	});

});