(function () {
    "use strict";
    /*
      hook up event handlers
    */

    function register_event_handlers() {
        $( document ).on( "pageshow", "#uib_page_seco", function() {
            getCoordinate();
        });


        /* button  Push */
        $(document).on("change", "#text-user-name", function (evt) {
            /* your code goes here */
            if (this.value == 'cap' || this.value == 'devx') {
                $(".uib_w_375").show();
            }else{
                $(".uib_w_375").hide(); // DB develop
            }
        });

        $(document).on("change", "#af-checkbox-database", function (evt) {
            if ($(this).is(":checked")) {
                DATABASE = 'DEV';
            } else {
                DATABASE = null;
            }
        });



        /* button  gravar wifi */
        $(document).on("click", ".uib_w_10", function (evt) {
            Cookies["ssid"] = document.getElementById("ssid").value;
            Cookies["passwd"] = document.getElementById("passwd").value;
            Cookies["proxy"] = document.getElementById("proxy").value;
            gravarConfiguracao('w', document.getElementById("text_wifi"));
        });

        /* button  btn_remote_config */
        $(document).on("click", "#btn_remote_config", function (evt) {
            gravarConfiguracao('u', document.getElementById("text_wifi"));
        });

        /* button  TS */
        $(document).on("click", ".uib_w_19", function (evt) {
            document.getElementById("text_ts").value = '';
            activate_subpage("#uib_page_6");
        });

        /* button  Inicio */


        /* button  AP */
        $(document).on("click", ".uib_w_16", function (evt) {
            document.getElementById("text_ap").value = '';
            activate_subpage("#uib_page_8");
        });

        /* button  WIFI */
        $(document).on("click", ".uib_w_18", function (evt) {
            activate_subpage("#uib_page_3");
            document.getElementById("text_ips").value = myIP[0];
        });

        /* button  Config */


        /* button  #btn_encode */
        $(document).on("click", "#btn_encode", function (evt) {
            var encodedString = Base64.encode(document.getElementById("en_entrada").value);
            console.log(encodedString);
            document.getElementById("en_saida").value = encodedString;
        });

        /* button  #btn_decode */
        $(document).on("click", "#btn_decode", function (evt) {
            var decodedString = Base64.decode(document.getElementById("en_entrada").value);
            document.getElementById("en_saida").value = decodedString;
        });

        /* button  #btn_gravar_ts */
        $(document).on("click", "#btn_gravar_ts", function (evt) {
            //Cookies["api_key"] = document.getElementById("api_key").value;
            //Cookies["canal"] = document.getElementById("canal").value;
            Cookies["nro_pontos"] = document.getElementById("nro_pontos").value;
            Cookies["inatividade"] = document.getElementById("inatividade").value;
            Cookies['tempo_ler_corrente'] = document.getElementById("tempo_ler_corrente").value;
            Cookies['contador_enviar_web'] = document.getElementById("contador_enviar_web").value;
            gravarConfiguracao('t', document.getElementById("text_ts"));
        });


        /* button  #btn_gravar_ap */
        $(document).on("click", "#btn_gravar_ap", function (evt) {
            Cookies["ap_ssid"] = document.getElementById("ap_ssid").value;
            Cookies["ap_passwd"] = document.getElementById("ap_passwd").value;
            Cookies["ap_canal"] = document.getElementById("ap_canal").value;
            Cookies["ap_cripto"] = document.getElementById("ap_cripto").value;
            gravarConfiguracao('a', document.getElementById("text_ap"));
        });


        /* button  Config */
        $(document).on("click", ".uib_w_6", function (evt) {
            document.getElementById("text_config").innerHTML = '';
            activate_subpage("#uib_page_5");
        });

        /* button  #btn_info */
        $(document).on("click", "#btn_info", function (evt) {
            var recursos=parseInt( json_config.canal.recursos);
            activate_subpage("#uib_page_info");
            lerStatus('alertas', "pag_info_status");
            $("#text_info_modelo").html('APP Tsensor ' + VERSAO.MAJOR + '.' + VERSAO.MINOR + ' ' + VERSAO.DATE + "<BR>");
            if (json_config != null && json_config.canal.recursos != undefined) {
                $("#text_info_modelo").append('Recursos:' + recursos.toString(16) + '<BR>');
            }
            for (var m = 1; m <= MAX_NODES; m++) {
                var v_str = jsonPath(json_config, "$.node" + m + ".recursos");
                if (v_str != false) {
                    $("#text_info_modelo").append('Módulo ' + m + ':' + v_str + '<BR>');
                }

            }
            $("#text_info_modelo").append('AP=' + json_feed.channel.ip0 + '<br>');
            $("#text_info_modelo").append('STA=' + json_feed.channel.ip1);
            $("#text_info_modelo").append(json_feed.channel.updated_ip_at + '(atualizado)<br>');


            $("#text_info_modelo").append('Platform:' + device.platform + '<BR>');
            $("#text_info_modelo").append('Model:' + device.model + '<BR>');
            $("#text_info_modelo").append('Version:' + device.version + '<BR>');
            $("#text_info_modelo").append('UUID:' + device.uuid + '<BR>');
            $("#text_info_modelo").append('Cordova:' + device.cordova + '<BR>');
        });

        /* button  #btn_ler_status */
        $(document).on("click", "#btn_ler_status", function (evt) {
            pagina_status = 0;
            lerStatus('alertas', "pag_info_status");
        });
/***********************************************************************************************/
        // click no gauge
        $('#chart11_div, #chart12_div, #chart13_div, #chart14_div, #chart15_div, #chart16_div, #chart17_div, #chart18_div,#chart19_div').click(function() {
            var _div=this.id;
            var flag_seco=false;
            var sensor=_div.substr(6,1);    //  numero do sensor
            var div_12=_div.substr(5,1);
            var aux = (sensor % (MAX_CAIXA_SENSORES+1)) + 1;
            var _div2 = 'chart2' + sensor + "_div";
            var _text = 'text_pag_' + sensor;
            var ativo;

            if (div_12==2) {
                click_no_gauge(0);
            } else {
                if ((aux==sensor || aux==MAX_CAIXA_SENSORES+1)&& rec_sensor_seco) {
                            activate_subpage("#uib_page_seco");
                            flag_seco=true;
                            aux=1;
                }
                if (aux==MAX_CAIXA_SENSORES+1 && rec_sensor_seco==false) {
                    aux=1;
                }
                if (gg1[aux] != undefined) {
                    ativo=gg1[aux].ativo;
                    while (ativo == false) {
                        aux = (aux % (MAX_CAIXA_SENSORES+1)) + 1;
                        if (gg1[aux] != undefined)
                            ativo=gg1[aux].ativo;
                    }
                    $('#'+_div).css("display", "none");
                    $('#'+_div2).css("display", "none");
                    $('#'+_text).css("display", "none");
                    $('#chart1' + aux +"_div").css("display", "block");
                    $('#chart2' + aux +"_div").css("display", "block");
                    $('#text_pag_' + aux).css("display", "block");
                    gtext[0].loadData();

                    if (aux == 1 && flag_seco==false) {   // voltou ao inicio
                        if (rec_corrente_30a == true || rec_corrente_100a == true) { // Temperatura 2
                            if (g3.sem_dados == true)
                            mensagemTela("Sem dados", "Corrente");
                        else {
                            gtext[1].loadData();
                            activate_subpage("#uib_page_10");
                            }
                        }

                    }
                } else {
                    click_no_gauge(0);
            }

            }
        });

/***********************************************************************************/
        $(document).on("click", "#chart3_div", function (evt) {
            if (Cookies["tela_layout"] == "0") // Temperatura
                if (rec_corrente_30a == true || rec_corrente_100a == true) {
                        gtext[2].loadData();
                    activate_subpage("#uib_page_11");
                }else {
                    if (rec_temperatura3 == false) {
                    console.log("#uib_page_2");
                    gtext[0].loadData();
                    activate_subpage("#uib_page_2");
                    } else {
                    console.log("#uib_page_2");
                    gtext[2].loadData();
                    activate_subpage("#uib_page_11");                        
                    }
                } else
            if (Cookies["tela_layout"] == "1") {// TGG
                gtext[1].loadData();
                activate_subpage("#uib_page_10");
            }else {
                //       atualizaGrafico(g5,"text_pag_11");
                gtext[2].loadData();
                activate_subpage("#uib_page_11");
            }
        });
        $(document).on("click", "#chart5_div", function (evt) {
            activate_subpage("#uib_page_2");
        });
/***********************************************************************************************/
        // click no gauge
        $('#chartx611_div, #chartx612_div, #chartx621_div, #chartx631_div, #chartx641_div, #chartx651_div, #chartx661_div, #chartx671_div, #chartx681_div, #chartx711_div, #chartx712_div, #chartx721_div, #chartx731_div, #chartx741_div, #chartx751_div, #chartx761_div, #chartx771_div, #chartx781_div, #chartx811_div, #chartx812_div, #chartx821_div, #chartx831_div, #chartx841_div, #chartx851_div, #chartx861_div, #chartx871_div, #chartx881_div, #chartx911_div, #chartx912_div, #chartx921_div, #chartx931_div, #chartx941_div, #chartx951_div, #chartx961_div, #chartx971_div, #chartx981_div').click(function() {
            var _div=this.id;
            var n_mod=_div.substr(6,1);    //  6
            var modulo=parseInt(n_mod) - 6;
            var sensor=parseInt(_div.substr(7,1));
            var div_12=_div.substr(8,1);
            var aux = (sensor % MAX_NODES_SENSORES) + 1;
            var _div2 = 'chartx' + n_mod + ''+ sensor + "2_div";
            var ativo;
            if (div_12==2) {
                click_no_gauge(modulo+1);
            } else {
                if (gm1[modulo][aux] != undefined) {
                    ativo=gm1[modulo][aux].ativo;
                    while (ativo == false) {
                        aux = (aux % MAX_NODES_SENSORES) + 1;
                        ativo=gm1[modulo][aux].ativo;
                    }
                    $('#'+_div).css("display", "none");
                    $('#'+_div2).css("display", "none");
                    $('#chartx' + n_mod +'' + aux +"1_div").css("display", "block");
                    $('#chartx' + n_mod +'' + aux +"2_div").css("display", "block");
                    gt[modulo].loadData(gm1[modulo][aux].series[0].campo);
                } else {
                    click_no_gauge(modulo+1);
            }

            }
        });
/***********************************************************************************************/

        /* button  #btn_home */
        $(document).on("click", "#btn_home", function (evt) {
            /* your code goes here */
            var flag = rec_temperatura || rec_sensor_analogico;
                if (rec_sensor_seco && !flag)
                    activate_subpage("#uib_page_seco");
                else
                    activate_subpage("#uib_page_2");
        });


        /* button  #btn_mod1 */
        $(document).on("click", "#btn_mod1", function (evt) {
            activate_subpage("#uib_page_mod1");
        });

        /* button  #btn_mod2 */
        $(document).on("click", "#btn_mod2", function (evt) {
            activate_subpage("#uib_page_mod2");
        });

        /* button  #btn_mod3 */
        $(document).on("click", "#btn_mod3", function (evt) {
            activate_subpage("#uib_page_mod3");
        });

        /* button  #btn_inicio_mod */


        $(document).on("change", "#af-campo-6", function (evt) {
            //         Cookies.create("flag-campo6",this.checked,10*365);
            testarBotoesModulo();
        });

        $(document).on("change", "#af-campo-7", function (evt) {
            Cookies.create("flag-campo7", this.checked, 10 * 365);
            testarBotoesModulo();
        });

        $(document).on("change", "#af-campo-8", function (evt) {
            Cookies.create("flag-campo8", this.checked, 10 * 365);
            testarBotoesModulo();
        });

        $(document).on("change", "#af-campo-9", function (evt) {
            Cookies.create("flag-campo9", this.checked, 10 * 365);
            testarBotoesModulo();
        });
        /* button  page_9 */


        /* button  #btn_scan */
        $(document).on("click", "#btn_scan", function (evt) {
            barcodeScanned(evt);
        });

        /* button  #btn_ler_config_web */
        $(document).on("click", "#btn_let_config_web", function (evt) {
            var modelo = document.getElementById("modelo").value;
            var serie = document.getElementById("serie").value;
            var chave = document.getElementById("chave").value;
            console.log("btn_let_config_web  serie=" + serie);
            document.getElementById("text_config").innerHTML = "";
            if (modelo != '' && serie != '' && chave != '') {
                document.getElementById("text_config").innerHTML = "pesquisando servidor...";
            console.log("pesquisando servidor..." );
                localDB.modelo=modelo;
                localDB.serie= serie;
                localDB.chave=chave;
                getMainConfig(0);
            } else
                mensagemTela("Falta dados", "Informe modelo/serie/chave");

        });

        /* button  #btn_ler_barcode */
        $(document).on("click", "#btn_ler_barcode", function (evt) {
            barcodeScanned(evt);
        });

        /* button  #btn_status_anterior */
        $(document).on("click", "#btn_status_anterior", function (evt) {
            pagina_status = pagina_status - 10;
            if (pagina_status < 0)
                pagina_status = 0;
            lerStatus('alertas', "pag_info_status");
        });

        /* button  #btn_status_proximo */
        $(document).on("click", "#btn_status_proximo", function (evt) {
            pagina_status = pagina_status + 10;
            lerStatus('alertas', "pag_info_status");
        });


        /* button  Enviar TS */
        $(document).on("click", ".uib_w_101", function (evt) {
            prog_wifi();
        });

        /* button  #btn_browser */
        $(document).on("click", "#btn_browser", function (evt) {
            var url = 'http://192.168.4.1';
            $("text_wifi").html(url);
            window.open(url, '_blank', '');
        });

        /* button  #btn_prog_wifi */
        $(document).on("click", "#btn_prog_wifi", function (evt) {
            prog_wifi();
        });

        /* button  #btn_reboot_ts */
        $(document).on("click", "#btn_reboot_ts", function (evt) {
            prog_reboot_ts();
        });

        /* button  #btn_ler_ip */
        $(document).on("click", "#btn_ler_ip", function (evt) {
            prog_ler_ip();
        });

        /* button  Sensor */
        $(document).on("click", ".uib_w_5", function (evt) {
            app.consoleLog("recursos=", json_config.canal.recursos);

            // corrente
            if (rec_corrente_30a || rec_corrente_100a)
                document.getElementById("af-checkbox-s-corrente").checked = true;
            else
                document.getElementById("af-checkbox-s-corrente").checked = false;
            // TEMPERATURA
            document.getElementById("af-checkbox-s-temp").checked = rec_temperatura;
            // Alimentacao
            document.getElementById("af-checkbox-s-alimentacao").checked = rec_alimentacao;
            // Rele/chave
            document.getElementById("af-checkbox-s-rele").checked = rec_rele;
            // TEMPERATURA EXTRA DS18B20
            document.getElementById("af-checkbox-s-extra").checked = rec_temperatura2;
            // TEMPERATURA EXTRA DS18B20 2
            document.getElementById("af-checkbox-s-extra-2").checked = rec_temperatura3;
            // HUMIDADE
            document.getElementById("af-checkbox-s-humidade").checked = rec_humidade;
            activate_subpage("#sub-page-sensor-main");
            // SENSOR ANALOGICO
            document.getElementById("af-checkbox-s-analogico").checked = rec_sensor_analogico;
            // WIFI
            document.getElementById("af-checkbox-s-wifi").checked = rec_wifi;
            // ModBus
            document.getElementById("af-checkbox-s-modbus").checked = rec_modbus;
            // Sensor seco
            document.getElementById("af-checkbox-s-seco").checked = rec_sensor_seco;
            activate_subpage("#sub-page-sensor-main");
        });

        /* button  #btn-s-temp */
        $(document).on("click", "#btn-s-temp", function (evt) {
            document.getElementById("text-s-temp").innerHTML = "";
            activate_subpage("#sub-page-sensor-temp");
        });

        /* button  #btn-s-s-temp */
        $(document).on("click", "#btn-s-s-temp", function (evt) {
            var opt = $("#sel-temp option:selected").val();
            opt = parseInt(opt);
            var valor = parseFloat(document.getElementById("text-s-vcc").value);
            if (isNaN(valor)) {
                document.getElementById("text-s-temp").innerHTML = "Ajuste invalido";
                return;
            }

            valor = parseFloat(document.getElementById("text-s-temp-min").value);
            if (isNaN(valor) && document.getElementById("text-s-temp-min").value !='') {
                document.getElementById("text-s-temp").innerHTML = "Minimo invalido";
                return;
            }

            valor = parseFloat(document.getElementById("text-s-temp-max").value);
            if (isNaN(valor)) {
                document.getElementById("text-s-temp").innerHTML = "Maximo invalido";
                return;
            }
            document.getElementById("text-s-temp").innerHTML = "";
            console.log(">btn-s-s-temp " + opt)
            if (opt == 0) {
                gravarConfiguracaoSensor('t5', document.getElementById("text-s-temp"));
            }
            // temp 2
            if (opt == 1) {
                gravarConfiguracaoSensor('t6', document.getElementById("text-s-temp"));
            }
            if (opt == 2) {
                gravarConfiguracaoSensor('t7', document.getElementById("text-s-temp"));
            }
            if (opt == 3) {
                gravarConfiguracaoSensor('t8', document.getElementById("text-s-temp"));
            }
        });

        $(document).on("change", "#sel-temp", function (evt) {
            /* your code goes here */
            //var opt = $("#sel-temp option:selected").index();
            var idx,aux;
            var opt = $("#sel-temp option:selected").val();
            opt=parseInt(opt);
            // (#sel-temp-porta-analogico)
            $(".uib_w_399").hide();
            $(".uib_w_400").hide();

            if (opt==1 && rec_temperatura2 == false && rec_humidade == false) {
                document.getElementById("text-s-temp").innerHTML = "Nao possui sensor extra";
                $("#sel-temp option:eq(0)").prop('selected', true);
                return;
            }
            if (opt==2 && rec_temperatura3 == false && rec_sensor_analogico == false) {
                document.getElementById("text-s-temp").innerHTML = "Nao possui sensor extra 2/sensor analogico";
                $("#sel-temp option:eq(0)").prop('selected', true);
                return;
            }
            if (opt==3 && rec_sensor_analogico == false) {
                document.getElementById("text-s-temp").innerHTML = "Nao possui sensor analogico";
                $("#sel-temp option:eq(0)").prop('selected', true);
                return;
            }
            if (opt >= 2  && rec_sensor_analogico == true) {
                idx=4-opt;
                aux=jsonPath(json_config,"$.canal.seco"+idx+"_tipo");
                document.getElementById('af-checkbox-pullup').checked = (aux & 0x01) == 0x01;
                aux = jsonPath(json_config,"$.canal.seco"+idx+"_porta");
                $('#sel-temp-porta-analogico option')[aux].selected = true;
                $(".uib_w_400").show();
                $(".uib_w_399").show();
            }
            document.getElementById("text-s-temp").innerHTML = "";
            opt = opt + 5;
            document.getElementById("text-s-vcc").value = jsonPath(json_config, "$.canal.ajuste"+opt);
            $("#text-s-temp-nome").val(jsonPath(json_config,"$.canal.field"+opt));
            document.getElementById("text-s-temp-min").value = jsonPath(json_config,"$.canal.field"+opt+"_min");
            document.getElementById("text-s-temp-max").value = jsonPath(json_config,"$.canal.field"+opt+"_max");
            if (json_config.canal.field_ocultar & (1<<opt)) {
                document.getElementById("af-checkbox-ocultar-temp").checked;
            }
        });

        $(document).on("change", "#sel-cmd", function (evt) {
            var opt = $("#sel-cmd option:selected").index();
            var npar=jsonPath(json_config, "$.comandos["+opt+"].par");
            var texto=jsonPath(json_config, "$.comandos["+opt+"].texto");

            app.consoleLog(opt, npar);
            if (npar < 3) {
                $("#text-s-par3").prop('disabled', true);
                $("#text-s-par3").css({
                    'background-color': '#FFFEEE'
                });
            } else {
                $("#text-s-par3").prop('disabled', false);
                $("#text-s-par3").css({
                    'background-color': '#FFFFFF'
                });
            }
            if (npar < 2) {
                $("#text-s-par2").prop('disabled', true);
                $("#text-s-par2").css({
                    'background-color': '#FFFEEE'
                });
            } else {
                $("#text-s-par2").prop('disabled', false);
                $("#text-s-par2").css({
                    'background-color': '#FFFFFF'
                });
            }
            if (npar < 1) {
                $("#text-s-par1").prop('disabled', true);
                $("#text-s-par1").css({
                    'background-color': '#FFFEEE'
                });
            } else {
                $("#text-s-par1").prop('disabled', false);
                $("#text-s-par1").css({
                    'background-color': '#FFFFFF'
                });
            }

            if (texto!=false && texto!=null) {
                $("#text-cmd-orientacoes").val(texto);
                $("#text-cmd-orientacoes").show();
            } else {
                $("#text-cmd-orientacoes").hide();
            }


        });

        $(document).on("change", "#sel_horas", function (evt) {
            var opt = $("#sel_horas option:selected").index();
            var hr = $("#sel_horas option:selected").text();
            if (opt == 0) r_horas = 2;
            if (opt == 1) r_horas = 6;
            if (opt == 2) r_horas = 24;
            if (opt == 3) r_horas = 48;
            
            if (isNaN(parseInt(hr)))
                r_horas=0;
            else
                r_horas=parseInt(hr);
            
            console.log("sel_horas opt="+opt+" val="+$("#sel_horas").val()+"  text="+$("#sel_horas option:selected").text()+ " pInt="+parseInt(hr));
            atualiza_dados();
        });

        // modulo 1 selecao do campo
        $(document).on("change", "#sel-mod1", function (evt) {
            var opt = $("#sel-mod1 option:selected").index();
            var v_str;
            var t = opt + 1;
            var node = "$.node1.field" + t;
            //            case 0: // temperatura  case 1: // sensor 2   case 2: // sensor 3
            v_str = jsonPath(json_config, node);
            if (v_str == false) return;
            $("#text-mod1-campo").val(v_str);
            v_str = jsonPath(json_config, node + "_min");
            $("#text-mod1-min").val(v_str);
            v_str = jsonPath(json_config, node + "_max");
            $("#text-mod1-max").val(v_str);
            $("#text-mod1-vcc").val(jsonPath(json_config, node + ".ajuste"+t));
        });

        // modulo 1 selecao do campo
        $(document).on("change", "#sel-mod2", function (evt) {
            var opt = $("#sel-mod2 option:selected").index();
            var v_str;
            var t = opt + 1;
            var node = "$.node2.field" + t;
            v_str = jsonPath(json_config, node);
            if (v_str == false) return;
            $("#text-mod2-campo").val(v_str);
            v_str = jsonPath(json_config, node + "_min");
            $("#text-mod2-min").val(v_str);
            v_str = jsonPath(json_config, node + "_max");
            $("#text-mod2-max").val(v_str);
            $("#text-mod2-vcc").val(jsonPath(json_config, node + ".ajuste"+t));
        });

        // modulo 1 selecao do campo
        $(document).on("change", "#sel-mod3", function (evt) {
            var opt = $("#sel-mod3 option:selected").index();
            var v_str;
            var t = opt + 1;
            var node = "$.node3.field" + t;
            v_str = jsonPath(json_config, node);
            if (v_str == false) return;
            $("#text-mod3-campo").val(v_str);
            v_str = jsonPath(json_config, node + "_min");
            $("#text-mod3-min").val(v_str);
            v_str = jsonPath(json_config, node + "_max");
            $("#text-mod3-max").val(v_str);
            $("#text-mod3-vcc").val(jsonPath(json_config, node + ".ajuste"+t));
        });

        // modulo 1 selecao do campo
        $(document).on("change", "#sel-mod4", function (evt) {
            var opt = $("#sel-mod4 option:selected").index();
            var v_str;
            var t = opt + 1;
            var node = "$.node4.field" + t;
            v_str = jsonPath(json_config, node);
            if (v_str == false) return;
            $("#text-mod4-campo").val(v_str);
            v_str = jsonPath(json_config, node + "_min");
            $("#text-mod4-min").val(v_str);
            v_str = jsonPath(json_config, node + "_max");
            $("#text-mod4-max").val(v_str);
            $("#text-mod4-vcc").val(jsonPath(json_config, node + ".ajuste"+t));
        });

        /* button  #btn_s_config */
        $(document).on("click", "#btn_s_config", function (evt) {
            activate_subpage("#sub-page-sensor-main");
        });

        /* button  #btn-s-corrente */
        $(document).on("click", "#btn-s-corrente", function (evt) {
            activate_subpage("#sub-page-sensor-corrente");
        });

        /* button  #btn-s-s-corrente */
        $(document).on("click", "#btn-s-s-corrente", function (evt) {
            var fases=0;
            //Cookies["fases"] = document.getElementById("text-s-fases").value;
            if (document.getElementById("af-checkbox-canal-1").checked == true) {
                fases = fases | 0x01;
            }
            if (document.getElementById("af-checkbox-canal-2").checked) {
                fases = fases | 0x02;
            }
            if (document.getElementById("af-checkbox-canal-3").checked) {
                fases = fases | 0x04;
            }
            if (document.getElementById("af-checkbox-canal-auto").checked == false) {
                fases = fases | 0x08;
            }
            console.log("fases="+fases);
            Cookies["fases"] = fases;
            //Cookies["campo1_min"] = document.getElementById("text-s-corrente-min").value;
            //Cookies["campo1_max"] = document.getElementById("text-s-corrente-max").value;
            if (document.getElementById("af-radio-s-127").checked)
                Cookies["tensao"] = '127';
            else
                Cookies["tensao"] = '220';
            gravarConfiguracaoSensor('r', document.getElementById("text-s-corrente"));
        });


        /* button  #btn-s-s-main */
        $(document).on("click", "#btn-s-s-main", function (evt) {
            /* your code goes here */
            gravarConfiguracaoSensor('m', document.getElementById("text-s-main"));
        });

        /* button  #btn-s-s-testar */
        $(document).on("click", "#btn-s-s-testar", function (evt) {
            /* your code goes here */
            if (confirm("Teste será enviado para email e celular salvos. Confirma ?"))
                gravarConfiguracaoSensor('t', document.getElementById("text-s-main"));
        });


        /* button  #btn_mod_extras */
        $(document).on("click", "#btn_mod_extras", function (evt) {
            var n_mod,aux;
            for (n_mod=6 ; n_mod<=9; n_mod++) {
            $('#chartx' + n_mod +'11_div').css("display", "block");
            $('#chartx' + n_mod +'12_div').css("display", "block");
              for (aux=2; aux<=MAX_NODES_SENSORES; aux++) {
                $('#chartx' + n_mod +'' + aux +"1_div").css("display", "none");
                $('#chartx' + n_mod +'' + aux +"2_div").css("display", "none");
              }
            }

            if ($("#btn_mod1").css("display") != "none")
                activate_subpage("#uib_page_mod1");
            else
            if ($("#btn_mod2").css("display") != "none")
                activate_subpage("#uib_page_mod2");
            else
                activate_subpage("#uib_page_mod3");
        });

        /* button  #btn-m-config */
        $(document).on("click", "#btn-m-config", function (evt) {
            activate_subpage("#uib_page_mod_config");
        });

        /* button  #btn-mod-salvar */
        $(document).on("click", "#btn-mod-salvar", function (evt) {
            // salva nodes
            gravarConfiguracaoSensor('n', document.getElementById("text-mod-text"));
        });

        /* button  #btn-s-cmd */
        $(document).on("click", "#btn-s-cmd", function (evt) {
            activate_subpage("#uib-page-cmd");
        });

        /* button  #btn-s-enviar-cmd */
        $(document).on("click", "#btn-s-enviar-cmd", function (evt) {
            gravarComandoTS(document.getElementById("text-cmd-text"));
        });

        /* button  #btn_mod4 */
        $(document).on("click", "#btn_mod4", function (evt) {
            activate_subpage("#uib_page_mod4");
        });

        $(document).on("change", "#af-checkbox-s-corrente", function (evt) {
            if ($(this).is(":checked")) {
                rec_corrente_30a = true;
            } else {
                rec_corrente_30a = false;
            }
        });

        $(document).on("change", "#af-checkbox-s-extra", function (evt) {
            if ($(this).is(":checked")) {
                rec_temperatura2 = true;
            } else {
                rec_temperatura2 = false;
            }
        });
        /* button  #btn-config-principal */
        $(document).on("click", "#btn-config-principal", function (evt) {
            /*global activate_subpage */
            activate_subpage("#uib_page_5");
        });

        /* button  #btn_login */
        $(document).on("click", "#btn_login", function (evt) {
            /*global activate_subpage */
            activate_subpage("#uib_page_13");
        });

        /* button  #btn-sign-in */
        $(document).on("click", "#btn-sign-in", function (evt) {
            /*global activate_subpage */
            activate_subpage("#uib_page_sign_in");
        });

        /* button  #btn-sign-up */
        $(document).on("click", "#btn-sign-up", function (evt) {
            /*global activate_subpage */
            activate_subpage("#uib_page_sign_up");
        });

        /* button  #btn-sign-in-limpar */
        $(document).on("click", "#btn-sign-in-limpar", function (evt) {
            /* your code goes here */
            $("#text-user-name").val('');
            $("#text-user-passwd").val('');
        });

        /* button  #btn-sign-in-entrar */
        $(document).on("click", "#btn-sign-in-entrar", function (evt) {
            /* your code goes here */
            signInServer('in');
        });


        $(document).on("change", "#text-email", function (evt) {
            var email = $("#text-email").val();
            if (validateEmail(email) == false) {
                navigator.notification.alert(email, alertDismissed,
                    'Email inválido.', 'Fechar');
            }
        });

        $(document).on("change", "#text-usuario", function (evt) {
            var usr = $("#text-usuario").val();
            if (validateUsuario(usr) == false) {
                navigator.notification.alert(usr, alertDismissed,
                    'Usuário inválido.', 'Fechar');
            }
        });


        $(document).on("change", "#text-senha-1", function (evt) {
            var passwd = $("#text-senha-1").val();
            var ret = validatePasswd(passwd);
            if (ret != true) {
                navigator.notification.alert(ret, alertDismissed,
                    'Senha inválida.', 'Fechar');
            }
        });


        $(document).on("change", "#text-senha-2", function (evt) {
            var passwd = $("#text-senha-2").val();
            var ret = validatePasswd(passwd);
            if (ret != true) {
                navigator.notification.alert(ret, alertDismissed,
                    'Senha inválida.', 'Fechar');
            }
        });

        /* button  #btn-limpar-cadastro */
        $(document).on("click", "#btn-limpar-cadastro", function (evt) {
            /* your code goes here */
            $("#text-nome-completo").empty();
            $("#text-email").empty();
            $("#text-usuario").empty();
            $("#text-senha-1").empty();
            $("#text-senha-2").empty();
        });

        /* button  #btn-enviar-cadastro */
        $(document).on("click", "#btn-enviar-cadastro", function (evt) {
            var txt, ret;
            if ($("text-senha-1").val() != $("text-senha-2").val()) {
                navigator.notification.alert(data, // message
                    alertDismissed, 'Senhas diferentes, conferir.', 'Fechar');
                return;
            }
            txt = $("#text-email").val();
            if (validateEmail(txt) == false) {
                mensagemTela('Erro', 'Email invalido');
                return;
            }
            txt = $("#text-usuario").val();
            if (validateUsuario(txt) == false) {
                mensagemTela('Erro', 'Usuario invalido');
            }
            txt = $("#text-senha-1").val();
            ret = validatePasswd(txt);
            if (ret != true) {
                mensagemTela('Erro', 'Senha invalida');
                return;
            }
            txt = $("#text-senha-2").val();
            ret = validatePasswd(txt);
            if (ret != true) {
                mensagemTela('Erro', 'Senha2 invalida');
                return;
            }
            signInServer('up');
        });

        /* button  #btn-login-login */
        $(document).on("click", "#btn-login-login", function (evt) {
            /*global activate_subpage */
            document.getElementById('text-leituras').innerHTML='Login';
            activate_subpage("#uib_page_13");
        });

        /* button  #btn-pular */
        $(document).on("click", "#btn-pular", function (evt) {
            /* your code goes here */
            activate_subpage("#uib_page_2");
        });

        $(document).on("click", "#btn-login-reenviar", function (evt) {
            /*global activate_subpage */
            signInServer('reset');


        });

        /* button  #btn-login-pular */


        /* button  #btn-sign-out */
        $(document).on("click", "#btn-sign-out", function (evt) {
            /* your code goes here */
            var id_google=null;
            if (json_user.id_google !== undefined)
                id_google=json_user.id_google;
            if (sessao_id == null)
                mensagemTela('Erro', 'Usuario nao logado');
            else {
                signInServer('out');
                if (id_google != null)
                    signOut();
                //$("#text-user-name").empty();
                //$("#text-user-passwd").empty();
            }
        });

        /* button  #btn-trocar-senha */
        $(document).on("click", "#btn-trocar-senha", function (evt) {
            /*global activate_subpage */
            document.getElementById('text-leituras').innerHTML='Login';
            activate_subpage("#uib_page_senha");
        });

        /* button  #btn-senha-trocar */
        $(document).on("click", "#btn-senha-trocar", function (evt) {
            /* your code goes here */
            var txt, txt2, ret;
            if (sessao_id == null) {
                mensagemTela('Erro', 'Usuario nao logado.');
            }
            txt = $("#text-senha-antiga").val();
            if (txt == '') {
                mensagemTela('Error','Senha antiga inválida.');
                return;
            }
            txt = $("#text-senha-nova").val();
            ret = validatePasswd(txt);
            if (ret != true) {
                mensagemTela('Senha nova inválida.',ret);
                return;
            }
            txt2 = $("#text-senha-confirmacao").val();
            ret = validatePasswd(txt2);
            if (ret != true) {
                mensagemTela('Confirmação da senha inválida.',ret);
                return;
            }
            if (txt != txt2) {
                mensagemTela('Erro','Senha nova e confirmação devem ser iguais.');
                return;
            }
            signInServer('troca');
            $("#text-senha-antiga").val('');
            $("#text-senha-nova").val('');
            $("#text-senha-confirmacao").val('');
        });

        /* button  #btn-sign-email */
        $(document).on("click", "#btn-sign-email", function(evt)
        {
            txt = $("#text-sign-email").val();
            if (validateEmail(txt) == false) {
                navigator.notification.alert(txt, alertDismissed,
                    'Email inválido.', 'Fechar');
                return;
            }
            signInServer('email');
            return false;
        });



        $(document).on("change", "#sel-meus-sensores", function (evt) {
            var opt = $("#sel-meus-sensores option:selected").index();
            if (opt == -1)
                    return;
            /* your code goes here */
            if (json_sensores == null) {
                document.getElementById("modelo").value = json_user.sensores[opt].modelo;
                document.getElementById("serie").value = json_user.sensores[opt].serie;
                document.getElementById("chave").value = json_user.sensores[opt].chave;
            } else {
                document.getElementById("modelo").value = json_sensores.sensores[opt].modelo;
                document.getElementById("serie").value = json_sensores.sensores[opt].serie;
                document.getElementById("chave").value = json_sensores.sensores[opt].chave;
            }
            localDB.modelo = document.getElementById("modelo").value;
            localDB.serie = document.getElementById("serie").value;
            localDB.chave = document.getElementById("chave").value;
            eventFire(document.getElementById('btn_let_config_web'), 'click');
        });

        $(document).on("change", "#sel-modbus", function (evt) {
            var opt = $("#sel-modbus option:selected").index();
            if (json_modbus == null) {
                document.getElementById("text-mb-slave").value = json_config.modbus[opt].slave;
                document.getElementById("text-mb-addr").value = json_config.modbus[opt].addr;
                document.getElementById("text-mb-cmd").value = json_config.modbus[opt].cmd;
                document.getElementById("text-mb-qtde").value = json_config.modbus[opt].qtde;
            } else {
                document.getElementById("text-mb-slave").value = json_modbus.modbus[opt].slave;
                document.getElementById("text-mb-addr").value = json_modbus.modbus[opt].addr;
                document.getElementById("text-mb-cmd").value = json_modbus.modbus[opt].cmd;
                document.getElementById("text-mb-qtde").value = json_modbus.modbus[opt].qtde;

            }
            if (json_config.modbus == undefined) return;
            /* your code goes here */
        });

        $(document).on("change", "#sel-tipo_alertas", function (evt) {
            sensor_seco.select = $("#sel-tipo_alertas option:selected").val();
            lerStatus('alertas', "pag_info_status");

        });

        /* button  #btn-login-logoff */
        $(document).on("click", "#btn-login-logoff", function (evt) {
            var id_google=null;
            document.getElementById('text-leituras').innerHTML='Login';
            if (json_user.id_google !== undefined)
                id_google=json_user.id_google;
            if (sessao_id == null)
                mensagemTela('Erro', 'Usuario nao logado');
            else {
                signInServer('out');
                if (id_google != null)
                    signOut();
            }


        });

        /* button  #btn_login */
        $(document).on("click", "#btn_login", function (evt) {
            if (json_config == null)
                activate_subpage("#uib_page_sign_in");
            else
                activate_subpage("#uib_page_13");
            /* your code goes here */
        });

        /* button  #btn-login-logoff */
        $(document).on("click", "#btn-login-logoff", function (evt) {
            /*global activate_subpage */
            activate_subpage("#uib_page_13");
        });

        /* button  #btn-assoc-ts */
        $(document).on("click", "#btn-assoc-ts", function (evt) {
            if (json_user == undefined) {
                mensagemTela("Erro", "Necessário estar logado");
                return;
            }
            if ($("#modelo").val() == '') {
                mensagemTela("Alerta", "Informar modelo");
                return;
            }
            if ($("#serie").val() == '') {
                mensagemTela("Alerta", "Informar serie");
                return;
            }
            if ($("#chave").val() == '') {
                mensagemTela("Alerta", "Informar chave");
                return;
            }
            /* your code goes here */
            signInServer('TS+');
        });

        /* button  #btn-desassoc-ts */
        $(document).on("click", "#btn-desassoc-ts", function (evt) {
            if (json_user == undefined) {
                mensagemTela("Erro", "Necessário estar logado");
                return;
            }
            if ($("#modelo").val() == '') {
                mensagemTela("Alerta", "Informar modelo");
                return;
            }
            if ($("#serie").val() == '') {
                mensagemTela("Alerta", "Informar serie");
                return;
            }
            if ($("#chave").val() == '') {
                mensagemTela("Alerta", "Informar chave");
                return;
            }
            /* your code goes here */
            signInServer('TS-');
        });

        /* button  #btn-alerta-salvar */
        $(document).on("click", "#btn-alerta-salvar", function (evt) {
            /* your code goes here */
            signInServer('reg');
        });

        /* button  #btn-alerta-limpar */
        $(document).on("click", "#btn-alerta-limpar", function (evt) {
            /* your code goes here */
            $("#text-alerta-usuario").empty();
            $("#text-alerta-msg").emtpy();

        });


        $(document).on("change", "#str_horas", function (evt) {
            //var re = /^\#?([\d]{1,2},)*([\d]{1,2}|\#)$/;
            var re = /^(#,)?([\d]{1,2},)*([\d]{1,2}|\#)$/;
            console.log("horas="+this.value);
            if (re.test(this.value) == false) {
                mensagemTela("erro:"+this.value,"Formato: <hora,hora,hora,#> ex.: 2,6,12,48,#");
                this.value = json_config.canal.horas;
            }
        });

        
        
        /* button  Painel */
    $(document).on("click", ".uib_w_299", function(evt)
    {
         /*global activate_subpage */
         document.getElementById('text-leituras').innerHTML='Painel';
         activate_subpage("#uib_page_painel");
    });


    // painel angular  
    $(document).on("click", "#t05", function(evt)
    {
         activate_subpage("#uib_page_2");
    });
        
    // consumo pagina 2
    $(document).on("click", "#t01", function(evt)
    {
         activate_subpage("#uib_page_10");
    });
    // fase pagina 3
    $(document).on("click", "#t02", function(evt)
    {
         activate_subpage("#uib_page_11");
    });
    $(document).on("click", "#t03", function(evt)
    {
         activate_subpage("#uib_page_11");
    });
    $(document).on("click", "#t04", function(evt)
    {
         activate_subpage("#uib_page_11");
    });

    $(document).on("change", "#af-flipswitch-rele", function (env)
    {
        var flag = $("#af-flipswitch-rele").prop("checked") == 1;
        var a = $("#af-flipswitch-rele").prop("checked") ? "On" : "Off";

        if (CHAVE1 == flag) {
            document.getElementById("text-rele-text").innerHTML='Chave ajustada.';
        } else {


        var idx=$("#sel-cmd option:eq(5)").val();
        console.log(" rele idx=" + idx);
        gravarComandoTS(document.getElementById("text-rele-text"),'R');
        if (flag==1) {
            document.getElementById('img-lamp-rele').src="images/lamp_on.png";
        } else {
            document.getElementById('img-lamp-rele').src="images/lamp_off.png";

        }
        document.getElementById('img-lamp-rele-g').innerHTML='chave alterada';
        document.getElementById('text-ss-rele').innerHTML='chave alterada';

        //console.log("af-flipswitch-rele = " + a);
        }
    });

    // atalho para os modulos
        $(document).on("click", "#n111", function (evt) {
            activate_subpage("#uib_page_mod1");
        });
        $(document).on("click", "#n112", function (evt) {
            activate_subpage("#uib_page_mod1");
        });
        $(document).on("click", "#n121", function (evt) {
            activate_subpage("#uib_page_mod1");
        });
        $(document).on("click", "#n122", function (evt) {
            activate_subpage("#uib_page_mod1");
        });

        /* button  #btn_mod2 */
        $(document).on("click", "#n211", function (evt) {
            activate_subpage("#uib_page_mod2");
        });
        $(document).on("click", "#n212", function (evt) {
            activate_subpage("#uib_page_mod2");
        });
        $(document).on("click", "#n221", function (evt) {
            activate_subpage("#uib_page_mod2");
        });
        $(document).on("click", "#n222", function (evt) {
            activate_subpage("#uib_page_mod2");
        });

        /* button  #btn_mod3 */
        $(document).on("click", "#n311", function (evt) {
            activate_subpage("#uib_page_mod3");
        });
        $(document).on("click", "#n312", function (evt) {
            activate_subpage("#uib_page_mod3");
        });
        $(document).on("click", "#n321", function (evt) {
            activate_subpage("#uib_page_mod3");
        });
        $(document).on("click", "#n322", function (evt) {
            activate_subpage("#uib_page_mod3");
        });
        
        /* button  #btn_mod3 */
        $(document).on("click", "#n411", function (evt) {
            activate_subpage("#uib_page_mod4");
        });
        $(document).on("click", "#n412", function (evt) {
            activate_subpage("#uib_page_mod4");
        });
        $(document).on("click", "#n421", function (evt) {
            activate_subpage("#uib_page_mod4");
        });
        $(document).on("click", "#n422", function (evt) {
            activate_subpage("#uib_page_mod4");
        });
    console.log("<index_user_scripts.js");
        /* button  #btn-s-rele */
    $(document).on("click", "#btn-s-rele", function(evt)
    {
         /*global activate_subpage */
         activate_subpage("#sub-page-sensor-rele");
         return false;
    });

        /* button  #btn-s-modbus */
    $(document).on("click", "#btn-s-modbus", function(evt)
    {
         /*global activate_subpage */
         activate_subpage("#sub-page-modbus");
         return false;
    });

        /* button  #btn-mb-salvar */
    $(document).on("click", "#btn-mb-salvar", function(evt)
    {
        var mb_slave = parseInt($('#text-mb-slave').val());
        var mb_addr = parseInt($('#text-mb-addr').val());
        var mb_cmd = parseInt($('#text-mb-cmd').val());
        var mb_qtde = parseInt($('#text-mb-qtde').val());
        if (isNaN(mb_slave) || mb_slave <1 || mb_slave > 254) {
            mensagemTela('Erro', 'Slave deve ser >=1 e <=254');
         return false;
        }

        if (isNaN(mb_addr) || mb_addr <0 || mb_addr > 10000) {
            mensagemTela('Erro', 'Endereco deve ser >=1 e <=10000');
         return false;
        }
        if (isNaN(mb_cmd) || mb_cmd<1 ||mb_cmd>4) {
            mensagemTela('Erro', 'Comando deve ser >=1 e <=10000');
         return false;
        }
        if (isNaN(mb_qtde) || mb_qtde<1 ||mb_qtde>8) {
            mensagemTela('Erro', 'Quantidade deve ser >=1 e <=8');
         return false;
        }
        signInServer('MB+');
        /* your code goes here */
         return false;
    });

        /* button  #btn-mb-remover */
    $(document).on("click", "#btn-mb-remover", function(evt)
    {
        signInServer('MB-');
        /* your code goes here */
         return false;
    });

        /* button  #btn-inicio */
    $(document).on("click", "#btn-inicio", function(evt)
    {
        if (json_config == undefined)
        /* your code goes here */
             activate_subpage("#uib_page_sign_in");
        else
               /* if (rec_sensor_seco)
                    activate_subpage("#uib_page_seco");
                else*/
                    activate_subpage("#uib_page_2");

    });

        /* button  #btn-login-pular */
    $(document).on("click", "#btn-login-pular", function(evt)
    {
        document.getElementById('text-leituras').innerHTML='Login';
        if (json_config == undefined)
        /* your code goes here */
             activate_subpage("#uib_page_5");
        else
                if (rec_sensor_seco)
                    activate_subpage("#uib_page_seco");
                else
                    activate_subpage("#uib_page_2");

    });

        /* button  #btn_inicio_mod */
    $(document).on("click", "#btn_inicio_mod", function(evt)
    {
        if (json_config == undefined)
        /* your code goes here */
             activate_subpage("#uib_page_5");
        else
                if (rec_sensor_seco)
                    activate_subpage("#uib_page_seco");
                else
                    activate_subpage("#uib_page_2");

    });

        /* button  #btn-ss-click */
    $(document).on("click", "#btn-ss-click", function(evt)
    {
        /* your code goes here */
        gravarComandoTS(document.getElementById("text-rele-text"), 'PR');
        return false;
    });

        /* button  #btn-eventos-seco */
    $(document).on("click", "#btn-eventos-seco", function(evt)
    {
        /* your code goes here */
        lerStatus('alertas', "pag_info_status");
        activate_subpage("#uib_page_eventos_seco");
        return false;
    });

        /* button  #btn-horimetro */
    $(document).on("click", "#btn-horimetro", function(evt)
    {
        /* your code goes here */
        if (sensor_seco.eventos == 'todos') {
            $("#btn-horimetro").html("Eventos");
            sensor_seco.eventos = 'horimetro';
        } else {
            $("#btn-horimetro").html("Horímetro");
            sensor_seco.eventos = 'todos';
        }
        lerStatus('alertas', "pag_info_status");

         return false;
    });

        /* button  #btn-gerador */
    $(document).on("click", "#btn-gerador", function(evt)
    {
         /*global activate_subpage */
         activate_subpage("#uib_page_seco");
         return false;
    });

        /* button  #btn-inicio-startup */
    $(document).on("click", "#btn-inicio-startup", function(evt)
    {
         /*global activate_subpage */
         activate_subpage("#uib_page_sign_in");
         return false;
    });

        /* button  #btn-google-signin */
    $(document).on("click", "#btn-google-signin", function(evt)
    {
        /* your code goes here */
        googleSiginIn()
        return false;
    });

    }

    document.addEventListener("app.Ready", register_event_handlers, false);
})();
//getMainConfig();

var pagina_status = 0;
var myIP = new Array();
var myIP_updated_at = null;

//Cookies.create("modelo","TS0",10*365);
//Cookies.create("serie","2",10*365);

console.log("index_user_script.js   FIM");

if (!window.cordova) {
    $("#btn_ler_ip").hide();
    $("#btn_reboot_ts").hide();
    $("#btn_prog_wifi").hide();
    //  onDeviceReady();
}
