<?php

    require('db.php');

    header('Content-Type: application/json; charset=UTF-8');

   

    $order = $_POST['order'];
    $orderBy = $_POST['orderBy'];
    $inputArray['firstName'] = $_POST['searchString'];
    $inputArray['department'] = $_POST['searchString'];
    $inputArray['jobTitle'] = $_POST['searchString'];
    $inputArray['lastName'] = $_POST['searchString'];
    $inputArray['email'] = $_POST['searchString'];
    $inputArray['location'] = $_POST['searchString'];

    
	

    $sql = "SELECT p.lastName AS lastName, p.firstName AS firstName, p.jobTitle AS jobTitle, p.id AS id, p.email AS email, d.name AS department, l.name AS location  
            FROM personnel p 
            LEFT JOIN department d ON (d.id = p.departmentID) 
            LEFT JOIN location l ON (l.id = d.locationID) 
            WHERE p.firstName LIKE CONCAT('%', :firstName, '%')
            OR d.name LIKE CONCAT('%', :department, '%')
            OR p.jobTitle LIKE CONCAT('%', :jobTitle, '%')
            OR p.lastName LIKE CONCAT('%', :lastName, '%')
            OR p.email LIKE CONCAT('%', :email, '%')
            OR l.name LIKE CONCAT('%', :location, '%')
            ORDER BY $orderBy $order";




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

    foreach($result as $row){
        array_push($output['data'], $row);
    }

   
    echo json_encode($output);


?>