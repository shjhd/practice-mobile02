var httpProxy = require('http-proxy');
module.exports = function(target){
  var proxy = httpProxy.createProxyServer({
    changeOrigin: true
  });
  proxy.on('error', function(err, req, res) {
    res.statusCode = 500;
    res.end('API Proxying to :`' + req.url + '` failed with:' + err.toString());
  });
  return function(req, res) {
    req.url = req.originalUrl;
    proxy.web(req, res, {
      target: target
    });
  };
};
