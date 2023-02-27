<?php

    require('db.php');

    header('Content-Type: application/json; charset=UTF-8');

    if($_POST['single']){
        $sql = "SELECT d.id AS departmentID, d.name AS departmentName, d.locationID AS locationID, l.name AS locationName  
        FROM department d
        LEFT JOIN location l ON (l.id = d.locationID)
        WHERE d.id = :departmentID
        ORDER BY departmentName " . $_POST['order'];

        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':departmentID', intval($_POST['departmentID']), PDO::PARAM_INT);
        $error = $stmt->execute();
    }elseif($_POST['join']){
        $sql = "SELECT d.id AS departmentID, d.name AS departmentName, l.name AS locationName  
        FROM department d
        LEFT JOIN location l ON (l.id = d.locationID) 
        ORDER BY departmentName " . $_POST['order'];

        $stmt = $pdo->prepare($sql);
        $error = $stmt->execute();
    }else{
        $sql = "SELECT *  
        FROM department ORDER BY name " . $_POST['order'];

        $stmt = $pdo->prepare($sql);
        $error = $stmt->execute();
    }
    

    

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