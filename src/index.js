import { config } from "./config";
import { handleMessage } from "./bot/messageHandler";
import { handleCallbackQuery } from "./bot/callbackHandler";

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {

    const secret_token = request.headers.get('X-Telegram-Bot-Api-Secret-Token');

    if (secret_token !== config.worker.SECRET_TOKEN) {
        return new Response('Authentication Failed.', { status: 403 });
    }

    const data = await request.json();

	if (data.message) {
		await handleMessage(data.message);
	} else if (data.callback_query) {
        await handleCallbackQuery(data.callback_query);
    }

    return new Response('OK', { status: 200 });

}
