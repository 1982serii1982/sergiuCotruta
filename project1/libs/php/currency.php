<?php

    include('helpFunctions/helperPHP.php');
    include('helpFunctions/config.php');

    //$file = 'currency.txt';


    $url = "https://openexchangerates.org/api/latest.json?app_id=" . $open_exchange_rates_API_key;
    $result = curl_request($url);
    $decoded_result = json_decode($result, true);

    //file_put_contents($file, print_r($decoded_result, true));

    json_return($decoded_result);
?>