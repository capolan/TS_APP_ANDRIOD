function getObjects(obj, key) {
    var val;
    for (var i in obj) {
        //      if (!obj.hasOwnProperty(i)) continue;
        if (obj[i] == null) continue;
        // if (key == "field1")   app.consoleLog(key + "  i="+i+" val="+obj[i]);
        if (i == key) {
            val = obj[i];
            return val;
        }
        if (typeof obj[i] == 'object') {
            return getObjects(obj[i], key);
        }
    }
    return false;
}
/***********************************************************/

function selectHandler(e) {
    alert('A table row was selected');
}
/********************************************************************/
function runGraph(_tipo, _id_div, _page, _titulo, _largura, _altura, _series, _modulo, _nro_pontos, _passo, _min_value, _max_value, _isStacked, _div_painel) {
    // tipo
    // 0 = gauge
    // 1 = area
    // 2 = linha
    // 3 = dounets
    this.tipo = _tipo;
    app.consoleLog(">runGraph", "entry");

    this.count = 0;
    this.ativo = true;
    this.status = null;
    this.offline_at = false;
    this.id_div = _id_div;
    this.page = _page;
    this.painel=_div_painel; // fomato t1v = valor  t1a=prim linha  t1b segunda linha, passar somente t1
    this.titulo = _titulo;
    this.sem_dados = true;
    // set your channel id here
    this.modulo = _modulo;
    // set your channel's read api key here if necessary
    this.isStacked = _isStacked;
    this.message = '';

    this.largura = _largura;
    this.altura = _altura;

    this.nro_pontos = _nro_pontos;

    this.max_value = parseInt(_max_value);
    this.max_real = parseInt(_max_value);
    if (isNaN(_max_value) || isNaN(this.max_value)) this.max_value = 100;
    this.min_value = parseInt(_min_value);
    this.min_real = parseInt(_min_value);
    if (isNaN(_min_value) || isNaN(this.min_value)) this.min_value = 0;

    this.series = _series;
    this.serie = null; // numero de serie do node
    this.created_at = null;

    // global variables
    //var chart, charts, data, options;
    this.chart = null;
    this.options = null;
    this.data = null;
    this.timerID = null;
    this.vcc = null;
    this.field_flag = null;
    this.vcc_flag = null;
    this.green_value=0;
    this.yellow_value=0;
    this.red_value=0;
    this.max = new Array(10);
    this.min = new Array(10);

    var self = this;

    this.ajustaData = function () {
        var contador;
        //            console.log(">ajustaData modulo="+self.modulo);
        if (self.modulo == null)
            contador = json_feed.channel.contador;
        else {
            var str = self.modulo + 1;
            var v_str = jsonPath(json_feed,
                "$.nodes" + str + ".contador");
            if (v_str != false) {
                contador = parseInt(v_str);
            }
        }
        //                console.log(json_feed);

        //            if (self.nro_pontos == self.nro_pontos_old || self.tipo==3)
        if (self.nro_pontos == contador || self.tipo == 3 || self.tipo == 0)
            return;
        //    console.log(">ajustaData " + self.id_div + "  pontos=" + self.nro_pontos + "  new=" + contador);
        self.nro_pontos = self.data.getNumberOfRows() - 1;
        self.data.removeRows(1, self.nro_pontos);
        self.nro_pontos = contador;
        var n = parseInt(self.nro_pontos);
        self.data.addRows(n);
    };

    // load the data
    this.loadData = function () {
        // get the data from thingspeak
        var d, j, k, valor, field_msg;
        var titulo, div_painel=null;
        //app.consoleLog(self.id_div," loadData");
        self.message = '';

        if (json_feed == null) {
            app.consoleLog(self.id_div, " sem feed");
            self.message = " sem feed";
            return;
        }
        // console.log("json_feed="+JSON.stringify(json_feed.channel));
        // se nao visivel, nao atualiza grafico
        //  if (self.count >0 && $('#'+self.page).css('display') == 'none') {
        //      console.log("none="+self.id_div);
        //      return;
        //  }
        // confere que o numero da serie do node do feed == config
        var valdata = json_feed;

        if (serie.modulo != null && serie.modulo >= 0) {
            var n = self.modulo + 1;

            if (self.serie == null)
                self.serie = getObjects(json_config.canal, "node" + n);
            if (self.serie == false) {
                self.serie = null;
                self.message = "sem serie json_config node" + n;
                return;
            }
            // testa config com o feed
            var node = jsonPath(valdata, "$.nodes" + n + ".serie");
            if (self.serie != node) {
                self.serie = null;
                self.message = "serie json_config serie" + self.serie + " <> json_feed serie=" + node;
                return;
            }
        }

        if (self.modulo == null ) {
            var campo = self.series[0].campo;
            var v_str= jsonPath(valdata, "$.feeds[0].field" + campo);
            if (v_str === false) {
                self.ativo=false;
                return;
            }
            // testa se é para mostrar o relógio
            if (json_config.canal.field_ocultar != undefined) {
                var field_ocultar=parseInt(json_config.canal.field_ocultar);
                if ((field_ocultar & (1<<campo)) > 0) {
                      //  console.log("OCULTAR:" + campo);
                        self.ativo=false;
                        return;
                    }
            }
        } else
        if (self.modulo >= 0) {
            var campo = self.series[0].campo;
            var str = self.modulo + 1;
            var v_str = jsonPath(valdata,
                            "$.nodes_feed" + str + "[0].field" + campo);
            if (v_str === false) {
                self.ativo=false;
                return;
            }
        }
        self.ativo=true;
        //self.message='count='+self.count;
        self.count++;
        self.ajustaData();

        // app.consoleLog("self.read_api_key",self.read_api_key+" self.id_div",self.id_div);
        //  app.consoleLog("self.modulo",self.modulo);
        //  app.consoleLog("self.nro_pontos",self.nro_pontos);
        if (window.cordova && navigator.connection.type == Connection.NONE) return;

        //app.consoleLog(self.painel + " id_div="+self.id_div+ "  valdata",valdata);
        self.vcc = null;
        self.field_flag = 0;
        self.vcc_flag = 0;
        self.sem_dados = false;
        for (var i = 0, f = 0; i <= self.nro_pontos - 1; i++, f++) {
            var mensagem = false;
            if (valdata.feeds[i] === undefined) {
               // app.consoleLog("poucos dados feed i=" + i + "   id_div=" + self.id_div);
                // self.message = 'poucos dados';
                break;
            }

            if (self.modulo == null) {
                var v_str = valdata.feeds[i].created_at;
                d = new Date(v_str);
                self.created_at = valdata.feeds[0].created_at;
                self.offline_at = getObjects(valdata.channel, "offline_at");
                self.status = getObjects(valdata.channel, "status");
                if (self.vcc == null)
                    self.vcc = valdata.feeds[0].vcc;
                titulo=valdata.channel.name;
            } else { // nodes
                if (self.modulo >= 0) {
                    var str = self.modulo + 1;
                    var v_str = jsonPath(valdata, "$.nodes_feed" + str + "[" + i + "].created_at");
                    if (i == 0 && v_str == false) return;
                    d = new Date(v_str);
                    self.created_at = v_str;
                    self.offline_at = jsonPath(valdata, "$.nodes" + str + ".offline_at");
                    self.status = jsonPath(valdata, "$.nodes" + str + ".status");
                    v_str = jsonPath(valdata, "$.nodes_feed" + str + "[" + i + "].vcc");
                    if (self.vcc == null && v_str != false)
                        self.vcc = v_str;
                    v_str = jsonPath(valdata, "$.nodes" + str + ".vcc_flag");
                    if (self.vcc_flag == null && v_str !== false)
                        self.vcc_flag = v_str;
                    titulo = jsonPath(valdata, "$.nodes" + str + ".name");
                }
            }
            if (self.tipo != 3) self.data.setCell(f, 0, d);
            j = 1;
            k = 0;
            for (var key in self.series) {
                var campo = self.series[key].campo;
                var ncampo = self.series[0].campo;
                //     app.consoleLog("campo="+campo+"modulo=",self.modulo);
                switch (campo) {
                case 100: // min
                    if (self.modulo === null) {
                        valor = getObjects(valdata,
                            "field" + ncampo + "_min");
                    } else
                    if (self.modulo >= 0) {
                        var str = self.modulo + 1;
                        var v_str = jsonPath(json_config,
                            "$.node" + str + ".field"+ncampo+"_min");
                        valor = parseFloat(v_str);
                        //   self.min[str]=undefined;
                    }
                    if (valor==null || valor === false || isNaN(valor)) valor = 0;
                    break;
                case 101: // max
                    if (self.modulo === null) {
                        valor = getObjects(valdata,
                            "field" + ncampo + "_max");
                    } else
                    if (self.modulo >= 0) {
                        var str = self.modulo + 1;
                        var v_str = jsonPath(json_config,
                            "$.node" + str + ".field"+ncampo+"_max");
                        valor = parseFloat(v_str);
                        //    self.max[str]=undefined;
                    }
                    if (valor === false || isNaN(valor)) valor = 1000;
                    break;
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                    if (self.modulo == null) {
                        valor = getObjects(valdata.feeds[i], "field" + campo);
                       // if (valor != undefined)                            console.log("i: "+i + " valor=" + valor);
                        if (valor !== false)
                            valor = parseFloat(valor);
                        field_msg = getObjects(valdata.feeds[i], "field");
                        if (field_msg != null && campo == field_msg) {
                            mensagem = getObjects(valdata.feeds[i], "mensagem");
                        }
                        self.min[campo] = jsonPath(valdata,"$.channel.min_field" + campo);
                        self.max[campo] = jsonPath(valdata,"$.channel.max_field" + campo);
                        v_str = jsonPath(valdata,"$.channel.field" + campo + "_flag");
                        if (isNaN(parseInt(v_str)))
                            self.field_flag = 0;
                        else
                            self.field_flag = parseInt(v_str);
                    } else
                    if (self.modulo >= 0) {
                        var str = self.modulo + 1;
                        var s;
                        var v_str = jsonPath(valdata,
                            "$.nodes_feed" + str + "[" + i + "].field" + campo);
                        valor = parseFloat(v_str);
                        field_msg = getObjects(valdata,"$.nodes_feed" + str + "[" + i + "].field");
                        if (field_msg != null && field_msg != false && campo == field_msg) {
                            s = "$.nodes_feed" + str + "[" + i + "].mensagem";
                            mensagem = jsonPath(valdata, s);
                        }
                        v_str = jsonPath(valdata,
                            "$.nodes" + str + ".min_field" + campo);
                        self.min[campo] = parseInt(v_str);
                        v_str = jsonPath(valdata,
                            "$.nodes" + str + ".max_field" + campo);
                        self.max[campo] = parseInt(v_str);
                        // status
                        v_str = jsonPath(valdata,
                            "$.nodes" + str + ".field" + campo + "_flag");
                        if (isNaN(parseInt(v_str)))
                            self.field_flag = 0;
                        else
                            self.field_flag = parseInt(v_str);


                    }
                    if (valor === false && i == 0) {
                        self.message = 'sem dados';
                        self.message = '';
                    }
                    break;
                }
         /*       if (i == 0 && valor === false) {
                     //console.log("sem feeds total:" + self.id_div);
                    self.sem_dados = true;
                }
*/
                if (isNaN(valor) || valor === false) valor = null;
                if (self.tipo == 3) { // dounets
                    self.data.setCell(k, 0, self.series[key].nome);
                    self.data.setCell(k, 1, valor);
                    k++;
                } else {
                          if (self.id_div == "xchart2_div") {
                            app.consoleLog(self.id_div,
                                           "dados f=" + f + "  j=" + j + " valor=" + valor+ "  d="+d.toString());
                            app.consoleLog(self.tipo,
                                           "mensagem f=" + mensagem);
                            }
                            
                    self.data.setCell(f, j++, valor);
                    if (self.tipo == 2 && campo <= 8) { // +++
                        if (mensagem != false) {
                            self.data.setCell(f, j++, '+');
                            self.data.setCell(f, j++, "<p>" + mensagem + "</p>");

                        } else {
                            self.data.setCell(f, j++, null);
                            self.data.setCell(f, j++, null);
                        }
                    }
                } // else
            } // for
        }
        // se tem dados, mostra o gráfico
        //      if (self.message == '') {
        //            if ($("#"+self.id_div).css('display') == 'none')
        //                    $("#"+self.id_div).css('display','block');
        self.chart.draw(self.data, self.options);
        // cor do fundo do gráfico em vermelho se offline
        if (self.tipo == 0) {
            var flag = false;
            //if (self.id_div == "chart1_div") console.log("vcc="+self.vcc_flag+" status="+self.status+"   field="+self.field_flag);
            // offline
            if (self.status == 3 || self.offline_at != false) {
                $('#' + self.id_div + ' circle:nth-child(2)').attr('fill', '#FF0000');
                $(div_painel).css('color','red');
                if (map != null && map != 0)
                    markerMap.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
            } else {
                $('#' + self.id_div + ' circle:nth-child(2)').attr('fill', '#F7F7F7');
                $(div_painel).css('color','green');
                if (map != null && map != 0)
                    markerMap.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
            }
            // fora dos limites
            if (self.field_flag == 0) {
                $('#' + self.id_div + ' circle:nth-child(1)').attr('fill', '#F7F7F7');
                $(div_painel).css('color','green');
            } else {
                $('#' + self.id_div + ' circle:nth-child(1)').attr('fill', '#FF0000');
                $(div_painel).css('color','red');
                flag = true;
            }
            // bateria fraca
            if (self.vcc_flag != 0) {
                if (flag == true)
                    $('#' + self.id_div + ' circle:nth-child(1)').attr('fill', '#F97700');
                else
                    $('#' + self.id_div + ' circle:nth-child(1)').attr('fill', '#F7F700');
            }
        }
        //        } else {
        //            if ($("#"+self.id_div).css('display') == 'block') {
        //                    $("#"+self.id_div).css('display','none');
        //            }
        //        }

        //  console.log("<loadData "+self.id_div);
    };

    // initialize the chart
    this.initChart = function () {
        //  app.consoleLog("initChart=" + self.tipo, "entry");
        self.data = new google.visualization.DataTable();
        if (self.tipo == 1 || self.tipo == 2) {
            var flag = true;
            self.data.addColumn('datetime', 'Label');
            for (var key in self.series) {
                //        app.consoleLog(self.tipo + ':key=' + key + " titulo=" + self.series[key].nome + " data=" + self.series[key].campo);
                self.data.addColumn('number', self.series[key].nome);
                if (self.tipo == 2 && flag == true) { // linha +++
                    self.data.addColumn({
                        type: 'string',
                        role: 'annotation'
                    });
                    self.data.addColumn({
                        type: 'string',
                        role: 'annotationText',
                        p: {
                            html: true
                        }
                    });
                    flag = false;
                }
            }
        }

        var range_val = self.max_value - self.min_value;
        self.red_value = range_val - (range_val * 0.1) + self.min_value;
        self.yellow_value = range_val - (range_val * 0.25) + self.min_value;
        console.log("range=" + range_val + " yellow=" + self.yellow_value + " red=" + self.red_value + "  max=" + self.max_value + " min=" + self.min_value);
        var tick_value = 5;
        switch (self.tipo) {
        case 0: // gauge
            app.consoleLog("0.titulo=" + self.series[0].nome + " data=" + self.series[0].campo);
            self.data.addColumn('datetime', 'Label');
            self.data.addColumn('number', self.series[0].nome);
            self.data.addRows(1);
            self.nro_pontos = 1;
            self.chart = new google.visualization.Gauge(document.getElementById(self.id_div));
            /*            self.options = {
                            width: self.largura,
                            height: self.altura,
                            min: self.min_value,
                            max: self.max_value,
                            redFrom: red_value,
                            redTo: self.max_value,
                            yellowFrom: yellow_value,
                            yellowTo: red_value,
                            minorTicks: tick_value
                        };
            */
            var diff_val = Math.ceil((self.max_value - self.min_value) / 3);
            if (isNaN(self.min_real)) {
                console.log("min_Real NULL");
                self.options = {
                    width: self.largura,
                    height: self.altura,
                    min: 0,
                    max: self.max_value,
                    greenFrom: 0,
                    greenTo: self.yellow_value,
                    yellowFrom: self.yellow_value,
                    yellowTo: self.red_value,
                    redFrom: self.red_value,
                    redTo: self.max_value,
                    redColor: '#DC3912',
                    minorTicks: tick_value
                };

            } else {
                console.log("min_Real OK");
                self.yellow_value = self.min_value;
                self.red_value = self.max_value;
                self.options = {
                    width: self.largura,
                    height: self.altura,
                    min: self.min_value - diff_val,
                    max: self.max_value + diff_val,
                    greenFrom: self.yellow_value,
                    greenTo: self.red_value,
                    yellowFrom: self.min_value - diff_val,
                    yellowTo: self.yellow_value,
                    redFrom: self.red_value,
                    redTo: self.max_value + diff_val,
                    redColor: '#FF9900',
                    minorTicks: tick_value
                };
            }
            break;
        case 1: // area
            self.chart = new google.visualization.AreaChart(document.getElementById(self.id_div));
            self.options = {
                animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out'
                },
                title: self.titulo,
                titleTextStyle: {
                    color: 'white'
                },
                width: self.largura,
                height: self.altura,
                isStacked: self.isStacked,
                legend: {
                    position: 'bottom'
                },
                backgroundColor: 'white',
                hAxis: {
                    title: 'tempo',
                    titleTextStyle: {
                        color: 'blue'
                    },
                    textStyle: {
                        color: 'black'
                    }
                },
                vAxis: {
                    title: 'watts',
                    titleTextStyle: {
                        color: 'red'
                    },
                    textStyle: {
                        color: 'black'
                    },
                    minValue: 0
                }
            };
            break;
        case 2: // linha
            self.chart = new google.visualization.LineChart(document.getElementById(self.id_div));
            self.options = {
                title: self.titulo,
                legend: {
                    position: 'bottom'
                }, //interpolateNulls: true,
                tooltip: {
                    isHtml: true
                },
                width: self.largura,
                height: self.altura,
                chartArea: {
                    width: '80%',
                    height: '60%'
                },
                // explorer: {  actions: ['dragToZoom', 'rightClickToReset'] }
                //vAxis: {minValue:self.min, maxValue:self.max }
            };
            break;
        case 3: // dounets
            self.data.addColumn('string', self.titulo);
            self.data.addColumn('number', "xx");
            self.data.addRows(self.series.length);

            self.nro_pontos = 1;
            self.chart = new google.visualization.PieChart(document.getElementById(self.id_div));
            self.options = {
                title: self.titulo,
                pieHole: 0.4
            };
            break;

        }
        var n = parseInt(self.nro_pontos);
        if (isNaN(n)) {
            n = 20;
            self.nro_pontos = 20;
        }
        self.data.addRows(n);
        self.loadData();

        // load new data every 15 seconds
        //    setInterval('this.loadData()', 15000);
    };

    this.initChart();
    //    else
    //      google.setOnLoadCallback(this.initChart);
    // google.visualization.events.addListener(self.chart, 'click', selectHandler);
    app.consoleLog("<runGraph", "exit");
}

//google.charts.load('current', {'packages':['gauge', 'corechart', 'table']});

google.load('visualization', '1', {packages: ['gauge', 'corechart', 'table']});
