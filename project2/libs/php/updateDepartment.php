<?php

    require('db.php');
    require('help.php');

    header('Content-Type: application/json; charset=UTF-8');

    $sql = "SELECT COUNT(id) AS totalID FROM department WHERE name = :name AND locationID = :locationID";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':name', strtolower($_POST['departmentName']), PDO::PARAM_STR);
    $stmt->bindValue(':locationID', intval($_POST['locationID']), PDO::PARAM_INT);
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
        $output['status']['message'] = "Can not update " . formatData($_POST['departmentName']) . " department, because it already exists in departments table";

        $pdo = null;
        $stmt = null;

        echo json_encode($output);

        exit;
    }


    $sql = "UPDATE department
            SET name = :name, locationID = :locationID
            WHERE id = :id";

    
    

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':name', formatData($_POST['departmentName']), PDO::PARAM_STR);
    $stmt->bindValue(':id', intval($_POST['departmentID']), PDO::PARAM_INT);
    $stmt->bindValue(':locationID', intval($_POST['locationID']), PDO::PARAM_INT);
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
    $output['status']['message'] = "Department " . formatData($_POST['departmentName']) . " succesfully updated.";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];


    $pdo = null;
    $stmt = null;

    echo json_encode($output);

?>