import type { ParseMode } from '../bot-api'

const escapeFormatting = (string = '', parse_mode: ParseMode = 'Markdown') => {
  switch (parse_mode) {
  case 'Markdown':
    return string.replace(/[_*`[\]\\]/g, '\\$&')
  case 'MarkdownV2':
    return string.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&')
  case 'HTML':
    return string.replace(/[<>]/g, '\\$&')
  }
}

export default escapeFormatting
