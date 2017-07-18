/*********************************************************************/
function atualizaGrafico(objG, div, campo) {
    //console.log(">atualizaGrafico");
    var recursos = parseInt(json_config.canal.recursos);
    objG.loadData();
    if (div === null) return;
    //var d= new Date(g3.created_at);
    var d = moment(new Date(objG.created_at));
    var txt = '';
    var minmax = '';
    var offline = '';

    if (objG.message != undefined && objG.message != '') {
        document.getElementById(div).innerHTML = '<div align="center" style="size:6;color:red">' + objG.titulo + ':' + objG.message + '</div>';
        return;
    }

    if (objG.created_at != undefined) {
        if (objG.id_div != "chart1_div") txt = "Atualizado &agrave;s ";
        txt = txt + d.format('DD/MM/YYYY HH:mm:ss')
    }

    if (objG.offline_at != false) {
        offline = '<div style="color:red">[' + objG.offline_at + ']</div>';
        //$("#"+div).css('color','red');
    }
    if (campo <= MAX_CAIXA_SENSORES && objG.min[campo] != undefined) {
        var mi = parseFloat(objG.min[campo]);
        var ma = parseFloat(objG.max[campo]);
        minmax = "<br>min=" + mi.toFixed(1) +
            "&nbsp;&nbsp;m&aacute;x=" + ma.toFixed(1);
    }


    document.getElementById(div).innerHTML = txt +
        //        d.format('LLL')+
        minmax + offline + objG.message;
    // testa se tem rele no modulo principal
    if ((recursos & (1 << 15)) > 0)
        if (json_feed.feeds[0] !== undefined &&
            json_feed.feeds[0].chave1 !== undefined) {
            var status = json_feed.channel.status;
            var ch = parseInt(json_feed.feeds[0].chave1) >> 4;
            CHAVE1 = ch;

            //console.log("chave1=" + CHAVE1+ "  status=" + status);
            if (status == 0)
                document.getElementById('text-rele-text').innerHTML = '';
            else {
                document.getElementById('text-rele-text').innerHTML = json_feed.channel.status_msg;
            }
            document.getElementById('img-lamp-rele-g').innerHTML = 'Remoto';
            document.getElementById('text-ss-rele').innerHTML = 'Remoto';
            if (CHAVE1 == 1) {
                document.getElementById('img-lamp-rele').src = "images/lamp_on.png";
                $("#btn-ss-rele-estado").css('background', 'green');
            } else
            if (CHAVE1 == 0) {
                document.getElementById('img-lamp-rele').src = "images/lamp_off.png";
                $("#btn-ss-rele-estado").css('background', 'white');
            }
        }
}
/*********************************************************************/
/*  Global  */
/*********************************************************************/
function t_telaTS_global() {
    //  console.log(">t_telaTS_global");
    var sens, aux, ggativo, _div;
    //lerSensorSeco("seco_div");
    for (var i = 1; i <= MAX_CAIXA_SENSORES + 1; i++) {
        //console.log(">t_telaTS_global i=" + i);
        if (gg1[i] != undefined) {
            atualizaGrafico(gg1[i], "text_pag_" + i, i);
        }
        if (gg2[i] != undefined) {
            gg2[i].loadData();
        }
    }
    gtext[0].loadData();

    if (flag_getMainConfig) {
        /* BEGIN Localiza o visivel */
        sens = 0;
        aux = 1;
        ggativo = 0;
        while (aux <= MAX_CAIXA_SENSORES && sens == 0) {
            _div = "#chart1" + aux + '_div';
            if ($(_div).css('display') == 'block') {
                sens = aux;
            }
            if (ggativo == 0 && gg1[aux] != undefined && gg1[aux].ativo == true) {
                ggativo = aux;
            }

            aux++;
        }

        if (sens == 0 && ggativo > 0)
            sens = ggativo;

        if (sens > 0) {
            if (gg1[sens] == undefined) {
                $('#chart1' + sens + "_div").css("display", "none");
                $('#chart2' + sens + "_div").css("display", "none");
                $('#text_pag_' + sens).css("display", "none");
            }
            if (gg1[sens] == undefined || gg1[sens].ativo == false) {
                sens = 0;
                for (aux = 1; aux <= MAX_CAIXA_SENSORES; aux++) {
                    $('#chart1' + aux + "_div").css("display", "none");
                    $('#chart2' + aux + "_div").css("display", "none");
                    $('#text_pag_' + aux).css("display", "none");
                    if (gg1[aux] != undefined && gg1[aux].ativo == true && sens == 0)
                        sens = aux;
                }

            }
        }
        if (sens > 0) {
            $('#chart1' + sens + '_div').css("display", "block");
            $('#chart2' + sens + '_div').css("display", "block");
            $('#text_pag_' + sens).css("display", "block");
        } else {
            if ($("#uib_page_seco").is(":hidden")) {
                console.log("#uib_page_seco HIDDEN");
            }
            if (rec_sensor_seco)
                activate_subpage("#uib_page_seco");
        }
        //    flag_getMainConfig=false;
    }


    /* END Localiza o visivel */

    if (g3 != undefined && g3.ativo == true) {
        atualizaGrafico(g3, "text_pag_10", 6);
        atualizaGrafico(g4, null, 1);
        gtext[1].loadData();
    }
    if (g5 != undefined && g5.ativo == true) {
        atualizaGrafico(g5, "text_pag_11", 6);
        atualizaGrafico(g6, null, 1);
        gtext[2].loadData();
    }
    for (var i = 0; i < MAX_NODES; i++) {
        //console.log(">t_telaTS_temperatura i=" + i);
        if (gm1[i][1] != undefined) {
            for (var n = 1; n <= MAX_NODES_SENSORES; n++) {
                if (gm1[i][n] != undefined) {
                    //                if (gm1[i][n] != undefined && gm1[i][n].ativo == true) {
                    //console.log(">><< n="+n);
                    var cp = i + 1;
                    atualizaGrafico(gm1[i][n], "text-mod" + cp, 1);
                    gm2[i][n].loadData();
                }
            }
            gt[i].loadData();
        }
    }


}
/**************************************************************/

/**************************************************************/


function telaTS_global() {
    var chartx1, chartx2, chart;
    var field_ocultar;
    var n_div = 3;
    var pagina = '';
    app.consoleLog("telaTS_global", "entry");
    if (true || gg1[1] == undefined) {
        var nome_campo, ncampo, recursos;
        var max, min;
        recursos = jsonPath(json_config, "$.canal.recursos");
        for (ncampo = 1; ncampo <= MAX_CAIXA_SENSORES; ncampo++) {
            chartx1 = 'chart1' + ncampo + '_div';
            chartx2 = 'chart2' + ncampo + '_div';
            nome_campo = jsonPath(json_config, "$.canal.field" + ncampo);
            field_ocultar = parseInt(json_config.canal.field_ocultar);
            if (isNaN(field_ocultar))
                field_ocultar = 0;
            if (nome_campo == null) {
                nome_campo = 'sem_nome';
            }
            max = parseInt(jsonPath(json_config, "$.canal.field" + ncampo + "_max"));
            min = parseInt(jsonPath(json_config, "$.canal.field" + ncampo + "_min"));
            console.log("max=" + max + " min=" + min);
            gg1[ncampo] = new runGraph(0, chartx1, pagina, nome_campo, 200, 200, [{
                    nome: nome_campo,
                    campo: ncampo
            }],
                null,
                1, 1, min, max, true);
            gg2[ncampo] = new runGraph(2, chartx2, pagina, nome_campo, 280, 200, [{
                        nome: nome_campo,
                        campo: ncampo
                },
                    {
                        nome: "min",
                        campo: 100
                },
                    {
                        nome: "max",
                        campo: 101
                }],
                null,
                Cookies["nro_pontos"], Cookies["passo"], 20, 1, min, max, false);
            if ((field_ocultar & (1 << ncampo)) > 0) {
                gg1[ncampo].ativo = false;
            } else {
                gg1[ncampo].ativo = true;
            }
        }
        gtext[0] = new lerMensagensSensor(null, 'text_pag_2_2');
    }
    /*
     * CORRENTE
     */
    if (rec_corrente_30a == true || rec_corrente_100a == true) {
        console.log("rec_corrente campo1=" + Cookies["campo1"]);

        // testa se mostra campos de enegia
        var opt = [];
        field_ocultar = parseInt(json_config.canal.field_ocultar);
        for (var ll = 2; ll < 5; ll++) {
            var obj = {
                nome: Cookies["campo" + ll],
                campo: ll
            };
            if ((field_ocultar & (1 << ll)) == 0) {
                opt.push(obj);
            }
        }
        if (opt.length > 0) {



            max = Math.ceil((parseInt(json_config.canal.field1_max) + 100) / 100) * 100;
            min = parseInt(json_config.canal.field1_min);
            //console.log("corrente min="+min);
            if (isNaN(min) == false)
                if (min < 0) {
                    min = Math.floor((min - 200) / 100) * 100;
                } else min = 0;

                //max = parseInt(json_config.canal.field1_max);
                //min = parseInt(json_config.canal.field1_min);
            g3 = new runGraph(0, 'chart' + n_div + '_div', 'uib_page_10', 'Consumo', 200, 200, [{
                    nome: Cookies["campo1"],
                    campo: 1
            }],
                null,
                1, 1, min, max, true, 't2');
            n_div++;
            g4 = new runGraph(2, 'chart' + n_div + '_div', 'uib_page_10', 'Historio', 280, 200, [{
                        nome: Cookies["campo1"],
                        campo: 1
                },
                    {
                        nome: "min",
                        campo: 100
                },
                    {
                        nome: "max",
                        campo: 101
                }],

                null,
                Cookies["nro_pontos"], Cookies["passo"], min, max, true);
            gtext[1] = new lerMensagensSensor(null, "text_pag_10_2", 1);
            n_div++;
            g5 = new runGraph(3, 'chart' + n_div + '_div', 'uib_page_11', 'Fases', 200, 200, opt,
                /*[{
                        nome: Cookies["campo2"],
                        campo: 2
            },
                    {
                        nome: Cookies["campo3"],
                        campo: 3
            },
                    {
                        nome: Cookies["campo4"],
                        campo: 4
            }],*/
                null,
                3, 1, 1, 1, true, 't3');
            n_div++;
            g6 = new runGraph(1, 'chart' + n_div + '_div', 'uib_page_11', 'Fases', 280, 200, opt,
                /*[{
                                      nome: Cookies["campo2"],
                                       campo: 2
                           },
                                   {
                                       nome: Cookies["campo3"],
                                       campo: 3
                           },
                                   {
                                       nome: Cookies["campo4"],
                                       campo: 4
                           }],*/
                null,
                Cookies["nro_pontos"], Cookies["passo"], min, max, true);
            gtext[2] = new lerMensagensSensor(null, "text_pag_11_2", 1);        } // if (opt.length >0)
    }


    if (rec_sensor_seco == true)
        gg1[9] = new lerSensorSeco("chart19_div");
    else {
        gg1[9] = undefined;
        $("#chart19_div").css("display", "none");
    }

    document.addEventListener("app.Get_Feed", t_telaTS_global, false);
    app.consoleLog("<telaTS_global", "exit");

}


/*********************************************************************/
var flag_getMainConfig = false;
var flag_createGraphs = false;

function createGraphs() {
    app.consoleLog("createGraph", "entry  flag_createGraphs=" + flag_createGraphs + " flag_getMainConfig=" + flag_getMainConfig);

    app.consoleLog("tela=" + Cookies["tela_layout"]);
    if (Cookies["tela_layout"] == undefined)
        Cookies.create("tela_layout", "1", 100);
    switch (Cookies["tela_layout"]) {
    case '0':
        telaTS_global();
        break;
    } // switch
    flag_createGraphs = true;
}
/********************************************************************/
//var gx1 = [];
//var gx2 = [];
var gt = [];

var gm1 = new Array(4);
var gm2 = new Array(4);

for (var i = 0; i < 4; i++) {
    gm1[i] = new Array(MAX_NODES_SENSORES);
    gm2[i] = new Array(MAX_NODES_SENSORES);
}


function createGraphx(_modulo) {
    var chartx1, chartx2, chart;
    var modulo = parseInt(_modulo);
    var pagina = '';
    app.consoleLog("createGraphX=" + modulo, "entry");
    if (gm1[modulo][1] == undefined) {
        var nome_campo, ncampo, recursos;
        var acampo = null;
        var n_mod = 1 + modulo;
        var num_mod = 6 + modulo;
        var max, min;
        var node;
        chart = 'chartx' + num_mod + '_div';
        node = '$.node' + n_mod;
        recursos = jsonPath(json_config, node + ".recursos");
        for (ncampo = 1; ncampo <= MAX_NODES_SENSORES; ncampo++) {
            chartx1 = 'chartx' + num_mod + "" + ncampo + '1_div';
            chartx2 = 'chartx' + num_mod + "" + ncampo + '2_div';
            nome_campo = jsonPath(json_config, node + ".field" + ncampo);
            if (nome_campo == null) {
                nome_campo = 'sem_nome';
            }
            if (acampo == null) acampo = ncampo;
            max = parseInt(jsonPath(json_config, node + ".field" + ncampo + "_max"));
            min = parseInt(jsonPath(json_config, node + ".field" + ncampo + "_min"));
            console.log("max=" + max + " min=" + min);
            gm1[modulo][ncampo] = new runGraph(0, chartx1, pagina, nome_campo, 200, 200, [{
                    nome: nome_campo,
                    campo: ncampo
            }],
                modulo,
                1, 1, min, max, true, "n" + n_mod + "" + ncampo);
            gm2[modulo][ncampo] = new runGraph(2, chartx2, pagina, nome_campo, 280, 200, [{
                        nome: nome_campo,
                        campo: ncampo
                },
                    {
                        nome: "min",
                        campo: 100
                },
                    {
                        nome: "max",
                        campo: 101
                }],
                modulo,
                Cookies["nro_pontos"], Cookies["passo"], 20, 1, min, max, false);
        }
        gt[modulo] = new lerMensagensSensor(modulo, chart, acampo);
    }
    app.consoleLog("<createGraphX=" + modulo, "entry");
}
/**********************************************************************/

/**********************************************************************/
