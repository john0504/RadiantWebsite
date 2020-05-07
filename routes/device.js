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
    var UserId = 0;
    var Address = 0;
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
        sql = 'SELECT count(*) as count from DeviceTbl'
        if (req.session.SuperUser != 1) {
            sql += (` AND UserId = ${req.session.UserId}`);
        }
        mysqlQuery(sql, function (err, dev2) {
            var total = dev[0].count;
            totalPage = Math.ceil(total / linePerPage);
            sql = 'SELECT a.*,b.Account FROM DeviceTbl a left join UserTbl b on a.UserId = b.Id \
                    left join DeviceTypeTbl c on a.TypeId = c.Id';

            if (req.session.SuperUser != 1) {
                sql += (` WHERE a.UserId = ${req.session.UserId}`);
            }
            sql += (` limit ${index * linePerPage},${linePerPage}`);

            mysqlQuery(sql, function (err, devices) {
                if (err) {
                    console.log(err);
                }
                res.render('device', {
                    title: 'Device Information', data: devices, index: index, UserId: UserId,
                    Address: Address, totalPage: totalPage, linePerPage: linePerPage, order: order
                });
            });
        });
    });
});
/*
router.get('/search', function (req, res, next) {
    if (!checkSession(req, res)) {
        return;
    }
    var index = parseInt(req.query.index) ? parseInt(req.query.index) : 0;
    if (index < 0) {
        index = 0;
    }
    var Address = req.query.Address;
    var DevName = req.query.DevName;
    var Account = req.query.Account;
    var order = req.query.order;
    var timenow = parseInt(Date.now() / 1000 - 2 * 60);
    var totalOnline = 0;
    var totalPage = 0;
    var mysqlQuery = req.mysqlQuery;

    var sql = 'SELECT count(*) as count from DeviceTbl'
    sql += (` WHERE UpdateDate >= ${timenow}`);
    if (req.session.SuperUser != 1 && req.session.SuperUser != 2) {
        sql += (` AND AccountNo = ${req.session.AccountNo}`);
    }
    mysqlQuery(sql, function (err, dev2) {
        totalOnline = dev2[0].count;
        sql = 'SELECT count(*) as count from DeviceTbl a left join AccountTbl b on a.AccountNo = b.AccountNo'
        var haswhere = false;
        if (Address && Address != "") {
            sql += (` WHERE a.Address LIKE '%${Address}%'`);
            haswhere = true;
        }
        if (DevName && DevName != "") {
            if (!haswhere) {
                sql += (` WHERE a.DevName LIKE '%${DevName}%'`);
                haswhere = true;
            } else {
                sql += (` AND a.DevName LIKE '%${DevName}%'`);
            }
        }
        if (Account && Account != "") {
            if (!haswhere) {
                sql += (` WHERE b.Account LIKE '%${Account}%'`);
                haswhere = true;
            } else {
                sql += (` AND b.Account LIKE '%${Account}%'`);
            }
        }
        if (req.session.SuperUser != 1 && req.session.SuperUser != 2) {
            if (!haswhere) {
                sql += (` WHERE a.AccountNo = ${req.session.AccountNo}`);
                haswhere = true;
            } else {
                sql += (` AND a.AccountNo = ${req.session.AccountNo}`);
            }
        }
        mysqlQuery(sql, function (err, dev) {
            var total = dev[0].count;
            totalPage = Math.ceil(total / linePerPage);
            sql = 'SELECT a.*,b.Account FROM DeviceTbl a left join AccountTbl b on a.AccountNo = b.AccountNo';
            haswhere = false;
            if (Address && Address != "") {
                sql += (` WHERE a.Address LIKE '%${Address}%'`);
                haswhere = true;
            }
            if (DevName && DevName != "") {
                if (!haswhere) {
                    sql += (` WHERE a.DevName LIKE '%${DevName}%'`);
                    haswhere = true;
                } else {
                    sql += (` AND a.DevName LIKE '%${DevName}%'`);
                }
            }
            if (Account && Account != "") {
                if (!haswhere) {
                    sql += (` WHERE b.Account LIKE '%${Account}%'`);
                    haswhere = true;
                } else {
                    sql += (` AND b.Account LIKE '%${Account}%'`);
                }
            }
            if (req.session.SuperUser != 1 && req.session.SuperUser != 2) {
                if (!haswhere) {
                    sql += (` WHERE a.AccountNo = ${req.session.AccountNo}`);
                    haswhere = true;
                } else {
                    sql += (` AND a.AccountNo = ${req.session.AccountNo}`);
                }
            }
            if (order && order != "") {
                sql += (` order by  ${order}`);
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
                    title: 'Device Information', data: devices, index: index, Address: Address,
                    DevName: DevName, Account: Account, totalPage: totalPage,
                    linePerPage: linePerPage, order: order, totalOnline: totalOnline
                });
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
    var index = parseInt(req.query.index) ? parseInt(req.query.index) : 0;
    if (index < 0) {
        index = 0;
    }
    var mysqlQuery = req.mysqlQuery;
    var sql = `SELECT count(*) as count from MessageTbl WHERE Address ='${Address}'`;
    mysqlQuery(sql, function (err, mes) {
        var total = mes[0].count;
        totalPage = Math.ceil(total / linePerPage);
        sql = `SELECT * FROM MessageTbl WHERE Address ='${Address}'`;
        sql += (`order by id desc limit ${index * linePerPage},${linePerPage}`);
        mysqlQuery(sql, function (err, msgs) {
            if (err) {
                console.log(err);
            }
            msgs.forEach(msg => {
                msg.totalmoney = (msg.H68 << 16) + msg.H69;
                msg.totalgift = (msg.H6A << 16) + msg.H6B;
            });
            var data = msgs;
            res.render('deviceHistory', { title: 'Device History', data: data, index: index, Address: Address, totalPage: totalPage, linePerPage: linePerPage });
        });
    });
});

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
    var dateStr = req.body.ExpireDate;
    var year = dateStr.substring(0, 4);
    var month = dateStr.substring(4, 6);
    var day = dateStr.substring(6, 8);
    var date = new Date(year, month - 1, day, 0, 0, 0);
    var ExpireDate = date.getTime() / 1000;
    if (ExpireDate) {
        sql.ExpireDate = ExpireDate;
    }
    mysqlQuery('UPDATE DeviceTbl SET ? WHERE Address = ? AND UserId = ?', [sql, Address, UserId], function (err, rows) {
        if (err) {
            console.log('UPDATE error:' + err);
        }
        res.redirect('/device');
    });
});
*/
module.exports = router;
