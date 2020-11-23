const express = require('express');
const routes = express.Router();
const multer = require('multer');
const fs = require('fs');
const UserController = require('./controllers/UserController');
const PropertyController = require('./controllers/PropertyController');
const ChatController = require('./controllers/ChatController');

//#region User

const storageUser = multer.diskStorage({
    destination: function (req, file, cb) {
        let userId = req.body.User_ID;
        let userImageDirectory = `./src/public/user/${userId}/`;
        !fs.existsSync(userImageDirectory) && fs.mkdirSync(userImageDirectory);
        cb(null, userImageDirectory);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadUser = multer({ storage: storageUser });

routes.post('/login', UserController.login);
routes.post('/user' , UserController.createUser);
routes.post('/user/image' ,uploadUser.single('userImage'), UserController.uploadUserImg);
//#endregion

//#region Property
routes.get('/property', PropertyController.listAllProperties);
routes.get('/user/property', PropertyController.listPropertyByUser);
routes.post('/property',PropertyController.createProperty);

//#region Property-Images
const storagePropriedade = multer.diskStorage({
    destination: function (req, file, cb) {
        let propId = req.body.Property_ID;
        let propImagesDirectory = `./src/public/property/${propId}/`;
        !fs.existsSync(propImagesDirectory) && fs.mkdirSync(propImagesDirectory);
        cb(null, propImagesDirectory);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadPropriedade = multer({ storage: storagePropriedade });

routes.post('/property/images',uploadPropriedade.array('image' , 10),PropertyController.uploadPropertyImages);
//#endregion

routes.put('/property', PropertyController.updateProperty);
routes.delete('/property/:id', PropertyController.deleteProperty);

//#endregion

//#region Chat
routes.post('/chat',ChatController.addChat);
routes.get('/chat',ChatController.getChatsByUser);
routes.get('/chat/:chatId/messages',ChatController.getMessagesByChat);
//#endregion

//#region GlobalImageHandler
routes.get('/public/:folder/:id/:file',async (req,res) => { return res.sendFile(`${__dirname}/public/${req.params.folder}/${req.params.id}/${req.params.file}`); });
//#endregion


module.exports = routes;