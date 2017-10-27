/*
 * CAP @2017
 */
/*********************************************************/
var r_horas = 2;
var MAX_NODES = 4;
var MAX_NODES_SENSORES = 8;
var MAX_CAIXA_SENSORES = 8;
var VERSAO = {
    MAJOR: '1',
    MINOR: '91',
    DATE: '16/10/2017'
};
var vsApp;

var SERVER_HTTP = 'http://';
var SERVER_IP = 'ts0.sensoronline.net';
//var SERVER_IP = '45.55.77.192';
//var SERVER_PATH = '/dev/ti';
var SERVER_PATH = '/0';
var DATABASE = 'PROD'; //'DEV';
/*********************************************************************/

function dateChanged() {
    alert('sss');
}
/********************************************************/
function getLocalStorage() {
try {
if(window.localStorage ) return window.localStorage;
}
catch (e){
return undefined;
}
}

// function myEventHandler() {
//     "use strict" ;
// // ...event handler code here...
// }
/******************************************************************/
/* usage: eventFire(document.getElementById('mytest1'), 'click'); */
/******************************************************************/
function eventFire(el, etype) {
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}
/********************************************************/
function getUrlVars() {
    var vars = {};
    var parts = HREF.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
/***********************************************************************************/
function validateUsuario(txt) {
    var re = /^[a-zA-Z0-9.\-_$@!]{3,30}$/;
    return re.test(txt);
}

/***********************************************************************************/
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
/*****************************************************************************/
function validatePasswd(str) {
    if (str.length < 4) {
        return ("min 4 caracteres");
    } else if (str.length > 20) {
        return ("muito longa");
    } else if (str.search(/\d/) == -1) {
        return ("falta numero");
    } else if (str.search(/[a-zA-Z]/) == -1) {
        return ("falta letra");
    } else if (str.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
        return ("caractere invalido");
    }
    return true;
}

/******************************************************************************/
function mensagemTela(titulo, msg) {
    if (window.cordova)
        navigator.notification.alert(titulo, // message
            alertDismissed, msg, 'Fechar');
    else {
        if (titulo == null || titulo == '')
            alert(msg);
        else
            alert(titulo + ':' + msg);
    }
}
/******************************************************************************/
function atualizaHeaderLogin(txt, flag) {
    var acesso = jsonPath(json_config, "$.canal.acesso")
    console.log(">atualizaHeaderLogin " + txt + ' acesso=' + acesso);
    // REVER
    //document.getElementById("text-user-login").innerHTML = txt;
    //document.getElementById("text-user-mainpage").innerHTML = txt;
    //document.getElementById("text-user-config").innerHTML = txt;
    //document.getElementById("text-user-modulo").innerHTML = txt;
    //document.getElementById("text-user-sensor").innerHTML = txt;
    if (acesso != false) {
        var color = 'white';
        if (acesso == "r") color = 'yellow';
        if (acesso == "w") color = 'green';
        if (acesso == "a") color = 'blue';
//        document.getElementById("text-user-login").style.color = color;
      ///  document.getElementById("text-user-mainpage").style.color = color;
  //      document.getElementById("text-user-config").style.color = color;
    //    document.getElementById("text-user-modulo").style.color = color;
      //  document.getElementById("text-user-sensor").style.color = color;
    }

    console.log(json_user);
    if (json_user == undefined) {
        document.getElementById("text-sessao-id").innerHTML = '';
        $(".text-login-r").empty();
        $("#btn-sign-out").hide();
        $("#btn-login-logoff").hide();
        $('#btn-trocar-senha').hide();
        // $("#btn-login-reenviar").hide();
        $("#btn-enviar-cadastro").show();
        $("#btn-sign-in-entrar").show();
        $("#btn-assoc-ts").hide();
        $("#btn-desassoc-ts").hide();
        $(".uib_w_263").hide(); //#sel-meus-sensores
    //    $(".uib_w_217").css('display','block'); //login
        $(".uib_w_217").show(); //login
        $(".uib_w_218").show(); //login
        $(".uib_w_219").show(); //sigup
        $(".uib_w_220").show(); //sigup
        $(".uib_row_31").css('visibility','hidden'); //sig email
        $("#text-sign-email").val(''); //sig email

    } else {
        //document.getElementById("text-sessao-id").innerHTML = sessao_id;
        $(".text-login-r").text(json_user.login);
        $("#text-user-name").val(json_user.login);
        $("#btn-sign-out").show();
        $("#btn-login-logoff").show();
        $("#btn-enviar-cadastro").hide();
        $("#btn-trocar-senha").show();
        //$("#btn-login-reenviar").show();
        $("#btn-sign-in-entrar").hide();
        $("#btn-assoc-ts").show();
        $("#btn-desassoc-ts").show();
        $(".uib_w_263").show(); //#sel-meus-sensores
        //$(".uib_w_217").css('display','none'); //login
        $(".uib_w_217").hide(); //login
        $(".uib_w_218").hide(); //login
        $(".uib_w_219").hide(); //sigup
        $(".uib_w_220").hide(); //sigup
        $("#text-sign-email").val(json_user.email); //sig email
        $(".uib_row_31").css('visibility','visible'); //sig email
        if (flag == true) {
            console.log("======" + localDB.serie);
            if (json_user.contador > 0) {
                localDB.modelo = json_user.sensores[0].modelo;
                localDB.serie = json_user.sensores[0].serie;
                localDB.chave = json_user.sensores[0].chave;
            }
        }

    }
}


/******************************************************************************/
function lerMensagensSensor(_modulo, _dd_div, _field) {

    this.data = null;
    this.table = null;
    this.modulo = _modulo;
    this.dd_div = _dd_div;
    this.field = _field;


    var self = this;

    console.log(">lerMensagensSensor   div=" + _dd_div);

    if (window.cordova) {
        if (navigator.connection.type == Connection.NONE) {
            return;
        }
    }
    //    google.load("visualization", "1.1", {'packages':["table"]}, {'callback' : this.drawTable});
    //   google.setOnLoadCallback(this.drawTable);


    this.loadData = function () {
        var data, msg;
        var flag = false;
        var l, n = self.modulo + 1;
        var id_alerta;
        var v_str;

        if (self.modulo == null)
            v_str = jsonPath(json_feed, "$.channel.contador");
        else
            v_str = jsonPath(json_feed, "$.nodes" + n + ".contador");
        var len = parseInt(v_str);
        //console.log(">loadData "+self.dd_div+"  len="+len);
        l = self.data.getNumberOfRows();
        if (l > 0)
            self.data.removeRows(0, l);
        if (isNaN(len) || len == 0) {
            flag = false;
        } else {
            var field;

            for (var i = 0; i < len; i++) {
                //    console.log("i:"+i+" date="+json.feeds[i].created_at+"  status="+ json.feeds[i].status);
                if (self.modulo == null) {
                    msg = jsonPath(json_feed, "$.feeds[" + i + "].mensagem");
                    id_alerta = parseInt(jsonPath(json_feed, "$.feeds[" + i + "].id_alerta"));
                    data = jsonPath(json_feed, "$.feeds[" + i + "].created_at");
                    field = jsonPath(json_feed, "$.feeds[" + i + "].field");
                } else {
                    msg = jsonPath(json_feed, "$.nodes_feed" + n + "[" + i + "].mensagem");
                    id_alerta = parseInt(jsonPath(json_feed, "$.nodes_feed" + n + "[" + i + "].id_alerta"));
                    data = jsonPath(json_feed, "$.nodes_feed" + n + "[" + i + "].created_at");
                    field = jsonPath(json_feed, "$.nodes_feed" + n + "[" + i + "].field");
                }
                if (self.field != undefined && field != false && self.field != field && field != 0)
                    msg = false;
                if (msg != false) {
                    var d = moment(new Date(data));
                    flag = true;
                    //         console.log(json_feed );
                    //      console.log("id_alerta="+id_alerta );
                    self.data.addRow(["<font color=black>"+id_alerta+"</font>", 
                        "<font color=black>"+d.format('DD/MM/YYYY HH:mm')+"</font>", {
                        v: '1',
                        f: msg.toString(),
                        p: {'style':'color:black;'}
                    }]);
                }
            }
        }
        if (flag == false)
            $('#' + self.dd_div).hide();
        else {
            var view = new google.visualization.DataView(self.data);
            var cssClassNames = {
                'headerRow': 'italic-darkblue-font large-font bold-font',
                'tableRow': 'white-background',
                'oddTableRow': 'beige-background',
                'selectedTableRow': 'orange-background',
                'hoverTableRow': '',
                'headerCell': 'gold-border',
                'tableCell': '',
                'rowNumberCell': 'underline-blue-font'
            };

            view.hideColumns([0]);

            $('#' + self.dd_div).show();
            self.table.draw(self.data, {
                showRowNumber: false,
                allowHtml: true,
                'cssClassNames': cssClassNames,
                page: "enable",
                width: '100%',
                height: '100%'
            });
        }
        //   console.log("<loadData flag="+flag)
    };

    this.drawTable = function () {
        console.log(">drawTable Status dd_div=" + self.dd_div);
        self.data = new google.visualization.DataTable();
        self.data.addColumn('string', 'Id');
        self.data.addColumn('string', 'Data');
        self.data.addColumn('string', 'Evento');
        self.table = new google.visualization.Table(document.getElementById(self.dd_div));

        google.visualization.events.addListener(self.table, 'select', self.clickOnTable);


        self.loadData();
    };

    this.clickOnTable = function () {
        var selection = self.table.getSelection();
        var message = '';

        for (var i = 0; i < selection.length; i++) {
            var item = selection[i];
            if (item.row != null) {
                var vid;
                var str = self.data.getFormattedValue(item.row, 0);
                var data = self.data.getFormattedValue(item.row, 1);
                var msg = self.data.getFormattedValue(item.row, 2);
                if (json_user != undefined) {
                    $("#text-alerta-usuario").val(json_user.login);
                }
                // remove o <font....>23423432</font> deixando somente os numeros
                vid = /\d+/.exec(str); //str.replace(/(<.+>)(<.*>)/g,"");
                data = /\d+\/\d+\/\d+/.exec(data);
                console.log("vid="+vid)
                document.getElementById("text-evento-titulo").innerHTML = "<p>Evento:" + vid + "</p>";
                $("#text-alerta-id").prop("readonly", false);
                $("#text-alerta-data").prop("readonly", false);
                $("#text-alerta-mensagem").prop("readonly", false);
                $("#text-alerta-id").val(vid);
                $("#text-alerta-data").val(data);
                $("#text-alerta-mensagem").val(msg);
                $("#text-alerta-id").prop("readonly", true);
                $("#text-alerta-data").prop("readonly", true);
                $("#text-alerta-mensagem").prop("readonly", true);
                $('#uib_page_alerta').scrollTop(0);
                lerStatus('retorno', 'table_feedback_div');
                activate_subpage("#uib_page_alerta");
                return;
                message += '{row:' + item.row + ', column:none}; value (col 0) = ' + str + '\n';
            }
        }
    }

    //google.setOnLoadCallback(this.drawTable);

    if (this.data == null)
        this.drawTable();
    else
        this.loadData();
    console.log("<lerMensagensSensor");
}

/******************************************************************************/
function lerSensorSeco(_dd_div) {

    this.data = null;
    this.table = null;
    this.dd_div = _dd_div;
    this.ativo = true;
    this.created_at = 'NaN';
    this.offline_at = false;
    this.message = '';

    var self = this;

    console.log(">lerSensorSeco   div=" + _dd_div);

    if (window.cordova) {
        if (navigator.connection.type == Connection.NONE) {
            return;
        }
    }
    //    google.load("visualization", "1.1", {'packages':["table"]}, {'callback' : this.drawTable});
    //   google.setOnLoadCallback(this.drawTable);


    this.loadData = function () {
        var data, nome, valor,param,flag, ordem, cor, updated_at, ativo, flag_ativo;
        var texto,trocou, html, html0, html1, texto0, texto1;
        console.log(json_feed);
        data= jsonPath(json_feed,"$.feeds[0].created_at");
        if (data != false) {
            self.created_at = data;
        }

        data= jsonPath(json_feed,"$.feeds[0].time");
        if (data != false) {
            document.getElementById("text-last-msg").innerHTML=data + " (atualizado)";
        }

        valor=self.data.getNumberOfRows();
        if (valor > 0)
            self.data.removeRows(0, valor);
        json_seco=[];
        for (var i = 0; i < 8; i++) {
            nome = jsonPath(json_feed, "$.campos["+i+"].nome");
            if (nome == undefined)
                    break;
            ordem = parseInt(jsonPath(json_feed, "$.campos["+i+"].ordem"));
            if (nome == false) {
                break;
            }
            nome = nome.toString();
            valor = parseInt(jsonPath(json_feed, "$.feeds[0].seco1"));
            updated_at=false;
            trocou = parseInt(jsonPath(json_feed, "$.feeds[0].trocou1"));
            data = jsonPath(json_feed, "$.feeds[0].created_at");
            param = parseInt(jsonPath(json_config, "$.campos["+i+"].param1"));
            html0 = jsonPath(json_feed, "$.campos["+i+"].html0");
            html1 = jsonPath(json_feed, "$.campos["+i+"].html1");
            texto0 = jsonPath(json_feed, "$.campos["+i+"].texto0");
            texto1 = jsonPath(json_feed, "$.campos["+i+"].texto1");
            ativo = jsonPath(json_feed, "$.campos["+i+"].ativo");
            // bit 2   situação regular
            //param = (1 << 2) & param;
            param=0;
            trocou = (1 << ordem) & trocou;
            flag = (1 << ordem) & valor;
            if (param)
                flag = !flag;
            if (flag) {
                updated_at=jsonPath(json_feed, "$.campos["+i+"].updated1_at");
                if (html1 !== undefined && html1.toString() != "")
                    cor=html1.toString();
                else
                    cor="color:green;";
                if (texto1 !== undefined && texto1.toString() != "")
                    texto=texto1.toString();
                else
                    texto='On';
            } else {
                updated_at=jsonPath(json_feed, "$.campos["+i+"].updated0_at");
                if (html0 !== undefined && html0.toString() != "")
                    cor=html0.toString();
                else
                    cor="color:red;" ;
                if (texto0 !== undefined && texto0.toString() != "")
                    texto=texto0.toString();
                else
                    texto='Off';
            }
            if (trocou) {
                cor='color:yellow;';
                updated_at=jsonPath(json_config, "$.feeds[0].created_at");
            }
            //texto=texto + '['+ updated_at  +']';
            if (updated_at != false)
                updated_at=updated_at.toString();
            else
                updated_at='';
            if (ativo == 's')
                flag_ativo=true;
            else
                flag_ativo=false;
            html=cor;
            json_seco.push({nome: nome, texto:texto, cor:html, atualizado_em: updated_at, ativo: ativo, flag: flag_ativo });
            self.data.addRow(["<font color=black>"+nome+"</font>", {
                        v: '1',
                        f: texto,
                        p: {'style':html}
                    }]);
        }

            var view = new google.visualization.DataView(self.data);
            var cssClassNames = {
               // 'headerRow': 'italic-darkblue-font bold-font',
               // 'headerRow': 'italic-darkblue-font large-font bold-font',
                //'tableRow': 'white-background',
                //'oddTableRow': 'beige-background',
                'selectedTableRow': 'orange-background',
              //  'hoverTableRow': '',
                'headerCell': 'gold-border',
                'tableCell': '',
                'rowNumberCell': 'underline-blue-font'
            };


            self.table.draw(self.data, {
                showRowNumber: false,
                allowHtml: true,
                'cssClassNames': cssClassNames,
                page: "enable",
                width: '100%',
                height: '200px'
            });
           console.log("<loadData seco");
    };

    this.drawTable = function () {
        console.log(">drawTable Status dd_div=" + self.dd_div);
        self.data = new google.visualization.DataTable();
        self.data.addColumn('string', 'Sensor');
        self.data.addColumn('string', 'Situacao');
        self.table = new google.visualization.Table(document.getElementById(self.dd_div));

      //  google.visualization.events.addListener(self.table, 'select', self.clickOnTable);


        self.loadData();
    };

    this.clickOnTable = function () {
        var selection = self.table.getSelection();
        var message = '';

        for (var i = 0; i < selection.length; i++) {
            var item = selection[i];
            if (item.row != null) {
                var vid;
                var str = self.data.getFormattedValue(item.row, 0);
                var data = self.data.getFormattedValue(item.row, 1);
                var msg = self.data.getFormattedValue(item.row, 2);
                if (json_user != undefined) {
                    $("#text-alerta-usuario").val(json_user.login);
                }
                // remove o <font....>23423432</font> deixando somente os numeros
                vid = /\d+/.exec(str); //str.replace(/(<.+>)(<.*>)/g,"");
                data = /\d+\/\d+\/\d+/.exec(data);
                console.log("vid="+vid)
                document.getElementById("text-evento-titulo").innerHTML = "<p>Evento:" + vid + "</p>";
                $("#text-alerta-id").prop("readonly", false);
                $("#text-alerta-data").prop("readonly", false);
                $("#text-alerta-mensagem").prop("readonly", false);
                $("#text-alerta-id").val(vid);
                $("#text-alerta-data").val(data);
                $("#text-alerta-mensagem").val(msg);
                $("#text-alerta-id").prop("readonly", true);
                $("#text-alerta-data").prop("readonly", true);
                $("#text-alerta-mensagem").prop("readonly", true);
                $('#uib_page_alerta').scrollTop(0);
                lerStatus('retorno', 'table_feedback_div');
                activate_subpage("#uib_page_alerta");
                return;
                message += '{row:' + item.row + ', column:none}; value (col 0) = ' + str + '\n';
            }
        }
    }

    //google.setOnLoadCallback(this.drawTable);

    if (this.data == null)
        this.drawTable();
    else
        this.loadData();
    console.log("<lerSensorSeco");
}

/******************************************************************************************/
function click_no_gauge(node) {
    var txt;
    var n, n1;
    console.log("click_no_gauge=" + node);
    if (node == 0) {
        n = '$.feeds[0]';
        n1 = '$.channel';
    } else {
        n = '$.nodes_feed' + node + '[0]';
        n1 = '$.nodes' + node;
    }
    if (jsonPath(json_feed, n + ".created_at") == false) {
        txt = "sem dados";
    } else {
        var d = moment(new Date(jsonPath(json_feed, n + ".created_at")));
        var tensao = parseInt(jsonPath(json_feed, n + ".vcc")) / 1000;
        var serie = jsonPath(json_feed, n1 + ".serie");
        var status = jsonPath(json_feed, n1 + ".status");

        txt=d.format('DD/MM/YYYY HH:mm:ss');
        if (isNaN(tensao) == false) {
            txt = "tensão: " + tensao; // message
        }
        if (serie != false) txt = txt + ' serie=' + serie;
        txt = txt + ', amostras=' + jsonPath(json_feed, n1 + ".contador");
        if (node > 0 && status != false) txt = txt + ', status=' + status;
    }
    mensagemTela(null, txt);
}

/**************************************************************************/
var json_config = null;
// tipo = 0 ler todos os dados
//        1 = somente os módulos

function getMainConfig_success(tipo,data)
{
     var num_nodes=0;
                json_config = data;
                document.getElementById('text-inicial').innerHTML +="_OK";
                /*  intel.xdk.notification.alert(json.channel.name, "Canal"); */
                // TS
                if (data != 'null') {
                    if (data.status != 'OK') {
                        document.getElementById("text_config").innerHTML = data.status;
                        return;
                    }
                    document.getElementById("text_config").innerHTML = "Atualizando Grafico";
                    document.getElementById('text-inicial').innerHTML +="<BR>Criando grafico.";
                    ret = true;
                    json_feed = null;

                    if (tipo == 0) {
                        if (json_config.canal.nro_pontos == null)
                            Cookies.create("nro_pontos", 20, 10 * 356);
                        else
                            Cookies.create("nro_pontos", json_config.canal.nro_pontos, 10 * 356);
                        if (json_config.canal.tempo_ler_corrente == null)
                            Cookies.create("tempo_ler_corrente", 20, 10 * 356);
                        else
                            Cookies.create("tempo_ler_corrente", json_config.canal.tempo_ler_corrente, 10 * 356);
                        if (json_config.canal.contador_enviar_web == null)
                            Cookies.create("contador_enviar_web", 3, 10 * 356);
                        else
                            Cookies.create("contador_enviar_web", json_config.canal.contador_enviar_web, 10 * 356);
                        // WIFI
                        Cookies.create("ssid", json_config.canal.ssid, 10 * 356);
                        Cookies.create("passwd", json_config.canal.passwd, 10 * 356);
                        if (json_config.canal.proxy == undefined || json_config.canal.proxy == null)
                            Cookies.create("proxy", "0:0", 10 * 356);
                        else
                            Cookies.create("proxy", json_config.canal.proxy, 10 * 356);
                        // TENSAO
                        Cookies.create("tensao", json_config.canal.tensao, 10 * 356);
                        Cookies.create("fases", json_config.canal.fases, 10 * 356);
                        // TS
                        Cookies.create("api_key", json_config.canal.api_key, 10 * 356);
                        Cookies.create("canal", json_config.canal.canal, 10 * 356);
                        Cookies.create("inatividade", json_config.canal.offline_to_alert, 10 * 356);

                        // AP wifi
                        Cookies.create("ap_ssid", json_config.canal.ap_ssid, 10 * 356);
                        Cookies.create("ap_passwd", json_config.canal.ap_passwd, 10 * 356);
                        Cookies.create("ap_canal", json_config.canal.ap_canal, 10 * 356);
                        Cookies.create("ap_cripto", json_config.canal.ap_cripto, 10 * 356);
                        // Titulo dos campos
                        Cookies.create("descricao", json_config.canal.descricao, 10 * 356);
                        Cookies.create("campo1", json_config.canal.field1, 10 * 356);
                        Cookies.create("campo2", json_config.canal.field2, 10 * 356);
                        Cookies.create("campo3", json_config.canal.field3, 10 * 356);
                        Cookies.create("campo4", json_config.canal.field4, 10 * 356);
                        Cookies.create("campo5", json_config.canal.field5, 10 * 356);
                        Cookies.create("campo6", json_config.canal.field6, 10 * 356);
                        Cookies.create("campo7", json_config.canal.field7, 10 * 356);
                        Cookies.create("campo8", json_config.canal.field8, 10 * 356);

                        // sensor
                        Cookies.create("nome", json_config.canal.nome, 10 * 356);
                        Cookies.create("email", json_config.canal.email, 10 * 356);
                        Cookies.create("celular", json_config.canal.celular, 10 * 356);
                        document.getElementById('text-leituras').innerHTML= json_config.canal.nome;
                        document.getElementById("count_to_alert").value=json_config.canal.count_to_alert;

                        // limites
                        // corrente
                        // Cookies.create("campo1_min", json_config.canal.field1_min, 10 * 356);
                        // Cookies.create("campo1_max", json_config.canal.field1_max, 10 * 356);
                        // temp principal
                        //Cookies.create("vcc", json_config.canal.vcc, 10 * 356);
                        define_recuros();
                     //   if (json_user != undefined) {
                            atualizaHeaderLogin('',false);
                    //    }
                        sens = 0;
                        $("#sel-temp").empty();
                        $(".uib_w_399").hide();
                        $(".uib_w_400").hide();
                        //8 - licença free
                        //9 - licença home
                        //10 - licença prof
                        //11 - licença empresa
                        classe=parseInt(json_config.canal.classe);
                        if (isNaN(classe))
                            classe=0;
                        if ((classe & 0x100) > 0) {
                            $('#af-checkbox-ativar-sms').prop('disabled', true);;
                            $('#text-s-celular').prop('readonly', true);
                            //$("#text-s-celular").css({'background-color': '#FFFEEE'});
                        } else {
                            $('#af-checkbox-ativar-sms').prop('disabled', false);;
                            $('#text-s-celular').prop('readonly', false);
                            //$("#text-s-celular").css({'background-color': '#FFFFFF'});
                        }

                        if (rec_temperatura == true) {
                            option = $('<option></option>').prop("value", 0).text("1: " + json_config.canal.field5);
                            $("#sel-temp").append(option);
                            sens++;
                        }
                        if (rec_temperatura2 == true || rec_humidade == true) {
                            option = $('<option></option>').prop("value", 1).text("2: " + json_config.canal.field6);
                            $("#sel-temp").append(option);
                            sens++;
                        }
                        if (rec_temperatura3 == true || rec_sensor_analogico == true) {
                            option = $('<option></option>').prop("value", 2).text("3: " + json_config.canal.field7);
                            $("#sel-temp").append(option);
                        }
                        if (rec_sensor_analogico == true) {
                            option = $('<option></option>').prop("value", 3).text("4: " + json_config.canal.field8);
                            $("#sel-temp").append(option);
                        }
                        if (rec_corrente_100a == true || rec_corrente_30a == true) {
                            option = $('<option></option>').prop("value", 4).text("5: " + json_config.canal.field1);
                            $("#sel-temp").append(option);
                            option = $('<option></option>').prop("value", 5).text("6: " + json_config.canal.field2);
                            $("#sel-temp").append(option);
                            option = $('<option></option>').prop("value", 6).text("7: " + json_config.canal.field3);
                            $("#sel-temp").append(option);
                            option = $('<option></option>').prop("value", 7).text("8: " + json_config.canal.field4);
                            $("#sel-temp").append(option);
                        }

                        json_sensores=null;
                        json_modbus=null;
                        updateSelComandos(json_config);
                        json_desativados=json_config.desativado;
                        if (rec_temperatura || rec_humidade) {
                            $("#btn-s-temp").show();
                        } else {
                            $("#btn-s-temp").hide();
                        }
                        if (rec_modbus) {
                            $("#btn-s-modbus").show();
                            updateSelModBus(json_config);
                        } else {
                            $("#btn-s-modbus").hide();
                            //$("#btn-s-modbus").css('display','none'); //sig email
                        }
                        if (rec_sensor_seco) {
                            $("#btn-in-sensores").show();
                        } else {
                            $("#btn-in-sensores").hide();
                        }
                        console.log(data);
                    } // tipo==0
                    // modulos
                    for (var m = 0; m < MAX_NODES; m++) {
                        var recursos;
                        var n_mod = m + 1;
                        var s_campo = 6 + m;
                        var node = jsonPath(json_config, "$.canal.node" + n_mod);
                        if (node != false) {
                            num_nodes++;
                            node = "$.node" + n_mod;
                            recursos = jsonPath(json_config, node + ".recursos");
                            $("#sel-mod" + n_mod + " option:eq(0)").prop('selected', true);
                            $("#af-campo-" + s_campo).prop("checked", true);
                            $("#text-mod" + n_mod + "-nome").val(jsonPath(json_config, node + ".name"));
                            $("#text-mod" + n_mod + "-campo").val(jsonPath(json_config, node + ".field1"));
                            $("#text-mod" + n_mod + "-min").val(jsonPath(json_config, node + ".field1_min"));
                            $("#text-mod" + n_mod + "-max").val(jsonPath(json_config, node + ".field1_max"));
                            $("#text-mod" + n_mod + "-vcc").val(jsonPath(json_config, node + ".ajuste1"));
                            $("#sel-mod" + n_mod).empty();
                            for (sens = 1; sens <= MAX_NODES_SENSORES; sens++) {
                                node = jsonPath(json_config, "$.node" + n_mod + ".field" + sens);
                                console.log("sens  node=" + node);
                                option = $('<option></option>').prop("value", sens - 1).text(sens + ":" + node);
                                $("#sel-mod" + n_mod).append(option);
                            }


                        } else {
                            $("#af-campo-" + s_campo).prop("checked", false);
                        }
                    }
                    if (num_nodes >0) {
                        $(".uib_w_74").show();
                    } else {
                        $(".uib_w_74").hide();
                    }

                    Cookies.create("tela_layout", json_config.canal.tela_layout, 10 * 356);
                    flag_getMainConfig = true;

                    if (json_feed == null) {
                        json_feed=data.feeds;
                    }
                    createGraphs();
                    testarBotoesModulo();
                    writeMainConfig();
                    updateSelHoras();
                    updateSelTipoAlertas(json_config.alertas);
                    atualizaGraficoConfig();
                        //atualiza_dados(tipo==0);
                        get_feed_update(data.feeds);
                        $(".uib_w_215").show();

                    $.each(json_config.campos, function(key,val) {
                        console.log(key);
                        console.log(val);
                        if (val.ativo!='s')
                            val.ativo='n';
                    });

                    // select de 2,6 e 24horas
                    // ativa pagina principal
                    
                    //if (tipo == 0) activate_subpage("#uib_page_2");
                    if (json_config.canal.refreshTimer !== undefined) {
                        ret=parseInt(json_config.canal.refreshTimer);
                        if (isNaN(ret)) ret=10000;

                    } else
                        ret=10000;

                    refreshTimer=setTimeout('atualiza_dados()', ret, true);
                    document.getElementById("text_config").innerHTML = "OK";
                }
}

function getMainConfig(tipo, id_sensor) {
    var ret = false, classe;
    var sens, option;
    app.consoleLog(">getMainConfig", tipo);
    //clearTimeout(refreshTimer);
    clearInterval(refreshTimer);
    refreshTimer=undefined;
    /*    if (window.cordova) {
        if (navigator.connection.type == Connection.NONE) {
        text_obj.innerHTML="Sem conexão de rede.";
        return;
        }
    }
  */
    if (id_sensor != undefined ||
        (localDB.modelo != undefined &&
            localDB.serie != undefined &&
            localDB.chave != undefined)) {
        console.log("modelo=" + localDB.modelo);
        var chave;
        if (localDB.chave == undefined)
            chave = '1234';
        else
            chave = localDB.chave;
        var url = SERVER_HTTP + SERVER_IP + SERVER_PATH + "/config_ler.php?f=" + tipo + "&m=" + localDB.modelo + "&s=" + localDB.serie + "&c=" + chave.substring(0, 4) +
            '&t1=' + VERSAO.MAJOR +
            '&t2=' + VERSAO.MINOR +
            '&td=' + VERSAO.DATE;

        if (DATABASE != null) url = url + '&DB=' + DATABASE;
        if (window.cordova) {
            url = url + "&dp=" + device.platform +
                '&duuid=' + device.uuid;

            if (tipo != 2) {
                url = url + '&dm=' + device.model +
                '&dv=' + device.version +
                '&dc=' + device.cordova;
            }
            if (localDB.registrationId != undefined) {
                url = url + '&pushId=' + localDB.registrationId;

            }
        }

        if (id_sensor != undefined) {
            url = url + "&id=" + id_sensor;
        }

        console.log("url=" + url);
        //  document.getElementById("text_config").innerHTML=url;
        //  document.getElementById("text_config").innerHTML="GET";
        document.getElementById('text-leituras').innerHTML='Leituras';
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
           // headers: {
        //        'User-Agent': 'APP Tsensor ' + VERSAO.MAJOR + '.' + VERSAO.MINOR + ' ' + VERSAO.DATE
        //    },
            beforeSend: function () {
                document.getElementById("text_config").innerHTML = "Running...";
                document.getElementById('text-inicial').innerHTML +="<BR>Lendo config " + localDB.serie;
                json_desativados=[];
            },
            success: function (data) {
                 getMainConfig_success(tipo,data);

            },
            error: function (data) {
                mensagemTela(data.responseText, data.status + ':' + data.statusText);
                document.getElementById("modelo").value = localDB.modelo;
                document.getElementById("serie").value = localDB.serie;
                document.getElementById("chave").value = localDB.chave;
                document.getElementById("text_config").innerHTML = "Verifique configuração";
                //activate_subpage("#uib_page_5");
                refreshTimer=setTimeout('atualiza_dados()', 10000, true);
            }

        });
    } else {
        document.getElementById("text_config").innerHTML = "ajuste modelo/serie/chave";
        //activate_subpage("#uib_page_5");
        activate_subpage("#uib_page_sign_in");
    }
    return ret;
}
/*********************************************************************/
function writeMainConfig() {
    var fases;
    //var xhr = new XMLHttpRequest();
    app.consoleLog(">writeMainConfig", "");
    if (localDB.modelo != undefined &&
        localDB.serie != undefined) {
        // document.getElementById("chave").readOnly=true;
        document.getElementById("modelo").value = localDB.modelo;
        document.getElementById("serie").value = localDB.serie;
        document.getElementById("chave").value = localDB.chave;
        var v_str = json_config.canal.addr_serv;
        if (v_str != undefined && v_str != null) {
            // letra U
            var i = v_str.charCodeAt(0) - 83;
            $("#sel-endereco-TS").prop('selectedIndex', i);
        }
        // TITULO da PAGINA
        $("#af-header-0-tit").html("<h1>" + json_config.canal.nome + "</h1>");


        // TS
        document.getElementById("canal").value = Cookies["canal"];
        document.getElementById("tempo_ler_corrente").value = Cookies["tempo_ler_corrente"];
        document.getElementById("contador_enviar_web").value = Cookies["contador_enviar_web"];
        document.getElementById("contador_gravar_log").value = json_config.canal.contador_gravar_log;
        //document.getElementById("api_key").value = Cookies["api_key"];
        document.getElementById("api_key").value = json_config.canal.user_key;
        document.getElementById("nro_pontos").value = Cookies["nro_pontos"];
        document.getElementById("inatividade").value = Cookies["inatividade"];
        document.getElementById("str_horas").value = json_config.canal.horas;

        // WIFI
        document.getElementById("ssid").value = Cookies["ssid"];
        document.getElementById("passwd").value = Cookies["passwd"];
        document.getElementById("proxy").value = Cookies["proxy"];
        // AP wifi
        document.getElementById("ap_ssid").value = Cookies["ap_ssid"];
        document.getElementById("ap_passwd").value = Cookies["ap_passwd"];
        document.getElementById("ap_canal").value = Cookies["ap_canal"];
        document.getElementById("ap_cripto").value = Cookies["ap_cripto"];


        // PAGINA SENSOR
        document.getElementById("text-s-nome").value = Cookies["nome"];
        document.getElementById("text-s-email").value = Cookies["email"];
        document.getElementById("text-s-celular").value = Cookies["celular"];
        if (json_config.canal.ativo_celular == 'S') 
            $("#af-checkbox-ativar-sms").prop("checked", true);
        else
            $("#af-checkbox-ativar-sms").prop("checked", false);

        if (json_config.canal.ativo_email == 'S') 
            $("#af-checkbox-ativar-email").prop("checked", true);
        else
            $("#af-checkbox-ativar-email").prop("checked", false);
        
        

        // TEMPERATURA
        document.getElementById("text-s-vcc").value = json_config.canal.ajuste5;
        $("#text-s-temp-nome").val(json_config.canal.field5);
        document.getElementById("text-s-temp-min").value = json_config.canal.field5_min;
        document.getElementById("text-s-temp-max").value = json_config.canal.field5_max;
        document.getElementById('af-checkbox-pullup').checked = (json_config.canal.seco1_tipo & 0x01) == 0x01;
        fases = json_config.canal.seco1_porta;
        $('#sel-temp-porta-analogico option')[fases].selected = true;
        // CORRENTE/REDE
        if (Cookies["tensao"] == '220')
            document.getElementById("af-radio-s-220").checked = true;
        else
            document.getElementById("af-radio-s-127").checked = true;
        console.log("fases=" + Cookies["fases"] + '   json=' + json_config.canal.fases);
        fases = parseInt(json_config.canal.fases);
        Cookies["fases"]=fases;
        $("#text-s-corrente-nome").val(json_config.canal.field1);
        $("#text-s-corrente-fase1").val(json_config.canal.field2);
        $("#text-s-corrente-fase2").val(json_config.canal.field3);
        $("#text-s-corrente-fase3").val(json_config.canal.field4);
        document.getElementById("af-checkbox-canal-1").checked = (fases & 0x01) == 0x01;
        document.getElementById("af-checkbox-canal-2").checked = (fases & 0x02) == 0x02;
        document.getElementById("af-checkbox-canal-3").checked = (fases & 0x04) == 0x04;
        document.getElementById("af-checkbox-canal-auto").checked = (fases & 0x08) != 0x08;


        document.getElementById("text-s-corrente-ajuste").value = json_config.canal.ajuste1;
        document.getElementById("text-s-corrente-min").value = json_config.canal.field1_min;
        document.getElementById("text-s-corrente-max").value = json_config.canal.field1_max;

        //        if (json.nome != 'undefined')
        //            $("#af-header-0").html(json.nome);
    } // if modelo
}
/**********************************************************************/

/**********************************************************************/
function gravarComandoTS(text_obj, _cmd) {
    var node = $("#sel-node option:selected").index();
    //var cmd_idx = $("#sel-cmd option:selected").index();
    var cmd_idx = $("#sel-cmd").val();
    var chave = localDB.chave;
    var addr = SERVER_HTTP + SERVER_IP + SERVER_PATH + '/config_ts.php';
    var data = 'f=1&m=' + localDB.modelo +
        '&s=' + localDB.serie +
        "&c=" + chave.substring(0, 4) +
        "&nro_pontos" + Cookies["nro_pontos"];

    var cmd_forca='';
    var cmd;

    if (DATABASE != null) data = 'DB=' + DATABASE + '&' + data;

    if (_cmd == undefined)
        cmd = jsonPath(json_config, "$.comandos["+cmd_idx+"].comando");
    else {
        if ($("#af-flipswitch-rele").prop("checked"))
            document.getElementById("text-s-par1").value=1;
        else
            document.getElementById("text-s-par1").value=0;
        if (_cmd='PR'){ // pisca rele 1s
            document.getElementById("text-s-par1").value=3; //piscar
            document.getElementById("text-s-par2").value=1;
            document.getElementById("text-s-par3").value=1000;
        }
        cmd='R';
        if ($("#af-checkbox-cmd-limpa").prop("checked"))
            cmd_forca="&forca=1";
    }


    data = data + "&node=" + node + cmd_forca +
        "&cmd=" + cmd +
        "&par1=" + document.getElementById("text-s-par1").value +
        "&par2=" + document.getElementById("text-s-par2").value +
        "&par3=" + document.getElementById("text-s-par3").value;
    app.consoleLog(addr, data);
    if (window.cordova) {
        if (navigator.connection.type == Connection.NONE) {
            text_obj.innerHTML = "Sem conexão de rede.";
            return;
        }
    }
    if (text_obj != null)
        text_obj.innerHTML = "Enviando servidor";
    $.ajax({
        type: 'GET',
        url: addr + '?' + data,
        dataType: 'json',
       // headers: {
    //        'User-Agent': 'APP Tsensor/' + VERSAO.MAJOR + '.' + VERSAO.MINOR + '/' + VERSAO.DATE
      //  },
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            console.log(data);
            if (text_obj == null) {
                if (window.cordova)
                    navigator.notification.alert(data.mensagem, // message
                        alertDismissed, 'Comando', 'Fechar');
                else
                    alert("Comando:" + data.mensagem);
            } else {
                text_obj.innerHTML = data.mensagem;
            }
        },
        error: function (data) {
            if (text_obj == null) {
                mensagemTela('Erro', data.responseText);
            } else {
                text_obj.innerHTML = data;
            }
        }
    });
}

/**********************************************************************/
function updateSelSensores(data) {
    var i, option;
    var n, m, s, c, canal;
    var mm='',ss='',cc='';
    json_sensores=data;
    $("#sel-meus-sensores").empty();
    i = 0;
        document.getElementById("modelo").value = '';
        document.getElementById("serie").value = '';
        document.getElementById("chave").value = '';
        localDB.removeItem('modelo');
        localDB.removeItem('serie');
        localDB.removeItem('chave');

    m = jsonPath(data, "$.sensores[" + i + "].modelo");
    while (m != false) {
        n = jsonPath(data, "$.sensores[" + i + "].name");
        s = jsonPath(data, "$.sensores[" + i + "].serie");
        c = jsonPath(data, "$.sensores[" + i + "].chave");
        if (mm=='') {
            mm=m;ss=s;cc=c;
        }
        canal = jsonPath(data, "$.sensores[" + i + "].canal");
        console.log("m=" + m + " s=" + s + " c=" + c + "  canal=" + canal);
        option = $('<option></option>').prop("value", canal).text(n);
        $("#sel-meus-sensores").append(option);
        i++;
        m = jsonPath(data, "$.sensores[" + i + "].modelo");
    }
//    $('#sel-meus-sensores option')[0].selected = true;
    $("#sel-meus-sensores option:eq(0)").prop('selected', true);
        document.getElementById("modelo").value = mm;
        document.getElementById("serie").value = ss;
        document.getElementById("chave").value = cc;


   // eventFire(document.getElementById('sel-meus-sensores'), 'change');
}
/**********************************************************************/
function updateSelTipoAlertas(data) {
    var i, option;
    var s,a,c,q;
    $("#sel-tipo_alertas").empty();
    i = 0;
    s = jsonPath(data, "$.alertas[" + i + "].descricao");

    option = $('<option></option>').prop("value", -1).text("todos");
    $("#sel-tipo_alertas").append(option);
    $.each(data, function(key, val) {
           if (val.grupo=='2') {
                option = $('<option></option>').prop("value", val.id_tipo).text(val.descricao);
                $("#sel-tipo_alertas").append(option);
           }
    });
    $("#sel-tipo_alertas option:eq(0)").prop('selected', true);
    //eventFire(document.getElementById('sel-tipo_alertas'), 'change');
}

/***********************************************************************/
function updateSelModBus(data) {
    var i, option;
    var s,a,c,q;
    $("#sel-modbus").empty();
    i = 0;
    s = jsonPath(data, "$.modbus[" + i + "].slave");
    if (s != false) {
        document.getElementById("text-mb-slave").value = '';
        document.getElementById("text-mb-addr").value = '';
        document.getElementById("text-mb-cmd").value = '';
        document.getElementById("text-mb-qtde").value = '';
    }
    while (s != false) {
        a = jsonPath(data, "$.modbus[" + i + "].addr");
        c = jsonPath(data, "$.modbus[" + i + "].cmd");
        q = jsonPath(data, "$.modbus[" + i + "].qtde");
        console.log("Modbus s=" + s + ": a=" + a + " c=" + c + "  q=" + q);
        option = $('<option></option>').prop("value", canal).text(s + ':'+ a);
        $("#sel-modbus").append(option);
        i++;
        s = jsonPath(data, "$.modbus[" + i + "].slave");
    }
    $("#sel-modbus option:eq(0)").prop('selected', true);
    eventFire(document.getElementById('sel-modbus'), 'change');
}

/***********************************************************************/
function updateSelComandos(data) {
    var i, option;
    var id,desc, comando, rec_bits;
    var recursos = parseInt(json_config.canal.recursos);
    $("#sel-cmd").empty();
    i = 0;
    id = jsonPath(data, "$.comandos["+i+"].id");
    while (id != false) {
        desc = jsonPath(data, "$.comandos["+i+"].descricao");
        rec_bits = jsonPath(data, "$.comandos["+i+"].rec_bits");
        console.log("id=" + id + " desc=" + desc+ ' rec_bits=' + rec_bits);
        if (rec_bits == '' || (recursos & rec_bits) > 0) {
            option = $('<option></option>').prop("value", i).text(desc);
            $("#sel-cmd").append(option);
        }
        i++;
        id = jsonPath(data,"$.comandos["+i+"].id");
    }
    $('#sel-cmd option')[0].selected = 0;
}
/**********************************************************************/
function updateSelHoras() {
    var i, option;
    var v_hr, hr;

    if (json_config == undefined) return;
    $("#sel_horas").empty();
    v_hr = json_config.canal.horas;
    if (v_hr == false) return;
    hr = v_hr.split(",");
    for (i in hr) {
        if (isNaN(parseInt(hr[i]))) {
            option = $('<option></option>').prop("value", '#').text("# pontos");
        } else {
            option = $('<option></option>').prop("value", i).text(hr[i] + " horas");
        }
        $("#sel_horas").append(option);
    }
}

/**********************************************************************/
function signInServer(pag) {
    var addr = SERVER_HTTP + SERVER_IP + SERVER_PATH + '/config_ts.php?';
    if (DATABASE != null) addr = addr + 'DB=' + DATABASE + '&';

    if (window.cordova) {
        if (navigator.connection.type == Connection.NONE) {
            navigator.notification.alert(data, // message
                alertDismissed, 'Sem conexão com a rede.', 'Fechar');
            return;
        }
    }

    // BOOT
    if (pag == 'boot') {
        addr = addr + 'f=0&s=' + sessao_id;
        if (json_user != undefined) {
            addr = addr + '&u=' + json_user.login + '&p=' + localDB.encodeLogin;
        }
    }

    // SIGN-IN
    if (pag == 'in') {
        var user = $("#text-user-name").val();
        var passwd = $("#text-user-passwd").val();
        //var encrypted_message = GibberishAES.enc(passwd, "TSensor"+user);
        //var encrypted_message = Base64.encode(passwd, "TSensor");
        var encrypted_message = CryptoJS.SHA256(passwd);
        var encode = encodeURIComponent(encrypted_message);
        if (user == '' || passwd == '') {
            mensagemTela('Alerta', 'Informe usuario e senha.');
            return;
        }
        if (document.getElementById("af-checkbox-credenciais").checked)
            localDB.encodeLogin=encode;
        addr = addr + 'f=3&u=' + user + '&p=' + encode;
    }
    // SIGN-OUT logoff
    if (pag == 'out') {
        var user = json_user.login;
        if (json_user == undefined || user == '') {
            mensagemTela('Alerta', 'Não logado.');
            return;
        }
        addr = addr + 'f=7&u=' + user + '&s=' + sessao_id;
        localDB.removeItem('encodeLogin');
    }

    // SIGN-UP
    if (pag == 'up') {
        var nome = $("#text-nome-completo").val();
        var email = $("#text-email").val();
        var user = $("#text-usuario").val();
        var passwd = $("#text-senha-1").val();

        user = user.toLowerCase();
        passwd = CryptoJS.SHA256(passwd);
        var txt = "n=" + nome + "&e=" + email + "&p=" + passwd;
        var etxt = GibberishAES.enc(txt, "TSensor" + user);
      //  var etxt = CryptoJS.AES.encrypt(txt, "TSensor"+user);
        addr = addr + 'f=4&u=' + user + '&v=' + encodeURIComponent(etxt);
       // addr = addr + 'f=4&u=' + user + '&v=' + encodeURIComponent(etxt);
    }
    // RESET da senha
    if (pag == 'reset') {
        var email = $("#text-user-name").val();
        if (validateEmail(email) == false) {
            navigator.notification.alert(email, alertDismissed,
                'Informe o email no campo Usuário.', 'Fechar');
            return;
        }

        addr = addr + 'f=6&e=' + email;
    }
    // Troca da senha
    if (pag == 'troca') {
        var senha_1 = $("#text-senha-antiga").val();
        var senha_2 = $("#text-senha-nova").val();
        var senha_3 = $("#text-senha-confirmacao").val();
        senha_1 = CryptoJS.SHA256(senha_1);
        senha_2 = CryptoJS.SHA256(senha_2);
        senha_3 = CryptoJS.SHA256(senha_3);
        var txt = "&s1=" + senha_1 + "&s2=" + senha_2 + "&s3=" + senha_3;
        var etxt = GibberishAES.enc(txt, "TSensor");
        //var etxt = CryptoJS.AES.encrypt(txt, "TSensor"+user);
        addr = addr + 'f=8&u=' + user + '&v=' + encodeURIComponent(etxt);
    }
    // Troca emil do usuario
    if (pag == 'email') {
        var email= $("#text-sign-email").val();
        addr = addr + 'f=9&u=' + json_user.login + '&e=' + encodeURIComponent(email);
    }

    // Associar usuario a TS
    if (pag == 'TS+') {
        addr = addr + 'p=20&u=' + json_user.login +
            '&m=' + $("#modelo").val() +
            '&s=' + $("#serie").val() +
            '&c=' + $("#chave").val();
    }

    // Dessociar usuario a TS
    if (pag == 'TS-') {
        addr = addr + 'p=21&u=' + json_user.login +
            '&m=' + $("#modelo").val() +
            '&s=' + $("#serie").val() +
            '&c=' + $("#chave").val();
    }

    // Gravar um comando MODBUS
    if (pag == 'MB+') {
        var mb_slave = $('#text-mb-slave').val();
        var mb_addr = $('#text-mb-addr').val();
        var mb_cmd = $('#text-mb-cmd').val();
        var mb_qtde = $('#text-mb-qtde').val();
        addr = addr + 'p=40&u=' + json_user.login +
            '&m=' + $("#modelo").val() +
            '&s=' + $("#serie").val() +
            '&c=' + $("#chave").val()+
            '&ms=' + mb_slave +
            '&ma=' + mb_addr +
            '&mc=' + mb_cmd +
            '&mq=' + mb_qtde;
        addr = addr + '&updated_flag=10';
    }
    if (pag == 'MB-') {
        var mb_slave = $('#text-mb-slave').val();
        var mb_addr = $('#text-mb-addr').val();
        var mb_cmd = $('#text-mb-cmd').val();
        var mb_qtde = $('#text-mb-qtde').val();
        addr = addr + 'p=41&u=' + json_user.login +
            '&m=' + $("#modelo").val() +
            '&s=' + $("#serie").val() +
            '&c=' + $("#chave").val()+
            '&ms=' + mb_slave +
            '&ma=' + mb_addr +
            '&mc=' + mb_cmd +
            '&mq=' + mb_qtde;
        addr = addr + '&updated_flag=10';
    }

    // registrar comentario
    if (pag == 'reg') {
        addr = addr + 'p=30&u=';
        if (json_user != undefined) {
            addr = addr + '&u=' + json_user.login;
        }
        addr = addr + '&id_alerta=' + $("#text-alerta-id").val() +
            '&n=' + $("#text-alerta-usuario").val() +
            '&m=' + encodeURIComponent($("#text-alerta-msg").val());
        for (var i = 0; i < 3; i++) {
            if ($("#af-alerta-" + i).prop("checked")) {
                addr = addr + '&o=' + i;
                break;
            }
        }
    }


    console.log("pag=" + pag + "  user=" + user + " addr=" + addr + "   txt=" + txt);
    $.ajax({
        type: 'GET',
        url: addr,
        dataType: 'json',
        //headers: {
        //    'User-Agent': 'APP Tsensor/' + VERSAO.MAJOR + '.' + VERSAO.MINOR + '/' + VERSAO.DATE
        //},
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function () {
            if (pag=='TS+' || pag=='TS-')
                document.getElementById("text-s-modbus").innerHTML= "Running...";
            if (pag=='MB+' || pag=='MB-')
                document.getElementById("text_config").innerHTML="Running...";
        },
        success: function (data) {
            if (data.pag != undefined)
                pag=data.pag;
            console.log("signInServer ajax pag="+pag);
            console.log(data);
            if (pag == 'in' || pag == 'boot') {
                if (data.login == undefined || data.login == '') {
                    if (pag == 'in') {
                        mensagemTela('Erro', "usuario/senha inválida");
                    }
                    sessao_id = null;
                    json_user = undefined;
                    localDB.removeItem('sessao_id');
                    localDB.removeItem('json_user');
                    localDB.removeItem('encodeLogin');
                    atualizaHeaderLogin('');
                } else {
                   // mensagemTela(data.login, "bem vindo");
                    json_user = data;
                    sessao_id = data.sessao;
                    if (document.getElementById("af-checkbox-credenciais").checked) {
                        localDB.json_user = JSON.stringify(json_user);
                    }
                    localDB.sessao_id=sessao_id;
                    atualizaHeaderLogin(data.login,true);
                    updateSelSensores(data);
                    if (refreshTimer!==undefined)
                        clearInterval(refreshTimer);
                    refreshTimer=undefined;
                    json_feed=null;

                    if (localDB.modelo === undefined ||
                        localDB.serie === undefined ||
                        localDB.chave === undefined) {
                        if (data.contador > 0 ) {
                            localDB.modelo = data.sensores[0].modelo;
                            localDB.serie = data.sensores[0].serie;
                            localDB.chave = data.sensores[0].chave;
                        } else
                            activate_subpage("#uib_page_5");
                    }
                    getMainConfig_success(0,data);
                }
            } else
            if (pag == 'out') {
                var user = json_user.login;
                sessao_id = null;
                json_user = undefined;
                localDB.clear();
                $("#text-nome-completo").val('');
                $("#text-user-name").val(''); // sign-out
                $("#text-email").val('');
                $("#text-usuario").val('');
                $("#text-user-passwd").val('');
                atualizaHeaderLogin('');
                mensagemTela(user, 'logoff com sucesso');
            } else
            if (pag == 'xboot') {
                if (data.ret == 'OK') {
                    json_user = data;
                    /*   $("#text-nome-completo").val(data.nome);
                       $("#text-user-name").val(data.login); // sign-in
                       $("#text-email").val(data.email);
                       $("#text-usuario").val(data.login);*/
                    sessao_id = data.sessao;
                    localDB.sessao_id=sessao_id;
                    updateSelSensores(data);
                    atualizaHeaderLogin(data.login,true);
                } else {
                    /*    $("#text-nome-completo").empty();
                        $("#text-user-name").empty(); // sign-in
                        $("#text-email").empty();
                        $("#text-usuario").empty();*/
                    sessao_id = null;
                    localDB.removeItem('sessao_id');
                    json_user = undefined;
                    atualizaHeaderLogin('');
                }
            } else
            if (pag == 'TS+') {

                if (data.status == "1" && nome != false) {
                    updateSelSensores(data);
                    document.getElementById("text_config").innerHTML = "Sucesso na inclusao.";
                    signInServer('boot');
                } else
                    document.getElementById("text_config").innerHTML = "Erro:" + data.mensagem;
            } else
            if (pag == 'TS-') {
                if (data.status == "1") {
                    updateSelSensores(data);
                    document.getElementById("text_config").innerHTML = "Sucesso na remocao.";
                    signInServer('boot');
                } else
                    document.getElementById("text_config").innerHTML = "Erro:" + data.mensagem;
            } else
            if (pag == 'MB+' || pag == 'MB-') {
                updateSelModBus(data);
                json_modbus=data;
                if (data.status == "1") {
                    document.getElementById("text-s-modbus").innerHTML = "Sucesso.";
                } else
                    document.getElementById("text-s-modbus").innerHTML = "Erro:" + data.mensagem;
            } else
                mensagemTela(data.mensagem,"Retorno");

        },
        error: //function (data) {
            function (xhr, ajaxOptions, thrownError) {
            mensagemTela(xhr.responseText, xhr.status + ':' + xhr.statusText);
        }
    });
}
/**********************************************************************/
function gravarConfiguracao(pag, text_obj) {
    var chave =  localDB.chave;
    var addr = SERVER_HTTP + SERVER_IP + SERVER_PATH + '/config_ts.php?f=2' +
        '&m=' + localDB.modelo +
        '&s=' + localDB.serie +
        "&c=" + chave.substring(0, 4);

    if (DATABASE != null) addr = addr + '&DB=' + DATABASE;
    addr = addr + '&pag=' + pag;
    if (pag == 'w') {
        var idx = $("#sel-endereco-TS option:selected").index();
        var addr_serv = String.fromCharCode(idx + 83);
        // wifi
        console.log("passwd=" + Cookies["passwd"]);
        addr = addr + '&ssid=' + Cookies['ssid'] +
            '&passwd=' + Cookies['passwd'] +
            '&proxy=' + Cookies['proxy'] +
            '&addr_serv=' + addr_serv;
        addr = addr + '&updated_flag=10';
    }
    if (pag == 't') {
        // TS
        addr = addr + "&updated_flag=10";
        addr = addr + '&offline_to_alert=' + Cookies["inatividade"] +
            '&nro_pontos=' + Cookies['nro_pontos'] +
            '&tempo_ler_corrente=' + Cookies['tempo_ler_corrente'] +
            '&contador_enviar_web=' + Cookies['contador_enviar_web'] +
            '&contador_gravar_log=' + json_config.canal.contador_gravar_log +
            '&horas=' + encodeURIComponent($("#str_horas").val());
        addr = addr + '&updated_flag=10';
    }
    if (pag == 'a') {
        // AP
        addr = addr + '&ap_ssid=' + Cookies['ap_ssid'] +
            '&ap_passwd=' + Cookies['ap_passwd'] +
            '&ap_canal=' + Cookies['ap_canal'] +
            '&ap_cripto=' + Cookies['ap_cripto'];
        addr = addr + '&updated_flag=10';
    }
    if (pag == 'u') {
        addr = addr + '&updated_flag=10';
    }
    console.log("addr=" + addr);
    if (window.cordova) {
        if (navigator.connection.type == Connection.NONE) {
            text_obj.innerHTML = "Sem conexão de rede.";
            return;
        }
    }
    text_obj.innerHTML = "Enviando servidor";
    $.ajax({
        type: 'GET',
        url: addr,
        headers: {
            'User-Agent': 'APP Tsensor/' + VERSAO.MAJOR + '.' + VERSAO.MINOR + '/' + VERSAO.DATE
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            console.log(data);
            text_obj.innerHTML = data;
            if (data=='OK')
                    getMainConfig(0);
            // atualiza_modulos();
        },
        error: function (data) {
            text_obj.innerHTML = 'ERRO:' + data.responseText;
        }
    });
}
///////////////////////////////////////////////////////////////////////////////////////////////
function gravarConfiguracaoSensorPOST(pag, text_obj) {
    var ocultar;
    var chave = localDB.chave;
    var addr = SERVER_HTTP + SERVER_IP + SERVER_PATH + '/config_ts.php';
    var data;

    if (pag == 's') {
        data = {"campos":json_config.campos};
        $.extend(data, {"f":100,"m":localDB.modelo,"s":localDB.serie, "c":chave.substring(0,4)});
        app.consoleLog(data);
    }

    if (DATABASE != null) {
        $.extend(data,{"DB":DATABASE});
    }

    app.consoleLog(addr, data);
    if (window.cordova) {
        if (navigator.connection.type == Connection.NONE) {
            text_obj.innerHTML = "Sem conexão de rede.";
        }
    }
    if (text_obj != null)
        text_obj.innerHTML = "Enviando servidor";
    $.ajax({
        type: 'POST',
        url: addr,
        data: data,
        headers: {
            'User-Agent': 'APP Tsensor/' + VERSAO.MAJOR + '.' + VERSAO.MINOR + '/' + VERSAO.DATE
        },
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function () {
            text_obj.innerHTML = "Running...";
        },
        success: function (data) {
            console.log(data);
            if (text_obj == null) {
                navigator.notification.alert(data, // message
                    alertDismissed, 'Modulo', 'Fechar');
            } else {
                text_obj.innerHTML = data;
                if (data=='OK')
                    getMainConfig(0);
            }
            // atualiza_modulos();
        },
        error: function (data) {
            if (text_obj == null) {
                navigator.notification.alert(data, // message
                    alertDismissed, 'Erro', 'Fechar');
            } else {
                text_obj.innerHTML = data;
            }
        }
    });

}
/**********************************************************************/

function gravarConfiguracaoSensor(pag, text_obj) {
    var ocultar;
    var chave = localDB.chave;
    var f,pag1 = pag.substr(0,1);
    var addr = SERVER_HTTP + SERVER_IP + SERVER_PATH + '/config_ts.php?';
    var data = 'f=2&m=' + localDB.modelo +
        '&s=' + localDB.serie +
        "&c=" + chave.substring(0, 4);


    if (DATABASE != null) addr = addr + 'DB=' + DATABASE + '&';
    if (pag == 'r') {
        // rede/corrente
        ocultar=document.getElementById("af-checkbox-ocultar-corrente").checked;
        data = data + '&tensao=' + Cookies["tensao"] +
            '&ajuste1=' + document.getElementById("text-s-corrente-ajuste").value +
            '&fases=' + Cookies['fases'] +
            '&field1=' + encodeURIComponent(document.getElementById("text-s-corrente-nome").value) +
            '&field2=' + encodeURIComponent(document.getElementById("text-s-corrente-fase1").value) +
            '&field3=' + encodeURIComponent(document.getElementById("text-s-corrente-fase2").value) +
            '&field4=' + encodeURIComponent(document.getElementById("text-s-corrente-fase3").value) +
            '&field1_min=' + document.getElementById("text-s-corrente-min").value +
            '&field1_max=' + document.getElementById("text-s-corrente-max").value +
            '&field1_ocultar=' + ocultar +
            '&field2_ocultar=' + ocultar +
            '&field3_ocultar=' + ocultar +
            '&field4_ocultar=' + ocultar;


        data = data + '&updated_flag=10';

    }
    if (pag1== 's') {
        f=pag.substr(1,1);
        data = data + '&ajuste'+f+'=' + document.getElementById("text-s-vcc").value +
            '&field'+f+'=' + encodeURIComponent(document.getElementById("text-s-temp-nome").value) +
            '&field'+f+'_min=' + document.getElementById("text-s-temp-min").value +
            '&field'+f+'_max=' + document.getElementById("text-s-temp-max").value +
            '&field'+f+'_ocultar=' + document.getElementById("af-checkbox-ocultar-temp").checked;
    }
    if (pag == 't5') {
        // temperatura
        data = data + '&ajuste5=' + document.getElementById("text-s-vcc").value +
            '&field5=' + encodeURIComponent(document.getElementById("text-s-temp-nome").value) +
            '&field5_min=' + document.getElementById("text-s-temp-min").value +
            '&field5_max=' + document.getElementById("text-s-temp-max").value
            +
            '&field5_ocultar=' + document.getElementById("af-checkbox-ocultar-temp").checked;
    }
    if (pag == 't6') {
        // temperatura
        data = data + '&ajuste6=' + document.getElementById("text-s-vcc").value +
            '&field6=' + encodeURIComponent(document.getElementById("text-s-temp-nome").value) +
            '&field6_min=' + document.getElementById("text-s-temp-min").value +
            '&field6_max=' + document.getElementById("text-s-temp-max").value
            +
            '&field6_ocultar=' + document.getElementById("af-checkbox-ocultar-temp").checked;

    }
    if (pag == 't7') {
        // analogico
        var tipo=document.getElementById("af-checkbox-pullup").checked;
        if (tipo)
            tipo=1;
        else
            tipo=0;
        data = data + '&updated_flag=10';
        data = data + '&ajuste7=' + document.getElementById("text-s-vcc").value +
            '&field7=' + encodeURIComponent(document.getElementById("text-s-temp-nome").value) +
            '&field7_min=' + document.getElementById("text-s-temp-min").value +
            '&field7_max=' + document.getElementById("text-s-temp-max").value
            +
            '&field7_ocultar=' + document.getElementById("af-checkbox-ocultar-temp").checked+
            '&porta7=' + $("#sel-temp-porta-analogico option:selected").index() +
            '&tipo7=' + tipo;

    }

    if (pag == 't8') {
        // analogico
        var tipo=document.getElementById("af-checkbox-pullup").checked;
        if (tipo)
            tipo=1;
        else
            tipo=0;
        data = data + '&updated_flag=10';
        data = data + '&ajuste8=' + document.getElementById("text-s-vcc").value +
            '&field8=' + encodeURIComponent(document.getElementById("text-s-temp-nome").value) +
            '&field8_min=' + document.getElementById("text-s-temp-min").value +
            '&field8_max=' + document.getElementById("text-s-temp-max").value
            +
            '&field8_ocultar=' + document.getElementById("af-checkbox-ocultar-temp").checked +
            '&porta8=' + $("#sel-temp-porta-analogico option:selected").index() +
            '&tipo8=' + tipo;
            ;
    }

    if (pag == 't') {
        var sms= document.getElementById("af-checkbox-ativar-sms").checked;
        var email= document.getElementById("af-checkbox-ativar-email").checked;
        data = data +
            "&email=" + encodeURIComponent(document.getElementById("text-s-email").value) +
            "&celular=" + encodeURIComponent(document.getElementById("text-s-celular").value);

        data = data.replace("f=2","f=10")

    }

    if (pag == 'p') {
        data = data.replace("f=2","f=11")
    }

    if (pag == 'm') {
        var sms= document.getElementById("af-checkbox-ativar-sms").checked;
        var email= document.getElementById("af-checkbox-ativar-email").checked;
        var val=parseInt(document.getElementById("count_to_alert").value);
        data = data + "&nome=" + encodeURIComponent(document.getElementById("text-s-nome").value) +
            "&email=" + encodeURIComponent(document.getElementById("text-s-email").value) +
            "&celular=" + encodeURIComponent(document.getElementById("text-s-celular").value)+
            "&aemail=" + email +
            "&asms=" + sms;

        if (!isNaN(val) && val>=1 && val<=100)
            data = data + "&ctoalert=" + document.getElementById("count_to_alert").value;
    }
    // nodes limites e offline_at
    if (pag == 'n') {
        var opt;
        var campo;
        app.consoleLog("campo", campo);

        for (var m = 0; m < MAX_NODES; m++) {
            var n_mod = m + 1;
            var s_campo = 6 + m;
            var node = "&node" + n_mod;
            if ($("#af-campo-" + s_campo).prop("checked")) {
                opt = $("#sel-mod" + n_mod + " option:selected").index();
                campo = parseInt(opt) + 1;
                var v_str = jsonPath(json_config, "$.node" + n_mod + ".serie");
                data = data + node + "=" + v_str;
                data = data +
                    node + "_nome=" + encodeURIComponent($("#text-mod" + n_mod + "-nome").val()) +
                    node + "_field" + campo + "=" + $("#text-mod" + n_mod + "-campo").val();
                v_str = $("#text-mod" + n_mod + "-min").val();
                console.log("#text-mod" + n_mod + "-min:" + v_str);
                if (isNaN(parseInt(v_str)) == false) {
                    data = data + node + "_field" + campo + "_min=" + v_str;
                }
                v_str = $("#text-mod" + n_mod + "-max").val();
                if (isNaN(parseInt(v_str)) == false) {
                    data = data + node + "_field" + campo + "_max=" + v_str;
                }
                v_str = $("#text-mod" + n_mod + "-vcc").val();
                if (isNaN(parseInt(v_str)) == false) {
                    data = data + node + "_ajuste" + campo + "=" + v_str;
                }
            }

        }
    }

    if (pag == 'u') {
        data = data + '&updated_flag=1';
    }
    app.consoleLog(addr, data);
    if (window.cordova) {
        if (navigator.connection.type == Connection.NONE) {
            text_obj.innerHTML = "Sem conexão de rede.";
            return;
        }
    }
    if (text_obj != null)
        text_obj.innerHTML = "Enviando servidor";
    $.ajax({
        type: 'GET',
        url: addr + data,
        headers: {
            'User-Agent': 'APP Tsensor/' + VERSAO.MAJOR + '.' + VERSAO.MINOR + '/' + VERSAO.DATE
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        beforeSend: function () {
            text_obj.innerHTML = "Running...";
        },
        success: function (data) {
            console.log(data);
            if (text_obj == null) {
                navigator.notification.alert(data, // message
                    alertDismissed, 'Modulo', 'Fechar');
            } else {
                text_obj.innerHTML = data;
                if (data=='OK')
                    getMainConfig(0);
            }
            // atualiza_modulos();
        },
        error: function (data) {
            if (text_obj == null) {
                navigator.notification.alert(data, // message
                    alertDismissed, 'Erro', 'Fechar');
            } else {
                text_obj.innerHTML = data;
            }
        }
    });
}


var json_feed = null;
/**********************************************************************/
function get_feed_update(data) {
        if (data === undefined)
            return;

            document.getElementById('text-inicial').innerHTML +="<BR>Mostrando...";
            json_feed = data;
            //console.log("GET FEED OK " + flag_getMainConfig + " canal=" + json_feed.channel.canal);
            //document.dispatchEvent(evt_get_feed);
            t_telaTS_global();
            lerFlagStatus();
            //angular.element(document.getElementById('myCtrl')).scope().get();
            angular.element($("#afui")).scope().getSensores();
            angular.element($("#afui")).scope().getFeeds();
            angular.element($("#afui")).scope().getSeco();
            angular.element($("#afui")).scope().getDesativados();
            getCoordinate();
            if (flag_getMainConfig) {
                if (json_user != undefined)
                    activate_subpage("#uib_page_painel");
                else
                if (rec_sensor_seco)
                    activate_subpage("#uib_page_seco");
                else
                    activate_subpage("#uib_page_2");
                flag_getMainConfig=false;
            } else {
                document.getElementById('text-inicial').innerHTML ="";
            }

        check_elem_cor();
        if (json_config.canal.refreshTimer !== undefined) {
                ret=parseInt(json_config.canal.refreshTimer);
                if (isNaN(ret)) ret=10000;
        } else
            ret=10000;

        refreshTimer=setTimeout('atualiza_dados()', ret, true);
}
/**********************************************************************/

function get_feed() {
    var hoje=moment().format('YYYY-MM-DD');
    var data = document.getElementById('txt-data').value;
    url = SERVER_HTTP + SERVER_IP + SERVER_PATH + '/get_feed.php?f=1' +
        '&api_key=' + Cookies["api_key"] + '&results=' + Cookies["nro_pontos"];

    clearInterval(refreshTimer);

    if (DATABASE != null) url = url + '&DB=' + DATABASE;
    url = url + '&r_horas=' + r_horas;
    if (hoje != data)
        url = url + '&data=' + data;

    if (json_user != undefined) {
        url = url + '&login=' + json_user.login;
    }
    // enviar registro de Push para servidor
    if (localDB.sendRegistration == false && localDB.registrationId != undefined) {
        url = url + '&pushId=' + localDB.registrationId;
    }

    app.consoleLog("   get_feed", url);
    if (Cookies["api_key"] == undefined) // || Cookies['api_key'].length != 16)
        return;
    json_feed = null;
    $.ajax({
        type: 'GET',
        url: url,
        //dataType: 'application/json',
        //headers: {
        //    'User-Agent': 'APP Tsensor/' + VERSAO.MAJOR + '.' + VERSAO.MINOR + '/' + VERSAO.DATE
        //},
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function () {
            if (flag_getMainConfig)
                document.getElementById('text-inicial').innerHTML +="<BR>Lendo dados...";
            },
        success: function (data) {
            //  console.log("get_feed="+data);
            //    json_feed = JSON.parse(data);
            //localDB.sendRegistration=true;
            get_feed_update(data);
        },
        error: function (data) {
            console.log(data);
            text_wifi.innerHTML = 'ERRO get_feed:' + data.statusText;
            json_feed = null;
        }
    });
}


/************************************************************************/
function lerStatus(tipo, _dd_div) {

    this.data = null;
    this.table = null;
    this.flag = false;
    var self = this;

    console.log(">lerStatus");

    if (window.cordova) {
        if (navigator.connection.type == Connection.NONE) {
            return;
        }
    }
    //    google.load("visualization", "1.1", {'packages':["table"]}, {'callback' : this.drawTable});
    //   google.setOnLoadCallback(this.drawTable);


    this.loadData = function () {
        //$("#pag_info_status").html("Conectando servidor.");
        var url = SERVER_HTTP + SERVER_IP + SERVER_PATH + "/config_ler_status.php?" +
            'api_key=' + json_config.canal.api_key + '&';

        switch (tipo) {
            case 'alertas':
                url = url + "f=1&m=" + localDB.modelo + "&s=" + localDB.serie + '&limit=' + pagina_status;
                json_alertas=[];
                break;
            case 'retorno':
                url = url + "f=2&alerta=" + $("#text-alerta-id").val();
                break;
            case 'eventos':
                url = url + "f=3&m=" + localDB.modelo + "&s=" + localDB.serie + '&limit=' + pagina_status;
                break;
        }
    if (DATABASE != null) url = url + '&DB=' + DATABASE;
    if (window.cordova) {
        if (device.platform == 'Android') {
            url = url + '&pushId=' + localDB.registrationId;
        }
    }
/*        if (tipo == 'alertas') {
            url = url + "f=1&m=" + localDB.modelo + "&s=" + localDB.serie + '&limit=' + pagina_status;
        } else {
            url = url + "f=2&alerta=" + $("#text-alerta-id").val();
        }*/
        console.log(url);
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                'User-Agent': 'APP Tsensor ' + VERSAO.MAJOR + '.' + VERSAO.MINOR + ' ' + VERSAO.DATE
            },
            success: function (data) {
                var cssClassNames = {
                    'headerRow': 'italic-darkblue-font large-font bold-font',
                    'tableRow': 'white-background',
                    'oddTableRow': 'beige-background',
                    'selectedTableRow': 'orange-background',
                    'hoverTableRow': '',
                    'headerCell': 'gold-border',
                    'tableCell': '',
                    'rowNumberCell': 'blue-font'
                };

                json_string = data;
                var json = data; //JSON.parse(json_string);
                var len = json.feeds.length;
                //console.log("onLoad len=" + len);
                self.flag = true;
                if (len == 0) {
                    $("#" + _dd_div).html("Sem registros");
                } else {
                    for (var i = 0; i < len; i++) {
                        var ftxt;
                        //var d = moment().zone(new Date(json.feeds[i].created_at));
                        //var d = moment(new Date(json.feeds[i].created_at));


                        if (tipo == 'alertas') {
                            if (json.feeds[i].grupo == '1') {
                                ftxt = json.feeds[i].status + " [" + json.feeds[i].tipo_alerta + "]";
                            } else {
                                ftxt = "<font style=\"color:blue\">" + json.feeds[i].status + "</font>" + " [" + json.feeds[i].tipo_alerta + "]";
                            }
                        } else { // alerta_retorno
                            if (json.feeds[i].nome != null)
                                ftxt = json.feeds[i].nome + ':';
                            else
                                ftxt = '';
                            ftxt = json.feeds[i].mensagem + " [" + json.feeds[i].situacao + "]";
                        }
                        //    console.log("i:"+i+" date="+json.feeds[i].created_at+"  status="+ json.feeds[i].status);
                        //d.format('DD/MM/YYYY hh:mm')
                        //if (i=='1') mensagemTela(json.feeds[i].created_at +'|'+d.format('DD/MM/YYYY hh:mm'));
                        self.data.addRow(["<font color=black>"+json.feeds[i].created_at+"</font>", {
                            v: '1',
                            f: ftxt,
                            p: {'style':'color:black;'}
                        }]);
                        // ==9 sensor_seco e grupo==2 gerador
                        if (json.feeds[i].tipo_alerta == '9' ||
                            json.feeds[i].grupo == '2') {
                            if (sensor_seco.select == -1)
                                json_alertas.push({tipo_alerta: json.feeds[i].tipo_alerta,
                                                texto:json.feeds[i].status,
                                                atualizado_em: json.feeds[i].created_at });
                            else
                                if (json.feeds[i].tipo_alerta==sensor_seco.select)
                                json_alertas.push({tipo_alerta: json.feeds[i].tipo_alerta,
                                                texto:json.feeds[i].status,
                                                atualizado_em: json.feeds[i].created_at });
                        }


                    }

                    self.table.draw(self.data, {
                        showRowNumber: false,
                        allowHtml: true,
                        'cssClassNames': cssClassNames,
                        showRowNumber: true,
                        page: "enable",
                        width: '100%',
                        height: '100%'
                    });

                }
                if ($("#btn_info").hasClass("check"))
                    $("#btn_info").toggleClass("info check");

                angular.element($("#afui")).scope().getAlertas();
            },
            error: function (data) {
                alert("Web Service Doesn't Exist", "Error");
            }
        });
    }

    this.handlePage = function (e) {}

    this.drawTable = function () {
        console.log(">drawTable");
        self.data = new google.visualization.DataTable();
        //self.data.addColumn('number', 'Nro');
        self.data.addColumn('string', 'Data');
        if (tipo == 'alerta')
            self.data.addColumn('string', 'Evento');
        else
            self.data.addColumn('string', 'Comentário');
        self.table = new google.visualization.Table(document.getElementById(_dd_div));
        google.visualization.events.addListener(self.table, 'page', function (e) {
            self.handlePage(e)
        });

        self.loadData();
    };

    //google.setOnLoadCallback(this.drawTable);

    if (this.data == null)
        this.drawTable();
    else
        this.loadData();
    console.log("<lerStatus");
}

function myEventBase64Encode() {
    var encodedString = Base64.encode(document.getElementById("en_entrada").value);
    console.log(encodedString);
    document.getElementById("en_saida").value = encodedString;
}

function validarInteiro(valor, minval, maxval) {
    //tento converter a inteiro.
    //se for um inteiro nao lhe afeta, se não for tenta convertelo
    valor = parseInt(valor);

    //Comprovo se é um valor numérico
    if (isNaN(valor) || valor < minval || valor > maxval) {
        //entao (nao e numero) devuelvo el valor cadena vacia
        return "";
    } else {
        //No caso contrario (Se for um número) devolvo o valor
        return valor;
    }
}

/* COOKIES */

var Cookies = {
    init: function () {
        var allCookies = document.cookie.split('; ');
        for (var i = 0; i < allCookies.length; i++) {
            var cookiePair = allCookies[i].split('=');
            this[cookiePair[0]] = cookiePair[1];
        }
    },
    create: function (name, value, days) {
        if (this[name] == undefined) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            } else var expires = "";
            document.cookie = name + "=" + value + expires + "; path=/";
        }
        this[name] = value;
    },
    erase: function (name) {
        this.create(name, '', -1);
        this[name] = undefined;
    }
};

Cookies.init();

/*********************************************************************/
function atualizaGraficoConfig() {
    console.log(">atualizaGRaficoConfig");
    for (var sens = 1; sens <= 8; sens++) {
        var v_str;
        var n_mod, aux;
        if (gg1[sens] != undefined && jsonPath(json_config, '$.canal') != false) {
                v_str = jsonPath(json_config, "$.canal.field" + sens + "_max");
                max = Math.ceil((parseInt(v_str) + 10) / 10) * 10;
                v_str = jsonPath(json_config, "$.canal.field" + sens + "_min");
                console.log("min=" + v_str);
                min = parseInt(v_str);
                if (min < 0) {
                    min = Math.floor((min - 10) / 10) * 10;
                } else min = 0;

                if (isNaN(max))
                    max = 100;

                range_val = max - min;
                red_value = range_val - (range_val * 0.1) + min;
                yellow_value = range_val - (range_val * 0.25) + min;

                v_str = gg1[sens].data.getColumnLabel(1);
                console.log("GET field" + sens + "=" + v_str);

                v_str = jsonPath(json_config, "$.canal.field" + sens);
                //                console.log("field" + sens + "=" + v_str);

//                max = parseInt(jsonPath(json_config, node + ".field" + sens + "_max"));
                min = parseInt(jsonPath(json_config, "$.canal.field" + sens + "_min"));
                gg1[sens].data.setColumnLabel(1, v_str);
                gg2[sens].data.setColumnLabel(1, v_str);
                gg2[sens].options.title = v_str;
//                console.log("min=" + min);
                if (isNaN(min)) {
                    range_val = max;
                    red_value = range_val - (range_val * 0.1);
                    yellow_value = range_val - (range_val * 0.25);
                    gg1[sens].options.min = 0;
                    gg1[sens].options.max = max;
                    gg1[sens].options.greenFrom = 0;
                    gg1[sens].options.greenTo = yellow_value;
                    gg1[sens].options.yellowFrom = yellow_value;
                    gg1[sens].options.yellowTo = red_value;
                    gg1[sens].options.redFrom = red_value;
                    gg1[sens].options.redTo = max;
                    gg1[sens].options.redColor = '#DC3912';
                } else {
                    diff_val = Math.ceil((max - min) / 3);
                    yellow_value = min;
                    red_value = max;
                    gg1[sens].options.min = min - diff_val;
                    gg1[sens].options.max = max + diff_val;
                    gg1[sens].options.greenFrom = yellow_value;
                    gg1[sens].options.greenTo = red_value;
                    gg1[sens].options.yellowFrom = min - diff_val;
                    gg1[sens].options.yellowTo = yellow_value;
                    gg1[sens].options.redFrom = red_value;
                    gg1[sens].options.redTo = max + diff_val;
                    gg1[sens].options.redColor = '#FF9900';
                    //gm2[m][1].options.vAxis.minValue = min;
                    //gm2[m][1].options.vAxis.maxValue = max;
                }
            }
            // posiciona no primeiro gráfico visível
    } // for
        sens=0;
        for (aux=1; aux<=MAX_CAIXA_SENSORES; aux++) {
                $('#chart1' +aux +"_div").css("display", "none");
                $('#chart2' +aux +"_div").css("display", "none");
                $('#text_pag_' +aux).css("display", "none");
                if (gg1[aux].ativo == true && sens==0)
                        sens=aux;
              }
        if (sens > 0) {
            $('#chart1' + sens + '_div').css("display", "block");
            $('#chart2' + sens + '_div').css("display", "block");
            $('#text_pag_' +sens).css("display", "block");
        }

    /* NODES */
    for (var m = 0; m < MAX_NODES; m++) {
        var v_str;
        var t = m + 1;
        var n_mod, aux;
        var node = "$.node" + t;
        console.log("modulo=" + m);
        if (gm1[m] != undefined && jsonPath(json_config, node) != false) {
            for (sens = 1; gm1[m][sens] != undefined && sens <= MAX_NODES_SENSORES; sens++) {
                v_str = jsonPath(json_config, node + ".field" + sens + "_max");
                max = Math.ceil((parseInt(v_str) + 10) / 10) * 10;
                v_str = jsonPath(json_config, node + ".field" + sens + "_min");
                console.log("min=" + v_str);
                min = parseInt(v_str);
                if (min < 0) {
                    min = Math.floor((min - 10) / 10) * 10;
                } else min = 0;

                if (isNaN(max))
                    max = 100;

                range_val = max - min;
                red_value = range_val - (range_val * 0.1) + min;
                yellow_value = range_val - (range_val * 0.25) + min;

                v_str = gm1[m][sens].data.getColumnLabel(1);
                console.log("GET field" + sens + "=" + v_str);

                v_str = jsonPath(json_config, node + ".field" + sens);
                //                console.log("field" + sens + "=" + v_str);

//                max = parseInt(jsonPath(json_config, node + ".field" + sens + "_max"));
                min = parseInt(jsonPath(json_config, node + ".field" + sens + "_min"));
                gm1[m][sens].data.setColumnLabel(1, v_str);
                gm2[m][sens].data.setColumnLabel(1, v_str);
                gm2[m][sens].options.title = v_str;
//                console.log("min=" + min);
                if (isNaN(min)) {
                    range_val = max;
                    red_value = range_val - (range_val * 0.1);
                    yellow_value = range_val - (range_val * 0.25);
                    gm1[m][sens].options.min = 0;
                    gm1[m][sens].options.max = max;
                    gm1[m][sens].options.greenFrom = 0;
                    gm1[m][sens].options.greenTo = yellow_value;
                    gm1[m][sens].options.yellowFrom = yellow_value;
                    gm1[m][sens].options.yellowTo = red_value;
                    gm1[m][sens].options.redFrom = red_value;
                    gm1[m][sens].options.redTo = max;
                    gm1[m][sens].options.redColor = '#DC3912';
                } else {
                    diff_val = Math.ceil((max - min) / 3);
                    yellow_value = min;
                    red_value = max;
                    gm1[m][sens].options.min = min - diff_val;
                    gm1[m][sens].options.max = max + diff_val;
                    gm1[m][sens].options.greenFrom = yellow_value;
                    gm1[m][sens].options.greenTo = red_value;
                    gm1[m][sens].options.yellowFrom = min - diff_val;
                    gm1[m][sens].options.yellowTo = yellow_value;
                    gm1[m][sens].options.redFrom = red_value;
                    gm1[m][sens].options.redTo = max + diff_val;
                    gm1[m][sens].options.redColor = '#FF9900';
                    //gm2[m][1].options.vAxis.minValue = min;
                    //gm2[m][1].options.vAxis.maxValue = max;
                }
            }
            // posiciona no primeiro gráfico visível
            n_mod=m+6;
            $('#chartx' + n_mod +'11_div').css("display", "block");
            $('#chartx' + n_mod +'12_div').css("display", "block");
              for (aux=2; aux<=MAX_NODES_SENSORES; aux++) {
                $('#chartx' + n_mod +'' + aux +"1_div").css("display", "none");
                $('#chartx' + n_mod +'' + aux +"2_div").css("display", "none");
              }
        }
    } // for

 //   atualiza_dados();
}
/**********************************************************************/
/*********************************************************************/
function testarBotoesModulo() {
    console.log(">testarBotoesModulo");
    // console.log("json_feed.nodes1.name="+json_feed.nodes1.name);
    // $("#af-campo-6").prop("checked",Cookies["flag-campo6"]);
    var page = null;
    if (json_config == null) return;
    for (var m = MAX_NODES - 1; m >= 0; m--) {
        var n_mod = m + 1;
        var node = jsonPath(json_config, "$.canal.node" + n_mod);
        // console.log("m=" + m + "    gm1=" + gm1[m] + "   NODE=" + node);
        if (node != false) {
            $("#btn_mod" + n_mod).show();
            $("#cfg-mod" + n_mod).show();
            $("#btn_mod" + n_mod).html($("#text-mod" + n_mod + "-nome").val());
            createGraphx(m);
            page = n_mod;
        } else {
            $("#btn_mod" + n_mod).hide();
            $("#cfg-mod" + n_mod).hide();
            if (gm1[m] != undefined && gm1[m][0] != undefined) {
                gm1[m][0].ativo = false;
                gm2[m][0].ativo = false;
            }
        }
    }

    if (page != null) {
        $("#btn_mod_extras").show();
    } else {
        $("#btn_mod_extras").hide();
    }
}

function alertDismissed() {
    // do something
}


/*********************************************************************/
function lerFlagStatus() {
    //    console.log(">lerFlag_Status");
    if (json_feed == null) return;

    if ($("#btn_info").hasClass("close"))
        $("#btn_info").toggleClass("info close");

    $("#text_ips").html('')
    if (json_feed.channel.ip0 != undefined)
        $("#text_ips").append('AP=' + json_feed.channel.ip0 + '<br>');
    if (json_feed.channel.ip1 != undefined)
    $("#text_ips").append('STA=' + json_feed.channel.ip1);
    myIP_updated_at = json_feed.channel.updated_ip_at;
    $("#text_ips").append('<br>' + myIP_updated_at + '(atualizado)');
    $("#text_ips").append('<br>' + json_feed.channel.updated_at + ':');
    switch (json_feed.channel.updated_flag) {
    case '0':
        txt = 'OK';
        break;
    case '-1':
        txt = 'config OK';
        break;
    case '1':
        txt = 'enviado config';
        break;
    default:
        txt = 'invalido';
    }
    $("#text_ips").append(txt);
    // =0 OK =1 tem informacao CEL(check) =2 info do TS
    if (json_feed.channel.status != "0") {
        if ($("#btn_info").hasClass("info"))
            $("#btn_info").toggleClass("info check");
    } else
    if ($("#btn_info").hasClass("check"))
        $("#btn_info").toggleClass("info check");


}

/**************************************************************/
 function setupPush() {
   var push = PushNotification.init({
       "android": {
           "senderID": "629413010047"
       },
       "ios": {
         "sound": true,
         "alert": true,
         "badge": true
       },
       "windows": {}
   });

   push.on('registration', function(data) {
       console.log("registration event: " + data.registrationId);
       var oldRegId=1;
       if (localDB.registrationId !== undefined) {
           oldRegId=localDB.registrationId;
       }
       if (oldRegId != data.registrationId) {
           // Save new registration ID
           localDB.registrationId=data.registrationId;
           //alert(data.registrationId);
           // Post registrationId to your app server as the value has changed
       }
       //alert(data.registrationId);
       localDB.sendRegistration=false;
       getMainConfig(2);
   });

   push.on('error', function(e) {
       console.log("push error = " + e.message);
       alert("push error = " + e.message);
   });

   push.on('notification', function(data)
    {
        //alert('['+JSON.stringify(data) + ']' data.title+':'+data.message);
       mensagemTela(data.message, data.title );
        //push.finish(function () {
        //   alert('finish successfully called');
        //});
    });

   localDB.sendRegistration=false;
 }
/************************************************************/
function atualiza_dados() {
    //console.log(">atualiza_dados");
    get_feed();
}

function c() {
    getMainConfig(1);
}

var g3, g4, g5, g6;

var gg1 = new Array(MAX_CAIXA_SENSORES+1);
var gg2 = new Array(MAX_CAIXA_SENSORES);

var gtext = [];
var user = null;
var json_user;
var json_modbus=null;
var json_sensores=null;
var json_seco=[];
var json_desativados=[];
var sensor_seco = { eventos: 'todos', select : -1} ;
/*********************************************************************/
var sessao_id = null;
var localDB;
var refreshTimer;

//var evt_get_feed = document.createEvent("Event");
//evt_get_feed.initEvent("app.Get_Feed", false, false);
var HREF = window.location.href;
var CHAVE1=0;

var push;

function onDeviceReadyXDK() {
    console.log("onDeviceReadyXDK Emulator");
}

function onDeviceReady() {
    console.log("onDeviceReady");
 //   window.open = cordova.InAppBrowser.open;
    /*
    window.plugins.googleplus.trySilentLogin(
    {
      'scopes': 'profile email', // optional - space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '629413010047-mirv8igteh3qrh1vfigu8lalr55hgo21.apps.googleusercontent.com', // optional - clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true, // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
    },
    function (obj) {
      alert(JSON.stringify(obj)); // do something useful instead of alerting
    },
    function (msg) {
      alert('error: ' + msg);
    }
);    */
    // set to either landscape
   // screen.orientation.lock('portrait');

// allow user rotate
//    screen.orientation.unlock();

// access current orientation
  //  console.log('Orientation is ' + screen.orientation.type);

    var list=document.getElementById('text-inicial');
    list.innerHTML="LocalStorage";
    localDB = getLocalStorage();
    var vm = getUrlVars()["m"];
    var vs = getUrlVars()["s"];
    var vc = getUrlVars()["c"];
    console.log("modelo=[" + vm + ']');
    if (vm != undefined) {
        localDB.modelo=vm;
    }
    if (vs != undefined) {
        localDB.serie=vs;
    }
    if (vc != undefined) {
        localDB.chave=vc;
        activate_subpage("#uib_page_2");
    }

    localDB.sendRegistration=true;
    if (window.cordova && device.platform == 'Android') {
        setupPush();
    }

    vs=$("#startup-img").next("figcaption").text();
    console.log("figcaption=" + vs);

    if (window.cordova) {
        cordova.getAppVersion.getAppName(function (version) {
                vsApp = 'App=['+version;
                return true;
        });
        cordova.getAppVersion.getVersionCode(function (version) {
                vsApp = vsApp +'] Code=['+version;
                return true;
        });
        cordova.getAppVersion.getVersionNumber(function (version) {
                vsApp = vsApp +'] Version=['+version + ']';
                return true;
        });
    }
    vs='APP Tsensor ' + VERSAO.MAJOR + '.' + VERSAO.MINOR + ' ' + VERSAO.DATE + '(' + vsApp + ')';

    $("#startup-img").next("figcaption").text(vs);

    // testa sessao
    if (localDB.sessao_id != undefined) {
        sessao_id = localDB.sessao_id;
        if (localDB.json_user != undefined) {
            json_user= JSON.parse(localDB.json_user);
        console.log("sessao=" + sessao_id);
        signInServer('boot');
        }
    } else
        atualizaHeaderLogin('');

    if (intel.xdk.isxdk == true) {
        // Application is running in XDK
        console.log("Running in Intel XDK Emulator");
        list.innerHTML +="Intel XDK Emulator";
        $("#div_campos").hide();
    }
    //angular.element($("#afui")).scope().getDevice();

    // sensor principal
    $(".uib_col_6").height(200);
    $(".uib_col_7").height(220);
    $(".uib_col_8").height(200);
    $(".uib_col_10").height(220);
    $(".uib_col_19").height(200);
    $(".uib_col_23").height(220);
    // modulos
    $(".uib_col_13").height(200);
    $(".uib_col_14").height(220);
    $(".uib_col_15").height(200);
    $(".uib_col_16").height(220);
    $(".uib_col_17").height(200);
    $(".uib_col_18").height(220);
    $(".uib_col_30").height(200);
    $(".uib_col_31").height(220);
    // select
    $("#sel_horas").css('width', 100);
    $(".uib_w_399").hide(); // #sel-temp-porta-analogico
    $(".uib_w_400").hide(); // pullup

    $(".uib_w_263").hide(); //#sel-meus-sensores
    // readonly id_alerta
    //$("#text-alerta-id").prop("readonly", true);
    $("#text-alerta-id").css('width', 100);
    //$("#text-alerta-data").prop("readonly", true);
    //$("#text-alerta-mensagem").prop("readonly", true);
    // esconde botoes da tela info
    $("#btn_status_anterior").hide();
    $("#btn_status_proximo").hide();
    $("#text-cmd-orientacoes").hide();
    document.getElementById('img-lamp-rele-g').html='';
    document.getElementById('text-ss-rele').innerHTML='';


    document.getElementById('txt-data').value = moment().format('YYYY-MM-DD');
    document.getElementById('txt-data').min = '2015-11-01';
    document.getElementById('txt-data').max = moment().format('YYYY-MM-DD');

    list.innerHTML +="<BR>Lendo configuração";
    getMainConfig(0);
    //atualiza_dados();
    //    createGraphs();
    //    testarBotoesModulo();
    //refreshTimer=setInterval('atualiza_dados()', 10000, true);
    moment.locale("pt-BR");
    $('#api_key').prop('readonly', true);
    $("#api_key").css({
        'background-color': '#FFFEEE'
    });
    $('#canal').prop('readonly', true);
    $("#canal").css({
        'background-color': '#FFFEEE'
    });

    /*      var hash = CryptoJS.MD5("45.55.77.192,TS0,3");
        app.consoleLog("hash",hash.toString(CryptoJS.enc.Hex));
        var s=hash.toString(CryptoJS.enc.Hex);
        document.getElementById("chave").value=s;
    */
    $(".uib_w_375").hide(); // DB develop

    $("#af-checkbox-s-temp").prop('disabled', true);
    $("#af-checkbox-s-corrente").prop('disabled', true);
    $("#af-checkbox-s-alimentacao").prop('disabled', true);
    $("#af-checkbox-s-rele").prop('disabled', true);
    $("#af-checkbox-s-extra").prop('disabled', true);
    $("#af-checkbox-s-extra-2").prop('disabled', true);
    $("#af-checkbox-s-humidade").prop('disabled', true);
    $("#af-checkbox-s-seco").prop('disabled', true);
    $("#af-checkbox-s-modbus").prop('disabled', true);
    $("#af-checkbox-s-wifi").prop('disabled', true);
    $("#af-checkbox-credenciais").prop('checked',true);

    document.getElementById('text-about').innerHTML='Site: www.sensoronline.net<br>';
    document.getElementById('text-about').innerHTML +='Email: contato@sensoronline.net';

    list.innerHTML +="<BR>Up...";

    //var plugins = cordova.require("cordova/plugin_list").metadata;
    //alert("plugins: " +JSON.stringify(plugins) );

}


/*
//  RECURSOS
#define REC_CORRENTE_30A 0
#define REC_CORRENTE_100A 1
// temperatura
// 000 sem sensor temp
// 001 LM35
// 010 DHT11
// 011 DS18B20
// 100 DS18B20 segundo sensor
#define REC_LM35          0b000100
#define REC_DHT11         0b001000
#define REC_DS18B20       0b001100
#define REC_DS18B20_EXTRA 0b010000
#define REC_DS18B20_EXTRA_2 5
#define REC_LED1 6
#define REC_LED2 7
#define REC_LED3 8
#define REC_BOTAO 9
#define REC_ALIMENTACAO 10  // alimentação da rede
#define REC_SENSOR_ANALOGICO 11
#define REC_SENSOR_9 12 // PIR, sensor de contato, digital 0 ou 1
#define REC_SENSOR_10 13 // PIR, sensor de contato, digital 0 ou 1
#define REC_ULTRASOM 14
// rele
#define REC_RELE 15
#define REC_WIFI 16
#define REC_ETHERNET 17
#define REC_MODBUS 18
#define REC_NRF24L01 19
#define REC_SENSOR_SECO 20
*/
var rec_corrente_30a, rec_corrente_100a;
var rec_lm35, rec_dht11, rec_ds18b20, rec_temperatura, rec_humidade;
var rec_temperatura2, rec_ds18b20_extra, rec_temperatura3;
var rec_sensor_analogico;
var rec_rele, rec_led1, rec_led2, rec_led3, rec_alimentacao, rec_botao;
var rec_ethernet, rec_wifi, rec_modbus, rec_sensor_seco, rec_sensor_analogico;

function define_recuros() {
    var recursos = parseInt(json_config.canal.recursos);
    app.consoleLog(">recursos=" + recursos, recursos.toString(16));
    rec_ethernet=false;
    rec_wifi=false;
    if ((recursos & 1<<16)) {
        rec_wifi=true;
    }
    if ((recursos & 1<<17)) {
        rec_ethernet=true;
    } 
    // CORRENTE 30A
    $("#btn-s-corrente").hide();
    if ((recursos & 0x0001) == 0x0001) {
        rec_corrente_30a = true;
        $("#btn-s-corrente").show();
    } else {
        rec_corrente_30a = false;
    }
    // CORRENT 100a
    if ((recursos & 0x0002) == 0x0002) {
        rec_corrente_100a = true;
        console.log("corrente_100A");
        $("#btn-s-corrente").show();
    } else {
        rec_corrente_100a = false;
    }
    // TEMPERATURA
    rec_humidade=false;
    var temp = recursos & 0x000C;
    if (temp > 0) {
        rec_temperatura = true;
        if (temp == 0x0004)
            rec_lm35 = true;
        else
            rec_lm35 = false;

        if (temp == 0x0008) {
            rec_dht11 = true;
            rec_humidade = true;
        } else
            rec_dht11 = false;

        if (temp == 0x000C)
            rec_ds18b20 = true;
        else
            rec_ds18b20 = false;
    } else {
        rec_temperatura = false;
    }

    // TEMPERATURA EXTRA DS18B20
    if ((recursos & 0x10) == 0x10) {
        rec_temperatura2 = true;
        rec_ds18b20_extra = true;
    } else {
        rec_temperatura2 = false;
        rec_ds18b20_extra = false;
    }

    // TEMPERATURA EXTRA DS18B20 2
    if ((recursos & 0x20) == 0x20) {
        rec_temperatura3 = true;
    } else {
        rec_temperatura3 = false;
    }

    // SENSOR_ANALOGICO
    if ((recursos & 0x0800) == 0x0800) {
        rec_sensor_analogico = true;
    } else {
        rec_sensor_analogico = false;
    }

    // RELE
    if ((recursos & 0x8000) == 0x8000) {
        rec_rele = true;
        $("#btn-s-rele").show();
    } else {
        rec_rele = false;
        //$("#btn-s-rele").hide();
        $("#btn-s-rele").css('display','none');
    }
    // BOTAO
    if ((recursos & 0x200) == 0x200)
        rec_botao = true;
    else
        rec_botao = false;
    // ALIMENTACAO
    if ((recursos & 0x400) == 0x400) {
        rec_alimentacao = true;
    } else {
        rec_alimentacao = false;
    }
//#define REC_ETHERNET 17
    if (recursos & (1 << 17)) {
        rec_ethernet=true;
        console.log("ETHERNET");
        //$("#btn-wifi-principal").hide();
        $('#ssid,#passwd').each(function(){
            $(this).prop('readonly', true);
            $(this).css({'background-color': '#FFFEEE'});
        });

        } else {
        $('#ssid,#passwd').each(function(){
            $(this).prop('readonly', false);
            $(this).css({'background-color': '#FFFFFF'});
        });
        //$("#btn-wifi-principal").show();
    }
//#define REC_MODBUS   18
    if (recursos & (1 << 18)) {
        rec_modbus=true;
    } else {
        rec_modbus=false;

    }
//#define REC_NRF24L01   19
    if (recursos & (1 << 19)) {
        $("#sel-endereco-TS").prop('disabled', false);
        $("#sel-endereco-TS").css({'background-color': '#FFFFFF'});
    } else {
        $("#sel-endereco-TS").prop('disabled', 'disabled');
        $("#sel-endereco-TS").css({'background-color': '#FFFEEE'});

    }
//#define REC_SENSOR_SECO   20
    if (recursos & (1 << 20)) {
        rec_sensor_seco=true;
    } else {
        rec_sensor_seco=false;

    }
//#define REC_SENSOR_ANALOGICO
    if (recursos & (1 << 11)) {
        rec_sensor_analogico=true;
    } else {
        rec_sensor_analogico=false;

    }
}

