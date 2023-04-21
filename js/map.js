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

/*Vado a costruire la mappa con tutte le informazioni */
function showTrafficData(data, startHour = 0, endHour = 24, wholeDay = true){
	$(document).ready(function(){
		resetMap();
		if(data.length <= 0){
			return;
		}
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
			if(wholeDay){
				startHour = 0;
				endHour = 24;
			}
			if(endHour == 0){
				endHour = 24;
			}
			for(let i = startHour; i < endHour; i++){
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
		if(document.getElementById("heatMap").checked){
			showHeatMap(spireDictionary, document.getElementById("heatMapZones").value);
		}
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
function showHeatMap(spireDictionary, zones = 1){
	let maxLat, maxLong, minLat, minLong;
	let drawGrid = false;
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
		let latOffset = maxLat / 5000;
		let longOffset = maxLong / 1000;
		new Promise(resolve => {
			if(drawGrid){
				L.polyline([[maxLat, maxLong], [minLat, maxLong], [minLat, minLong], [maxLat, minLong], [maxLat, maxLong]], {color: "blue"}).addTo(map);
				for(let i = minLat; i <= maxLat; i += latOffset){
					L.polyline([[i, minLong], [i, maxLong]], {color: "blue"}).addTo(map);
				}
				for(let i = minLong; i <= maxLong; i += longOffset){
					L.polyline([[minLat, i], [maxLat, i]], {color: "blue"}).addTo(map);
				}
			}
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
			zones = !isNaN(zones) ? parseInt(zones) : 1;
			zones = zones < 1 ? 1 : zones;
			zones = zones > 20 ? 20 : zones;
			for(let i = 0; i < zones; i++){
				let marker = L.rectangle([[parseInt(sortedAreas[i][0].split(",")[0]) * latOffset + minLat, parseInt(sortedAreas[i][0].split(",")[1]) * longOffset + minLong], [(parseInt(sortedAreas[i][0].split(",")[0]) + 1) * latOffset + minLat , (parseInt(sortedAreas[i][0].split(",")[1]) + 1) * longOffset + minLong]], {color: "red"}).addTo(map)
				marker.bindPopup("Zona molto trafficata");	
			}
			for(let i = sortedAreas.length - 1; i >= sortedAreas.length - zones; i--){
				marker = L.rectangle([[parseInt(sortedAreas[i][0].split(",")[0]) * latOffset + minLat, parseInt(sortedAreas[i][0].split(",")[1]) * longOffset + minLong], [(parseInt(sortedAreas[i][0].split(",")[0]) + 1) * latOffset + minLat , (parseInt(sortedAreas[i][0].split(",")[1]) + 1) * longOffset + minLong]], {color: "#19e53e"}).addTo(map)
				marker.bindPopup("Zona poco trafficata");	
			}
			//console.log(sortedAreas);
		});
	});
}
