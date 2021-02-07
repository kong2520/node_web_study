const e = require('express');
var express = require('express');
var router = express.Router();

var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

router.get("/login", (req, res) => res.render("login", {page: "login"}));
router.get("/signup", (req, res) => res.render("signup", {page: "signup"}));

// 로그인
router.post('/login', function(req, res, next) {
    var email = req.body.email;
    var passwd =  req.body.passwd;
    var datas = [email,passwd]
    var sql = "select name, passwd, email from users where email=? and passwd=?";
    conn.query(sql,datas, function (err, rows) {
        if (err) console.error("err : " + err);
        if(rows.length == 0)
        {
            res.send("<script>alert('정보가 틀렸습니다. 다시 입력해주세요');history.back();</script>");
        }
        else
        {   
            // 세션
            req.session.user =
                {
                    name: rows[0].name,
                    pw: passwd,
                    authorized: true
                };
            if(req.session.user == null){
                console.log('hi')
            } else{
                console.log(req.session.user)
            };
            res.redirect('../board/list/');
        }
    });
});

router.get('/logout', function(req, res, next) {
    if (req.session.user) {
        console.log('로그아웃 처리');
        req.session.destroy(
            function (err) {
                if (err) {
                    console.log('세션 삭제시 에러');
                    return;
                }
                console.log('세션 삭제 성공');
                res.redirect('../board/list');
            }
        );     
    } else {
        console.log('로그인 안되어 있음');
        res.redirect('../board/list');
    }
});

module.exports = router;