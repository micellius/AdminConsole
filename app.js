/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 12:20 AM
 */

var http = require('http');
var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var morgan  = require('morgan'); // Logger
var errorHandler = require('errorhandler');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var stylus = require('stylus');
var routes = require('./routes');
var net = require('./routes/net.js');
var csrf = require('./routes/csrf.js');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan());
app.use(errorHandler());
app.use(bodyParser());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({secret: 'secret'}));
app.use(stylus.middleware({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/resources', express.static(__dirname + '/bower_components/openui5-bower/resources')); // UI5

app.get('/', routes.index);
app.post('/sap/hana/ide/core/base/server/net.xsjs', net.post);
app.head('/sap/hana/ide/core/base/server/csrf.xsjs', csrf.head);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});