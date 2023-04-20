import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

createApp({
  data() {
	return {
	  message: 'Hello Vue!',
	  alerts: '',
	  wholeDay: true,
	  singleDay: true,
	  heatMap: true
	}
  },
  methods: {
	  disableEndTime(){
		  this.wholeDay = !this.wholeDay;
	  },
	  disableEndDay(){
		  this.singleDay = !this.singleDay;
	  },
	  prova(){
		this.alerts = "";
		if(!this.singleDay && new Date(document.getElementById("startDay").value).getTime() > new Date(document.getElementById("endDay").value).getTime()){
			this.alerts += "<h2>Attenzione: la data di inizio è meno recente della data di fine</h2>";
			console.log("ciao");
		}
		if(!this.wholeDay && parseInt(document.getElementById("endTime").value.split(":")[0]) !== "00" && parseInt(document.getElementById("startTime").value.split(":")[0]) > parseInt(document.getElementById("endTime").value.split(":")[0])){
			this.alerts += "<h2>Attenzione: l'ora di inizio è più avanti dell'ora di fine</h2>";
		}
		//alert("ciao");
	  },
	  showHeatMap(){
		this.heatMap = !this.heatMap;
		if(this.heatMap){
			document.getElementById("heatMapZones").removeAttribute("class");
			document.getElementById("heatMapZonesLabel").removeAttribute("class");
		}
		else{
			document.getElementById("heatMapZones").setAttribute("class", "hide");
			document.getElementById("heatMapZonesLabel").setAttribute("class", "hide");

		}
	  }
  }
}).mount('#app')

$(document).ready(function(){
	$("input").change(function(){
		let data = {
			"action": "change",
			"startDate": document.getElementById("startDay").value,
			"endDate": document.getElementById("endDay").value,
			"startHour": document.getElementById("startTime").value,
			"endHour": document.getElementById("endTime").value,
			"entireDay": document.getElementById("entireDay").checked,
			"singleDay": document.getElementById("singleDay").checked,
			"showHeatMap": document.getElementById("heatMap").checked,
			"heatMapZones": document.getElementById("heatMapZones").value
		};
		$.post("ajax.php", data, function(data, status){
			if(status === "success"){
				if(data.length > 0){
					showTrafficData_php(JSON.parse(data));
				}
			}
			else{
				console.log("Ajax error");
			}
		});
	});
});