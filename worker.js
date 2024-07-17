// This file is auto generated and directly
// deployable to cloudflare workers from
// user dashboard.

(() => {
    // src/config.js
    var API_ROOT = "https://api.telegram.org";
    var SECRET_TOKEN = "";
    var BOT_TOKEN = "";
    var BOT_USERNAME = "";
    var CHANNEL_ID = -100123456789;
    var ADMIN_IDS = [1111111111, 2222222222];
  
    // src/telegram/api.js
    async function sendRequest(method, payload, isFormData = false) {
      const url = `${API_ROOT}/bot${BOT_TOKEN}/${method}`;
      const options = {
        method: "POST",
        headers: isFormData ? void 0 : { "Content-Type": "application/json" },
        body: isFormData ? payload : JSON.stringify(payload)
      };
      const response = await fetch(url, options);
      return await response.json();
    }
    async function sendMessage(chatId, text, replyToMessageId = null, replyMarkup = null) {
      const payload = {
        chat_id: chatId,
        text,
        parse_mode: "HTML"
      };
      if (replyToMessageId) {
        payload.reply_parameters = { message_id: replyToMessageId };
      }
      if (replyMarkup) {
        payload.reply_markup = replyMarkup;
      }
      return await sendRequest("sendMessage", payload);
    }
    async function copyMessage(chatId, originChatId, messageId, replyToMessageId = null, replyMarkup = null) {
      const payload = {
        chat_id: chatId,
        from_chat_id: originChatId,
        message_id: messageId,
        parse_mode: "HTML"
      };
      if (replyToMessageId) {
        payload.reply_parameters = { message_id: replyToMessageId };
      }
      if (replyMarkup) {
        payload.reply_markup = replyMarkup;
      }
      return await sendRequest("copyMessage", payload);
    }
    async function deleteMessage(chatId, messageId) {
      const payload = {
        chat_id: chatId,
        message_id: messageId
      };
      return await sendRequest("deleteMessage", payload);
    }
    async function answerCallbackQuery(id, text, show_alert = false) {
      const payload = {
        callback_query_id: id,
        text,
        show_alert
      };
      return await sendRequest("answerCallbackQuery", payload);
    }
  
    // src/utils/database.js
    async function saveMessageKey(messageId, secretKey) {
      await msgs_keys.put(messageId.toString(), secretKey);
    }
    async function getMessageKey(messageId) {
      return await msgs_keys.get(messageId);
    }
    async function deleteMessageKey(messageId) {
      await msgs_keys.delete(messageId);
    }
    async function banChat(chatId, reason) {
      const chatJson = { isBanned: true, banReason: reason };
      await users.put(chatId, JSON.stringify(chatJson));
    }
    async function unbanChat(chatId) {
      await users.delete(chatId);
    }
    async function banStatus(chatId) {
      let chatJson = { isBanned: false, banReason: "" };
      const fetchedData = await users.get(chatId);
      if (fetchedData) {
        chatJson = JSON.parse(fetchedData);
      }
      return chatJson;
    }
  
    // src/utils/misc.js
    function generateUrlSafeToken(len) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }
  
    // src/utils/static.js
    var Texts = {
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
      unknownCommand: "Unknown command! Send <code>/help</code> to get list of available commands.",
      chatBanned: "Banned <code>{chat_id}</code>.",
      chatUnbanned: "Unbanned <code>{chat_id}</code>.",
      chatIsBanned: "<b>Sorry, you are banned from using this bot!</b>\n\n<b>Reason:</b>\n{reason}",
      fileSaved: `
  <b>File has been saved!</b>
  
  File ID:
  <code>{file_id}</code>
  File Link:
  <code>{file_link}</code>
      `,
      invalidArgument: "The provided argument is invalid.",
      fileIdInvalid: "The provided file id is invalid.",
      fileNotFound: "The file linked with provided file id not found.",
      fileIsDeleted: "The file has been deleted.",
      queryExecuted: "The query has been executed.",
      queryDataInvalid: "Query data is invalid.",
      userNotAuthorized: "You are not authorized to execute this."
    };
  
    // src/utils/logic.js
    function isPositiveIntegerString(str) {
      const integerRegex = /^\d+$/;
      if (integerRegex.test(str)) {
        return parseInt(str, 10);
      }
      return null;
    }
  
    // src/bot/deeplinkHandler.js
    async function handleDeepLink(message, arg) {
      const [deeplink, ...args] = arg.split("-");
      switch (deeplink) {
        case "help":
          await helpCommand(message);
          break;
        case "getFile":
          await getCommand(message, args);
          break;
        case "delete":
          await deleteCommand(message, args);
          break;
        default:
          const text = Texts.invalidArgument;
          await sendMessage(message.chat.id, text, message.message_id);
      }
    }
  
    // src/bot/commandHandler.js
    async function startCommand(message, args) {
      if (args.length !== 0) {
        await handleDeepLink(message, args[0]);
        return;
      }
      const { from: user, chat } = message;
      const response = Texts.startCommand.replace("{first_name}", user.first_name);
      const reply_markup = {
        inline_keyboard: [[{ text: "Source Code", url: "https://github.com/lawdakacoder/FileShareBot" }]]
      };
      await sendMessage(chat.id, response, message.message_id, reply_markup);
    }
    async function banCommand(message, args) {
      const { from: user, chat } = message;
      if (!ADMIN_IDS.includes(user.id))
        return;
      const chatId = isPositiveIntegerString(args[0]);
      if (!chatId || args.length < 2) {
        await sendMessage(chat.id, Texts.banCommand, message.message_id);
        return;
      }
      const response = Texts.chatBanned.replace("{chat_id}", chatId);
      await banChat(chatId, args.slice(1).join(" "));
      await sendMessage(chat.id, response, message.message_id);
    }
    async function unbanCommand(message, args) {
      const { from: user, chat } = message;
      if (!ADMIN_IDS.includes(user.id))
        return;
      const chatId = isPositiveIntegerString(args[0]);
      if (!chatId || args.length !== 1) {
        await sendMessage(chat.id, Texts.unbanCommand, message.message_id);
        return;
      }
      const response = Texts.chatUnbanned.replace("{chat_id}", chatId);
      await unbanChat(chatId);
      await sendMessage(chat.id, response, message.message_id);
    }
    async function getCommand(message, args) {
      const { chat } = message;
      if (args.length === 0) {
        await sendMessage(chat.id, Texts.getCommand, message.message_id);
        return;
      }
      const argsArray = args[0].split("_");
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
    async function deleteCommand(message, args) {
      const { chat } = message;
      if (args.length === 0) {
        await sendMessage(chat.id, Texts.deleteCommand, message.message_id);
        return;
      }
      const argsArray = args[0].split("_");
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
    async function helpCommand(message) {
      const { chat } = message;
      await sendMessage(chat.id, Texts.helpCommand, message.message_id);
    }
    async function unknownCommand(message) {
      const { chat } = message;
      await sendMessage(chat.id, Texts.unknownCommand, message.message_id);
    }
    async function handleCommand(message) {
      const { text } = message;
      const [command, ...args] = text.split(" ");
      switch (command) {
        case "/start":
          await startCommand(message, args);
          break;
        case "/ban":
          await banCommand(message, args);
          break;
        case "/unban":
          await unbanCommand(message, args);
          break;
        case "/get":
          await getCommand(message, args);
          break;
        case "/del":
          await deleteCommand(message, args);
          break;
        case "/help":
          await helpCommand(message);
          break;
        default:
          await unknownCommand(message);
      }
    }
  
    // src/bot/messageHandler.js
    async function generatePostMarkup(chatId) {
      return {
        inline_keyboard: [
          [{ text: "Delete File", callback_data: "deleteChannelFile" }],
          [{ text: "Ban Sender", callback_data: `banSender/${chatId}` }]
        ]
      };
    }
    async function generateResponseMarkup(fileId) {
      return {
        inline_keyboard: [
          [{ text: "Revoke Link", callback_data: `revoke/${fileId}` }],
          [{ text: "Get File", callback_data: `getFile/${fileId}` }]
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
      const response = Texts.fileSaved.replace("{file_id}", fileId).replace("{file_link}", fileLink);
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
        const reason = Texts.chatIsBanned.replace("{reason}", banReason);
        await sendMessage(chatId, reason, messageId);
      }
      return isBanned;
    }
    async function handleMessage(message) {
      const { chat, text } = message;
      const isOwner = ADMIN_IDS.includes(chat.id);
      if (text?.startsWith("/")) {
        await handleCommand(message);
        return;
      }
      if (!isOwner) {
        if (chat.type !== "private") {
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
  
    // src/bot/callbackHandler.js
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
      await banChat(isPositiveIntegerString(args[0]), "Unknown.");
      await answerCallbackQuery(id, `Banned ${args[0]}.`, true);
    }
    async function handleCallbackQuery(callbackQuery) {
      const { id, data: text } = callbackQuery;
      const [query, ...args] = text.split("/");
      switch (query) {
        case "deleteChannelFile":
          await deleteChannelFile(callbackQuery);
          break;
        case "banSender":
          await banSender(callbackQuery, args);
          break;
        case "revoke":
          await deleteCommand(callbackQuery.message, args);
          await answerCallbackQuery(id, Texts.queryExecuted);
          break;
        case "getFile":
          await getCommand(callbackQuery.message, args);
          await answerCallbackQuery(id, Texts.queryExecuted);
          break;
        default:
          await answerCallbackQuery(id, Texts.queryDataInvalid, true);
      }
    }
  
    // src/index.js
    addEventListener("fetch", (event) => {
      event.respondWith(handleRequest(event.request));
    });
    async function handleRequest(request) {
      const secret_token = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
      if (secret_token !== SECRET_TOKEN) {
        return new Response("Authentication Failed.", { status: 403 });
      }
      const data = await request.json();
      if (data.message) {
        await handleMessage(data.message);
      } else if (data.callback_query) {
        await handleCallbackQuery(data.callback_query);
      }
      return new Response("OK", { status: 200 });
    }
  })();
  //# sourceMappingURL=index.js.map
  