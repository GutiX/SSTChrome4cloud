var urlServer = "http://160.40.50.183:8080/CLOUD4All_SST_Restful_WS/SST/call_";
var data = {"urlToTranslate": "", "targetLanguage": "fr"};
var tabs = [];
var serviceName = "";
var currentURL = "";
var currentTabId = 0;
var urlResponse = "";
var called = false;
var loading = false;
var uri = 'com.certh.service-synthesis';
var socketServer = 'http://localhost:8081/browserChannel';
var socket;
var reload = false;

console.log("Starting extension...");


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(!tab.url.includes("SSTChrome") && !tab.url.includes("SST/ServicesData"))
	{
		if(serviceName != "" && !tab.url.includes("chrome-devtools") && !tab.url.includes("chrome://") && (currentURL != tab.url || currentTabId != tab.id))
		{
			console.log('La URL a traducir es: ' + tab.url + " - " + tab.id + " - " + tabId);
			currentURL = tab.url;
			currentTabId = tab.id;
			/*chrome.tabs.get(tabId, function(tab) 
			{
				if (typeof tab != 'undefined') 
				{
					console.log('Tab exist! 1');
					chrome.tabs.update(tabId, {"url": "SSTChrome.html"});
					callSST(tab.url, tab.id);
				}
				else
				{
					console.log('Tab does not exist! 1');
					removeTab(tabId);
				}
			});*/
			loadAdaptedPage(tab.id, tab.url);
		}
		
		if(!reload)
		{
			var tabInfo = {};
			if(!tab.url.includes("chrome-devtools") && !tab.url.includes("chrome://"))
			{
				tabInfo = {"id": tab.id, "url": tab.url};
			}
			else
			{
				tabInfo = {"id": tab.id, "url": ""};
			}
			updateTab(tabInfo);
			showTabs();
		}
	}	
});

chrome.tabs.onRemoved.addListener(function(tabId){
	removeTab(tabId);
	showTabs();
});

function loadAdaptedPage(tabId, url)
{
	chrome.tabs.get(tabId, function(tab) 
	{
		if (typeof tab != 'undefined') 
		{
			console.log('Tab exist! 1');
			if(url != "")
			{
				chrome.tabs.update(tabId, {"url": "SSTChrome.html"});
				callSST(url, tabId);
			}
		}
		else
		{
			console.log('Tab does not exist! 1');
			removeTab(tabId);
		}
	});
}

function loadOriginalPage(tabId, url)
{
	chrome.tabs.get(tabId, function(tab) 
	{
		if (typeof tab != 'undefined') 
		{
			var updateValues = {};
			reload = true;
			for(i = 0; i < tabs.length; i++)
			{
				if(url != "")
				{
					updateValues.url = url;
					chrome.tabs.update(tabId, updateValues);
				}
			}
			reload = false;
		}
		else
		{
			console.log('Tab does not exist! 1');
			removeTab(tabId);
		}
	});
}

function reloadAllTabs()
{
	if(serviceName != "")
	{
		for(i = 0; i < tabs.length; i++)
		{
			loadAdaptedPage(tabs[i].id, tabs[i].url);
		}
	}
	else
	{
		for(i = 0; i < tabs.length; i++)
		{
			loadOriginalPage(tabs[i].id, tabs[i].url);
		}
	}
}

// ----- Tabs manager -----

function updateTab(tab)
{
	var exist = false;
	var index = tabs.length;
	var i = 0;
	while(!exist && i < index)
	{
		if(tabs[i].id == tab.id)
		{
			tabs[i].url = tab.url;
			exist = true;
		}
		i++;
	}
	
	if(!exist)
	{
		tabs.push(tab);
	}
}

function removeTab(tabId)
{
	for(i = 0; i < tabs.length; i++)
	{
		if(tabs[i].id == tabId)
		{
			tabs.splice(i, 1);
		}
	}
}

function showTabs()
{
	for(i = 0; i < tabs.length; i++)
	{
		console.log("tab " + i + ": " + JSON.stringify(tabs[i]));
	}
}

// ----- End Tabs manager -----

// ---- SST Communication ----
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
	   url: urlServer + serviceName,     
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
 
 // ---- End SST Communication ----
 
 // ---- Communication socket io -----
 
 
console.log("windows.onCreated....");

if(socket == null || !socket.socket.connected)
{
	console.log("### Connecting");
	socket = io.connect(socketServer);
	
	//socketListeners();
}

if(socket != null && socket.socket.connected)
{
	console.log("--- Connected ---");
	//socketListeners();
	console.log("Uri: " + uri);
	socket.send(uri);
}


/*function socketListeners()
{*/
	socket.on('connect', function(data){
		console.log('Socket connected: ');
		console.log("### Sending uri: " + uri);
		socket.send(uri);
	});
	
	socket.on("connectionSucceeded", function (settings) {
		console.log("## Received the following settings: " + JSON.stringify(settings));
	});

	socket.on("onBrowserSettingsChanged", function(settings){
		console.log("## Got newSettings: " + JSON.stringify(settings)); //{"targetLanguage":"fr","service":"Translatewebpage"}
		parseSettings(settings);
		reloadAllTabs();
	});
	
//}

function parseSettings(settings)
{
	if(settings != null)
	{
		serviceName = settings.service;
		/*switch(serviceName)
		{
			case "Translatewebpage": 
				data = {"urlToTranslate": "", "targetLanguage": settings.targetLanguage};
				break;
		}*/
		data = settings.data;
		console.log("Info parsed: " + serviceName + " - " + JSON.stringify(data));
	}
	else
	{
		serviceName = "";
		data = {};
	}
}

 // ---- End Communication socket io -----