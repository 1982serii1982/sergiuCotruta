<?php

    include('helpFunctions/helperPHP.php');
    include('helpFunctions/config.php');

    $north = urlencode($_REQUEST['rawData']['country']['north']);
    $south = urlencode($_REQUEST['rawData']['country']['south']);
    $east = urlencode($_REQUEST['rawData']['country']['east']);
    $west = urlencode($_REQUEST['rawData']['country']['west']);
    $maxRows = '30';


    $url = "http://api.geonames.org/weatherJSON?north=" . $north . "&south=" . $south . "&east=" . $east . "&west=" . $west . "&maxRows=" . $maxRows . "&username=" . $geonames_user_name;
    
    $result = curl_request($url);
    $decoded_result = json_decode($result, true);

    json_return($decoded_result);
?>