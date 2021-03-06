var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

router.get('/', function(req, res, next) {
    res.redirect('/board/list/1');
});

router.get('/list', function(req, res, next) {
    res.redirect('/board/list/1');
});

// 글 리스트
router.get('/list/:page', function(req, res, next) {
    var page = req.params.page;
    var sql = "select idx, name, title, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, " +
        "date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate from board";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        res.render('list', {title: '게시판 리스트', rows: rows,session:req.session.user});
    });
});


// 글작성
router.get('/write', function(req,res,next){
    res.render('write',{title : "게시판 글 쓰기",name:req.session.user.name});
});

router.post('/write', function(req,res,next){
    var name = req.session.user.name;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var email = req.session.user.email;
    var datas = [name,title,content,passwd,email];
 
    var sql = "insert into board(name, title, content, regdate, modidate, passwd,hit,email) values(?,?,?,now(),now(),?,0,?)";
    conn.query(sql,datas, function (err, rows) {
        if (err) console.error("err : " + err);
        res.redirect('/board/list');
    });
});

// 상세보기
router.get('/read/:idx',function(req,res,next)
{
var idx = req.params.idx;
    var sql = "select idx, name, title, content, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, " +
        "date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate,hit from board where idx=?";
    conn.query(sql,[idx], function(err,row)
    {
        if(err) console.error(err);
        res.render('read', {title:"글 상세", row:row[0]});
    });
});

// 글 수정
router.post('/update',function(req,res,next)
{
    var idx = req.body.idx;
    var name = req.body.name;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var datas = [name,title,content,idx,passwd];

    if (req.session.user){
        if (req.session.user.name != name) {
            res.send("<script>alert('글을 작성한 사용자가 아닙니다.');history.back();</script>");
        } else{
            var sql = "update board set name=? , title=?,content=?, modidate=now() where idx=? and passwd=?";
            conn.query(sql,datas, function(err,result)
            {
                if(err) console.error(err);
                if(result.affectedRows == 0)
                {
                    res.send("<script>alert('패스워드가 일치하지 않습니다.');history.back();</script>");
                }
                else
                {
                    res.redirect('/board/read/'+idx);
                }
            });
        }
    } else{
        res.send("<script>alert('로그인 후 이용해주세요');history.back();</script>");
    }
 
    
});

// 글삭제
router.post('/delete',function(req,res,next)
{
    var idx = req.body.idx;
    var passwd = req.body.passwd;
    var datas = [idx,passwd];

    var sql = "delete from board where idx=? and passwd=?";
    conn.query(sql,datas, function(err,result)
    {
        if(err) console.error(err);
        // affectedRow : 변경된 row 의 수를 가져옴
        if(result.affectedRows == 0)
        {
            res.send("<script>alert('패스워드가 일치하지 않습니다.');history.back();</script>");
        }
        else
        {
            res.redirect('/board/list/');
        }
    });
});

module.exports = router;

