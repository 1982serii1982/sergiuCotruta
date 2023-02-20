<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    require('db.php');

    header('Content-Type: application/json; charset=UTF-8');

    

    $sql = "SELECT * FROM location ORDER BY name";


    $stmt = $pdo->prepare($sql);
    $error = $stmt->execute();

    if($error === false){
        $output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		$pdo = null;

		echo json_encode($output); 

		exit;
    }

    $result = $stmt->fetchAll();

   

    $pdo = null;
    $stmt = null;

    if(count($result) > 0){
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];

        foreach($result as $row){
            array_push($output['data'], $row);
        }
    }else{
        $output['status']['code'] = "204";
        $output['status']['message'] = "No data to retrieve";
    }

    
    
    echo json_encode($output);

?>