<?php
    function formatData($input){
        $pattern = "/and/i";
        $str = ucwords(strtolower($input));
        $temp = preg_replace($pattern, "and", $str);
        return $temp;
    }

    function writeToFile($result, $file){
        file_put_contents($file, print_r($result, true));
    }
?>