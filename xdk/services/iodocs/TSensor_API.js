(function (credentials, helpers) {
  var exports = {};
  
  exports.default = function(params) {
    var url = 'http://45.55.77.192/0/config_ler.php';
      //params['apiKey']= key;
    if (params) url = url + '?' + $.param(params);
      console.log("url=" + url);
      console.log(params);
    return $.ajax({url: url, type: 'GET'});
  };
  
  return exports;
})