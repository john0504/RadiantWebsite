var express = require('express');
var router = express.Router();
var linePerPage = 10;

// home page
function checkSession(req, res) {
    if (!req.session.Sign) {
        res.redirect('/');
        return false;
    } else {
        res.locals.Account = req.session.Account;
        res.locals.SuperUser = req.session.SuperUser;
    }
    return true;
}

router.get('/', function (req, res, next) {
    if (!checkSession(req, res)) {
        return;
    }
    var SearchAccount = "";
    var order = "";
    var index = parseInt(req.query.index) ? parseInt(req.query.index) : 0;
    if (index < 0) {
        index = 0;
    }
    var totalPage = 0;
    var mysqlQuery = req.mysqlQuery;
    var sql = 'SELECT count(*) as count from DeviceTbl'
    if (req.session.SuperUser != 1) {
        sql += (` WHERE UserId = ${req.session.UserId}`);
    }
    mysqlQuery(sql, function (err, dev) {        
        var total = dev[0].count;
        totalPage = Math.ceil(total / linePerPage);
        sql = 'SELECT a.*, b.Account, c.Name, c.TextInfo2, c.TextInfo3 FROM DeviceTbl a left join UserTbl b on a.UserId = b.Id \
                left join DeviceTypeTbl c on a.TypeId = c.Id';

        if (req.session.SuperUser != 1) {
            sql += (` WHERE a.UserId = ${req.session.UserId}`);
        }
        sql += (` limit ${index * linePerPage},${linePerPage}`);

        mysqlQuery(sql, function (err, devices) {
            if (err) {
                console.log(err);
            }
            console.log(JSON.stringify(devices[0]));
            res.render('device', {
                title: 'Device Information', data: devices, index: index, SearchAccount: SearchAccount,
                totalPage: totalPage, linePerPage: linePerPage, order: order
            });
        });     
    });
});

router.get('/search', function (req, res, next) {
    if (!checkSession(req, res)) {
        return;
    }    
    if (req.session.SuperUser != 1) {
        return;    
    }
    var index = parseInt(req.query.index) ? parseInt(req.query.index) : 0;
    if (index < 0) {
        index = 0;
    }
    var SearchAccount = req.query.SearchAccount;
    var order = req.query.order;
    var totalPage = 0;
    var mysqlQuery = req.mysqlQuery;

    var sql = 'SELECT count(*) as count from DeviceTbl a left join UserTbl b on a.UserId = b.Id';
    if (SearchAccount && SearchAccount != "") {   
        sql += (` WHERE b.Account LIKE '%${SearchAccount}%'`);
    }
    mysqlQuery(sql, function (err, dev) {
        var total = dev[0].count;
        totalPage = Math.ceil(total / linePerPage);
        sql = 'SELECT a.*, b.Account FROM DeviceTbl a left join UserTbl b on a.UserId = b.Id \
                left join DeviceTypeTbl c on a.TypeId = c.Id';   
        if (SearchAccount && SearchAccount != "") {   
            sql += (` WHERE b.Account LIKE '%${SearchAccount}%'`);
        }
        if (order && order != "") {
            sql += (` order by ${order}`);
        }
        sql += (` limit ${index * linePerPage},${linePerPage}`);

        mysqlQuery(sql, function (err, devices) {
            if (err) {
                console.log(err);
            }
            devices.forEach(device => {
                if (device.UpdateDate >= Date.now() / 1000 - 2 * 60) {
                    device.Status = 1;
                } else {
                    device.Status = 0;
                }
            });
            res.render('device', {
                title: 'Device Information', data: devices, index: index, SearchAccount: SearchAccount, 
                totalPage: totalPage, linePerPage: linePerPage, order: order
            });
        });
    });
});

// history page
router.get('/deviceHistory', function (req, res, next) {
    if (!checkSession(req, res)) {
        return;
    }
    var Address = req.query.Address;
    var UserId = req.query.UserId
    var index = parseInt(req.query.index) ? parseInt(req.query.index) : 0;
    if (index < 0) {
        index = 0;
    }
    var mysqlQuery = req.mysqlQuery;
    var sql = `SELECT count(*) as count from DeviceHistoryTbl WHERE Address = ${Address} AND UserId = ${UserId}`;
    mysqlQuery(sql, function (err, mes) {
        var total = 0;
        if (mes && mes[0].count) {
            total = mes[0].count;
        }
        totalPage = Math.ceil(total / linePerPage);
        sql = `SELECT a.*, b.Account, c.Name FROM DeviceHistoryTbl a left join UserTbl b on a.UserId = b.Id \
                left join DeviceTypeTbl c on a.TypeId = c.Id WHERE a.Address ='${Address}' AND a.UserId = ${UserId}`;
        sql += (` order by a.id desc limit ${index * linePerPage},${linePerPage}`);
        mysqlQuery(sql, function (err, data) {
            if (err) {
                console.log(err);
            }
            res.render('deviceHistory', { title: 'Device History', data: data, index: index, Address: Address, UserId: UserId, totalPage: totalPage, linePerPage: linePerPage });
        });
    });
});
/*
// edit page
router.get('/deviceEdit', function (req, res, next) {
    if (!checkSession(req, res)) {
        return;
    }
    var Address = req.query.Address;
    var UserId = req.body.UserId;

    var mysqlQuery = req.mysqlQuery;

    mysqlQuery('SELECT * FROM DeviceTbl WHERE Address = ? AND UserId = ?', [Address, UserId], function (err, rows) {
        if (err) {
            console.log(err);
        }
        res.render('deviceEdit', { title: 'Edit Device', data: data });
    });

});

router.post('/deviceEdit', function (req, res, next) {
    if (!checkSession(req, res)) {
        return;
    }
    var mysqlQuery = req.mysqlQuery;

    var Address = req.body.Address;
    var UserId = req.body.UserId;

    var sql = {
        DevName: req.body.Name
    };

    mysqlQuery('UPDATE DeviceTbl SET ? WHERE Address = ? AND UserId = ?', [sql, Address, UserId], function (err, rows) {
        if (err) {
            console.log('UPDATE error:' + err);
        }
        res.redirect('/device');
    });
});
*/
module.exports = router;
