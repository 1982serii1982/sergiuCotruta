<?php

    include('helpFunctions/helperPHP.php');
    include('helpFunctions/config.php');

    $lat = !isset($_REQUEST['rawData']['lat']) ? '51.5007144': $_REQUEST['rawData']['lat'];
    $lng = !isset($_REQUEST['rawData']['lng']) ? '-0.1422878': $_REQUEST['rawData']['lng'];
    $airport_id = !isset($_REQUEST['rawData']['iata']) ? 'NWI': $_REQUEST['rawData']['iata'];

    if($_REQUEST['rawData']['second']){
        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => "https://forteweb-airportguide-airport-basic-info-v1.p.rapidapi.com/airports_nearby?auth=authairport567&lat=" . $lat . "&lng=" . $lng . "&miles=500",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => [
                "X-RapidAPI-Host: forteweb-airportguide-airport-basic-info-v1.p.rapidapi.com",
                "X-RapidAPI-Key: beff1c35d6mshf85497309639726p1c67a8jsn75d71af83ba2"
            ],
        ]);

        $result = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        $decoded_result = json_decode($result, true);

        json_return($decoded_result);
    }else{
        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => "https://forteweb-airportguide-airport-basic-info-v1.p.rapidapi.com/get_airport_by_iata?airport_id=" . $airport_id . "&auth=authairport567",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => [
                "X-RapidAPI-Host: forteweb-airportguide-airport-basic-info-v1.p.rapidapi.com",
                "X-RapidAPI-Key: beff1c35d6mshf85497309639726p1c67a8jsn75d71af83ba2"
            ],
        ]);

        $result = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        $decoded_result = json_decode($result, true);

        json_return($decoded_result);
    }


    
?>