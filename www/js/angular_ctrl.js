var myApp = angular.module('myApp', []);

var elem_cor;

function check_elem_cor(){
   var elem = document.getElementById("text-leituras");
    if (elem_cor !== undefined) {
        elem.style.color = elem_cor;
        elem_cor=undefined;
    }
}

myApp.controller('myCtrl',  function($scope) {
    $scope.sensores = {};

    $scope.updateFeeds = function() {
        var elem = document.getElementById("text-leituras");
        elem_cor=elem.style.color;
        elem.style.color = "Red";
        atualiza_dados();
        //setTimeout(check, 1000); // check again in a second
    }
    $scope.ativar_subpage_eventos_seco = function() {
        if (typeof $scope.sensores_alertas !== "undefined") {
        console.log(">ativar_subpage_eventos_seco");
        activate_subpage('#uib_page_eventos_seco');
        }
    }

    $scope.ativar_subpage_seco = function() {
        console.log(">ativar_subpage_seco");
        activate_subpage('#uib_page_seco');
    }

    $scope.ativar_page_2 = function() {
        activate_subpage('#uib_page_2');
    }

    $scope.sub_page_config_seco = function() {
        console.log(">sub-page-config-seco");
        activate_subpage('#sub-page-config-seco');
    }


    $scope.ativar_subpage_restricao = function() {
        console.log(">ativar_subpage_restricao");
        activate_subpage('#uib-page-config-restricao');
    }

    $scope.getFeeds = function() {
        if (json_feed == null) return;
        if (json_user == undefined || json_user.login == undefined) return;
        if (json_user.login != 'cap') return;
        delete $scope.feeds;
        delete $scope.nodes_feed1;
        $scope.feeds = json_feed.feeds;
        $scope.nodes_feed1 = json_feed.nodes_feed1;
        //console.log(json_feed.sensor);
        $scope.$apply();
    }

    $scope.getSeco = function() {
        var arr=[];
        if (json_seco.length == 0) return;
        delete $scope.sensores_seco;
        //$scope.sensores_seco = json_seco;

        json_seco.forEach(function(elem) {
            if (elem.ativo=='s')
                arr.push(elem);
        });
        $scope.sensores_seco = arr;
        $scope.campos = json_config.campos;
        $scope.modelo = localDB.modelo;
        //console.log(json_feed.sensor);
        $scope.$apply();
    }

    $scope.getDesativados = function() {
        var arr=[];
        if (json_desativados == undefined) return;
        if (json_desativados.length == 0) return;
        delete $scope.desativados;
        //$scope.sensores_seco = json_seco;

        json_desativados.forEach(function(elem) {
                var hora = elem.ends_at.substring(0,2);
                var min = elem.ends_at.substring(3,2);
                elem.starts = new Date ('Fri, 01 Jan 1971 '+elem.starts_at+' GMT');
                elem.ends = new Date ('Fri, 01 Jan 1971 '+elem.ends_at+' GMT');
          //      arr.push(elem);
        });
        //$scope.desativados = arr;
        $scope.desativados = json_desativados;
        $scope.$apply();
    }

    $scope.changeStartsEnds = function(elem) {
        var des=elem.desativ;
        var hh = des.starts.getHours();
        var mm = des.starts.getMinutes();
        var ss = '00';

        if (des.starts > des.ends) {
            mensagemTela('Hora inicial maior que hora final',"Atenção")
            return false;
        }
        if (hh < 10) {hh = "0"+hh;}
        if (mm < 10) {mm = "0"+mm;}
        des.starts_at=hh+":"+mm+":"+ss;

        hh = des.ends.getHours();
        mm = des.ends.getMinutes();
        if (hh < 10) {hh = "0"+hh;}
        if (mm < 10) {mm = "0"+mm;}
        des.ends_at=hh+":"+mm+":"+ss;
//        console.log(elem);
    }

    $scope.removeDesativado = function (elem,index) {
        json_desativados.splice(index,1);

    }

    $scope.getAlertas = function() {
        if (json_alertas.length == 0) return;
        delete $scope.sensores_alertas;
        $scope.sensores_alertas = json_alertas;
        //console.log(json_feed.alertas);
        $scope.$apply();
    }
    $scope.getSensores = function() {
        var arr=[];
        var serie;
        var nome=null;
        if (json_feed == null) return;
        delete $scope.sensores;
        json_feed.sensor.forEach(function(elem) {
            if (elem.ocultar == 0) {
                if (nome != elem.nome) {
                    nome=elem.nome;
                } else {
                    elem.nome='';
                }
              arr.push(elem);
            }
        });
//        $scope.sensores = json_feed.sensor;
        $scope.sensores = arr;
        //console.log(json_feed.sensor);
        $scope.$apply(); 
    }
    /*
    $scope.getDevice = function() {
        $scope.model=device.model;
        $scope.model=device.platform;
        $scope.$apply();
    }
    */
    $scope.goSensor = function(idx) {
        var modelo, serie, chave, id, ref, modulo, sens, canal;

        modelo=$scope.sensores[idx].modelo;
        serie=$scope.sensores[idx].serie;
        chave=$scope.sensores[idx].chave;
        id=$scope.sensores[idx].idp;
        ref=$scope.sensores[idx].ref;
        canal=$scope.sensores[idx].canal;
        modulo = Math.trunc(ref / 10);
        sens = ref % 10;

        if (serie == json_feed.channel.serie) {
//        if (serie == $("#serie").val()) {
            if (modulo == 0){
                        activate_subpage("#uib_page_2");
            }

        } else { // carregar modelo e serie
            $("#modelo").val(modelo);
            localDB.modelo=modelo;
            $("#serie").val(serie);
            localDB.serie=serie;
            $("#chave").val(chave); 
            localDB.chave=chave;
            //$("div.id_100 select").val("val2");
            //$("#sel-meus-sensores option:eq("+selectOption+")").prop('selected', true);
            //$("#sel-meus-sensores select").val(canal);
            $("#sel-meus-sensores").val(canal).change();

            getMainConfig(0,id);
        }
    }
});
