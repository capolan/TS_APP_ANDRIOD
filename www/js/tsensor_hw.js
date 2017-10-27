////////////////////////////////////////////////////////////////////////////////
var map=null;
var markerMap;

var map=0;
function initMap() {
	var myHome = {lng:-51.177074,lat:-29.916178};
	var myLatLng, str_icon, str_name;
    if (map == 0) return;
    if (json_feed.channel.latitude == undefined) return;
    //if (json_config.latitude == undefined) return;

    var l = parseFloat(json_feed.channel.latitude);
    var g = parseFloat(json_feed.channel.longitude);
	myLatLng = {lat: l, lng: g};

    var offline_at=json_feed.channel.offline_at;
    var name=json_feed.channel.name;
    if (offline_at != undefined) {
        str_icon='http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    } else {
        str_icon='http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    }

  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
 // cor do marcador
 // http://stackoverflow.com/questions/7095574/google-maps-api-3-custom-marker-color-for-default-dot-marker
 //
 // marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
  markerMap = new google.maps.Marker({
	icon: str_icon,
    position: myLatLng,
    map: map,
    title: name
  });

}
////////////////////////////////////////////////////////////////////////////////
function getCoordinate()
{
    var i, redraw=false;
    var l,g;

    l=json_config.latitude;
    g=json_config.longitude;
    if (json_feed == null) return;
    for (i = json_feed.feeds.length-1; i>=0; i--) {
        if (json_feed.feeds[i].latitude != undefined && parseFloat(json_feed.feeds[i].latitude) !=0) {
            l=json_feed.feeds[i].latitude;
        }
        if (json_feed.feeds[i].longitude != undefined && parseFloat(json_feed.feeds[i].longitude) !=0) {
            g=json_feed.feeds[i].longitude;
        }
    }
    if (l!=json_config.latitude || g!=json_config.longitude) {
        json_config.latitude=l;
        json_config.longitude=g;
        redraw=true;
    }
    console.log("lat=" + json_config.latitude + ' lgn=' + json_config.longitude);
    if (map == null || redraw==true)
        initMap();
}


////////////////////////////////////////////////////////////////////////////////
// Programar o Tsensor hw diretamente
////////////////////////////////////////////////////////////////////////////////
function prog_ler_ip() {
    //    var myRe = new RegExp("([0-9\.]*)\<br\>([0-9\.]*)","g");
    var addr = 'http://192.168.4.1/?I&R';

    console.log("url=" + addr);
    if (navigator.connection.type == Connection.NONE) {
        text_wifi.innerHTML = "Sem conexão de rede.";
        return;
    }
    text_wifi.innerHTML = "Enviando ao TS";
    $.ajax({
        type: 'GET',
        url: addr,
        timeout: 15000,
        success: function (data) {
            console.log(data);
            myIP = data.split(/\s*,\s*/);
            var txt = 'AP=' + myIP[0] + '<br>STA=' + myIP[1];
            text_wifi.innerHTML = txt;
        },
        error: function (data) {
            console.log(data);
            text_wifi.innerHTML = 'ERRO:' + data.statusText;
        }
    });

}

// REBOOT
function prog_reboot_ts() {
    var addr = 'http://192.168.4.1/s?f=7&R';

    console.log("url=" + addr);
    if (navigator.connection.type == Connection.NONE) {
        text_wifi.innerHTML = "Sem conexão de rede.";
        return;
    }
    text_wifi.innerHTML = "Enviando ao TS";
    $.ajax({
        type: 'GET',
        url: addr,
        timeout: 15000,
        success: function (data) {
            console.log(data);
            text_wifi.innerHTML = data;
        },
        error: function (data) {
            console.log(data);
            text_wifi.innerHTML = 'ERRO:' + data.statusText;
        }
    });

}

// Programar o Tsensor hw diretamente
function prog_wifi() {
    var addr = 'http://192.168.4.1/s?f=1&R&s=' +
        $("#ssid").val() +
        '&p=' + $("#passwd").val() +
        '&y=' + $("#proxy").val();

    console.log("url=" + addr);
    if (window.cordova) {
        if (navigator.connection.type == Connection.NONE) {
            text_wifi.innerHTML = "Sem conexão de rede.";
            return;
        }
    }
    text_wifi.innerHTML = "Enviando ao TS";
    $.ajax({
        type: 'GET',
        url: addr,
        timeout: 15000,
        success: function (data) {
            console.log(data);
            text_wifi.innerHTML = data;
        },
        error: function (data) {
            console.log(data);
            text_wifi.innerHTML = 'ERRO:' + data.statusText;
        }
    });

}
