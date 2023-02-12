<?php
    function formatData($input){
        $pattern = "/and/i";
        $str = ucwords(strtolower($input));
        $temp = preg_replace($pattern, "and", $str);
        return $temp;
    }
?>