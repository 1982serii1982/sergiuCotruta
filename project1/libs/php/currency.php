<?php

    include('helpFunctions/helperPHP.php');
    include('helpFunctions/config.php');


    $url = "https://openexchangerates.org/api/latest.json?app_id=" . $open_exchange_rates_API_key;
    $result = curl_request($url);
    $decoded_result = json_decode($result, true);

    json_return($decoded_result);
?>