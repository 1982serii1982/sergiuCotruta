<?php

    function curl_request($url) {

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $url);

        $result = curl_exec($ch);

        curl_close($ch);

        return $result;

    }

    function json_return($json_object) {

        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['data']['content'] = $json_object;

        header('Content-Type: application/json; charset=UTF-8');

        echo json_encode($output);

    }

    function writeToFile($result, $file){
        file_put_contents($file, print_r($result, true));
    }
	

	



?>