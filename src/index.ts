import 'dotenv/config'

import { TelegramBot } from './bot-api'
import escapeFormatting from './utils/escapeFormatting'
import { welcomeMessage, functionalityInfo } from './public/messages'

import isCreator from './utils/isCreator'
import { selectRandomFrom } from './utils/selectRandomFrom'
import { welcomeStickers } from './public/stickers'

const { BOT_TOKEN, SERVER_URL, PORT } = process.env

const bot = new TelegramBot({ botToken: BOT_TOKEN, serverUrl: SERVER_URL })
bot.listen(PORT || 5000)

bot.onMessage(/^\/start$/i, async (msg) => {
  const { id: chat_id, type } = msg.chat

  const response = welcomeMessage

  await bot.sendMessage({ chat_id, text: response })
  if (type === 'private') await bot.sendSticker({ chat_id, sticker: String(selectRandomFrom(welcomeStickers)) })
})

bot.onMessage(/^\/help|commands$/i, async (msg) => {
  const { id: chat_id } = msg.chat

  const response = functionalityInfo

  await bot.sendMessage({ chat_id, text: response })
})

bot.onMessage(/^\/(bot_info|about_bot|bot)$/i, async (msg) => {
  const { id: chat_id } = msg.chat

  const {
    username,
    can_join_groups, can_read_all_group_messages, supports_inline_queries,
  } = await bot.getMe()

  const response = `Bot's username: *@${username}* \n` +
    `Version: ${process.env.npm_package_version}\n` +
    'Author: @n8body\n' +
    '\n' +
    `Can join groups: _${can_join_groups ? 'yes' : 'no'}_ \n` +
    `Can read all group messages: _${can_read_all_group_messages ? 'yes' : 'no'}_ \n` +
    `Supports inline queries: _${supports_inline_queries ? 'yes' : 'no'}_`

  await bot.sendMessage({ chat_id, text: response, parse_mode: 'Markdown' })
})

bot.onMessage(/^\/(my_info|about_me|me)$/i, async (msg) => {
  const { id: chat_id, type } = msg.chat
  const { id: user_id, username, first_name, last_name, is_bot } = msg.from || {}

  if (is_bot) return

  const { bio } = type === 'private' ? await bot.getChat(chat_id) : { bio: null }

  const photos = await bot.getUserProfilePhotos({ user_id })

  const e = escapeFormatting
  const response =
    `Usename: *@${username}* \n` +
    `First name: _${e(first_name)}_ \n` +
    (last_name ? `Lastname: _${e(last_name)}_ \n` : '') +
    `ID: \`${user_id}\` \n` +
    (bio ? `Bio: ${e(bio)}` : '')

  photos.total_count > 0
    ? bot.sendPhoto({ chat_id, photo: photos.photos[0][0].file_id, caption: response, parse_mode: 'Markdown' })
    : bot.sendMessage({ chat_id, text: response, parse_mode: 'Markdown' })
})

bot.onMessage(/^\/(chat_info|about_chat|chat)$/i, async (msg) => {
  const { id: chat_id, type } = msg.chat

  if (type === 'private') return bot.sendMessage({ chat_id, text: 'Sorry, but this is a private chat, so use /my_info instead.' })

  const { title } = await bot.getChat(chat_id)
  const memberCount = await bot.getChatMemberCount(chat_id)
  const chatAdministrators = await bot.getChatAdministrators(chat_id)

  const e = escapeFormatting
  const admins = chatAdministrators.map(admin => {
    // @ts-ignore: Unreachable code error
    const { user, status, is_anonymous } = admin

    return is_anonymous ? null : `${e(user.username || user.first_name)} (_${e(status)}_)`
  }).filter(el => Boolean(el)).join(', \n   ')

  const response =
    `Title: *${e(title || '')}* \n` +
    `Chat type: _${type}_ \n` +
    `Members: ${memberCount} \n` +
    'Admins: \n   ' + admins

  await bot.sendMessage({ chat_id, text: response, parse_mode: 'Markdown', disable_notification: true })
})

// Section: COMMUNICATION
// bot.onMessage(/^\/send @(\w+) (.+)$/i, async (msg) => {
//   const { message_id, sticker } = msg
//   const { id: chat_id, type } = msg.chat
// })

// Section: STICKERs
bot.on('sticker', async (msg) => {
  const { message_id, sticker } = msg
  const { id: chat_id, type } = msg.chat

  if (type !== 'private') return

  const response = `Thanks for the sticker, dude! By the way, its ID is: \`${sticker?.file_id}\``

  await bot.sendMessage({ chat_id, text: response, parse_mode: 'Markdown', reply_to_message_id: message_id })
})

bot.onMessage(/^\/(show_the_sticker|what_is_the_sticker|sticker_by_id|sbi(\s?)(.*))/i, async (msg, match) => {
  const { message_id } = msg
  const { id: chat_id } = msg.chat

  const sticker_id = String(match?.[3]).trim()

  if (!sticker_id) return bot.sendMessage({ chat_id, text: 'Sorry, but you have to provide and ID for this command', reply_to_message_id: message_id })

  const response = 'The sticker with that ID is:'

  const reply = await bot.sendMessage({ chat_id, text: response, reply_to_message_id: message_id })
  const result = await bot.sendSticker({ chat_id, sticker: sticker_id, reply_to_message_id: reply.message_id })
  if (!result) await bot.sendMessage({ chat_id, text: 'Sorry, but I couldn\'t find anything.', reply_to_message_id: reply.message_id })
})

// Section: BOT CONTROLs
bot.onMessage(/^\/end$/i, async (msg) => {
  const { message_id } = msg
  const { id: chat_id } = msg.chat
  const { id: user_id, username } = msg.from

  const isSosatb = !isCreator(user_id)
  const response = isSosatb ? `Sosatb plus lezhatb, ${username}` : 'Ladno('

  await bot.sendMessage({ chat_id, text: response, reply_to_message_id: message_id })

  if (!isSosatb) {
    console.error('Za sho, hozyain(')
    throw new Error('(((')
  }
})

// Section: MEMEs
bot.onMessage(/(\s|^)+(д(а+)[-]*)+(\w*)[.!?,:;()]*$/i, async (msg) => {
  const { message_id } = msg
  const { id: chat_id } = msg.chat

  const answer = Math.random() < 0.1

  const stickers = ['CAACAgIAAxkBAAIDAmK8n1Vsf_8N1QMp3mBHwpUQe4g0AAKkGgACUgToSfJnbfUmbHSIKQQ']

  if (answer) await bot.sendSticker({ chat_id, sticker: stickers[0], reply_to_message_id: message_id })
})

bot.onMessage(/^\/meme$/i, async (msg) => {
  const { id: chat_id } = msg.chat

  const subreddits = [
    'bulgaria',
    'ProgrammerHumor',
    'meme', 'Memes_Of_The_Dank', 'memes',
  ]

  const meme = await fetch(`https://meme-api.herokuapp.com/gimme/${selectRandomFrom(subreddits)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json())

  console.log(meme)

  const response = meme.title === 'Title' ? '' : meme.title
  await bot.sendPhoto({ chat_id, photo: meme.url, caption: response })
})

bot.onMessage(/^\/photo$/i, async (msg) => {
  const { id: chat_id } = msg.chat

  const photo = await fetch(`https://api.unsplash.com/photos/random/?client_id=${process.env.UNSPLASH_ACCESS_KEY}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Version': 'v1',
    },
  }).then(response => response.json()).catch(error => console.error(error))

  const response = escapeFormatting(photo.description || photo.alt_description || '') + '\n' +
    `by [${photo.user.name}](${photo.user.links.html})`

  await bot.sendPhoto({ chat_id, photo: photo.urls.regular, caption: response, parse_mode: 'Markdown' })
})

// // Section: TESTs
// bot.on('animation', async (msg) => {
//   const { id: chat_id } = msg.chat
//   // @ts-ignore: Unreachable code error
//   const { file_id } = msg.animation
//   console.log(file_id)
//   await bot.sendAnimation({ chat_id, animation: file_id, caption: 'Here you are!' })
// })
