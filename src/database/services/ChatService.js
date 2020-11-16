const connection = require('../connection');

module.exports = {
    async addChat(User_To_ID, Message, User_ID) {
        try {
            let chat = await connection('chat')
                .where('User1_ID', User_To_ID)
                .orWhere('User1_ID', User_ID)
                .andWhere('User2_ID', User_To_ID)
                .orWhere('User2_ID', User_ID)
                .select('*').first();

            let chatId;
            if (!chat)
                await connection('chat').insert({
                    User1_ID: User_ID,
                    User2_ID: User_To_ID
                }).returning('Id').then(Id => chatId = Id[0]);
            else chatId = chat.Id;

            await connection('chat_message').insert({
                User_ID: User_ID,
                Chat_ID: chatId,
                Message,
                created_at: new Date().toLocaleString()
            });
        }
        catch (err) {
            throw err;
        }
    },
    async getChatsByUser(userID) {
        try {
            const chats = await connection('chat')
                .leftJoin('user as uO', 'chat.User1_ID', 'uO.Id')
                .leftJoin('user as uD', 'chat.User2_ID', 'uD.Id')
                .select('uO.FirstName as OriginUserName',
                    'uD.FirstName as DestinationUserName',
                    'uO.ProfileImageUrl as OriginUserImageUrl',
                    'uD.ProfileImageUrl as DestinationUserImageUrl',
                    'uO.Id as OriginUserId',
                    'uD.Id as DestinationUserId',
                    'chat.Id')
                .where('User1_ID', userID)
                .orWhere('User2_ID', userID);

            return chats;
        }
        catch (err) {
            throw err;
        }
    },
    async getMessagesByChat(chatID) {
        try {
            const messages = await connection('chat_message')
                .leftJoin('user', 'chat_message.User_ID', 'user.Id')
                .leftJoin('chat', 'chat_message.Chat_ID', 'chat.Id')
                .where('chat_message.Chat_ID', chatID)
                .select(
                    'chat.User1_ID',
                    'chat.User2_ID',
                    'chat_message.Id',
                    'chat_message.message',
                    'chat_message.created_at',
                    'user.FirstName',
                    'chat_message.User_ID'
                );

            return messages;
        }
        catch (err) {
            throw err;
        }
    }
};

