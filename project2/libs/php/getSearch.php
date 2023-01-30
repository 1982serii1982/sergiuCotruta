<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    require('db.php');

    header('Content-Type: application/json; charset=UTF-8');

    $file = 'getSerchResult.txt';

    $order = $_REQUEST['order'];
    $orderBy = $_REQUEST['orderBy'];
    $searchString = $_REQUEST['searchString'];

    
	

    $sql = "SELECT p.lastName AS lastName, p.firstName AS firstName, p.jobTitle AS jobTitle, p.id AS id, p.email AS email, d.name AS department, l.name AS location  
            FROM personnel p 
            LEFT JOIN department d ON (d.id = p.departmentID) 
            LEFT JOIN location l ON (l.id = d.locationID) 
            WHERE p.firstName LIKE '$searchString%'
            OR d.name LIKE '$searchString%'
            OR p.firstName LIKE '$searchString%'
            OR p.email LIKE '$searchString%'
            OR l.name LIKE '$searchString%'
            ORDER BY $orderBy $order";



    
    

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $result = $stmt->fetchAll();

    file_put_contents($file, print_r($result, true));

    $pdo = null;
    $stmt = null;

    $array =[];
    foreach($result as $row){
        array_push($array, $row);
    }

   
    echo json_encode($array);


?>