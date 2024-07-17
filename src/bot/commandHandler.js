import { ADMIN_IDS, CHANNEL_ID } from "../config";
import { copyMessage, deleteMessage, sendMessage } from "../telegram/api";
import { banChat, deleteMessageKey, getMessageKey, unbanChat } from "../utils/database";
import { isPositiveIntegerString } from "../utils/logic";
import { Texts } from "../utils/static";
import { handleDeepLink } from "./deeplinkHandler";

async function startCommand(message, args) {
    if (args.length !== 0) {
        await handleDeepLink(message, args[0]);
        return;
    }

    const { from: user, chat } = message;
    const response = Texts.startCommand
    .replace('{first_name}', user.first_name);
    const reply_markup = {
        inline_keyboard: [[{ text: 'Source Code', url: 'https://github.com/lawdakacoder/FileShareBot' }]]
    };

    await sendMessage(chat.id, response, message.message_id, reply_markup);
}

async function banCommand(message, args) {
    const { from: user, chat } = message;

    if (!ADMIN_IDS.includes(user.id)) return;

    const chatId = isPositiveIntegerString(args[0]);

    if (!chatId || args.length < 2) {
        await sendMessage(chat.id, Texts.banCommand, message.message_id);
        return;
    }

    const response = Texts.chatBanned
    .replace('{chat_id}', chatId);

    await banChat(chatId, args.slice(1).join(' '));
    await sendMessage(chat.id, response, message.message_id);
}

async function unbanCommand(message, args) {
    const { from: user, chat } = message;
    
    if (!ADMIN_IDS.includes(user.id)) return;

    const chatId = isPositiveIntegerString(args[0]);

    if (!chatId || args.length !== 1) {
        await sendMessage(chat.id, Texts.unbanCommand, message.message_id);
        return;
    }

    const response = Texts.chatUnbanned
    .replace('{chat_id}', chatId);

    await unbanChat(chatId);
    await sendMessage(chat.id, response, message.message_id);
}

export async function getCommand(message, args) {
    const { chat } = message;

    if (args.length === 0) {
        await sendMessage(chat.id, Texts.getCommand, message.message_id);
        return;
    }

    const argsArray = args[0].split('_');

    if (argsArray.length !== 2) {
        await sendMessage(chat.id, Texts.invalidArgument, message.message_id);
        return;
    }

    const storedMessageKey = await getMessageKey(argsArray[0]);
    
    if (argsArray[1] !== storedMessageKey) {
        await sendMessage(chat.id, Texts.fileIdInvalid, message.message_id);
        return;
    }
    
    await copyMessage(
        chat.id,
        CHANNEL_ID,
        isPositiveIntegerString(argsArray[0]),
        message.message_id
    );
}

export async function deleteCommand(message, args) {
    const { chat } = message;

    if (args.length === 0 ) {
        await sendMessage(chat.id, Texts.deleteCommand, message.message_id);
        return;
    }

    const argsArray = args[0].split('_');

    if (argsArray.length !== 2) {
        await sendMessage(chat.id, Texts.invalidArgument, message.message_id);
        return;
    }

    const storedMessageKey = await getMessageKey(argsArray[0]);

    if (argsArray[1] !== storedMessageKey) {
        await sendMessage(chat.id, Texts.fileIdInvalid, message.message_id);
        return;
    }

    await deleteMessageKey(argsArray[0]);
    await deleteMessage(CHANNEL_ID, isPositiveIntegerString(argsArray[0]));
    await sendMessage(chat.id, Texts.fileIsDeleted, message.message_id);
}

export async function helpCommand(message) {
    const { chat } = message;
    await sendMessage(chat.id, Texts.helpCommand, message.message_id);
}

async function unknownCommand(message) {
    const { chat } = message;
    await sendMessage(chat.id, Texts.unknownCommand, message.message_id);
}

export async function handleCommand(message) {
    const { text } = message;
    const [ command, ...args ] = text.split(' ');

    switch (command) {
        case '/start':
            await startCommand(message, args);
            break;
        case '/ban':
            await banCommand(message, args);
            break;
        case '/unban':
            await unbanCommand(message, args);
            break;
        case '/get':
            await getCommand(message, args);
            break;
        case '/del':
            await deleteCommand(message, args);
            break;
        case '/help':
            await helpCommand(message);
            break;
        default:
            await unknownCommand(message);
    }
}