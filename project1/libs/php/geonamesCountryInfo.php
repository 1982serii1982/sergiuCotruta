<?php

    include('helpFunctions/helperPHP.php');
    include('helpFunctions/config.php');

    $country_iso_a2 = urlencode($_REQUEST['rawData']['country']);


    $url = "http://api.geonames.org/countryInfoJSON?country=" . $country_iso_a2 . "&username=" . $geonames_user_name;
    $result = curl_request($url);
    $decoded_result = json_decode($result, true);

    json_return($decoded_result);
?>