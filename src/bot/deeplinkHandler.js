import { sendMessage } from "../telegram/api";
import { Texts } from "../utils/static";
import { deleteCommand, getCommand, helpCommand } from "./commandHandler";

export async function handleDeepLink(message, arg) {
    const [deeplink, ...args] = arg.split('-');

    switch (deeplink) {
        case 'help':
            await helpCommand(message);
            break;
        case 'getFile':
            await getCommand(message, args);
            break;
        case 'delete':
            await deleteCommand(message, args);
            break;
        default:
            const text = Texts.invalidArgument;
            await sendMessage(message.chat.id, text, message.message_id);
    }
}