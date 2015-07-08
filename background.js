var urlServer = "http://160.40.50.183:8080/CLOUD4All_SST_Restful_WS/SST/call_";
var data = {"urlToTranslate": "", "targetLanguage": "fr"};
var currentURL = "";
var currentTabId = 0;
var urlResponse = "";
var called = false;
var loading = false;
var uri = 'com.certh.service-synthesis';
var socketServer = 'http://localhost:8081/browserChannel';
var socket;

console.log("Starting extension...");


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(!tab.url.includes("SSTChrome") && !tab.url.includes("chrome-devtools") && !tab.url.includes("chrome://") && (currentURL != tab.url || currentTabId != tab.id))
	{
		console.log('La URL a traducir es: ' + tab.url + " - " + tab.id + " - " + tabId);
		currentURL = tab.url;
		currentTabId = tab.id;
		chrome.tabs.get(tabId, function(tab) 
		{
			if (typeof tab != 'undefined') 
			{
				console.log('Tab exist! 1');
				chrome.tabs.update(tabId, {"url": "SSTChrome.html"});
				//callSST(tab.url, tab.id);
			}
			else
			{
				console.log('Tab does not exist! 1');
			}
		});
		
	}
});

 function callSST(urlRequest, tabId)
 {
	console.log(" --- start SST call --- ");
	
	data.urlToTranslate = urlRequest;
	console.log("data.urlToTranslate = " + data.urlToTranslate + " - " + urlRequest);
	var dataRequest = JSON.stringify(data);
	console.log("SST request: " + dataRequest);
	
	var updateValues = {};

	$.ajax({
	   type: "POST",
	   encoding:"UTF-8",
	   contentType: "application/json; charset=UTF-8",
	   url: urlServer + 'Translatewebpage',     
	   data: dataRequest,
	   success: function(data) {
		    urlResponse = unescape(data.urlOfTranslatedPage);
			currentURL = urlResponse;
			updateValues.url = urlResponse;
			console.log("success ", updateValues.url);
			
			chrome.tabs.get(tabId, function(tab) 
			{
				if (typeof tab != 'undefined') 
				{
					console.log('Tab exist!');
					chrome.tabs.update(tabId, updateValues);
				}
				else
				{
					console.log('Tab does not exist!');
				}
			});
			
		},
		error: function(data) {
			console.log("error ", data.error);
			return "";
		},
	});

	console.log(" --- end SST call --- ");
 }
 
 //Communication socket io
 
 
console.log("windows.onCreated....");

if(socket == null || !socket.socket.connected)
{
	console.log("### Connecting");
	socket = io.connect(socketServer);
	
	socketListeners();
}

if(socket != null && socket.socket.connected)
{
	console.log("--- Connected ---");
	//socketListeners();
	console.log("Uri: " + uri);
	socket.send(uri);
}


function socketListeners()
{
	socket.on('connect', function(data){
		console.log('Socket connected: ');
		console.log("### Sending uri: " + uri);
		socket.send(uri);
	});
	
	socket.on("connectionSucceeded", function (settings) {
		console.log("## Received the following settings: " + JSON.stringify(settings));
	});

	socket.on("onBrowserSettingsChanged", function(settings){
		console.log("## Got newSettings: " + JSON.stringify(settings));
	});
	
}
