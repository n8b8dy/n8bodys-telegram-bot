import express from 'express'
import type { Express } from 'express-serve-static-core'

import type { Chat, ChatMember, File, Message, User, UserProfilePhotos } from './types/telegram'
import type {
  BotSettings,
  Commands,
  Query,
  SendMessageOptions, SendPhotoOptions, SendAnimationOptions, SendStickerOptions,
  BanChatMemberOptions, UnbanChatMemberOptions,
  GetUserProfileOptions,
} from './types/bot'

export class TelegramBot {
  #app: Express
  #settings: BotSettings
  #telegramAPI: string
  #uri: string
  #webhookUri: string
  #commands: Commands

  constructor (settings: BotSettings) {
    this.#settings = settings
    const { botToken, serverUrl } = this.#settings

    this.#telegramAPI = `https://api.telegram.org/bot${botToken}`
    this.#uri = `/webhook/${botToken}`
    this.#webhookUri = serverUrl + this.#uri

    this.#commands = new Proxy({}, {
      get (target: Commands, property: string) {
        for (const key in target) {
          if (target[key].type === 'string') { if (key === property) return target[key] }
          else if (target[key].type === 'Array<string>') {
            for (const alias of (target[key].aliases || [])) {
              if (alias === property) return target[key]
            }
          }
          else if (target[key].type === 'RegExp') { if (target[key].regexp?.test(property)) return target[key] }
        }

        return null
      },
      getOwnPropertyDescriptor (target: Commands, property: string) {
        for (const key in target) {
          if (target[key].type === 'string') {
            if (key === property) return { configurable: true, enumerable: true }
          } else if (target[key].type === 'Array<string>') {
            for (const alias of (target[key].aliases || [])) {
              if (alias === property) return { configurable: true, enumerable: true }
            }
          } else if (target[key].type === 'RegExp') {
            if (target[key].regexp?.test(property)) return { configurable: true, enumerable: true }
          }
        }
      },
    })

    this.#app = express()
    this.#app.use(express.json())
  }

  get api () {
    return this.#telegramAPI
  }

  async _init () {
    const response = await fetch(`${this.#telegramAPI}/setWebhook?url=${this.#webhookUri}`)
    console.log(await response.json())
  }

  async _setCommandsHandler () {
    const type = 'text'
    this.#app.post(this.#uri, async (req, res, next) => {
      const message = await req.body?.message
      const text = message?.[type]
      if (!text) {
        next()
        return res.send()
      }

      if (Object.hasOwnProperty.apply(this.#commands, [message[type]])) {
        const command = this.#commands[message[type]]
        const match = text.match(command?.regexp) || text
        command.handler(message, match)
      }

      res.send()
      return next()
    })
  }

  // async _setQueryHandler () {
  //   const type = 'query'
  //   this.#app.post(this.#uri, async (req, res, next) => {
  //     const message = await req.body?.message
  //     const text = message?.[type]
  //     if (!text) {
  //       next()
  //       return res.send()
  //     }

  //     if (Object.hasOwnProperty.apply(this.#commands, [message[type]])) {
  //       const command = this.#commands[message[type]]
  //       const match = text.match(command?.regexp) || text
  //       command.handler(message, match)
  //     }

  //     res.send()
  //     return next()
  //   })
  // }

  async listen (port: number) {
    this.#app.listen(port, async () => {
      await this._setCommandsHandler()
      await this._init()
      console.info('BOT STARTED')
    })
  }

  async on (type: 'text' | 'sticker' | 'animation', handler: (message: Message) => void) {
    this.#app.post(this.#uri, async (req, res, next) => {
      const message = await req.body?.message

      // const { id: chat_id } = await message?.chat || {}

      // if (chat_id !== Number(process.env.DEV_GROUP_ID) && chat_id !== Number(process.env.CREATOR_ID)) {
      //   return res.send()
      // }

      if (message?.[type]) { handler(message) }

      res.send()
      return next()
    })
  }

  async onMessage (query: Query, handler: (message: Message, match?: Array<string> | string) => void) {
    console.log(query)
    if (typeof query === 'string') this.#commands[query] = { type: 'string', handler }
    else if (Array.isArray(query) && typeof query[0] === 'string') {
      this.#commands[query.join('|')] = { type: 'Array<string>', aliases: query, handler }
    }
    else if (query instanceof RegExp) { this.#commands[String(query)] = { type: 'RegExp', regexp: query, handler } }
  }

  async getMe (): Promise<User> {
    const response = await fetch(`${this.#telegramAPI}/getMe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json())
    return response.result
  }

  async sendMessage (options: SendMessageOptions): Promise<Message> {
    const response = await fetch(`${this.#telegramAPI}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    }).then(response => response.json())
    return response.result
  }

  async sendPhoto (options: SendPhotoOptions): Promise<Message> {
    const response = await fetch(`${this.#telegramAPI}/sendPhoto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    }).then(response => response.json())
    return response.result
  }

  async sendAnimation (options: SendAnimationOptions): Promise<Message> {
    const response = await fetch(`${this.#telegramAPI}/sendAnimation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    }).then(response => response.json())
    return response.result
  }

  async getFile (file_id: string): Promise<File> {
    const response = await fetch(`${this.#telegramAPI}/getFile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_id }),
    }).then(response => response.json())
    return response.result
  }

  async banChatMember (options: BanChatMemberOptions): Promise<true> {
    const response = await fetch(`${this.#telegramAPI}/banChatMember`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    }).then(response => response.json())
    return response.result
  }

  async UnbanChatMember (options: UnbanChatMemberOptions): Promise<true> {
    const response = await fetch(`${this.#telegramAPI}/unbanChatMember`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    }).then(response => response.json())
    return response.result
  }

  async getUserProfilePhotos (options: GetUserProfileOptions): Promise<UserProfilePhotos> {
    const response = await fetch(`${this.#telegramAPI}/getUserProfilePhotos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    }).then(response => response.json())
    return response.result
  }

  async getChat (chat_id: string | number): Promise<Chat> {
    const response = await fetch(`${this.#telegramAPI}/getChat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chat_id }),
    }).then(response => response.json())
    return response.result
  }

  async getChatAdministrators (chat_id: string | number): Promise<Array<ChatMember>> {
    const response = await fetch(`${this.#telegramAPI}/getChatAdministrators`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chat_id }),
    }).then(response => response.json())
    return response.result
  }

  async getChatMemberCount (chat_id: string | number): Promise<number> {
    const response = await fetch(`${this.#telegramAPI}/getChatMemberCount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chat_id }),
    }).then(response => response.json())
    return response.result
  }

  async getChatMember (options: { chat_id: string | number, user_id: number }): Promise<ChatMember> {
    const response = await fetch(`${this.#telegramAPI}/getChatMember`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    }).then(response => response.json())
    return response.result
  }

  async sendSticker (options: SendStickerOptions): Promise<Message> {
    const response = await fetch(`${this.#telegramAPI}/sendSticker`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    }).then(response => response.json())
    return response.result
  }
}
