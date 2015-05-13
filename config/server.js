// var PROXY_PREFIX = '/api/';
// var PROXY_TARGET = 'http://staging.zhonglie007.com';
// var apiProxy = require('./api-proxy');

module.exports = function(server){

  // HTML5 pushstate
  // server.all('/*', function(req, res) {
  //   res.sendfile('index.html',{root: server.get('root') || 'app'});
  // });

  // API Stub
  // server.get('/books', function(req, res){
    // res.json(require(__dirname + '/../data/books'));
  // });

  // API Proxy
  // server.use(PROXY_PREFIX,apiProxy(PROXY_TARGET));
};

