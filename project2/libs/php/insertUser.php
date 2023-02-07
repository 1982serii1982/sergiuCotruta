<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    require('db.php');

    header('Content-Type: application/json; charset=UTF-8');

    // $file = 'insertResult.txt';

    // file_put_contents($file, print_r($_REQUEST, true));



    $sql = "INSERT INTO personnel (firstName, lastName, email, departmentID) 
            VALUES (:firstName, :lastName, :email, :departmentID)";

    
    

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':firstName', ucfirst(strtolower($_REQUEST['firstName'])), PDO::PARAM_STR);
    $stmt->bindValue(':lastName', ucfirst(strtolower($_REQUEST['lastName'])), PDO::PARAM_STR);
    $stmt->bindValue(':email', $_REQUEST['email'], PDO::PARAM_STR);
    $stmt->bindValue(':departmentID', intval($_REQUEST['departmentID']), PDO::PARAM_INT);
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

    $output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];


    $pdo = null;
    $stmt = null;

    foreach($result as $row){
        array_push($output['data'], $row);
    }

    echo json_encode($output);

?>