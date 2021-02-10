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
                    email: email,
                    authorized: true
                };
            if(req.session.user == null){
                console.log('hi')
            };
            res.redirect('../board/list/');
            // res.render('list', {username:username});
        }
    });
});

// 로그아웃
router.get('/logout', function(req, res, next) {
    if (req.session.user) {
        console.log('로그아웃 처리');
        req.session.destroy(
            function (err) {
                if (err) {
                    console.log('세션 삭제시 에러');
                    return;
                }
                res.redirect('../board/list');
            }
        );     
    } else {
        console.log('로그인 안되어 있음');
        res.redirect('../board/list');
    }
});

// 회원가입
router.post('/signup', function(req,res,next){
    var name = req.body.name;
    var email = req.body.email;
    var passwd = req.body.passwd;
    var datas = [name,email,passwd];

    var sql = "select email from users where email = ?";
    conn.query(sql,email, function(err,rows)
    {
        if(err) console.error(err);
        if(rows.length > 0)
        {
            res.send("<script>alert('동일한 이메일이 있습니다. 다시 가입해주세요');history.back();</script>");
        } else {
            var sql = "insert into users(name, email, passwd, created) values(?,?,?,now())";
            conn.query(sql,datas, function (err, rows) {
            if (err) console.error("err : " + err);
            // res.send("<script>alert('회원가입이 완료되었습니다. 로그인 후 이용해주세요');</script>");
            res.redirect('/board/list');
    });
        }
    });
});

module.exports = router;