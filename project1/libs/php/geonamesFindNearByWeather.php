<?php

    include('helpFunctions/helperPHP.php');
    include('helpFunctions/config.php');

    $lat = $_REQUEST['rawData']['lat'];
    $lng = $_REQUEST['rawData']['lng'];
    $radius = '100';


    $url = "http://api.geonames.org/findNearByWeatherJSON?lat=" . $lat . "&lng=" . $lng . "&radius=" . $radius . "&username=" . $geonames_user_name;
    $result = curl_request($url);
    $decoded_result = json_decode($result, true);

    json_return($decoded_result);
?>