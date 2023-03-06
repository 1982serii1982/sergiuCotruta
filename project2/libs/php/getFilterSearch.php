<?php

    function filter($var){
        if($var === 'order' || $var === 'orderBy'){
            return false;
        }
        return true;
    }

    require('db.php');

    header('Content-Type: application/json; charset=UTF-8');


    $order = isset($_POST['order']) ? $_POST['order'] : '';
    $orderBy = isset($_POST['orderBy']) ? $_POST['orderBy'] : '';

    $inputArray = [];

    
	

    $sql = "SELECT p.lastName AS lastName, p.firstName AS firstName, p.jobTitle AS jobTitle, p.id AS id, p.email AS email, d.name AS department, l.name AS location  
            FROM personnel p 
            LEFT JOIN department d ON (d.id = p.departmentID) 
            LEFT JOIN location l ON (l.id = d.locationID) ";


    $keyArray = array_values(array_filter(array_keys($_POST), "filter"));
    

    

    foreach ($keyArray as $key => $value){
        switch($value){
            case 'firstName':
                if($key === 0){
                    $sql .= "WHERE p.firstName LIKE CONCAT( '%', :firstName, '%')";
                }else{
                    $sql .= " AND p.firstName LIKE CONCAT( '%', :firstName, '%')";
                }
                $inputArray['firstName'] = $_POST[$value];
                break;
            case 'lastName':
                if($key === 0){
                    $sql .= "WHERE p.lastName LIKE CONCAT( '%', :lastName, '%')";
                }else{
                    $sql .= " AND p.lastName LIKE CONCAT( '%', :lastName, '%')";
                }
                $inputArray['lastName'] = $_POST[$value];
                break;
            case 'jobTitle':
                if($key === 0){
                    $sql .= "WHERE p.jobTitle LIKE CONCAT( '%', :jobTitle, '%')";
                }else{
                    $sql .= " AND p.jobTitle LIKE CONCAT( '%', :jobTitle, '%')";
                }
                $inputArray['jobTitle'] = $_POST[$value];
                break;
            case 'email':
                if($key === 0){
                    $sql .= "WHERE p.email LIKE CONCAT( '%', :email, '%')";
                }else{
                    $sql .= " AND p.email LIKE CONCAT( '%', :email, '%')";
                }
                $inputArray['email'] = $_POST[$value];
                break;
            case 'department':
                if($key === 0){
                    $sql .= "WHERE d.name LIKE CONCAT( '%', :department, '%')";
                }else{
                    $sql .= " AND d.name LIKE CONCAT( '%', :department, '%')";
                }
                $inputArray['department'] = $_POST[$value];
                break;
            case 'location':
                if($key === 0){
                    $sql .= "WHERE l.name LIKE CONCAT( '%', :location, '%')";
                }else{
                    $sql .= " AND l.name LIKE CONCAT( '%', :location, '%')";
                }
                $inputArray['location'] = $_POST[$value];
                break;
        }
    }

    $sql .= " ORDER BY $orderBy $order";


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