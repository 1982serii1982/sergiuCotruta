<?php
    require('db.php');
    require('help.php');

    header('Content-Type: application/json; charset=UTF-8');

    

    $sql = "SELECT COUNT(id) AS totalID FROM personnel WHERE departmentID = :departmentID";



    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':departmentID', intval($_POST['departmentID']), PDO::PARAM_INT);
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
        $output['status']['message'] = "Unable to delete " . formatData($_POST['departmentName']) . " department for " . formatData($_POST['locationName']) . " location. There is a reference to " . formatData($_POST['departmentName']) . " department in main table.";
        
        $pdo = null;
        $stmt = null;

        echo json_encode($output);

        exit;
    }

    
    $sql = "DELETE FROM department WHERE id = :departmentID";

    
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':departmentID', intval($_POST['departmentID']), PDO::PARAM_INT);
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
	$output['status']['message'] = formatData($_POST['departmentName']) . " department from " . formatData($_POST['locationName']) . " location is successfully deleted.";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];


    $pdo = null;
    $stmt = null;

    


    echo json_encode($output);

?>