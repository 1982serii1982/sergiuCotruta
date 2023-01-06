<?php

    

    include('helpFunctions/helperPHP.php');
    include('helpFunctions/config.php');


    $url = "http://api.countrylayer.com/v2/all?access_key=". $country_layer_API_key;
    $result = curl_request($url);
    $decoded_result = json_decode($result, true);
    if(isset($decoded_result['error'])){
        $json_result = file_get_contents("../json/restCountries.json");
        $decoded_json_result = json_decode($json_result, true);
        json_return($decoded_json_result);
    }else{
        json_return($decoded_result);
    }

    
?>