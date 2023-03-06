<?php

    require('db.php');

    header('Content-Type: application/json; charset=UTF-8');

 


    $sql = "UPDATE personnel
            SET firstName = :firstName, lastName = :lastName, jobTitle = :jobTitle, email = :email, departmentID = :departmentID
            WHERE id = :id";

    
    

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':firstName', ucfirst(strtolower($_POST['firstName'])), PDO::PARAM_STR);
    $stmt->bindValue(':lastName', ucfirst(strtolower($_POST['lastName'])), PDO::PARAM_STR);
    $stmt->bindValue(':jobTitle', ucfirst(strtolower($_POST['jobTitle'])), PDO::PARAM_STR);
    $stmt->bindValue(':email', $_POST['email'], PDO::PARAM_STR);
    $stmt->bindValue(':departmentID', intval($_POST['departmentID']), PDO::PARAM_INT);
    $stmt->bindValue(':id', intval($_POST['id']), PDO::PARAM_INT);
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
    $output['status']['message'] = "User " . ucfirst(strtolower($_POST['firstName'])) . " " . ucfirst(strtolower($_POST['lastName'])) . " succesfully updated.";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];


    $pdo = null;
    $stmt = null;

    echo json_encode($output);

?>