import { config } from "../config";

/**
Send request to Bot API.
**/
async function sendRequest(
    method,
    payload,
    isFormData = false
) {
    const url = `${config.telegram.API}/bot${config.bot.TOKEN}/${method}`;
    const options = {
        method: 'POST',
        headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
        body: isFormData ? payload : JSON.stringify(payload)
    };
    const response = await fetch(url, options);

    return await response.json();
}

/**
Send message to Telegram.
**/
export async function sendMessage(
    chatId,
    text,
    replyToMessageId = null,
    replyMarkup = null
) {
    const payload = {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
    };

    if (replyToMessageId) {
        payload.reply_parameters = {message_id: replyToMessageId};
    }

    if (replyMarkup) {
        payload.reply_markup = replyMarkup;
    }

    return await sendRequest('sendMessage', payload);
}

/**
Forward message to another Telegram chat.
**/
export async function forwardMessage(
    chatId,
    originChatId,
    messageId
) {
    const payload = {
        chat_id: chatId,
        from_chat_id: originChatId,
        message_id: messageId
    };

    return await sendRequest('forwardMessage', payload);
}

/**
Copy message to another Telegram chat.
**/
export async function copyMessage(
    chatId,
    originChatId,
    messageId,
    protectContent = false,
    replyToMessageId = null,
    replyMarkup = null
) {
    const payload = {
        chat_id: chatId,
        from_chat_id: originChatId,
        message_id: messageId,
        protect_content: protectContent,
        parse_mode: 'HTML'
    };

    if (replyToMessageId) {
        payload.reply_parameters = {message_id: replyToMessageId};
    }

    if (replyMarkup) {
        payload.reply_markup = replyMarkup;
    }

    return await sendRequest('copyMessage', payload);
}

/**
Edit Telegram message.
**/
export async function editMessageText(
    chatId,
    messageId,
    text,
    replyMarkup = null
) {
    const payload = {
        chat_id: chatId,
        message_id: messageId,
        text: text,
        parse_mode: 'HTML'
    };

    if (replyMarkup) {
        payload.reply_markup = replyMarkup;
    }

    return await sendRequest('editMessageText', payload);
}

/**
Delete Telegram message.
**/
export async function deleteMessage(
    chatId,
    messageId
) {
    const payload = {
        chat_id: chatId,
        message_id: messageId
    };

    return await sendRequest('deleteMessage', payload);
}

/**
Answer callback query.
**/
export async function answerCallbackQuery(
    id,
    text,
    show_alert = false
) {
    const payload = {
        callback_query_id: id,
        text: text,
        show_alert: show_alert
    };

    return await sendRequest('answerCallbackQuery', payload);
}
