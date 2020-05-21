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
    var index = parseInt(req.query.index) ? parseInt(req.query.index) : 0;
    if (index < 0) {
        index = 0;
    }
    var mysqlQuery = req.mysqlQuery;
    var SearchAccount = "";
    var sql = 'SELECT count(*) as count from SceneTbl a left join UserTbl b on a.UserId = b.Id';
    if (req.session.SuperUser != 1) {
        var UserId = req.session.UserId;
        sql += ` WHERE a.UserId = '${UserId}'`;
    }
    mysqlQuery(sql, function (err, acc) {
        var total = acc[0].count;
        totalPage = Math.ceil(total / linePerPage);
        sql = 'SELECT a.*,b.Account from SceneTbl a left join UserTbl b on a.UserId = b.Id';
        if (req.session.SuperUser != 1) {      
            var UserId = req.session.UserId;
            sql += ` WHERE a.UserId = '${UserId}'`;
        }
        sql += (` limit ${index * linePerPage},${linePerPage}`);
        mysqlQuery(sql, function (err, accounts) {
            if (err) {
                console.log(err);
            }
            var data = accounts;

            // use scene.ejs
            res.render('scene', { title: 'Scene Information', data: data, SearchAccount: SearchAccount,
             index: index, totalPage: totalPage, linePerPage: linePerPage });
        });
    });
});

router.get('/search', function (req, res, next) {
    if (!checkSession(req, res)) {
        return;
    }
    var index = parseInt(req.query.index) ? parseInt(req.query.index) : 0;
    if (index < 0) {
        index = 0;
    }
    var SearchAccount = req.query.SearchAccount;
    var mysqlQuery = req.mysqlQuery;

    if (req.session.SuperUser != 1) {        
        return;
    }
    var sql = `SELECT count(*) as count from SceneTbl a left join UserTbl b on a.UserId = b.Id \
                WHERE b.Account LIKE '%${SearchAccount}%'`;
    mysqlQuery(sql, function (err, acc) {
        var total = acc[0].count;
        totalPage = Math.ceil(total / linePerPage);
        sql = `SELECT a.*,b.Account from SceneTbl a left join UserTbl b on a.UserId = b.Id \
                WHERE b.Account LIKE '%${SearchAccount}%'`;
        sql += (` limit ${index * linePerPage},${linePerPage}`);
        mysqlQuery(sql, function (err, accounts) {
            if (err) {
                console.log(err);
            }
            var data = accounts;

            // use user.ejs
            res.render('scene', { title: 'Scene Information', data: data, SearchAccount: SearchAccount,
                index: index, totalPage: totalPage, linePerPage: linePerPage });
        });
    }); 
});
/*
// add page
router.get('/add', function (req, res, next) {
    if (!checkSession(req, res)) {
        return;
    }
    // use userAdd.ejs
    res.render('sceneAdd', { title: 'Add Scene', msg: '' });
});

// add post
router.post('/sceneAdd', function (req, res, next) {
    if (!checkSession(req, res)) {
        return;
    }
    var mysqlQuery = req.mysqlQuery;

    // check Account exist
    var Account = req.body.Account;
    mysqlQuery('SELECT Account FROM SceneTbl WHERE Account = ?', Account, function (err, accounts) {
        if (err) {
            console.log(err);
        }

        var count = accounts.length;
        if (count > 0) {

            var msg = 'Account already exists.';
            res.render('userAdd', { title: 'Add User', msg: msg });

        } else {

            var sql = {
                Account: req.body.Account,
                Password: req.body.Password,
                CreateDate: Date.now() / 1000
            };

            //console.log(sql);
            mysqlQuery('INSERT INTO SceneTbl SET ?', sql, function (err, accounts) {
                if (err) {
                    console.log(err);
                }
                res.setHeader('Content-Type', 'application/json');
                res.redirect('/scene');
            });
        }
    });
});

// edit page
router.get('/sceneEdit', function (req, res, next) {
    if (!checkSession(req, res)) {
        return;
    }
    var UserId = req.query.UserId;

    var mysqlQuery = req.mysqlQuery;

    mysqlQuery('SELECT * FROM SceneTbl WHERE UserId = ?', UserId, function (err, accounts) {
        if (err) {
            console.log(err);
        }

        var data = accounts;
        res.render('sceneEdit', { title: 'Edit Scene', data: data });
    });

});


router.post('/sceneEdit', function (req, res, next) {
    if (!checkSession(req, res)) {
        return;
    }
    var mysqlQuery = req.mysqlQuery;
    var UserId = req.body.UserId;

    var sql = {
        Account: req.body.Account
    };

    if (req.body.Password) {
        sql.Password = req.body.Password;
    }

    if (req.body.Enable) {
        sql.Enable = req.body.Enable;
    }

    if (req.body.SuperUser) {
        sql.SuperUser = req.body.SuperUser;
    }
    mysqlQuery('UPDATE SceneTbl SET ? WHERE UserId = ?', [sql, UserId], function (err, accounts) {
        if (err) {
            console.log(err);
        }
        res.redirect('/scene');
    });
});


router.get('/sceneDelete', function (req, res, next) {
    if (!checkSession(req, res)) {
        return;
    }
    var UserId = req.query.UserId;
    var mysqlQuery = req.mysqlQuery;

    mysqlQuery('DELETE FROM SceneTbl WHERE UserId = ?', UserId, function (err, accounts) {
        if (err) {
            console.log(err);
        }
        res.redirect('/scene');
    });
});
*/
module.exports = router;
