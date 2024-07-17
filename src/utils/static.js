export const Texts = {
    startCommand: `
Hi there, <b>{first_name}</b>! I save all your files in my archive channel and provide you with a link to access them.
    `,
    banCommand: `
Send <code>/ban</code> with user id and reason to ban the user.

<b>Example:</b>
<code>/ban 123456 reason here</code>
    `,
    unbanCommand: `
Send <code>/unban</code> with user id to unban the user.

<b>Example:</b>
<code>/unban 123456</code>
    `,
    helpCommand: `
<b>Avilable Commands:</b>
<code>/start</code> - Ping the bot.
<code>/get</code> - Get the file.
<code>/del</code> - Delete the file.
<code>/ban</code> - Ban the user. <b>(Admin only!)</b>
<code>/unban</code> - Unban the user. <b>(Admin only!)</b>
<code>/help</code> - Get help text.
    `,
    getCommand: `
Send <code>/get</code> with file id to get the stored file.

<b>Example:</b>
<code>/get 108_a36ee6be0d6c9e</code>
    `,
    deleteCommand: `
Send <code>/del</code> with file id to delete the stored file.

<b>Example:</b>
<code>/del 154_1b15d992eb6ee0</code>
    `,
    unknownCommand: 'Unknown command! Send <code>/help</code> to get list of available commands.',
    chatBanned: 'Banned <code>{chat_id}</code>.',
    chatUnbanned: 'Unbanned <code>{chat_id}</code>.',
    chatIsBanned: '<b>Sorry, you are banned from using this bot!</b>\n\n<b>Reason:</b>\n{reason}',
    fileSaved: `
<b>File has been saved!</b>

File ID:
<code>{file_id}</code>
File Link:
<code>{file_link}</code>
    `,
    invalidArgument: 'The provided argument is invalid.',
    fileIdInvalid: 'The provided file id is invalid.',
    fileNotFound: 'The file linked with provided file id not found.',
    fileIsDeleted: 'The file has been deleted.',
    queryExecuted: 'The query has been executed.',
    queryDataInvalid: 'Query data is invalid.',
    userNotAuthorized: 'You are not authorized to execute this.'
}