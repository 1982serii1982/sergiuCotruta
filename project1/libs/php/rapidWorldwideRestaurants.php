<?php

    include('helpFunctions/helperPHP.php');
    include('helpFunctions/config.php');

    $city = !isset($_REQUEST['rawData']['city']) ? 'London': $_REQUEST['rawData']['city'];
    $city_id = !isset($_REQUEST['rawData']['city_id']) ? '297704': $_REQUEST['rawData']['city_id'];

    

    if($_REQUEST['rawData']['typehead']){
        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => "https://worldwide-restaurants.p.rapidapi.com/typeahead",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => "q=" . $city . "&language=en_US",
            CURLOPT_HTTPHEADER => [
                "X-RapidAPI-Host: worldwide-restaurants.p.rapidapi.com",
                "X-RapidAPI-Key: beff1c35d6mshf85497309639726p1c67a8jsn75d71af83ba2",
                "content-type: application/x-www-form-urlencoded"
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
            CURLOPT_URL => "https://worldwide-restaurants.p.rapidapi.com/search",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => "language=en_US&limit=30&location_id=" . $city_id . "&currency=USD",
            CURLOPT_HTTPHEADER => [
                "X-RapidAPI-Host: worldwide-restaurants.p.rapidapi.com",
                "X-RapidAPI-Key: beff1c35d6mshf85497309639726p1c67a8jsn75d71af83ba2",
                "content-type: application/x-www-form-urlencoded"
            ],
        ]);

        $result = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        $decoded_result = json_decode($result, true);

        json_return($decoded_result);
    }
?>