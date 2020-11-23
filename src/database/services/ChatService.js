const connection = require('../connection');

module.exports = {
    async addChat(chat) {
        console.log(chat)
        const existentChat = await connection('chat')
            .where('User1_ID', chat.User2_ID)
            .orWhere('User1_ID', chat.User1_ID)
            .andWhere('User2_ID', chat.User2_ID)
            .orWhere('User2_ID', chat.User1_ID)
            .select('*')
            .first();

        let chatID;
        if (!existentChat) {
            chatID = await connection('chat').insert({
                User1_ID: chat.User1_ID,
                User2_ID: chat.User2_ID
            }).then(Id => Id[0]);
        }
        else chatID = existentChat.Id;

        await connection('chat_message').insert({
            User_ID: chat.User1_ID,
            Chat_ID: chatID,
            Message: chat.Message,
            created_at: new Date().toLocaleString('pt-BR')
        });
    },
    async getChatsByUser(userID) {
        const chats = await connection('chat')
            .leftJoin('user as user1', 'chat.User1_ID', 'user1.Id')
            .leftJoin('user as user2', 'chat.User2_ID', 'user2.Id')
            .select('user1.FirstName as OriginUserName',
                'user2.FirstName as DestinationUserName',
                'user1.ProfileImageUrl as OriginUserImageUrl',
                'user2.ProfileImageUrl as DestinationUserImageUrl',
                'user1.Id as OriginUserId',
                'user2.Id as DestinationUserId',
                'chat.Id')
            .where('User1_ID', userID)
            .orWhere('User2_ID', userID);

        return chats;
    },
    async getMessagesByChat(chatID) {
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
};

