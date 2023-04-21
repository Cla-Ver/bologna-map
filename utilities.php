<?php

function stylesheets(){
    return '
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin=""/>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <link rel="stylesheet" href="./css/main.css">
    ';
}

function scripts(){
  return '
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script type="module" src="./js/utilities.js"></script>
  <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=" crossorigin=""></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
  <script src="./js/map.js"></script>
  <script type="module" src="./js/controls.js"></script>
  ';
}

/**/
function get_traffic_data($startDate, $endDate, $startHour = 0, $endHour = 24){
  //Dates are YYYY-MM-DD
  $startDate = date_create($startDate, timezone_open("Europe/Rome"));
  $connection = connection();
  $endDate = date_create($endDate, timezone_open("Europe/Rome"));
  if ($startDate > $endDate){
    return "";
  }
  //curl_setopt($curl, CURLOPT_HTTPGET, 1); //GET is default
  $json_result = "";
  $i = 0;
  $r = 0;
  $result_rows = array();
  for($curDate = $startDate; date_diff($curDate, $endDate)->format("%R%a") >= 0; $curDate->modify("+1 day")){
    //echo date_format($curDate, "Y/m/d") . "\n";
    $api_formatted_curDate = date_format($curDate,"Y-m-d");
    $query = $connection->prepare("SELECT * FROM `rilevazione-flusso-veicoli-tramite-spire-anno-2022` WHERE data=?");
    $query->bind_param("s", $api_formatted_curDate);
    $query->execute();
    $result = $query->get_result();
    //echo $result->num_rows;
    //if($result->num_rows <= 0){
    //  $json_result = insert_newData($api_formatted_curDate);
   // }
    //else{
      while($row = $result->fetch_assoc()){
        //echo $row["data"] . "\n";
        $result_rows[] = $row;
        $r++;
      }
      
    //}
    $i = $i + 1;
  }
  $json_result = json_encode($result_rows);
  return $json_result;
}

function connection(){
  $connection = new mysqli("127.0.0.1:3307", "root", "P4tchouliKnownledg3", "prova");
  if($connection->connect_error){
    die('Error connecting to the database');
  }
  return $connection;
}

function show_traffic_data($startDate, $endDate, $startHour = 0, $endHour = 24){
  $traffic_info_json = get_traffic_data($startDate, $endDate, $startHour, $endHour);
  if(strlen($traffic_info_json) <= 0){
    echo "<script>resetMap();</script>";
    return;
  }
  echo "<script>showTrafficData(" . $traffic_info_json . ", " . $startHour . ", " . $endHour . ");</script>";
}

?>