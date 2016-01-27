<?php
	//get the code from url
	$code = $_GET["code"];
	
	//application specific declarations
	$domain = "agro-pais.com";
	$clientId = "f5da7f020fcb4ea0aaf4e0ea790e2943";
	$clientSecret = "7be756cdd4f146f4a55d3f803dab549c";

	//access token url
	$url = 'http://195.220.224.164/oauth2/token';
	
	//payload params for the request token
	$payload = http_build_query(
		array(
			'grant_type' => 'authorization_code',
			'code' => $code,
			'redirect_uri' => 'http://'. $domain . '/callback.php',
			'client_id' => $clientId,
			'client_secret' => $clientSecret
		)
	);

	//extra header for the request
	$header = array("Content-Type" => "application/x-www-form-urlencoded", "Authorization"=>"Basic");
  
  	//actual request implementation
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_MUTE, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($ch, CURLOPT_USERPWD, $clientId . ":" . $clientSecret); 
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$output = curl_exec($ch);
	curl_close($ch);

	//get the access token from the json response
	$jsonData = json_decode($output,true);
	$access_token = $jsonData["access_token"];

	//start a session and set the access token to it
	session_start();
	$_SESSION["access_token"] = $access_token;

	//redirect to the user page
	header('Location: user.php');
?>