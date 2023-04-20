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
 		 {{message}}
			<fieldset>
				<legend> Controlli </legend>
				<div id="alerts">
					
				</div>
				<div>
					<label for="startDay">Giorno iniziale di cui visualizzare le informazioni:</label>
					<input type="date" id="startDay" name="startDay" :onchange="prova" value="2022-10-30">
				</div>
				<div>
					<label for="endDay">Giorno finale di cui visualizzare le informazioni:</label>
					<input type="date" id="endDay" name="endDay" :disabled="singleDay" value="2022-10-30">
				</div>
				<div>
					<label for="startTime">Inserire l'ora di inizio transito:</label>
					<input type="time" id="startTime" name="startTime" >
				</div>
				<div>
					<label for="endTime">Inserire l'ora di fine transito:</label>
					<input type="time" id="endTime" name="endTime"  :disabled="wholeDay">
				</div>
				<div>
					<input type="checkbox" id="entireDay" @click="disableEndTime" :checked="wholeDay"/>
					<label for="entireDay"> Giorno intero </label>
				</div>
				<div>
					<input type="checkbox" id="singleDay" @click="disableEndDay" :checked="singleDay"/>
					<label for="singleDay"> Giorno singolo </label>
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
