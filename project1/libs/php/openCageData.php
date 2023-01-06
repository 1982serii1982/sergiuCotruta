<?php

    include('helpFunctions/helperPHP.php');
    include('helpFunctions/config.php');

    $lat = !isset($_REQUEST['rawData']['lat']) ? '51.5007144': $_REQUEST['rawData']['lat'];
    $lng = !isset($_REQUEST['rawData']['lng']) ? '-0.1422878': $_REQUEST['rawData']['lng'];
    $placename = urlencode(!isset($_REQUEST['rawData']['placename']) ? 'United Kingdom' : $_REQUEST['rawData']['placename']);

    if($_REQUEST['rawData']['first']){
        $url = "https://api.opencagedata.com/geocode/v1/json?q=" . $lat . "+" . $lng . "&key=" . $open_cage_API_key;
        $result = curl_request($url);
        $decoded_result = json_decode($result, true);
        json_return($decoded_result);
    }else{
        $url = "https://api.opencagedata.com/geocode/v1/json?q=" . $placename . "&key=" . $open_cage_API_key;
        $result = curl_request($url);
        $decoded_result = json_decode($result, true);
        json_return($decoded_result);
    }

?>