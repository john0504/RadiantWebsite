var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var ssl = require('./routes/ssl');
var login = require('./routes/login');
var logout = require('./routes/logout');
var device = require('./routes/device');
var user = require('./routes/user');
var group = require('./routes/group');
var scene = require('./routes/scene');
var schedule = require('./routes/schedule');
var radiant = require('./routes/radiant');

var app = express();

// DataBase 
var mysql = require("mysql");

var pool = mysql.createPool({
    host: "localhost",
    user: "tywu",
    password: "12345678",
    database: "Radiant_db",
    connectionLimit: 100
});

var mysqlQuery = function (sql, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = undefined;
    }
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err, null, null);
        } else {
            conn.query(sql, options, function (err, results, fields) {
                // callback
                callback(err, results, fields);
            });
            // release connection。
            // 要注意的是，connection 的釋放需要在此 release，而不能在 callback 中 release
            conn.release();
        }
    });
}

console.log("MySQL Database Ready!");

/*
var mqtt = require('mqtt');
var fs = require('fs');
var opt = {
    port: 1883,
    clientId: 'AURORA-nodejs',
    protocol: 'mqtt',
    username: 'ZWN0Y28uY29tMCAXDTE5MDcxODAzMzUyMVoYDzIxMTkwNjI0MDMzNTIxWjBlMQsw',
    password: 'CQYDVQQGEwJUVzEPMA0GA1UECAwGVGFpd2FuMRAwDgYDVQQHDAdIc2luY2h1MQ8w',
    key: fs.readFileSync('./client.key'),
    cert: fs.readFileSync('./client.crt'),
    ca: fs.readFileSync('./ca.crt'),
    rejectUnauthorized: false
};
var client = mqtt.connect('mqtt://localhost', opt);

client.on('connect', function () {
    console.log('MQTT Server Connected!');
    client.subscribe("radiant/#");
    var topic = `radiant/testmqtt`;
    var paylod = `This is a test message.`;
    client.publish(topic, paylod, { qos: 1, retain: false });
});

client.on('message', function (topic, msg) {
    console.log(`Topic: ${topic} Msg: ${msg}`);
    var PrjName = topic.substring(0, 7);
    var action = topic.substring(8, 14);
    if (action == 'server') {
        console.log(`Get a Server Message!`);
    } else if (action == 'device') {
        console.log(`Get a Device Message!`);
    }
});
*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: 'radiant', //secret的值建议使用随机字符串
    name: 'sid',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 1000 * 30 } // 过期时间（毫秒）
}));

// db state
app.use(function (req, res, next) {
    req.mysqlQuery = mysqlQuery;
    next();
});

app.use('/', routes);
app.use('/radiant', radiant);
app.use('/login', login);
app.use('/logout', logout);
app.use('/device', device);
app.use('/group', group);
app.use('/scene', scene);
app.use('/schedule', schedule);
app.use('/user', user);
app.use('/.well-known/acme-challenge', ssl);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
