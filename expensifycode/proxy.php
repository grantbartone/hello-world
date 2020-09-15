<?php
$GLOBALS['API_PATH'] = "https://www.expensify.com/api";
$GLOBALS['API_PARTNERNAME'] = "fakepartnerfake";  // replaced for security purposes
$GLOBALS['API_PARTNERPASSWORD'] = "fakepassword"; // replaced for security purposes

switch ($_GET['command']) {
	case 'Authenticate':
		commandAuthenticate($_POST['username'], $_POST['password']);
		break;
	case 'Get':
		commandGet($_GET['authToken']);
		break;
	case 'CreateTransaction':
		commandCreateTransaction($_POST['authToken'], $_POST['created'], $_POST['merchant'], $_POST['amount']);
		break;
	default:
		echo '{"message": "Invalid request of unknown type. Please try again."}';
}

function commandAuthenticate($username, $password) {
	$postParams = array('partnerName' => $GLOBALS['API_PARTNERNAME'],
								'partnerPassword' => $GLOBALS['API_PARTNERPASSWORD'],
								'partnerUserID' => $username,
								'partnerUserSecret' => $password,
						);
	$options = array(CURLOPT_URL => $GLOBALS['API_PATH'] . '?command=Authenticate',
						CURLOPT_POST => 1,
						CURLOPT_POSTFIELDS => $postParams,
					);
	fetch($options);
}

function commandGet($authToken) {
	$getURL = $GLOBALS['API_PATH'] . "?command=Get&authToken=$authToken" .
		"&returnValueList=transactionList";
	$options = array(CURLOPT_URL => $getURL);
	$response = fetch($options);
}

function commandCreateTransaction($authToken, $created, $merchant, $amount) {
	$postParams = array('authToken' => $authToken,
								'created' => $created,
								'merchant' => $merchant,
								'amount' => $amount,
							);
	$options = array(CURLOPT_URL => $GLOBALS['API_PATH'] . '?command=CreateTransaction',
						CURLOPT_POST => 1,
						CURLOPT_POSTFIELDS => $postParams,
					);
	$response = fetch($options);
}

function fetch($options) {
	$ch = curl_init();
	curl_setopt_array($ch, $options);
	curl_exec($ch);
}
?>