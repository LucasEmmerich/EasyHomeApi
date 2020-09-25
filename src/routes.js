const express = require('express');
const routes = express.Router();
const multer = require('multer');
const fs = require('fs');
const UserController = require('./controllers/UserController');
const PropriedadeController = require('./controllers/PropriedadeController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let propId = req.body.Propriedade_ID;
        let propImagesDirectory = `./src/public/propriedades/${propId}/`;
        !fs.existsSync(propImagesDirectory) && fs.mkdirSync(propImagesDirectory);
        cb(null, propImagesDirectory);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

//usuario
routes.post('/login', UserController.login);
routes.post('/user', UserController.createUser);
//usuario

//propriedade
routes.get('/propriedade', PropriedadeController.listAllPropriedades);
routes.get('/user/propriedade', PropriedadeController.listPropriedadeByUser);
routes.post('/propriedade',PropriedadeController.createPropriedade);
routes.post('/propriedade/imagens',upload.array('image' , 10),PropriedadeController.uploadPropriedadeImagens);
routes.put('/propriedade', PropriedadeController.updatePropriedade);
routes.delete('/propriedade/:id', PropriedadeController.deletePropriedade);
//propriedade

//image
routes.get('/public/propriedades/:id/:file',async (req,res) => { return res.sendFile(`${__dirname}/public/propriedades/${req.params.id}/${req.params.file}`); });

module.exports = routes;