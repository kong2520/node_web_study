const express = require('express');
const app = express();
const PORT= 3000;
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false}))
// routes
const indexRoute = require("./routes/index");
var mysqlRouter = require('./routes/mysql');
var userRouter = require('./routes/user');
var boardRouter = require('./routes/board');

// session
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',           //이때의 옵션은 세션에 세이브 정보를 저장할때 할때 파일을 만들꺼냐
                                //아니면 미리 만들어 놓을꺼냐 등에 대한 옵션들임
    resave: true,
    saveUninitialized:true
}));

// 뷰엔진 설정
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

// use routes
app.use("/", indexRoute);
app.use('/mysql', mysqlRouter);
app.use('/board', boardRouter);
app.use('/user',userRouter);

//listen
app.listen(PORT, function () {
    console.log('Example app listening on port',PORT);
});