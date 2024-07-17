<div align="center"><h1>File Share Bot</h1>
<b>An open-source JavaScript Telegram bot that allows you to save your files in a Telegram channel and access or share them without revealing the channel’s identity</b>

<a href="https://t.me/AdasArchiveBot"><b>Demo Bot</b></a>
</div><br>

## **📑 INDEX**
* [**🕹 Direct Deployment**](#direct-deployment)
* [**🛠️ Deploy from Source**](#deploy-from-source)
* [**🪝 Webhook**](#webhook)
* [**🤖 Commands**](#commands)
* [**❤️ Credits**](#credits)

<a name="direct-deployment"></a>

## **🕹 Direct Deployment**

1.Login to your [Cloudflare Dashboard](https://dash.cloudflare.com/).

2.Navigate to "Workers & Pages" > "Create" and create new worker.

3.Copy the content of [worker.js](https://github.com/lawdakacoder/FileShareBot/blob/main/worker.js) file.

4.Paste the code in worker's code editor and fill following variables then click deploy button:
  * **SECRET_TOKEN**: Random long url safe token to protect unauthorized execution of your Cloudflare worker.

      * Send `/secret 32` command to [DumpJsonBot](https://t.me/DumpJsonBot) to generate it.

      * Alternatively, it can be manually created by using alphabets, numbers and by not using any special character except `_` and `-`.

  * **BOT_TOKEN**: API token of your Telegram bot, can be obtained from [BotFather](https://t.me/BotFather).

  * **BOT_USERNAME**: Username of your Telegram bot without '@'.

  * **CHANNEL_ID**: ID of channel where bot will save user files, this can be obtained by adding [DumpJsonBot](https://t.me/DumpJsonBot) in your channel and by sending `/chat`.

  * **ADMIN_IDS**: List of user ids that can ban and unban users, user id can be obtained by sending /`chat` to [DumpJsonBot](https://t.me/DumpJsonBot).

5.Navigate to "Workers & Pages" (drop-down menu) > "KV" > "Create a namespace" and create two namespaces called `users` and `msgs_keys`.

6.Go back to Worker (created in 2nd step) > "Settings" > "Variables" > scroll down to "KV Namespace Bindings" and create two variables `users` and `msgs_keys` and bind them to same namespaces (created in 5th step) > "Deploy".

7.Copy your worker's URL and set webhook as given [here](#webhook).

[!TIP]
> If you’re already using my [ContactBot](https://github.com/lawdakacoder/ContactBot), there’s no need to create a separate `users` namespace. You can simply bind the existing one to your worker. This will ban the user in another bot with same reason automatically.

<a name="deploy-from-source"></a>

## **🛠️ Deploy from Source**

1.Install [Git](https://git-scm.com/downloads), [Node.JS](https://nodejs.org/en/download/package-manager) and [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

2.Clone repository:
```
git clone https://github.com/lawdakacoder/FileShareBot.git
```

3.Change Directory:
```
cd FileShareBot
```

4.Fill [config.js](https://github.com/lawdakacoder/FileShareBot/blob/main/src/config.js) file.

5.Create two [KV namespaces](https://developers.cloudflare.com/kv/get-started/#2-create-a-kv-namespace) called `users` and `msgs` and add their ids in [wrangler.toml](https://github.com/lawdakacoder/FileShareBot/blob/main/wrangler.toml) file.

6.Setup Wrangler
  * Install wrangler

    ```
    npm install wrangler
    ```
  * Login in Wrangler

    ```
    npx wrangler login
    ```
  * Deploy to Cloudflare worker

    ```
    npx wrangler deploy
    ```

7.Setup webhook as given [here](#webhook).

<a name="webhook"></a>

## **🪝 Webhook**
You can set webhook using your browser until I make a script to do it more easily.

**1.Set webhook**:<br>
Replace `BOT_TOKEN`, `WORKER_URL` and `SECRET_TOKEN` with their original values which you generated above and then open link in browser:
```
https://api.telegram.org/botBOT_TOKEN/setWebhook?url=WORKER_URL&allowed_updates=["message", "callback_query"]&secret_token=SECRET_TOKEN&drop_pending_updates=true
```

**2.Delete webhook**:<br>
Filled wrong info or need to update info? delete webhook and then you can set it again!
```
https://api.telegram.org/botBOT_TOKEN/deleteWebhook
```

<a name="commands"></a>

## **🤖 Commands**
List of commands that you can set in [BotFather](https://t.me/BotFather).

```
start - Ping the bot.
get - Get the file.
del - Delete the file.
ban - Ban the user. (Admin only!)
unban - Unban the user. (Admin only!)
help - Get help text.
```

<a name="credits"></a>

## **❤️ Credits**
[**LawdaKaCoder**](https://github.com/lawdakacoder): Developer of FileShareBot and for lawda.<br>
[**Cloudflare**](https://cloudflare.com): For workers, KV and great documentation that no one can understand.
