<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    require('db.php');

    header('Content-Type: application/json; charset=UTF-8');

    $file = 'getAllLocation.txt';

    

    $inputArray = [];

    $sql = "SELECT * FROM location WHERE id IN ( ";

    foreach ($_REQUEST['data'] as $key => $value){
        if($key == 0){
            $sql .= ":id" . $key;
            $inputArray['id' . $key] = $value;
        }else{
            $sql .= ",:id" . $key;
            $inputArray['id' . $key] = $value;
        }
        
    }


    $sql .= ")";
    
    


    $stmt = $pdo->prepare($sql);
    $error = $stmt->execute($inputArray);

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

    $output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];


    $pdo = null;
    $stmt = null;

    file_put_contents($file, print_r($result, true));
    
    foreach($result as $row){
        array_push($output['data'], $row);
    }

    

    
    echo json_encode($output);

?>