<?php

    include('helpFunctions/helperPHP.php');

    $result = file_get_contents("../json/countryBorders.geo.json");
    $decoded_result = json_decode($result, true);

    json_return($decoded_result);



?>