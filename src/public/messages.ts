export const welcomeMessage = `
Welcome, username! This is a bot made by n8body for educational and experimental purposes. Use /help to see all the available commands.
`
export const functionalityInfo = `
Here"s a list of all the functionality of the bot:
- Information Commands: 
    /start - shows initial message
    /help, /commands - shows this message
    /bot_info, /about_bot, /bot - shows information about the bot
    /my_info, /about_me, /me - shows information about the user
    /chat_info, /about_chat, /chat - shows information about the chat (cannot be used in private chats)
- Sticker Commands:
    [sticker] - returns the sticker's ID (can be used only in private chats) 
    /show_the_sticker, /what_is_the_sticker, /sticker_by_id, /sbi [ID] - shows the sticker with the provided ID
- Entertaining Commands:
    /meme - sends a random meme
    /photo - sends a random photo
- Admin Commands:
    (under construction)
- Creator Commands... you don't need them
- And some easter eggs
`
export const errorAnswers: { [key: number]: string } = {
  400: 'Command cannot be run in this chat.',
}
