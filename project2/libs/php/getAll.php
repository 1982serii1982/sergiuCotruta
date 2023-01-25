<?php

    require('db.php');

    //$file = 'result.txt';

    $order = $_REQUEST['order'];
    $orderBy = $_REQUEST['orderBy'];

    
	

    $sql = "SELECT p.lastName, p.firstName, p.jobTitle, p.id, p.email, d.name AS department, l.name AS location  FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ORDER BY " . $orderBy . " " . $order;


    //file_put_contents($file, print_r($sql, true));


    $state = $conn->prepare($sql);
    $state->execute();

    $result = $state->fetchAll(PDO::FETCH_ASSOC);

    $conn = null;
    $state = null;

    
    
    //$result = $conn->query($sql, PDO::FETCH_ASSOC);
    $array =[];
    foreach($result as $row){
        array_push($array, $row);
    }

    // Echo out the data to be used
    echo json_encode($array);

?>