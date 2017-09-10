
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
        window.localStorage.setItem('jsonArray', previousData + "++" + JSON.stringify(jsonObject));
		console.log({"myArray": window.localStorage.getItem("jsonArray").split("++")});
		updateDOM();
		checkForUpdates();
	}

}

function updateDOM(){
	var Shows = window.localStorage.getItem("jsonArray").split("++");
	var list = document.getElementsByTagName("ul")[0];
	for (var i = 1; i < Shows.length; i++) {
		var node = document.createElement("LI");
		var textNode = document.createTextNode(JSON.parse(Shows[i]).name);
		node.appendChild(textNode);
		list.appendChild(node);
	}
}

function checkForUpdates(){
	var Shows = window.localStorage.getItem("jsonArray").split("++");
	var show = JSON.parse(Shows[Shows.length-1]);
	
	console.log(show);

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST","http://localhost:8000/search/",true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	xhttp.onreadystatechange = function() {
  		if (this.readyState == 4 && this.status == 200) {
    		if(this.response.success == 1){
    			alert("Torrent Found");
    			document.getElementById("#response").innerHTML = this.response.SearchInfo.name + " Torrent found";
    		}
  		}
	};
	
	xhttp.send("name="+show.name+"&season="+show.season+"&episode="+show.episode+"&quality="+show.quality);
}