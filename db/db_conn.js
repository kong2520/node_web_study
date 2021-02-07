var mysql = require('mysql');
 
module.exports = function () {
    return {
        init: function () {
            return mysql.createConnection({
                host    :'localhost',
                port : 3306,
                user : 'root',
                password : 'dlwlstjd324',
                database:'nodestudy'
            })
        }
    }
};