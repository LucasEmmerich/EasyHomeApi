const chatService = require('../database/services/ChatService');
const UnauthorizedTokenError = require('../errors/UnauthorizedTokenError');
const tokenHelper = require('../helpers/tokenHelper');

module.exports = {
    async addChat(request, response) {
        try {
            const { User_To_ID, Message } = request.body;

            const userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);

            const User_ID = userInfo.Id;

            await chatService.addChat(User_To_ID, Message, User_ID);

            return response.json({ status: 201 });
        }
        catch (err) {
            if (err.name == 'UnauthorizedTokenError') return response.json({ status: 401, message: 'Unauthorized' });
            else return response.json({ status: 500, message: 'Internal Error' })
        }
    },
    async getChatsByUser(request, response) {
        try {
            const userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);

            const chats = await chatService.getChatsByUser(userInfo.Id)

            return response.json(chats);
        }
        catch (err) {
            if (err.name == 'UnauthorizedTokenError') return response.json({ status: 401, message: 'Unauthorized' });
            else return response.json({ status: 500, message: 'Internal Error' })
        }
    },
    async getMessagesByChat(request, response) {
        try {
            const { chatId } = request.params;

            const userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);

            const messages = await chatService.getMessagesByChat(chatId);

            if (messages[0].User1_ID !== userInfo.Id && messages[0].User2_ID !== userInfo.Id) throw new UnauthorizedTokenError('Chats não pertencentes ao Usuário.');

            return response.json(messages);
        }
        catch (err) {
            if (err.name == 'UnauthorizedTokenError') return response.json({ status: 401, message: 'Unauthorized' });
            else return response.json({ status: 500, message: 'Internal Error' })
        }
    }
};

