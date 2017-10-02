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
			"quality":quality
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
	shows.splice(this.id,1);
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
		node.style.margin = '5px';
		var img = document.createElement("IMG");
		img.setAttribute('src','trash.png');
		img.setAttribute('id',i);
		img.style.float = 'right';
		img.onclick = deleteShow;
		var textNode = document.createTextNode(Shows[i].name);
		node.appendChild(textNode);
		node.appendChild(img);
		list.appendChild(node);
	}
}

function checkForUpdates(){
	var show = createJSONobject();
	var headers = new Headers({
		'Content-type':'application/x-www-form-urlencoded'
	});
	var request = new Request('http://localhost:8000/search/',{
		method:'post',
		mode:'cors',
		headers:headers,
		body:"name="+show[0].name+"&season="+show[0].season+"&episode="+show[0].episode+"&quality="+show[0].quality
	});
	fetch(request)
	.then((res) => res.json() )
	.then(function(data){
		console.log(data);
	});
}