/* eslint-disable no-use-before-define */
export const _messageTypes = [
  'text',
  'animation',
  'sticker',
]
export type ParseMode = 'Markdown' | 'MarkdownV2' | 'HTML'
export interface User {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username: string
  language_code?: string
  can_join_groups?: boolean
  can_read_all_group_messages?: boolean
  supports_inline_queries?: boolean
}
export interface Location {
  longitude: number
  latitude: number
  horizontal_accuracy?: number
  live_period?: number
  heading?: number
  proximity_alert_radius?: number
}
export interface ChatPhoto {
  small_file_id: string
  small_file_unique_id: string
  big_file_id: string
  big_file_unique_id: string
}
export interface ChatPermissions {
  can_send_messages?: boolean
  can_send_media_messages?: boolean
  can_send_polls?: boolean
  can_send_other_messages?: boolean
  can_add_web_page_previews?: boolean
  can_change_info?: boolean
  can_invite_users?: boolean
  can_pin_messages?: boolean
}
export interface ChatLocation {
  location: Location
  address: string
}
export interface Chat {
  id: number
  type: 'private' | 'group' | 'supergroup' | 'channel'
  title?: string
  username?: string
  first_name: string
  last_name?: string
  photo?: ChatPhoto
  bio?: string
  has_private_forwards?: true
  join_to_send_messages?: true
  join_by_request?: true
  description?: string
  invite_link?: string
  pinned_message?: Message
  permissions?: ChatPermissions
  slow_mode_delay?: number
  message_auto_delete_time?: number
  has_protected_content?: true
  sticker_set_name?: string
  can_set_sticker_set?: true
  linked_chat_id?: number
  location?: ChatLocation
}
export interface ChatMemberOwner {
  status: string
  user: User
  is_anonymous: boolean
  custom_title?: string
}
export interface ChatMemberAdministrator {
  status: string
  user: User
  can_be_edited: boolean
  is_anonymous: boolean
  can_manage_chat: boolean
  can_delete_messages: boolean
  can_manage_video_chats: boolean
  can_restrict_members: boolean
  can_promote_members: boolean
  can_change_info: boolean
  can_invite_users: boolean
  can_post_messages: boolean
  can_edit_messages: boolean
  can_pin_messages: boolean
  custom_title?: string
}
export interface ChatMemberMember {
  status: string
  user: User
}
export interface ChatMemberRestricted {
  status: string
  user: User
  is_member: boolean
  can_change_info: boolean
  can_invite_users: boolean
  can_pin_messages: boolean
  can_send_messages: boolean
  can_send_media_messages: boolean
  can_send_polls: boolean
  can_send_other_messages: boolean
  can_add_web_page_previews: boolean
  until_date: number
}
export interface ChatMemberLeft {
  status: 'left'
  user: User
}
export interface ChatMemberBanned {
  status: 'kicked'
  user: User
  until_date: number
}
export type ChatMember = ChatMemberOwner | ChatMemberAdministrator | ChatMemberMember | ChatMemberRestricted | ChatMemberLeft | ChatMemberBanned
// export interface Animation {

// }
export interface File {
  file_id: string
  file_unique_id: string
  file_size?: number
  file_path?: number
}
export interface PhotoSize {
  file_id: string
  file_unique_id: string
  width: number
  height: number
  file_size: number
}
export interface Animation {
  file_id: string
  file_unique_id: string
  width: number
  height: number
  duration: number
  thumb?: PhotoSize
  file_name?: string
  mime_type?: string
  file_size?: number
}
export interface Sticker {
  file_id: string
  file_unique_id: string
  width: number
  height: number
  is_animated: boolean
  is_video: boolean
  emoji?: string
  set_name?: string
  file_size?: number
}
export interface Message {
  message_id: number
  from: User
  sender_chat?: Chat
  date: number
  chat: Chat
  forward_from?: User
  forward_from_chat?: Chat
  forward_from_message_id?: number
  forward_signature?: string
  forward_sender_name?: string
  forward_date?: number
  is_automatic_forward?: true
  reply_to_message?: Message
  via_bot?: User
  edit_date?: number
  has_protected_content?: true
  media_group_id?: string
  author_signature?: string
  text?: string
  animation?: Animation
  // ...
  photo?: Array<PhotoSize>
  sticker?: Sticker
  // ...
  caption?: string
  // ...
}
export interface UserProfilePhotos {
  total_count: number
  photos: Array<Array<PhotoSize>>
}
export interface InlineQuery {
  id: string
  from: User
  query: string
  offset: string
  chat_type?: string
  location?: Location
}
// export interface InlineQueryResult {

// }
