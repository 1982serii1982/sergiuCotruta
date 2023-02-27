<?php

    require('db.php');
    require('help.php');

    header('Content-Type: application/json; charset=UTF-8');

    $sql = "SELECT COUNT(id) AS totalID FROM location WHERE name = :name";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':name', strtolower($_POST['locationName']), PDO::PARAM_STR);
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
        $output['status']['message'] = "Can not update " . formatData($_POST['locationName']) . " location, because it already exists in location table";

        $pdo = null;
        $stmt = null;

        echo json_encode($output);

        exit;
    }


    $sql = "UPDATE location
            SET name = :name
            WHERE id = :id";

    
    

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':name', formatData($_POST['locationName']), PDO::PARAM_STR);
    $stmt->bindValue(':id', intval($_POST['locationID']), PDO::PARAM_INT);
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
    $output['status']['message'] = "Location " . formatData($_POST['locationName']) . " succesfully updated.";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];


    $pdo = null;
    $stmt = null;

    echo json_encode($output);

?>