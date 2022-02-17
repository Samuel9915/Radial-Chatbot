import { Telegraf, Context, Scenes, Markup, session } from 'telegraf'
import LocalSession from 'telegraf-session-local'
import dotenv from 'dotenv'
dotenv.config()
import { addUser, addUserMessage, DBConnect } from "./db/mongoose/chatapp"
import { ReverseString, User } from "./lib"
import { GetTriggers, PluginInit, ProcessTriggers } from './stages'
import { InitEvents, Middleware } from './middleware/default'
import {io, Socket, Socket as SocketClient} from 'socket.io-client'
import { SocketConnect, SSocket } from './lib/socket_client_bridge'


console.log('hello world', process.env.BOT_TOKEN)


DBConnect().then((connection:any)=>{
    let bot = new Telegraf(process.env.BOT_TOKEN as string)

    bot.use(session()) // session is deprecated but it seems needed to set up stages...
    PluginInit(bot).then((stage:any)=>{
        //console.log('>>>>middleware',stage)
        
        // /bot.use(Middleware)
        bot.use(stage.middleware())
        
        ProcessTriggers(bot)
        InitEvents(bot)
        bot.launch()

    })
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
    
})




