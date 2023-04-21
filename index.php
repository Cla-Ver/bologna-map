<!DOCTYPE html>
  
<?php

require "utilities.php";

?>
<html>

	<head>
		<?php echo stylesheets(); ?>
		<title> Map </title>
	</head>

  	<body>
		<div class="container" id="app">
			<fieldset>
				<legend> Controlli </legend>
				<div id="alerts">
					{{alerts}}
				</div>
				<div>
					<label for="startDay">Giorno iniziale di cui visualizzare le informazioni:</label>
					<input type="date" id="startDay" name="startDay" :onchange="checkAlerts" value="2022-10-30">
				</div>
				
				<div id="endDayDiv">
					<label for="endDay" id="endDayLabel">Giorno finale di cui visualizzare le informazioni:</label>
					<input type="date" id="endDay" name="endDay" :onchange="checkAlerts" :disabled="singleDay" value="2022-10-30">
				</div>
				<div id="timeDiv" class="hide">
					<div>
						<label for="startTime">Inserire l'ora di inizio transito:</label>
						<input type="time" id="startTime" name="startTime" :onchange="checkAlerts" :disabled="wholeDay" value="00:00">
					</div>
					<div>
						<label for="endTime" id="endTimeLabel">Inserire l'ora di fine transito:</label>
						<input type="time" id="endTime" name="endTime" :onchange="checkAlerts" :disabled="wholeDay" value="00:00">
					</div>
				</div>
				<div>
					<input type="checkbox" id="entireDay" @click="disableEndTime" :onchange="checkAlerts" :checked="wholeDay"/>
					<label for="entireDay"> Giorno intero </label>
				</div>
				<div>
					<input type="checkbox" id="singleDay" @click="disableEndDay" :checked="singleDay"/>
					<label for="singleDay"> Giorno singolo </label>
				</div>
				<div>
					<input type="checkbox" id="heatMap" :checked="heatMap" @click="showHeatMap"/>
					<label for="heatMap"> Mostra mappa di calore </label>
				</div>
				<div>
					<label id="heatMapZonesLabel" for="heatMapZones"> Numero di zone da visualizzare: </label>
					<input type="number" id="heatMapZones" name="heatMapZones" value="1" min="0" max="20">
				</div>

			</fieldset>
			<div id="map" name="map">
			</div>
		</div>
	</body>
	<?php echo scripts(); ?>
<?php 
show_traffic_data("2022-10-30", "2022-10-30");
?>

</html>
