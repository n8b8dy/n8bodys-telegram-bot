import type { Message, ParseMode } from './telegram'

export interface BotSettings {
  botToken: string
  serverUrl: string
}
export interface Commands {
  [key: string]: {
    type: 'string' | 'RegExp'
    regexp?: RegExp
    handler: (message: Message, match?: Array<string> | string) => void
  }
}

export interface SendMessageOptions {
  chat_id: number | string
  text: string
  parse_mode?: ParseMode
  disable_web_page_preview?: boolean
  disable_notification?: boolean
  protect_content?: boolean
  reply_to_message_id?: number
  allow_sending_without_reply?: boolean
}
export interface SendPhotoOptions {
  chat_id: number | string
  photo: string
  caption?: string
  parse_mode?: ParseMode
  disable_notification?: boolean
  protect_content?: boolean
  reply_to_message_id?: number
  allow_sending_without_reply?: boolean
}
export interface SendAnimationOptions {
  chat_id: number | string
  animation: string
  duration?: number
  width?: number
  height?: number
  thumb?: string
  caption?: string
  parse_mode?: ParseMode
  disable_notification?: boolean
  protect_content?: boolean
  reply_to_message_id?: number
  allow_sending_without_reply?: boolean
}

export interface GetUserProfileOptions{
  user_id: number
  offset?: number
  limit?: number
}

export interface BanChatMemberOptions {
  chat_id: string | number
  user_id: number
  until_date?: number
  revoke_messages?: boolean
}
export interface UnbanChatMemberOptions {
  chat_id: string | number
  user_id: number
  only_if_banned?: boolean
}

export interface SendStickerOptions {
  chat_id: number | string
  sticker: string
  parse_mode?: ParseMode
  disable_notification?: boolean
  protect_content?: boolean
  reply_to_message_id?: number
  allow_sending_without_reply?: boolean
}

export interface AnswerInlineQueryOption {
  inline_query_id: string
  // results: Array<InlineQueryResult>
  cache_time?: number
  is_personal?: boolean
  next_offset?: string
  switch_pm_text?: string
  switch_pm_parameter: string
}
