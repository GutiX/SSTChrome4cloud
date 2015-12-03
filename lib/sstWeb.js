
console.log("sstWeb.js");
var msgVisible = false;

chrome.runtime.onMessage.addListener(
	function(req, sen, sendResponse) {
		console.log("Message page load: " + req.action)
		if (req.action == "load page") {
			if (req.status == true) {
				console.log("load page");
				msgVisible = true;
			}
		}
		else if (req.action == "error load page") {
			if (req.status == true) {
				console.log("error load page");
				displayMsgError();
			}
		}
	}
);

jQuery(function($) {
	displayMsg();
});

function displayMsg()
{
	if(msgVisible)
	{
		console.log("showing the page load msg... " + msgVisible);
		
		var body = document.getElementsByTagName('body')[0].innerHTML;
		document.getElementsByTagName('body')[0].innerHTML = "<div class='mLoadPage' id='mLoadPage'><h1>Loading page...</h1></div>" + body;
		document.getElementsByTagName('body')[0].style.paddingTop = "200px";
		document.getElementById("mLoadPage").style.position = "absolute";
		document.getElementById("mLoadPage").style.top = "0px";
		document.getElementById("mLoadPage").style.left = "0px";
		document.getElementById("mLoadPage").style.textAlign = "center";
		document.getElementById("mLoadPage").style.width = "100%";
		document.getElementById("mLoadPage").style.padding = "30px";
		document.getElementById("mLoadPage").style.background = "#ffffff";
		document.getElementById("mLoadPage").style.zIndex = "9999";
		document.getElementById("mLoadPage").style.fontSize = "30px !important";
	}
}

function displayMsgError()
{
	console.log("showing the page load msg error... ");
	document.getElementById("mLoadPage").innerHTML = "<h1>Error connection!</h1>";
}