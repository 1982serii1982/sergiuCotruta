<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    require('db.php');
    require('help.php');

    header('Content-Type: application/json; charset=UTF-8');

    

    $sql = "SELECT * FROM department WHERE locationID = :locationID";



    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':locationID', intval($_REQUEST['locationID']), PDO::PARAM_INT);
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

    

    if(count($result) > 0){
        $output['status']['code'] = "302";
        $output['status']['message'] = "Unable to delete " . formatData($_REQUEST['locationName']) . " location. There is a reference to " . formatData($_REQUEST['locationName']) . " location, in another table.";
        
        $pdo = null;
        $stmt = null;

        echo json_encode($output);

        exit;
    }

    
    $sql = "DELETE FROM location WHERE id = :locationID";

    
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':locationID', intval($_REQUEST['locationID']), PDO::PARAM_INT);
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
	$output['status']['message'] = formatData($_REQUEST['locationName']) . " location is successfully deleted.";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];


    $pdo = null;
    $stmt = null;

    


    echo json_encode($output);

?>