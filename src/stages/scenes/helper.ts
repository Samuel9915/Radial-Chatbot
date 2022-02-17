import { Telegraf, Context, Scenes, Markup, session } from 'telegraf'
import { kbd_inline, kbd_reply } from '../../lib/tg'
import { Middleware } from '../../middleware/default'

// const {enter, leave} = Scenes.Stage
// Name = name of the Scene or Wizard
export const Name = 'helper-scene'

export const Visible = true

// Trigger = text or intent which trigers the Wizard
export const Triggers = ['zoom']

// Scene = initialise the Scene object 
export const Scene = new Scenes.BaseScene<Scenes.SceneContext>(`${Name}`)

// Set the scene up with a middleware (to catch events coming in and out).
// the only event a middleware doesn't catch is the "enter" scene event

Scene.use(Middleware)

Scene.enter(
    (ctx:any)=>{
        //Middleware(ctx,null)
        ctx.reply('hello')
    }
)
Scene.on('text',(ctx:any)=>{
    if (ctx.session['counter']==undefined) {
        console.log('setting state counter')
        ctx.session['counter'] = 1
    } else {
        ctx.session['counter'] = ctx.session['counter'] + 1
    }
    console.log(ctx)
    if (ctx.update?.message.text=='bye') {
        ctx.scene.leave()
    } else if (ctx.update?.message.text=='help') {
        //return kbd_inline(ctx,'sss',[{text:'Add Value',cbvalue:'add'},{text:'Subtract Value',cbvalue:'subtract'}])
        // return kbd_inline(ctx,'this is a keyboard',['/one','/two','/three','bye'])
        // ctx.reply('Type "bye" if you want to leave this scene')
    } else {
        ctx.reply('hmmm')
    }
})

Scene.on('callback_query',(ctx)=>{
    console.log(ctx)
})

Scene.leave(
    (ctx:any)=>{
        ctx.reply('good-bye')
    }
)