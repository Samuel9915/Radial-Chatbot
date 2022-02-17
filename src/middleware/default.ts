import { addUserMessage } from "../db/mongoose/chatapp"

export const Middleware = async(ctx:any,next:any)=>{
    console.time('aaa')
    if (ctx.session?.__scenes?.current != undefined) {
        console.log('you are in a scene', ctx.session.__scenes?.current)
    }
    // const xreply = ctx.reply
    // ctx.reply = (args:any[])=>{
    //     if (ctx.session) ctx.session.lastMessage = args[0]
    //     console.log('lm',args[0])
    //     try{
    //         xreply(args)
    //     } catch(e) {
    //         console.log(e)
    //     }
        
    // }
    await next()
    console.timeEnd('aaa')
}

export const InitEvents = (bot:any)=>{
    bot.start((ctx:any)=>{
        console.log('started')
        const message=`Good day to you. Welcome to RaDial (Rajang Dialog) Engine.`
        ctx.reply(message)
    })

    bot.on('text',(ctx:any)=>{
        let user = (ctx.update as any).message.from
        let msg = ctx.update.message.text
        addUserMessage(user.id,ctx.update.message).then((d:any)=>{
            ctx.reply(`You said ${msg}`)
        }).catch(e=>{
            ctx.reply(`Ooops something went wrong...`)
        })
        
    })
    
    bot.on('location',(ctx:any)=>{
        console.log(ctx.update.message)
        ctx.reply(`I know where you live, haha`)
    })
    
    bot.on('photo',(ctx:any)=>{
        console.log(ctx.update.message)
    })
    
    bot.on('document',(ctx:any)=>{
        console.log(ctx.update.message)
    })
    
    bot.on('contact',(ctx:any)=>{
        console.log(ctx.update.message)
    })
    
    bot.on('audio',(ctx:any)=>{
        console.log(ctx.update.message)
    })
    
    bot.on('video',(ctx:any)=>{
        console.log(ctx.update.message)
    })
}