<?php
    
    
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "companydirectory";

    
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname",$username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch(PDOExeption $e) {
        echo "Error: ".$e->getMessage();
        die();
    }

?>