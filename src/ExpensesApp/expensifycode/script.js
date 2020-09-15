$( document ).ready( () => checkCookieAuth() );
var cookieName = "expensify";

function handleAuthSubmit() {
	const credentials = {
		username: $("input[name=username]").val(),
		password: $("input[name=password]").val(),
	};
	$.ajax({
		url: "proxy.php?command=Authenticate",
		method: "POST",
		data: credentials,
	}).done(function (msg) {
		const response = JSON.parse(msg);
		if (response.jsonCode !== 200) {
			showLoginShake();
			return onResponseError(response);
		}
		onAuthSuccess(response);
	}).fail(function (jqXHR, textStatus) {
		console.log("handleAuthSubmit:", textStatus);
		showLoginHint("Something went wrong. Please try again.");
	});
	return false;
}

function validCreatedDateKey(event) {
	if (isNaN(event.key) && event.key !== '-') return false;
}

function validTransaction(created, merchant, amount) {
	const createdDate = new Date(created);
	if (isNaN(createdDate.getTime()))
		return alert("Please enter a valid date in the format YYYY-MM-DD to create a transaction.");

	if (createdDate < new Date('1900-01-01') || createdDate > new Date('2999-12-31'))
		return alert("Please enter a date between 1900-01-01 and 2999-12-31 to create a transaction.");

	if (isNaN(amount)) return alert("Please enter a valid Amount to create a transaction.");
	if (Math.abs(amount) > 9999999999) return alert("Please enter an Amount under $100,000,000.00");

	return true;
}

function onAuthSuccess({ accountID, authToken, email }) {
	document.cookie = `${cookieName}=${authToken}`;
	dismissLoginForm();
	getTransactions();
}

function onResponseError(response) {
	console.log("onResponseError:", response);
	const { jsonCode, message } = response;
	switch (jsonCode) {
		case 401: showLoginHint("Incorrect password. Please try again."); break;
		case 404: 
			showLoginHint("Account not found. Please check your email address and try again.");
			break;
		case 407:
			showLoginHint("Your session has expired. Please login again.");
			document.cookie = `${cookieName}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
			checkCookieAuth();
			break;
		case 402:
		default: 
			showLoginHint("Something went wrong. Please try again.");
	}
}

function checkCookieAuth() {
	const cookiePresent = document.cookie.includes(cookieName);
	if (cookiePresent) {
		getTransactions();
		showLoadingTransactions();
	} else {
		showLogin();
	}
}

function getCookieAuthToken() {
	const cookie = document.cookie.split(";").filter(a => a.includes(cookieName))[0];
	return cookie.substr(cookieName.length + 1);
}

function getTransactions() {
	const authToken = getCookieAuthToken();
	const proxyURL = `proxy.php?command=Get&authToken=${authToken}&returnValueList=transactionList`;
	$.ajax({
		url: proxyURL,
	}).done(function (msg) {
		const response = JSON.parse(msg);
		if (response.jsonCode !== 200) return onResponseError(response);
		onGetSuccess(response);
	}).fail(function (jqXHR, textStatus) {
		console.log("getTransactions:", textStatus);
		alert("Something went wrong! Check your network connection and reload to try again.");
	});
}

function onGetSuccess( {transactionList} ) {
	// Add each transaction in the Get response to the Transactions table
	for (const transaction of transactionList) {
		const { created, merchant, amount } = transaction;
		addTransactionRow(created, merchant, amount);
	}
	showTransactions();
}

function handleCreateTransaction() {
	const authToken = getCookieAuthToken();
	const created = $("input[name=created]").val();
	const merchant = $("input[name=merchant]").val();
	const amount = $("input[name=amount]").val();

	if (validTransaction(created, merchant, amount)) {
		document.getElementById('createTransaction').reset();
		const displayAmount = amount * -1;
		addTransactionRow(created, merchant, displayAmount);
		$.ajax({
			url: "proxy.php?command=CreateTransaction",
			method: "POST",
			data: { authToken, created, merchant, amount },
		}).done(function (msg) {
			const response = JSON.parse(msg);
			if (response.jsonCode !== 200) return onResponseError(response);
			console.log("Transaction created!", response);
		}).fail(function (jqXHR, textStatus) {
			removeTransactionRow();
			console.log("getTransactions:", textStatus);
			alert("Something went wrong! Check your network connection try again.");
		});
	}
	return false;
}

function removeTransactionRow() {
	const last = document.getElementById('transactionTableBody').lastChild;
	document.getElementById('transactionTableBody').removeChild(last);
}

function addTransactionRow(created, merchant, amount) {
	const dollarAmount = amount / 100;
	const displayAmount = dollarAmount.toLocaleString("en-US", { style: "currency", currency: "USD" });
	
	const row = document.createElement("tr");
	row.insertCell(-1).appendChild(document.createTextNode(created));
	row.insertCell(-1).appendChild(document.createTextNode(merchant));
	row.insertCell(-1).appendChild(document.createTextNode(displayAmount));
	document.getElementById("transactionTableBody").appendChild(row);
}

function showLogin() {
	$("#transactionTable, #transactionForm").attr("class", "none");
	$("#loginContent").attr("class", "block reveal").one("animationend", () => {
		// Update the opacity and remove "reveal" on animationend to enable "shake" animation
		$("#loginContent").css("opacity", 1).removeClass("reveal");
	});
}

function showLoginShake() {
	$("#loginContent").addClass("shake").one("animationend", () => {
		$("#loginContent").removeClass("shake");
	});
}

function showLoginHint(message) {
	$("#loginHint").text(message);
	return false;
}

function dismissLoginForm() {
	$("#loginContent").addClass("flyAway").one("animationend", () => {
		// Hide Login after flyAway animation and reveal the Loading Transactions header text
		$("#loginContent").attr("class", "none");
		showLoadingTransactions();
	});
}

function showLoadingTransactions() {
	$(".transactionsHeader").text("Loading Transactions...");
	$("#transactionTable").attr("class", "block reveal");
}

function showTransactions() {
	$(".transactionsHeader").text("Transactions:");
	$("#transactionTable table").addClass("reveal");
	$("#transactionForm").removeClass("none").addClass("block");
}