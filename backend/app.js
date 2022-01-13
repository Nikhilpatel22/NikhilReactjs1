const express = require('express');
const app = express();
const router = require('./routes/route');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('./database/conn')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));


//app.use(express.static(path.join(__dirname,'public')));

// var corsOptions = {
//     origin: "http://localhost:8081"
//   };
app.use(cors());
//app.get('/getUsers',router);
//app.get('/',router)
//app.post('/getUsers/addUser',router);
app.use('/users',router);

module.exports = app;