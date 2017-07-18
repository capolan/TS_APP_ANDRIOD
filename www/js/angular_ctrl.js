var myApp = angular.module('myApp', []);

myApp.controller('myCtrl',  function($scope) {
    $scope.sensores = {};

    $scope.updateFeeds = function() {
        atualiza_dados();
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
        if (json_seco.length == 0) return;
        delete $scope.sensores_seco;
        $scope.sensores_seco = json_seco;
        //console.log(json_feed.sensor);
        $scope.$apply();
    }

    $scope.getAlertas = function() {
        if (json_alertas.length == 0) return;
        delete $scope.sensores_alertas;
        $scope.sensores_alertas = json_alertas;
        //console.log(json_feed.alertas);
        $scope.$apply();
    }
    $scope.getSensores = function() {
        if (json_feed == null) return;
        delete $scope.sensores;
        $scope.sensores = json_feed.sensor;
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
        var serie, id, ref, modulo, sens;

        serie=$scope.sensores[idx].serie;
        id=$scope.sensores[idx].idp;
        ref=$scope.sensores[idx].ref;
        modulo = Math.trunc(ref / 10);
        sens = ref % 10;

        if (serie == $("#serie").val()) {
            if (modulo == 0){
                switch (sens ) {
                    case 5:
                        activate_subpage("#uib_page_2");
                        break;
                    case 1:
                    case 6:
                        activate_subpage("#uib_page_10");
                        break;
                    case 2:
                    case 3:
                    case 4:
                    case 7:
                        activate_subpage("#uib_page_11");
                        break;
                }
            }

        } else { // carregar modelo e serie
            //$("#modelo").val('');
            $("#serie").val(serie);
            Cookies["serie"]=serie;
            $("#chave").val('');
            Cookies.erase("chave");
            getMainConfig(0,id);
        }
    }
});
