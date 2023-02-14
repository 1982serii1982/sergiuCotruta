<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    require('db.php');
    require('help.php');

    header('Content-Type: application/json; charset=UTF-8');

    

    $file = 'insertResult.txt';

    
    
    $sql = "DELETE FROM personnel WHERE id = :id";

    
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':id', intval($_REQUEST['id']), PDO::PARAM_INT);
    $error = $stmt->execute();

    //file_put_contents($file, print_r($error, true));
    
    // die();

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
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];


    $pdo = null;
    $stmt = null;

    


    echo json_encode($output);

?>