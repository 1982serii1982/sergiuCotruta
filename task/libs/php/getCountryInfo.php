<?php

	// remove for production

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	
	if(isset($_REQUEST['country'], $_REQUEST['city'], $_REQUEST['street'], $_REQUEST['house'])){
		$country = urlencode($_REQUEST['country']);
		$city = urlencode($_REQUEST['city']);
		$street = urlencode($_REQUEST['street']);
		$house = urlencode($_REQUEST['house']);
		$url = 'http://api.geonames.org/geoCodeAddressJSON?q=' . $street . '+' . $house . '+' . $city . '&username=serii1982';
	}elseif(isset($_REQUEST['lng_weather'], $_REQUEST['lat_weather'])){
		$url = 'http://api.geonames.org/findNearByWeatherJSON?lat=' . $_REQUEST['lat_weather'] . '&lng=' . $_REQUEST['lng_weather'] . '&username=serii1982';
	}elseif(isset($_REQUEST['lng_time'], $_REQUEST['lat_time'])){
		$url = 'http://api.geonames.org/timezoneJSON?lat=' . $_REQUEST['lat_time'] . '&lng=' . $_REQUEST['lng_time'] . '&username=serii1982';
	}

	

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

	if(isset($_REQUEST['country'], $_REQUEST['city'], $_REQUEST['street'], $_REQUEST['house'])){
		$output['data'] = $decode['address'];
		$output['status']['description'] = "address";
	}elseif(isset($_REQUEST['lng_weather'], $_REQUEST['lat_weather'])){
		$output['data'] = $decode['weatherObservation'];
		$output['status']['description'] = "weather";
	}elseif(isset($_REQUEST['lng_time'], $_REQUEST['lat_time'])){
		$output['data'] = $decode;
		$output['status']['description'] = "time";
	}
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
