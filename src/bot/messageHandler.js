import { ADMIN_IDS, BOT_USERNAME, CHANNEL_ID } from "../config";
import { copyMessage, sendMessage } from "../telegram/api";
import { banStatus, saveMessageKey } from "../utils/database";
import { generateUrlSafeToken } from "../utils/misc";
import { Texts } from "../utils/static";
import { handleCommand } from "./commandHandler";

async function generatePostMarkup(chatId) {
    return {
        inline_keyboard: [
            [{ text: 'Delete File', callback_data: 'deleteChannelFile' }],
            [{ text: 'Ban Sender', callback_data: `banSender/${chatId}` }]
        ]
    };
}

async function generateResponseMarkup(fileId) {
    return {
        inline_keyboard: [
            [{ text: 'Revoke Link', callback_data: `revoke/${fileId}` }],
            [{ text: 'Get File', callback_data: `getFile/${fileId}` }]
        ]
    };
}

async function handleFileCopy(message, secretToken) {
    const { chat } = message;
    const replyMarkup = await generatePostMarkup(chat.id);
    const copiedMessage = await copyMessage(
        CHANNEL_ID,
        chat.id,
        message.message_id,
        null,
        replyMarkup
    );

    await saveMessageKey(copiedMessage.result.message_id, secretToken);

    return copiedMessage.result.message_id;
}

async function sendFileSavedMessage(chatId, messageId, fileId, fileLink) {
    const response = Texts.fileSaved
        .replace('{file_id}', fileId)
        .replace('{file_link}', fileLink);
    const replyMarkup = await generateResponseMarkup(fileId);

    await sendMessage(chatId, response, messageId, replyMarkup);
}

async function handleUserFile(message) {
    const secretToken = generateUrlSafeToken(16);
    const copiedMessageId = await handleFileCopy(message, secretToken);
    const fileId = `${copiedMessageId}_${secretToken}`;
    const fileLink = `https://t.me/${BOT_USERNAME}?start=getFile-${fileId}`;

    await sendFileSavedMessage(message.chat.id, message.message_id, fileId, fileLink);
}

async function handleBanStatus(chatId, messageId) {
    const { isBanned, banReason } = await banStatus(chatId);

    if (isBanned) {
        const reason = Texts.chatIsBanned
        .replace('{reason}', banReason);
        await sendMessage(chatId, reason, messageId);
    }

    return isBanned;
}

export async function handleMessage(message) {
    const { chat, text } = message;
    const isOwner = ADMIN_IDS.includes(chat.id);

    if (text?.startsWith('/')) {
        await handleCommand(message);
        return;
    }

    if (!isOwner) {
        if (chat.type !== 'private') {
            return;
        }

        const isBanned = await handleBanStatus(chat.id, message.message_id);
        if (isBanned) {
            return;
        }
    }

    if (message.document || message.audio || message.video || message.photo || message.voice) {
        await handleUserFile(message);
    }
}
