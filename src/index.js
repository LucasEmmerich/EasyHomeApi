const express = require('express');
const routes = require('./routes');
const cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();//always first
 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser()); 


app.use(express.json());
app.use(routes);
app.listen(3333);
