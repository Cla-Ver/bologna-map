import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

createApp({
  data() {
	return {
	  message: 'Hello Vue!',
	  alerts: '',
	  wholeDay: true,
	  singleDay: true,
	  heatMap: true,
	  animatedMarkers: false,
	  cyclingDays: false
	}
  },
  methods: {
	  disableEndTime(){
		  this.wholeDay = !this.wholeDay;
		  if(this.wholeDay){
			document.getElementById("timeDiv").setAttribute("class", "hide");
			//document.getElementById("endDayDiv").setAttribute("class", "hide");
		  }
		  else{
			document.getElementById("timeDiv").removeAttribute("class");
		  }
	  },
	  disableEndDay(){
		  this.singleDay = !this.singleDay;
			if(!this.singleDay){
				document.getElementById("cyclingDaysDiv").removeAttribute("class");
			}
			else{
				document.getElementById("cyclingDaysDiv").setAttribute("class", "hide");
			}
	  },
	  checkAlerts(){
		this.alerts = "";
		if(!this.singleDay && new Date(document.getElementById("startDay").value).getTime() > new Date(document.getElementById("endDay").value).getTime()){
			this.alerts += "<h2>Attenzione: la data di inizio è meno recente della data di fine</h2>";
			console.log("ciao");
		}
		if(!this.wholeDay && parseInt(document.getElementById("endTime").value.split(":")[0]) !== 0 && parseInt(document.getElementById("startTime").value.split(":")[0]) > parseInt(document.getElementById("endTime").value.split(":")[0])){
			this.alerts += "<h2>Attenzione: l'ora di inizio è più avanti dell'ora di fine</h2>";
		}
		if(parseInt(new Date(document.getElementById("startDay").value).getFullYear()) !== 2022 || (singleDay && parseInt(new Date(document.getElementById("endDay").value).getFullYear()) !== 2022)){
			this.alerts += "<h2>Attenzione: nel database sono presenti dati solo per l'anno 2022</h2>"
		}
		//alert("ciao");
	  },
	  showHeatMap(){
		this.heatMap = !this.heatMap;
		/*if(this.heatMap){
			document.getElementById("heatMapZones").removeAttribute("class");
			document.getElementById("heatMapZonesLabel").removeAttribute("class");
		}
		else{
			document.getElementById("heatMapZones").setAttribute("class", "hide");
			document.getElementById("heatMapZonesLabel").setAttribute("class", "hide");

		}*/
	  },
	  toggleAnimatedMarkers(){
		this.animatedMarkers = !this.animatedMarkers;
	  },
	  toggleCyclingDays(){
		this.cyclingDays = !this.cyclingDays;
		if(this.cyclingDays){
			document.getElementById("rotationTypeDiv").removeAttribute("class");
		}
		else{
			document.getElementById("rotationTypeDiv").setAttribute("class", "hide");
		}
	  }
  }
}).mount('#app')

$(document).ready(function(){
	$("input").change(function(e){
		let data = {
			"action": "change",
			"startDate": document.getElementById("startDay").value,
			"endDate": document.getElementById("endDay").value,
			"startHour": document.getElementById("startTime").value,
			"endHour": document.getElementById("endTime").value,
			"entireDay": document.getElementById("entireDay").checked,
			"singleDay": document.getElementById("singleDay").checked,
			"showHeatMap": document.getElementById("heatMap").checked,
			"animatedMarkers": document.getElementById("animatedMarkers").checked,
			"cyclingDays": document.getElementById("cyclingDays").checked
			//"heatMapZones": document.getElementById("heatMapZones").value
		};
		if(e.target.id === "cyclingDays"){
			$.post("ajax.php", data, function(result, status){
				if(status === "success"){
					if(result.length > 0){
						cycleDays(JSON.parse(result), parseInt(data["startHour"]), parseInt(data["endHour"]), data["entireDay"]);
					}
				}
				else{
					console.log("Ajax error in cycling days");
				}
			});	
			return;
		}
		$.post("ajax.php", data, function(result, status){
			if(status === "success"){
				if(result.length > 0){
					showTrafficData(JSON.parse(result), parseInt(data["startHour"]), parseInt(data["endHour"]), data["entireDay"]);
				}
			}
			else{
				console.log("Ajax error in showing traffic data");
			}
		});
	});
});