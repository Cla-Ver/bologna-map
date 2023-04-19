//import {showTrafficData} from "utilities.js";

let map;
//initMap();

function initMap(){
	//let today = new Date();
	document.getElementById("startTime").setAttribute("value", "00:00");
	document.getElementById("endTime").setAttribute("value", "23:59");
	document.getElementById("startDay").max = '2023-02-31';
	updateMap("2022-10-30", "2022-10-31");
}

function updateMap(startDate, endDate){
	$(document).ready(function() {
		//console.log(date);
		let startHour, endHour;
		if(document.getElementById("entireDay").checked){
			startHour = 0;
			endHour = 24
		}
		else{
			startHour = parseInt(document.getElementById("startTime").value.split(":")[0]);
			endHour = parseInt(document.getElementById("endTime").value.split(":")[0]);
		}
		if(startHour > endHour && !document.getElementById("entireDay").checked){
			document.getElementById("alerts").innerHTML = "<b>Attenzione: l'ora di inizio è più avanti dell'ora di fine.</b>";
		}
		if(endHour == 0){
			endHour = 24;
		}
		if(typeof map !== "undefined"){
			map.remove();
		}
		map = L.map('map', {
			center: [44.5, 11.349],
			zoom: 13
		});		
		const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);
		
		showTrafficData(map, startDate, endDate, startHour, endHour);
	});
}

function setDate(){
	updateMap(document.getElementById("startDay").value, document.getElementById("endDay").value);
}

function setEntireDay(){
	if(document.getElementById("entireDay").checked){
		document.getElementById("startTime").setAttribute("disabled", "");
		document.getElementById("endTime").setAttribute("disabled", "");
	}
	else{
		document.getElementById("startTime").removeAttribute("disabled");
		document.getElementById("endTime").removeAttribute("disabled");
	}
	setDate();
}

function setSingleDay(){
	if(document.getElementById("singleDay").checked){
		document.getElementById("endDay").setAttribute("disabled", "");
	}
	else{
		document.getElementById("endDay").removeAttribute("disabled");
	}
}

// function showTrafficData(map, startDate, endDate, startHour, endHour){
// 	let startDate_arr = startDate.split("-");
// 	let year = startDate_arr[0];
// 	endDate = new Date(endDate);
// 	startDate = new Date(startDate);
// 	let trafficDictionary = {};
// 	let maxTraffic;
// 	/*for(let curDate = new Date(startDate); curDate.getDate() - endDate.getDate() > 0; curDate.setDate(curDate.getDate() + 1)){
// 		console.log("ciao");
// 	}*/
	
// 	for(let curDate = startDate; curDate < endDate; curDate.setDate(curDate.getDate() + 1)){
// 			$.get("https://opendata.comune.bologna.it/api/records/1.0/search/?dataset=rilevazione-flusso-veicoli-tramite-spire-anno-" + curDate.getFullYear() + "&q=data%3D" + curDate.getFullYear() + "-" + ('00'+curDate.getMonth()).slice(-2) + "-" + ('00'+curDate.getDate()).slice(-2) + "&rows=1000&sort=data", function(data, status){
// 				let records = data.records;
// 				/*Presento il marker e le relative informazioni per ogni spira presente.*/
// 				records.forEach(record => {
// 					let marker = L.marker([record.fields["latitudine"], record.fields["longitudine"]]).addTo(map);
// 					let cars = 0;
// 					for(let i = startHour; i < endHour; i++){
// 						cars += record.fields[('00'+i).slice(-2) + "_00_" + ('00'+(i+1)).slice(-2) + "_00"]; /*Se l'ora ha una sola cifra (0-9), metto uno zero davanti*/
// 					}
// 					if(!(record.fields["nome_via"] in trafficDictionary)){
// 						trafficDictionary[record.fields["nome_via"]] = {totalCars: cars, geoPoints: [record.fields["geopoint"]]};
// 					}
// 					else{
// 						let newgeoPoints = trafficDictionary[record.fields["nome_via"]]["geoPoints"];
// 						newgeoPoints.push(record.fields["geopoint"]);
// 						trafficDictionary[record.fields["nome_via"]] = {totalCars: trafficDictionary[record.fields["nome_via"]]["totalCars"] + cars, geoPoints: newgeoPoints};
// 					}
// 					marker.bindPopup("Nome via: " + record.fields["nome_via"] + "<br>Data: " + record.fields["data"] + "<br>Direzione: " + record.fields["direzione"] + "<br>Veicoli transitati: " + cars);
// 				});
// 			});
// 		/*$.get("https://opendata.comune.bologna.it/api/records/1.0/search/?dataset=rilevazione-flusso-veicoli-tramite-spire-anno-" + curDate.getFullYear() + "&q=data%3D" + curDate.getFullYear() + "-" + ('00'+curDate.getMonth()).slice(-2) + "-" + ('00'+curDate.getDate()).slice(-2) + "&rows=1000&sort=data", function(data, status){
// 			let records = data.records;
// 			/*Presento il marker e le relative informazioni per ogni spira presente.
// 			records.forEach(record => {
// 				let marker = L.marker([record.fields["latitudine"], record.fields["longitudine"]]).addTo(map);
// 				let cars = 0;
// 				for(let i = startHour; i < endHour; i++){
// 					cars += record.fields[('00'+i).slice(-2) + "_00_" + ('00'+(i+1)).slice(-2) + "_00"]; /*Se l'ora ha una sola cifra (0-9), metto uno zero davanti
// 				}
// 				if(!(record.fields["nome_via"] in trafficDictionary)){
// 					trafficDictionary[record.fields["nome_via"]] = {totalCars: cars, geoPoints: [record.fields["geopoint"]]};
// 				}
// 				else{
// 					let newgeoPoints = trafficDictionary[record.fields["nome_via"]]["geoPoints"];
// 					newgeoPoints.push(record.fields["geopoint"]);
// 					trafficDictionary[record.fields["nome_via"]] = {totalCars: trafficDictionary[record.fields["nome_via"]]["totalCars"] + cars, geoPoints: newgeoPoints};
// 				}
// 				marker.bindPopup("Nome via: " + record.fields["nome_via"] + "<br>Data: " + record.fields["data"] + "<br>Direzione: " + record.fields["direzione"] + "<br>Veicoli transitati: " + cars);
// 			});
// 		});*/
// 	}
// 	//console.log(trafficDictionary);
// 	/*Vado ad individuare il tratto di strada più trafficato. Siccome ci possono essere molte spire nella stessa strada, faccio una media del numero di auto che hanno attraversato ogni spira della stessa strada.
// 	Questo serve per evitare che una strada poco trafficata ma con molte spire risulti che sia stata attraversata da più auto rispetto ad una strada più trafficata ma con meno spire.*/
// 	console.log("bro");
// 	for ([key, value] of Object.entries(trafficDictionary)){
// 		console.log("ciao");
// 		if(typeof maxTraffic === "undefined" || (maxTraffic["totalCars"] / maxTraffic["geoPoints"].length) < (value["totalCars"] / value["geoPoints"].length)){
// 			maxTraffic = value;
// 		}
// 	}
// 	//console.log(maxTraffic);
// 	let maxTrafficLocation;
// 	if(maxTraffic["geoPoints"].length <= 1){
// 		maxTrafficLocation = L.circle(maxTraffic["geoPoints"][0], {radius: 200, color: "red"}).addTo(map);
// 	}
// 	else{
// 		maxTrafficLocation = L.polyline(maxTraffic["geoPoints"], {color: "red"}).addTo(map);
// 	}
// 	maxTrafficLocation.bindPopup("Tratto maggiormente trafficato");

// 	/*console.log(endDate);
// 	endDate.setDate(endDate.getDate() + 1);
// 	console.log(startDate.getDate());*/
// 	/*$.get("https://opendata.comune.bologna.it/api/records/1.0/search/?dataset=rilevazione-flusso-veicoli-tramite-spire-anno-" + year + "&q=data%3D" + startDate + "&rows=1000&sort=data", function(data, status){
// 		let records = data.records;
// 		records.forEach(record => {
// 			let marker = L.marker([record.fields["latitudine"], record.fields["longitudine"]]).addTo(map);
// 			let cars = 0;
// 			for(let i = startHour; i < endHour; i++){
// 				cars += record.fields[('00'+i).slice(-2) + "_00_" + ('00'+(i+1)).slice(-2) + "_00"]; /*Se l'ora ha una sola cifra (0-9), metto uno zero davanti
// 			}
// 			if(!(record.fields["nome_via"] in trafficDictionary)){
// 				trafficDictionary[record.fields["nome_via"]] = {totalCars: cars, geoPoints: [record.fields["geopoint"]]};
// 			}
// 			else{
// 				let newgeoPoints = trafficDictionary[record.fields["nome_via"]]["geoPoints"];
// 				newgeoPoints.push(record.fields["geopoint"]);
// 				trafficDictionary[record.fields["nome_via"]] = {totalCars: trafficDictionary[record.fields["nome_via"]]["totalCars"] + cars, geoPoints: newgeoPoints};
// 			}
// 			marker.bindPopup("Nome via: " + record.fields["nome_via"] + "<br>Data: " + record.fields["data"] + "<br>Direzione: " + record.fields["direzione"] + "<br>Veicoli transitati: " + cars);
// 		});
// 		for ([key, value] of Object.entries(trafficDictionary)){
// 			if(typeof maxTraffic === "undefined" || (maxTraffic["totalCars"] / maxTraffic["geoPoints"].length) < (value["totalCars"] / value["geoPoints"].length)){
// 				maxTraffic = value;
// 			}
// 		}
// 		console.log(maxTraffic);
// 		let maxTrafficLocation;
// 		if(maxTraffic["geoPoints"].length <= 1){
// 			maxTrafficLocation = L.circle(maxTraffic["geoPoints"][0], {radius: 200, color: "red"}).addTo(map);
// 		}
// 		else{
// 			maxTrafficLocation = L.polyline(maxTraffic["geoPoints"], {color: "red"}).addTo(map);
// 		}
// 		maxTrafficLocation.bindPopup("Tratto maggiormente trafficato");
// 	});*/
// }

function showTrafficData_php(data){
	$(document).ready(function(){
		console.log(data);
		if(typeof map !== "undefined"){
			map.remove();
		}
		map = L.map('map', {
			center: [44.5, 11.349],
			zoom: 13
		});		
		const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);
		//console.log(data.length);
		let trafficDictionary = {};
		let spireDictionary = {};
		let maxTraffic;
		let maxTrafficLocation;
		for(let i = 0; i < data.length; i++) {
			item = data[i];
			//console.log(item["data"]);
			lat = parseFloat(item["latitudine"]);
			long = parseFloat(item["longitudine"]);
			//let marker = L.marker([lat, long]).addTo(map);
			let cars = 0;
			for(let i = 0; i < 24; i++){
				cars += item[('00'+i).slice(-2) + ":00-" + ('00'+(i+1)).slice(-2) + ":00"]; /*Se l'ora ha una sola cifra (0-9), metto uno zero davanti*/
			}
			if(!(item["nome_via"] in trafficDictionary)){
				trafficDictionary[item["nome_via"]] = {totalCars: cars, geoPoints: [[item["latitudine"], item["longitudine"]]]};
				//console.log(trafficDictionary[item["nome_via"]]["geoPoints"]);
			}
			else{
				let newgeoPoints = trafficDictionary[item["nome_via"]]["geoPoints"];
				//console.log(newgeoPoints);
				newgeoPoints.push([item["latitudine"], item["longitudine"]]);
				
				trafficDictionary[item["nome_via"]] = {totalCars: parseInt(trafficDictionary[item["nome_via"]]["totalCars"]) + cars, geoPoints: newgeoPoints};
				//console.log(trafficDictionary[item["nome_via"]]["geoPoints"]);
			}
			if(!(item["codice_spira"] in spireDictionary)){
				spireDictionary[item["codice_spira"]] = {totalCars: cars, geoPoint: [item["latitudine"], item["longitudine"]], date: [item["data"]], streetName: item["nome_via"]};
			}
			else{
				let newdate = spireDictionary[item["codice_spira"]]["date"];
				newdate.push(item["data"]);
				spireDictionary[item["codice_spira"]] = {totalCars: parseInt(spireDictionary[item["codice_spira"]]["totalCars"]) + cars, geoPoint: [item["latitudine"], item["longitudine"]], date: newdate, streetName: item["nome_via"]};
			}
			//marker.bindPopup("Nome via: " + item["nome_via"] + "<br>Data: " + item["data"] + "<br>Direzione: " + item["direzione"] + "<br>Veicoli transitati: " + cars);
		}
		for([key, value] of Object.entries(spireDictionary)){
			/*console.log(value);
			break;*/
			//console.log(value);
			let marker = L.marker([value["geoPoint"][0], value["geoPoint"][1]]).addTo(map);
			marker.bindPopup("Nome via: " + value["streetName"] + "<br>Data: " + value["date"] + "<br>Veicoli transitati: " + value["totalCars"]);
		}
		
		for ([key, value] of Object.entries(trafficDictionary)){
			if(typeof maxTraffic === "undefined" || (maxTraffic["totalCars"] / maxTraffic["geoPoints"].length) < (value["totalCars"] / value["geoPoints"].length)){
				maxTraffic = value;
				//console.log(maxTraffic);
			}
		}
		//console.log(maxTraffic);
		if(maxTraffic["geoPoints"].length <= 1){
			maxTrafficLocation = L.circle(maxTraffic["geoPoints"][0], {radius: 200, color: "red"}).addTo(map);
		}
		else{
			//console.log(maxTraffic["geoPoints"]);
			maxTrafficLocation = L.polyline(maxTraffic["geoPoints"], {color: "red"}).addTo(map);
		}
		maxTrafficLocation.bindPopup("Tratto maggiormente trafficato");
	
	});
}