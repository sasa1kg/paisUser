<?php
	//application specific variables
	$clientId = "f5da7f020fcb4ea0aaf4e0ea790e2943";
	$domain = "agro-pais.com";

	//redirect url for the user to authenticate 
	//itself using the fi-ware oauth
	$newURL = "http://195.220.224.164/oauth2/authorize"
		. "?response_type=code"
		. "&client_id=". $clientId
		. "&state=xyz"
		. "&redirect_uri=http%3A%2F%2F".$domain
		. "%2Fcallback.php";

	//actual redirect
	header('Location: '.$newURL);
?>