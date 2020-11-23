const chatService = require('../database/services/ChatService');
const tokenHandler = require('../handlers/tokenHandler');
const UnauthorizedTokenError = require('../errors/UnauthorizedTokenError');
const Chat = require('../model/Chat');

module.exports = {
    async addChat(request, response, errorHandler) {
        try {
            const Message  = request.body.Message;
            const User_From_ID = tokenHandler.getUserInfoByToken(request.headers.authorization).Id;
            const User_To_ID = request.body.User_To_ID;
            const chat = new Chat(User_From_ID,User_To_ID,Message);

            if(chat.valid) chat.id = await chatService.addChat(chat.getEntity());

            return response.status(201).send();
        }
        catch (err) {
            errorHandler(err);
        }
    },
    async getChatsByUser(request, response,errorHandler) {
        try {
            const userInfo = tokenHandler.getUserInfoByToken(request.headers.authorization);

            const chats = await chatService.getChatsByUser(userInfo.Id);

            return response.status(200).json(chats);
        }
        catch (err) {
            errorHandler(err);
        }
    },
    async getMessagesByChat(request, response, errorHandler) {
        try {
            const chatId = request.params.chatId;

            const userInfo = tokenHandler.getUserInfoByToken(request.headers.authorization);

            const messages = await chatService.getMessagesByChat(chatId);

            if (messages[0].User1_ID !== userInfo.Id && messages[0].User2_ID !== userInfo.Id) 
                throw new UnauthorizedTokenError('Chats não pertencentes ao Usuário.');

            return response.status(200).json(messages);
        }
        catch (err) {
            errorHandler(err);
        }
    }
};

