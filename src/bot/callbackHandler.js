import { ADMIN_IDS } from "../config";
import { answerCallbackQuery, deleteMessage } from "../telegram/api";
import { banChat } from "../utils/database";
import { isPositiveIntegerString } from "../utils/logic";
import { Texts } from "../utils/static";
import { deleteCommand, getCommand } from "./commandHandler";

async function deleteChannelFile(query) {
    const { id, message, from: user } = query;

    if (!ADMIN_IDS.includes(user.id)) {
        await answerCallbackQuery(id, Texts.userNotAuthorized, true);
        return;
    }

    await deleteMessage(message.chat.id, message.message_id);
    await answerCallbackQuery(id, Texts.fileIsDeleted, true);
}

async function banSender(query, args) {
    const { id, from: user } = query;

    if (!ADMIN_IDS.includes(user.id)) {
        await answerCallbackQuery(id, Texts.userNotAuthorized, true);
        return;
    }
    
    await banChat(isPositiveIntegerString(args[0]), 'Unknown.');
    await answerCallbackQuery(id, `Banned ${args[0]}.`, true);
}

export async function handleCallbackQuery(callbackQuery) {
    const { id, data: text } = callbackQuery;
    const [query, ...args] = text.split('/')

    switch (query) {
        case 'deleteChannelFile':
            await deleteChannelFile(callbackQuery);
            break;
        case 'banSender':
            await banSender(callbackQuery, args);
            break;
        case 'revoke':
            await deleteCommand(callbackQuery.message, args);
            await answerCallbackQuery(id, Texts.queryExecuted);
            break;
        case 'getFile':
            await getCommand(callbackQuery.message, args);
            await answerCallbackQuery(id, Texts.queryExecuted);
            break;
        default:
            await answerCallbackQuery(id, Texts.queryDataInvalid, true);
    }
}