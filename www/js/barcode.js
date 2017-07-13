//////////////////////////////////////////////////////////////////////////////////////////
// http://stackoverflow.com/questions/23930744/how-to-use-google-login-api-with-cordova-phonegap
var id_token ;
function sendBackend() {
	//var id_token = googleUser.getAuthResponse().id_token;
	var xhr = new XMLHttpRequest();
    var data, sessao_id;
	console.log('>send idtoken=' + id_token);
	xhr.open('POST', 'http://ts0.sensoronline.net/obj/ti/tokensignin.php');
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
		console.log('Signed in as: ' + xhr.responseText);
	};
	xhr.onreadystatechange=function(){
      console.log('xhr.readyState=',xhr.readyState);
      console.log('xhr.status=',xhr.status);
       if (xhr.readyState==4 && xhr.status==200){
          console.log('response=',xhr.responseText);
           data=JSON.parse(xhr.responseText);
                    json_user = data;
                    sessao_id = data.sessao;
                    if (document.getElementById("af-checkbox-credenciais").checked) {
                        localDB.json_user = JSON.stringify(json_user);
                    }
                    localDB.sessao_id=sessao_id;
                    atualizaHeaderLogin(data.login,true);
                    updateSelSensores(data);
                    activate_subpage("#uib_page_5");
		}
	}
	xhr.send('idtoken=' + id_token);
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  //console.log(profile);
 // sendBackend(googleUser);
  id_token = googleUser.getAuthResponse().id_token;
    
  sendBackend();
  
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
  
    function onFailure(error) {
      console.log(error);
    }
    function renderButton() {
      gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSignIn,
        'onfailure': onFailure
      });
    }
  

//////////////////////////////////////////////////////////////////////////////////////////
var json_barcode;
function xbarcodeScanned(evt) {
   // intel.xdk.notification.beep(1);
   // navigator.notification.alert("Leitura", alertDismissed, 'Barcode', 'Fechar');
    if (evt.type == "intel.xdk.device.barcode.scan") {
        if (evt.success == true) {
            //mensagemTela('BarCode',evt.codedata);
            var url = evt.codedata;
            var vars=[];
            var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                vars[key] = value;
            });
          //  intel.xdk.device.showRemoteSite(url, 264, 0,56, 48)
            //console.log(evt.codedata);

            //navigator.notification.alert(evt.codedata, alertDismissed, 'Barcode', 'Fechar');
            document.getElementById("modelo").value=vars['m'];
            document.getElementById("serie").value=vars['s'];
            document.getElementById("chave").value=vars['c'];
            localDB.modelo=vars['m'];
            localDB.serie=vars['s'];
            localDB.chave=vars['c'];
            getMainConfig(0);
        } else {
          //scan cancelled
        }
    }
}

function barcodeScanned(evt) {
   cordova.plugins.barcodeScanner.scan(
      function (result) {
          alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
      },
      function (error) {
          alert("Scanning failed: " + error);
      },
      {
          "preferFrontCamera" : true, // iOS and Android
          "showFlipCameraButton" : true, // iOS and Android
          "prompt" : "Place a barcode inside the scan area", // supported on Android only
          "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
      }
   );

}
