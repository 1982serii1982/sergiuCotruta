<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    require('db.php');
    require('help.php');

    header('Content-Type: application/json; charset=UTF-8');

    

    //$file = 'insertResult.txt';

    
    



    $sql = "SELECT * FROM location WHERE name = :name";



    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':name', formatData($_REQUEST['locationName']), PDO::PARAM_STR);
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

    if(count($result) > 0){
        $output['status']['code'] = "302";
        $output['status']['message'] = formatData($_REQUEST['locationName']) . " location already exists.";

        $pdo = null;
        $stmt = null;

        echo json_encode($output);

        exit;
    }

    $sql = "INSERT INTO location (name) 
            VALUES (:name)";

    
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':name', formatData($_REQUEST['locationName']), PDO::PARAM_STR);
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
    


    $output['status']['code'] = "200";
	$output['status']['message'] = formatData($_REQUEST['locationName']) . " location is successfully added.";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];


    $pdo = null;
    $stmt = null;

    //file_put_contents($file, print_r($output, true));


    echo json_encode($output);

?>