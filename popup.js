window.onload= function() {

	document.getElementById("form").onsubmit = function(e) {
		e.preventDefault();
		var tvshow=document.getElementById('tvm').value;
		var season=document.getElementById('ses').value;
		var episode=document.getElementById('epi').value;
		var quality=document.getElementById("qua").value;
		var jsonObject = {
			"tv":tvshow,
			"sea":season,
			"epi":episode,
			"qua":quality
			};
		// Store this information in a local storage subject to access
		let previousData = window.localStorage.getItem('jsonArray');
        window.localStorage.setItem('jsonArray', previousData + "++" + JSON.stringify(jsonObject));
		console.log({"myArray": window.localStorage.getItem("jsonArray").split("++")})

        
        
	}
}
