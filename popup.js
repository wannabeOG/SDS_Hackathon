window.onload= function() {
	try{
		updateDOM();
		checkForUpdates();
	}
	catch(e){
		console.log(e);
	}
	document.getElementById("form").onsubmit = addShow;
}

function addShow(e){
		e.preventDefault();
		var tvshow=document.getElementById('tvm').value;
		var season=document.getElementById('ses').value;
		var episode=document.getElementById('epi').value;
		var quality=document.getElementById("qua").value;
		var jsonObject = {
			"name":tvshow,
			"season":season,
			"episode":episode,
			"quality":quality,
			"status":0,
			"results":[]
		};
		
		var data = createJSONobject();
		data.push(jsonObject);
		storeJsonObject(data);
		updateDOM();
		checkForUpdates();
}

function createJSONobject(){
	var shows = [];
	if(window.localStorage.getItem("jsonArray")){
		var myArray = window.localStorage.getItem("jsonArray").split("++");
		for (var i = 0; i < myArray.length; i++) {
			shows[i] = JSON.parse(myArray[i]);
		}
	}
	return shows;
}

function storeJsonObject(shows){
	var string = "";
	for (var i = 0; i<shows.length; i++) {
		if(i!=0){
			string = string + '++' + JSON.stringify(shows[i]);
		}
		else{
			string = JSON.stringify(shows[i]);
		}
	}
	window.localStorage.setItem('jsonArray',string);
}

function deleteShow(){
	shows = createJSONobject();
	shows.splice(this.class,1);
	storeJsonObject(shows);
	updateDOM();
}

function updateDOM(){
	var Shows = createJSONobject();
	var list = document.getElementsByTagName("ul")[0];
	while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
    for (var i = 0; i < Shows.length; i++) {
		var node = document.createElement("LI");
		node.style.marginTop = '5px';
		node.style.marginBottom = '5px';
		var img = document.createElement("IMG");
		
		var imgTorrent = document.createElement("IMG");
		try{
			if (Shows[i].status==1) {
				imgTorrent.setAttribute('src','torrent_active.png');
				imgTorrent.onclick = Details;	
			}
			else{
				imgTorrent.setAttribute('src','torrent_inactive.png');
			}
		}
		catch(error){
			imgTorrent.setAttribute('src','torrent_inactive.png');	
		}
		imgTorrent.setAttribute('class',i);
		imgTorrent.style.float = 'right';
		imgTorrent.style.marginRight = '10px';
		
		img.setAttribute('src','trash.png');
		img.setAttribute('class',i);
		img.style.float = 'right';
		img.onclick = deleteShow;
		var textNode = document.createTextNode(Shows[i].name);
		node.appendChild(textNode);
		node.appendChild(img);
		node.appendChild(imgTorrent);
		list.appendChild(node);
	}
}

function Details(){
	result = createJSONobject()[this.className].results;
	console.log(result);
	var resultDiv = document.getElementById('results');
	document.getElementById('heading').innerHTML = "Torrent Found";
	var list = document.getElementById('resultList');
	for (var i = 0; i < result.length; i++) {
		var node = document.createElement("LI");
		var link = document.createElement("A");
		link.setAttribute('href','https://proxyspotting.in'+result[i].link);
		link.setAttribute('target','_blank')
		link.appendChild(document.createTextNode(result[i].TorrentName));
		node.appendChild(link);
		list.appendChild(node);
	}
}
var k = 0;
function updateStatus(data){
	shows = createJSONobject();
	shows[k].status = 1;
	shows[k].results = data.results;
	storeJsonObject(shows);
	k++;
}

function checkForUpdates(){
	var shows = createJSONobject();
	var headers = new Headers({
		'Content-type':'application/x-www-form-urlencoded'
	});
	for (var i = 0; i < shows.length; i++) {
		k=0;
		var request = new Request('http://localhost:8000/search/',{
			method:'post',
			mode:'cors',
			headers:headers,
			body:"name="+shows[i].name+"&season="+shows[i].season+"&episode="+shows[i].episode+"&quality="+shows[i].quality
		});
		fetch(request)
		.then((res) => res.json() )
		.then(function(data){
			updateStatus(data);
		})
		.then(updateDOM);
	}
}