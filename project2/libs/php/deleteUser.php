<?php

    require('db.php');
    require('help.php');

    header('Content-Type: application/json; charset=UTF-8');

   
    $sql = "DELETE FROM personnel WHERE id = :id";

    
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':id', intval($_POST['id']), PDO::PARAM_INT);
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
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];


    $pdo = null;
    $stmt = null;

    


    echo json_encode($output);

?>