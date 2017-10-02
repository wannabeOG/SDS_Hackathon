
window.onload= function() {
	try{
		updateDOM();
		checkForUpdates();
	}
	catch(e){
		console.log(e);
	}
	document.getElementById("form").onsubmit = function(e) {
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
		
		var previousData = window.localStorage.getItem('jsonArray');
        if(previousData)
        	window.localStorage.setItem('jsonArray', previousData + "++" + JSON.stringify(jsonObject));
		else{
			window.localStorage.setItem('jsonArray', JSON.stringify(jsonObject));	
		}
		console.log(createJSONobject());
		updateDOM();
		checkForUpdates();
	}

}

function createJSONobject(){
	var shows = [];
	var myArray = window.localStorage.getItem("jsonArray").split("++");
	for (var i = 0; i < myArray.length; i++) {
		shows[i] = JSON.parse(myArray[i]);
	}
	return shows;
}

function updateDOM(){
	var Shows = createJSONobject();
	var list = document.getElementsByTagName("ul")[0];
	for (var i = 0; i < Shows.length; i++) {
		var node = document.createElement("LI");
		var textNode = document.createTextNode(Shows[i].name);
		node.appendChild(textNode);
		list.appendChild(node);
	}
}

function checkForUpdates(){
	var show = createJSONobject();
	
	console.log(show);
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