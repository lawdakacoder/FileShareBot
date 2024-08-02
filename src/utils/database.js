/**
Save message secret key and its sender id with message id.
**/
export async function saveMessageKey(messageId, secretKey, senderId) {
    const msgJson = {secret: secretKey, sender: senderId};
    await msgs_keys.put(messageId.toString(), JSON.stringify(msgJson));
}

/**
Get message secret key and its sender id with message id.
**/
export async function getMessageKey(messageId) {
    const msgJson = await msgs_keys.get(messageId);

    // Support older files.
    if (!msgJson?.startsWith('{')) {
        return msgJson;
    }

    return JSON.parse(msgJson);
}

/**
Delete message secret key with message id.
**/
export async function deleteMessageKey(messageId) {
    await msgs_keys.delete(messageId.toString());
}

/**
Ban the given chat.
**/
export async function banChat(chatId, reason) {
    const chatJson = {isBanned:true, banReason:reason};
    await users.put(chatId, JSON.stringify(chatJson));
}

/**
Unban the given chat.
**/
export async function unbanChat(chatId) {
    await users.delete(chatId);
}

/**
Check if chat is banned.
**/
export async function banStatus(chatId) {
    let chatJson = {isBanned: false, banReason: ''};
    const fetchedData = await users.get(chatId);

    if (fetchedData) {
        chatJson = JSON.parse(fetchedData);
    }

    return chatJson;
}
