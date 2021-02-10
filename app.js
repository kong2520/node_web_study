const express = require('express');
const app = express();
const PORT= 3000;
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false}))
// routes
var userRouter = require('./routes/user');
var boardRouter = require('./routes/board');

// session
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',           
    resave: true,
    saveUninitialized:true
}));

// 뷰엔진 설정
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

// use routes
app.use("/", boardRouter);
app.use('/board', boardRouter);
app.use('/user',userRouter);

//listen
app.listen(PORT, function () {
    console.log('Example app listening on port',PORT);
});