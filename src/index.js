const express = require('express');
const routes = require('./routes');
const cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');
const httpErrorHandler = require('./handlers/httpErrorHandler');
const cors = require('cors');
const app = express();//always first
 

const ENVIROMENT = process.argv[2];
//fazer distinção de ambient


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser()); 
app.use(routes);
app.use((err, req, res, next) => {
    httpErrorHandler(err,res);
});

app.listen(3333);
