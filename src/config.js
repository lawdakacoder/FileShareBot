export const config = {
    telegram: {
        API: 'https://api.telegram.org' // Bot API server to use. 
    },

    bot: {
        TOKEN: '', // Telegram bot token.
        USERNAME: '', // Telegram bot username.
        CHANNEL_ID: -1002212345678, // Telegram channel ID to save files in.
        ADMIN_IDS: [1111111111, 2222222222], // User IDs that can ban/unban users.
        DISABLE_FORWARDS: true // Restrict users from forwarding.
    },

    worker: {
        SECRET_TOKEN: '' // Random string to prevent unauthorized execution of worker.
    }
}
