var access_token;
var user_id;
var user_name;

function statusChangeCallback(response) {
	if (response.status === 'connected') {
		testAPI();
	} else if (response.status === 'not_authorized') {
		document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
	} else {
		document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
	}
}

function checkLoginState() {
	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
}

window.fbAsyncInit = function() {
	FB.init({
		appId : '227825597416489',
		cookie : true,
		xfbml : true,
		version : 'v2.0'
	});

	FB.login(function() {
		FB.api('/me/feed', 'post', {
			message : 'test asdasdf'
		});
	}, {
		scope : 'publish_actions'
	});

	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});

};

(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id))
		return;
	js = d.createElement(s);
	js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function testAPI() {
	FB.api('/me', function(response) {
		access_token = FB.getAuthResponse()['accessToken'];
		user_name = response.name;
		user_id = response.id;
		document.getElementById('status').innerHTML = 'Gracias por loguearte, ' + response.name;
		alert(user_name + " tu token es:\n\n" + access_token + "\n\nY tu id: " + user_id);
	});
}

$('#publicar_Muro').on('click', function() {
	FB.ui({
		method : 'feed',
		name : 'Test 1',
		caption : 'prueba de publicar en muro',
		description : ('gfgfgdfgasdfadf dfghfhfdgdfgdfgdfgdfgfsdfsdf.'),
		link : 'http://www.frba.utn.edu.ar/',
		picture : 'http://www.fbrell.com/public/f8.jpg'
	}, function(response) {
		if (response && response.post_id) {
			alert('Publicado exitosamente.');
		} else {
			alert('No se pudo publicar :(.');
		}
	});
});