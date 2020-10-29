const connection = require('../database/connection');
const tokenHelper = require('../helpers/tokenHelper');

module.exports = {
    async addChat(request, response) {
        const { User_To_ID, Message } = request.body;
        let User_ID;

        let userInfo;
        try {
            userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);
            User_ID = userInfo.Id;
        }
        catch (err) {
            return response.json({ status: 401, message: 'Unauthorized' });
        }
        if(userInfo.Id != User_ID){
            return response.json({ status: 401, message: 'Unauthorized' });
        }
        
        let chat = await connection('chat')
        .where('User1_ID',User_To_ID)
        .orWhere('User1_ID',User_ID)
        .andWhere('User2_ID',User_To_ID)
        .orWhere('User2_ID',User_ID)
        .select('*').first();

        let chatId;
        if(!chat){
            await connection('chat').insert({
                User1_ID: User_ID,
                User2_ID: User_To_ID
            }).returning('Id').then(Id => chatId = Id[0]);
        }
        else{
            chatId = chat.Id;
        }

        await connection('chat_message').insert({
            User_ID: User_ID,
            Chat_ID: chatId,
            Message,
            created_at: new Date().toLocaleString()
        });
        
        return response.json({ status: 201});
    },
    async getChatsByUser(request,response){
        let userInfo;

        try {
            userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);
        }
        catch (err) {
            return response.json({ status: 401, message: 'Unauthorized' });
        }

        let chats = await connection('chat')
        .leftJoin('user as uO','chat.User1_ID','uO.Id')
        .leftJoin('user as uD','chat.User2_ID','uD.Id')
        .select('uO.Name as OriginUserName',
        'uD.Name as DestinationUserName',
        'uO.ProfileImageUrl as OriginUserImageUrl',
        'uD.ProfileImageUrl as DestinationUserImageUrl',
        'uO.Id as OriginUserId',
        'uD.Id as DestinationUserId',
        'chat.Id')
        .where('User1_ID',userInfo.Id)
        .orWhere('User2_ID',userInfo.Id);

        return response.json(chats);
    },
    async getMessagesByChat(request,response){
        let chatId = request.params.chatId;

        let userInfo;

        try {
            userInfo = tokenHelper.getUserInfoByToken(request.headers.authorization);
        }
        catch (err) {
            return response.json({ status: 401, message: 'Unauthorized' });
        }

        let chats = await connection('chat_message')
        .leftJoin('user','chat_message.User_ID','user.Id')
        .where('chat_message.Chat_ID',chatId)
        .select('chat_message.Id','chat_message.message','chat_message.created_at','user.Name','chat_message.User_ID');

        return response.json(chats);
    }
};

