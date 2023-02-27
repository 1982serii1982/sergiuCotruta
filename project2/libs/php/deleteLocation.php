<?php

    require('db.php');
    require('help.php');

    header('Content-Type: application/json; charset=UTF-8');

    

    $sql = "SELECT COUNT(id) AS totalID FROM department WHERE locationID = :locationID";



    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':locationID', intval($_POST['locationID']), PDO::PARAM_INT);
    $error = $stmt->execute();

    if(!$error){
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
        $output['status']['message'] = "Unable to delete " . formatData($_POST['locationName']) . " location. There is a reference to " . formatData($_POST['locationName']) . " location, in another table.";
        
        $pdo = null;
        $stmt = null;

        echo json_encode($output);

        exit;
    }

    
    $sql = "DELETE FROM location WHERE id = :locationID";

    
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':locationID', intval($_POST['locationID']), PDO::PARAM_INT);
    $error = $stmt->execute();

    if(!$error){
        $output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		$pdo = null;
        $stmt = null;

		echo json_encode($output); 

		exit;
    }
    


    $output['status']['code'] = "200";
	$output['status']['message'] = formatData($_POST['locationName']) . " location is successfully deleted.";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];


    $pdo = null;
    $stmt = null;

    


    echo json_encode($output);

?>