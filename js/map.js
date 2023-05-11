//import {showTrafficData} from "utilities.js";

let map;
let mapLayerGroup;
let heatmapLayer;
let carIcon;

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

carIcon = L.Icon.extend({
	options:{
		iconUrl: "resources/car-front.svg",
		popupAnchor: [-3, -20]
		//className: "markerDirectionAnim"
	}
});


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
		mapLayerGroup.clearLayers();
	}
	else{
		map = L.map('map', {
			center: [44.5, 11.349],
			zoom: 13,
			layers: tiles
			//layers: tiles
		});
		mapLayerGroup = L.layerGroup().addTo(map);
	}
	//if(typeof)
	/*(typeof heatmapLayer !== "undefined"){
		heatmapLayer.setData({});
	}*/
	
	

}

/*Vado a costruire la mappa con tutte le informazioni in ingresso.*/
/*Questa funzione non fa alcuna interrogazione al database, ma mostra solamente i dati che le vengono introdotti (variabile data)*/
function showTrafficData(data, startHour = 0, endHour = 24, wholeDay = true){
	$(document).ready(function(){
		resetMap();
		if(data.length <= 0){
			return;
		}
		let trafficDictionary = {};
		let spireDictionary = {};
		let streetsTrafficWithDirection = {};
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
			let key = item["nome_via"] + " / " + item["direzione"];
			if(!(key in streetsTrafficWithDirection)){
				streetsTrafficWithDirection[key] = {streetName: item["nome_via"], totalCars: cars, geoPoint: [[item["latitudine"], item["longitudine"]]], direction: item["direzione"]};
			}
			else{
				let newgeoPoints = streetsTrafficWithDirection[key]["geoPoint"];
				newgeoPoints.push([item["latitudine"], item["longitudine"]]);
				streetsTrafficWithDirection[key] = {streetName: item["nome_via"], totalCars: parseInt(streetsTrafficWithDirection[key]["totalCars"]) + cars, geoPoint: newgeoPoints, direction: item["direzione"], date: item["data"]};
			}
		}
		/*Inserisco un marker per ogni spira, con le sue varie informazioni*/
		//showMarkers(spireDictionary);
		showMarkers_icons(streetsTrafficWithDirection);
		
		/*Mostro la via più trafficata*/
		//showBusiestRoad(trafficDictionary);
		if(document.getElementById("heatMap").checked){
			//showHeatMap(spireDictionary, document.getElementById("heatMapZones").value);
			heatmap_plugin(spireDictionary);
		}
	});
}

/*Disegna sulla mappa tutti i segnalini delle spire, con tutte le loro informazioni */
function showMarkers(spireMarkers){
	for([key, value] of Object.entries(spireMarkers)){
		let marker = L.marker([value["geoPoint"][0], value["geoPoint"][1]], {icon: carIcon}).addTo(mapLayerGroup);
		marker.bindPopup("Nome via: " + value["streetName"] + "<br>Data: " + value["date"] + "<br>Veicoli transitati: " + value["totalCars"]);
	}
}

/*Disegna sulla mappa tutti i segnalini delle spire, con o senza animazioni*/
function showMarkers_icons(streetsTrafficWithDirection){
	let maxCars = getMax_spire(streetsTrafficWithDirection);
	for([key, value] of Object.entries(streetsTrafficWithDirection)){
		if(value["direction"].length > 0 && value["totalCars"] > 0){
			let size = 50 * (value["totalCars"] / maxCars); // Calcolo dimensione segnalino in base a quello con più auto
			size = size < 8 ? 8 : size; // Serve per non fare segnalini troppo piccoli
			if(value["geoPoint"].length <= 1 || !document.getElementById("animatedMarkers").checked){
				let marker = L.marker([value["geoPoint"][0][0], value["geoPoint"][0][1]], {icon: new carIcon({iconSize: [size, size]})}).addTo(mapLayerGroup);
				marker.bindPopup("Nome via: " + value["streetName"] + "<br>Direzione: " + value["direction"] + "<br>Veicoli transitati: " + value["totalCars"] + "<br>Value: " + Math.floor(value["totalCars"] / maxCars * 100) / 100 + "<br>Data: " + value["date"]);	
			}
			else{
				let pointList = [];
				/*In base alla direzione delle auto, ordino i punti delle spire in base alle loro coordinate*/
				if(value["direction"].includes("N")){
					value["geoPoint"].sort((a, b) => (a[0] - b[0]));
				}
				else if(value["direction"].includes("S")){
					value["geoPoint"].sort((a, b) => (b[0] - a[0]));
				}
				else if(value["direction"] === "E"){
					value["geoPoint"].sort((a, b) => (a[1] - b[1]));
				}
				else if(value["direction"] === "O"){
					value["geoPoint"].sort((a, b) => (b[1] - a[1]));
				}
				for(point of value["geoPoint"]){
					pointList.push({latlng: [point[0], point[1]]});
				}
				let markerPlayer = L.markerPlayer(pointList, 5000, {icon: new carIcon({iconSize: [size, size]}), loop: true, autostart: true}).addTo(mapLayerGroup);
				markerPlayer.bindPopup("Nome via: " + value["streetName"] + "<br>Direzione: " + value["direction"] + "<br>Veicoli transitati: " + value["totalCars"] + "<br>Value: " + Math.floor(value["totalCars"] / maxCars * 100) / 100 + "<br>Data: " + value["date"]);	
			}
		}
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
		maxTrafficLocation = L.circle(maxTraffic["geoPoints"][0], {radius: 200, color: "red"}).addTo(mapLayerGroup);
	}
	else{
		//console.log(maxTraffic["geoPoints"]);
		maxTrafficLocation = L.polyline(maxTraffic["geoPoints"], {color: "red"}).addTo(mapLayerGroup);
		//console.log(maxTraffic["geoPoints"]);
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
		let latOffset = maxLat / (1500 * (parseInt($("#heatMapZonesRange").attr("max")) + 1 - parseInt(document.getElementById("heatMapZonesRange").value)));
		let longOffset = maxLong / (300 * ( parseInt($("#heatMapZonesRange").attr("max")) + 1 - parseInt(document.getElementById("heatMapZonesRange").value)));

		new Promise(resolve => {
			if(drawGrid){
				L.polyline([[maxLat, maxLong], [minLat, maxLong], [minLat, minLong], [maxLat, minLong], [maxLat, maxLong]], {color: "blue"}).addTo(mapLayerGroup);
				for(let i = minLat; i <= maxLat; i += latOffset){
					L.polyline([[i, minLong], [i, maxLong]], {color: "blue"}).addTo(mapLayerGroup);
				}
				for(let i = minLong; i <= maxLong; i += longOffset){
					L.polyline([[minLat, i], [maxLat, i]], {color: "blue"}).addTo(mapLayerGroup);
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
				let marker = L.rectangle([[parseInt(sortedAreas[i][0].split(",")[0]) * latOffset + minLat, parseInt(sortedAreas[i][0].split(",")[1]) * longOffset + minLong], [(parseInt(sortedAreas[i][0].split(",")[0]) + 1) * latOffset + minLat , (parseInt(sortedAreas[i][0].split(",")[1]) + 1) * longOffset + minLong]], {color: "red"}).addTo(mapLayerGroup)
				marker.bindPopup("Zona molto trafficata");	
			}
			for(let i = sortedAreas.length - 1; i >= sortedAreas.length - zones; i--){
				marker = L.rectangle([[parseInt(sortedAreas[i][0].split(",")[0]) * latOffset + minLat, parseInt(sortedAreas[i][0].split(",")[1]) * longOffset + minLong], [(parseInt(sortedAreas[i][0].split(",")[0]) + 1) * latOffset + minLat , (parseInt(sortedAreas[i][0].split(",")[1]) + 1) * longOffset + minLong]], {color: "#19e53e"}).addTo(mapLayerGroup)
				marker.bindPopup("Zona poco trafficata");	
			}
			//console.log(sortedAreas);
		});
	});
}

/*Mostra la mappa di calore*/
function heatmap_plugin(spireDictionary){
	traffic = [];
	let maxCars = getMax_spire(spireDictionary) * 0.7;
	for([key, value] of Object.entries(spireDictionary)){
		let spire = {
			lat: value["geoPoint"][0],
			lng: value["geoPoint"][1],
			value: value["totalCars"]
		};
		/*spire["lat"] = value["geoPoint"][0];
		spire["lng"] = value["geoPoint"][1];
		spire["value"] = Math.floor(value["totalCars"] / maxCars * 100) / 100;*/
		traffic.push(spire);
	}
	const config = {
		"maxOpacity": .7,
		"useLocalExtrema": false,
		//valueField: "totalCars",
		"radius": 0.004,
		"scaleRadius": true,
		valueField: "value",
		latField: "lat",
		lngField: "lng"
	};

	heatmapLayer = new HeatmapOverlay(config);

	mapLayerGroup.addLayer(heatmapLayer);
	heatmapLayer.setData({
		data: traffic,
		max: maxCars
	});
	//console.log(traffic);
}

/* Cerca il massimo in un dictionary in cui nel suo campo valore ha il campo "totalCars" */
function getMax_spire(spireDictionary){
	let max;
	for([key, value] of Object.entries(spireDictionary)){
		if(typeof max === "undefined" || max < value["totalCars"]){
			max = value["totalCars"];
		}
	}
	return max;
}

function cycleDays(data, startHour = 0, endHour = 24, wholeDay = true){
	data.sort((a, b) => (new Date(a["data"]) - new Date(b["data"])));
	let startDate = new Date(data[0]["data"]);
	let endDate = addDays(new Date(data[data.length - 1]["data"]), 1);
	let curDate = startDate;
	let dateInterval = curDate;
	let i = 0;
	let cyclingDays = document.getElementById("cyclingDays").checked;
	let rotType = document.getElementById("rotationType").value;
	const cd = setInterval(function(){
		i++;
		if(i >= 50 || cyclingDays !== document.getElementById("cyclingDays").checked || rotType !== document.getElementById("rotationType").value){
			if(document.getElementById("cyclingDays").checked && !document.getElementById("singleDay").checked){
				if(curDate > endDate){
					curDate = startDate;
				}
				let curData = data.filter((item) => new Date(item["data"]) >= dateInterval && new Date(item["data"]) < new Date(curDate));
				showTrafficData(curData, startHour, endHour, wholeDay);
				document.getElementById("mapTitle").innerHTML = "Dati dal " + dateInterval.toLocaleDateString("en-IT") + " al " + curDate.toLocaleDateString("en-IT") + " (" + startHour + ":00 - " + endHour + ":00)";
				dateInterval = curDate;
				switch(document.getElementById("rotationType").value){
					case "week":
						/*Serve per capire se ho fatto un giro completo di tutti i giorni da considerare. Se sì, ricomincio da capo nella visualizzazione */
						if(curDate.toLocaleDateString("en-IT") === endDate.toLocaleDateString("en-IT")){
							dateInterval = startDate;
							curDate = startDate;
						}
						curDate = addDays(curDate, 7);
						/*Se la settimana supera la data massima entro la quale voglio visualizzare i dati, la riduco opportunamente */
						while(curDate > endDate){
							curDate = addDays(curDate, -1);
						}	
						break;
					case "month":
						if(curDate.toLocaleDateString("en-IT") === endDate.toLocaleDateString("en-IT")){
							dateInterval = startDate;
							curDate = startDate;
						}
						curDate = addMonth(curDate);
						while(curDate > endDate){
							curDate = addDays(curDate, -1);
						}	
						break;
					default:
						curDate = addDays(curDate, 1);
				}
			}
			else{
				document.getElementById("mapTitle").innerHTML = "";
				clearInterval(cd);
			}	
			i = 0;
			cyclingDays = document.getElementById("cyclingDays").checked;
			rotType = document.getElementById("rotationType").value;
		}
		else{
			i++;
		}
	}, 200);
	//}
	return;
}

function addDays(date, days){
	date = new Date(date);
	date.setDate(date.getDate() + days);
	return date;
}

function addMonth(date) {
    let d = date.getDate();
    date.setMonth(date.getMonth() + 1);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
}