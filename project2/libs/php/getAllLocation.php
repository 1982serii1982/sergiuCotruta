<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    require('db.php');

    header('Content-Type: application/json; charset=UTF-8');

    
	

    $sql = "SELECT *  
            FROM location ";


    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll();


    $pdo = null;
    $stmt = null;

    
    
    $array =[];
    foreach($result as $row){
        array_push($array, $row);
    }

    // Echo out the data to be used
    echo json_encode($array);

?>