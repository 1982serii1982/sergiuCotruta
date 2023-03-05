<?php
    require('db.php');
    require('help.php');

    header('Content-Type: application/json; charset=UTF-8');

    if($_POST['count']){

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
            $output['status']['count'] = $result[0]['totalID'];
            
            
            $pdo = null;
            $stmt = null;

            echo json_encode($output);

            exit;
        }else{
            $output['status']['code'] = "202";
            
            
            $pdo = null;
            $stmt = null;

            echo json_encode($output);

            exit;
        }

    }else{

    
    
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
        $output['status']['message'] = formatData($_POST['departmentName']) . " department is successfully deleted.";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];


        $pdo = null;
        $stmt = null;

    


        echo json_encode($output);

    }

?>