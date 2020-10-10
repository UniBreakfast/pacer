import TelegramBot from 'node-telegram-bot-api'

let bot, adminId


// bounce required in order for the top level require(config) to be done first
setImmediate(() => {

  bot = new TelegramBot(process.env.PG_TELEGRAM_TOKEN, {polling: true})

  bot.on('message', msg =>
    bot.sendMessage(msg.chat.id, 'Whatever your goal is, you can do it!'))

  adminId = +process.env.PG_ADMIN_CHAT

})


export default {
  log(...args) {
    if (bot) {
      args.forEach(arg => {
        if (typeof arg != 'string') arg = '`'+JSON.stringify(arg, null, 2)+'`'
        bot.sendMessage(adminId, arg, {parse_mode:'markdown'})
      })
    } else setTimeout(() => this.log(...args), 1000)
  }
}
