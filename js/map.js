//import {showTrafficData} from "utilities.js";

let map;
//initMap();

function initMap(){
	//let today = new Date();
	/*document.getElementById("startTime").setAttribute("value", "00:00");
	document.getElementById("endTime").setAttribute("value", "23:59");
	document.getElementById("startDay").max = '2023-02-31';
	updateMap("2022-10-30", "2022-10-31");*/
}

function resetMap(){
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
}

/*function updateMap(startDate, endDate){
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
}*/

/*function setDate(){
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
}*/

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
/**/

/*Vado a costruire la mappa con tutte le informazioni */
function showTrafficData_php(data){
	$(document).ready(function(){
		resetMap();
		let trafficDictionary = {};
		let spireDictionary = {};
		/*Costruzione degli array chiave-valore per spire e strade.*/
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
		}
		/*Inserisco un marker per ogni spira, con le sue varie informazioni*/
		showMarkers(spireDictionary);
		/*Mostro la via più trafficata*/
		showBusiestRoad(trafficDictionary);
		showHeatMap(spireDictionary);
	});
}

/*Disegna sulla mappa tutti i segnalini delle spire, con tutte le loro informazioni */
function showMarkers(spireMarkers){
	for([key, value] of Object.entries(spireMarkers)){
		let marker = L.marker([value["geoPoint"][0], value["geoPoint"][1]]).addTo(map);
		marker.bindPopup("Nome via: " + value["streetName"] + "<br>Data: " + value["date"] + "<br>Veicoli transitati: " + value["totalCars"]);
	}
}

/*Disegna sulla mappa la strada più trafficata*/
function showBusiestRoad(trafficDictionary){
	let maxTraffic;
	let maxTrafficLocation;
	for ([key, value] of Object.entries(trafficDictionary)){
		if(typeof maxTraffic === "undefined" || (maxTraffic["totalCars"] / maxTraffic["geoPoints"].length) < (value["totalCars"] / value["geoPoints"].length)){
			maxTraffic = value;
			//console.log(maxTraffic);
		}
	}
	/*Se la via più trafficata ha una sola spira metto un cerchio, altrimenti disegno una linea che collega tutte le sue spire*/
	if(maxTraffic["geoPoints"].length <= 1){
		maxTrafficLocation = L.circle(maxTraffic["geoPoints"][0], {radius: 200, color: "red"}).addTo(map);
	}
	else{
		//console.log(maxTraffic["geoPoints"]);
		maxTrafficLocation = L.polyline(maxTraffic["geoPoints"], {color: "red"}).addTo(map);
		console.log(maxTraffic["geoPoints"]);
	}
	maxTrafficLocation.bindPopup("Tratto maggiormente trafficato");

}

/*Disegna sulla mappa le zone più o meno trafficate */
function showHeatMap(spireDictionary){
	let maxLat, maxLong, minLat, minLong;
	new Promise(resolve => {
		for ([key, value] of Object.entries(spireDictionary)){
			let itemLat = value["geoPoint"][0];
			let itemLong = value["geoPoint"][1];
			if(typeof maxLat === "undefined"){
				maxLat = itemLat;
				minLat = itemLat;
				maxLong = itemLong;
				minLong = itemLong;
				continue;
			}
			minLat = itemLat < minLat ? itemLat : minLat;
			maxLat = itemLat > maxLat ? itemLat : maxLat;
			minLong = itemLong < minLong ? itemLong : minLong;
			maxLong = itemLong > maxLong ? itemLong : maxLong;
			//console.log(maxLong);
		}
		resolve();
	}).then(function(){
		//L.polyline([[maxLat, maxLong], [minLat, maxLong], [minLat, minLong], [maxLat, minLong], [maxLat, maxLong]], {color: "blue"}).addTo(map);
		let latOffset = maxLat / 5000;
		let longOffset = maxLong / 1000;
		new Promise(resolve => {
			//console.log(maxLat);
			//L.polyline([[maxLat, maxLong], [minLat, minLong]], {color: "blue"}).addTo(map);
			/*for(let i = minLat; i <= maxLat; i += latOffset){
				L.polyline([[i, minLong], [i, maxLong]], {color: "blue"}).addTo(map);
				//console.log(i);
			}
			for(let i = minLong; i <= maxLong; i += longOffset){
				L.polyline([[minLat, i], [maxLat, i]], {color: "blue"}).addTo(map);
				//console.log(i);
			}*/

			resolve();
		}).then(function(){
			let areas = {};
			for ([key, value] of Object.entries(spireDictionary)){
				let rectCoords = [Math.floor((parseFloat(value["geoPoint"][0]) - minLat) / latOffset), Math.floor((parseFloat(value["geoPoint"][1]) - minLong) / longOffset)];
				
				
				if(!(rectCoords in areas)){
					areas[rectCoords] = {totalCars: value["totalCars"], spires: 1};
				}
				else{
					if(value["totalCars"] > 0){
						areas[rectCoords] = {totalCars: areas[rectCoords]["totalCars"] + value["totalCars"], spires: parseInt(areas[rectCoords]["spires"]) + 1};
					}
				}	
				
				
				
				//console.log(rectCoords);
				//L.rectangle([[rectCoords[0] * latOffset + minLat, rectCoords[1] * longOffset + minLong], [(rectCoords[0] + 1) * latOffset + minLat , (rectCoords[1] + 1) * longOffset + minLong]], {color: "yellow"}).addTo(map);
				//L.circle(value["geoPoint"], {radius: 200, color: "red"}).addTo(map);
				//break;
			}
			//console.log(areas);
			let sortedAreas = Object.entries(areas).sort((a, b) => (b[1]["totalCars"] / b[1]["spires"]) - (a[1]["totalCars"] / a[1]["spires"])).filter((item) => {return item[1]["totalCars"] > 0;});
			for(let i = 0; i < 4; i++){
				let marker = L.rectangle([[parseInt(sortedAreas[i][0].split(",")[0]) * latOffset + minLat, parseInt(sortedAreas[i][0].split(",")[1]) * longOffset + minLong], [(parseInt(sortedAreas[i][0].split(",")[0]) + 1) * latOffset + minLat , (parseInt(sortedAreas[i][0].split(",")[1]) + 1) * longOffset + minLong]], {color: "red"}).addTo(map)
				marker.bindPopup("Zona maggiormente trafficata");	
			}
			for(let i = sortedAreas.length - 1; i >= sortedAreas.length - 4; i--){
				marker = L.rectangle([[parseInt(sortedAreas[i][0].split(",")[0]) * latOffset + minLat, parseInt(sortedAreas[i][0].split(",")[1]) * longOffset + minLong], [(parseInt(sortedAreas[i][0].split(",")[0]) + 1) * latOffset + minLat , (parseInt(sortedAreas[i][0].split(",")[1]) + 1) * longOffset + minLong]], {color: "#19e53e"}).addTo(map)
				marker.bindPopup("Zona meno trafficata");	
			}
			//console.log(sortedAreas);
		});
	});
}
