const express = require('express');
const routes = express.Router();
const multer = require('multer');
const UserController = require('./controllers/UserController');
const PropriedadeController = require('./controllers/PropriedadeController');


var storage = multer.memoryStorage()
var upload = multer({ storage: storage });

//usuario
routes.post('/login',UserController.login);
routes.post('/user', UserController.createUser);
// routes.get('/user', UserController.listUser);
//usuario

//propriedade
routes.get('/propriedade', PropriedadeController.listAllPropriedades);
routes.get('/user/propriedade', PropriedadeController.listPropriedadeByUser);
routes.post('/propriedade',upload.array('file'), PropriedadeController.createPropriedade);
routes.put('/propriedade', PropriedadeController.updatePropriedade);
routes.delete('/propriedade/:id', PropriedadeController.deletePropriedade);
//propriedade



module.exports = routes;