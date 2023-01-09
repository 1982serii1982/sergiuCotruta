<?php

    include('helpFunctions/helperPHP.php');
    include('helpFunctions/config.php');


    $lat = !isset($_REQUEST['rawData']['lat']) ? '51.5007144': $_REQUEST['rawData']['lat'];
    $lng = !isset($_REQUEST['rawData']['lng']) ? '-0.1422878': $_REQUEST['rawData']['lng'];


    $url = "https://api.openweathermap.org/data/2.5/forecast?lat=" . $lat . "&lon=" . $lng . "&units=metric&cnt=30&APPID=" . $open_weather_API_key;
    
    $result = curl_request($url);
    $decoded_result = json_decode($result, true);



    json_return($decoded_result);
?>