<?php

require "./utilities.php";
if(isset($_POST["action"])){
    /*Per cambiare la mappa con i segnalini senza dover ricaricare la pagina*/
    if($_POST["action"] == "change"){
        if($_POST["singleDay"] == "on" || !isset($_POST["endDate"]) || strlen($_POST["endDate"]) <= 0){
            $_POST["endDate"] = $_POST["startDate"];
        }
        if($_POST["entireDay"] == "on" || strlen($_POST["startHour"]) <= 0 || strlen($_POST["endHour"]) <= 0){
            $_POST["startTime"] = "00:00";
            $_POST["endTime"] = "24:00";
        }
        //echo "ciao dentro";
        echo get_traffic_data($_POST["startDate"], $_POST["endDate"], explode(":", $_POST["startTime"])[0], explode(":", $_POST["endTime"][0]));
        return;
    }
}
?>