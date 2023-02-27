<?php

    require('db.php');
    require('help.php');

    header('Content-Type: application/json; charset=UTF-8');

 
    $sql = "SELECT COUNT(id) AS totalID FROM location WHERE name = :name";



    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':name', formatData($_POST['locationName']), PDO::PARAM_STR);
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

    if($result[0]['totalID'] > 0){
        $output['status']['code'] = "302";
        $output['status']['message'] = formatData($_POST['locationName']) . " location already exists.";

        $pdo = null;
        $stmt = null;

        echo json_encode($output);

        exit;
    }

    $sql = "INSERT INTO location (name) 
            VALUES (:name)";

    
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':name', formatData($_POST['locationName']), PDO::PARAM_STR);
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
	$output['status']['message'] = formatData($_POST['locationName']) . " location is successfully added.";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];


    $pdo = null;
    $stmt = null;

   
    echo json_encode($output);

?>