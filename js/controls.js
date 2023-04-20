import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

createApp({
  data() {
	return {
	  message: 'Hello Vue!',
	  wholeDay: true,
	  singleDay: true
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
		
		alert("ciao");
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
			"singleDay": document.getElementById("singleDay").checked
		};
		$.post("ajax.php", data, function(data, status){
			if(status === "success"){
				showTrafficData_php(JSON.parse(data));
			}
			else{
				console.log("Ajax error");
			}
		});
	});
});