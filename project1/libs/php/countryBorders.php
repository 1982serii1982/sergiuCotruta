<?php

    include('helpFunctions/helperPHP.php');
    //************************************************************************************* */
    $index = $_REQUEST['rawData']['index'];
    $isoA2 = !isset($_REQUEST['rawData']['isoA2']) ? 'AG': $_REQUEST['rawData']['isoA2'];

    switch($index){
        case 1:
            $array_properties = array();
            $result = file_get_contents("../json/countryBorders.geo.json");
            $decoded_result = json_decode($result, true);
            foreach ($decoded_result['features'] as $value) {
                array_push($array_properties, $value['properties']);
            }
            json_return($array_properties);
            break;
        
        case 2:
            $array_properties = array();
            $result = file_get_contents("../json/countryBorders.geo.json");
            $decoded_result = json_decode($result, true);
            foreach ($decoded_result['features'] as $value) {
                array_push($array_properties, $value['geometry']);
            }
            json_return($array_properties);
            break;
        
        case 3:
            $array = array();
            $result = file_get_contents("../json/countryBorders.geo.json");
            $decoded_result = json_decode($result, true);
            foreach ($decoded_result['features'] as $value) {
                if($value['properties']['iso_a2'] == $isoA2){
                    $array[0] = $value;
                    break;
                }
            }
            json_return($array);
            break;
    }

    //************************************************************************************* */


?>