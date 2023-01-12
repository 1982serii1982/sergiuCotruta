<?php

    include('helpFunctions/helperPHP.php');
    include('helpFunctions/config.php');


    $country_name = urlencode($_REQUEST['rawData']['country']);

    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI?q=" . $country_name . "&pageNumber=1&pageSize=10&autoCorrect=true&withThumbnails=true",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "X-RapidAPI-Host: contextualwebsearch-websearch-v1.p.rapidapi.com",
            "X-RapidAPI-Key: " . $X_RapidAPI_Key2
        ],
    ]);

    $result = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    $decoded_result = json_decode($result, true);


    json_return($decoded_result);

?>