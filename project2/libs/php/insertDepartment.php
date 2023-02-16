<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    require('db.php');
    require('help.php');

    header('Content-Type: application/json; charset=UTF-8');

    

    $file = 'insertResult.txt';

    
    



    $sql = "SELECT * FROM department WHERE name = :name AND locationID = :location ORDER BY name";



    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':name', formatData($_REQUEST['departmentName']), PDO::PARAM_STR);
    $stmt->bindValue(':location', intval($_REQUEST['locationID']), PDO::PARAM_INT);
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

    // file_put_contents($file, print_r($result, true));

    // die();

    if(count($result) > 0){
        $output['status']['code'] = "302";
        $output['status']['message'] = formatData($_REQUEST['departmentName']) . " department already exists in " . formatData($_REQUEST['locationName']) . " location";

        $pdo = null;
        $stmt = null;

        echo json_encode($output);

        exit;
    }

    $sql = "INSERT INTO department (name, locationID) 
            VALUES (:name, :location)";

    
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':name', formatData($_REQUEST['departmentName']), PDO::PARAM_STR);
    $stmt->bindValue(':location', intval($_REQUEST['locationID']), PDO::PARAM_INT);
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
	$output['status']['message'] = formatData($_REQUEST['departmentName']) . " department is successfully added to " . formatData($_REQUEST['locationName']) . " location";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];


    $pdo = null;
    $stmt = null;

    //file_put_contents($file, print_r($output, true));


    echo json_encode($output);

?>