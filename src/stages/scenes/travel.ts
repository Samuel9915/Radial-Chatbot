import { Telegraf, Context, Scenes, Markup, session } from 'telegraf'
import { Middleware } from '../../middleware/default'

// const {enter, leave} = Scenes.Stage
// Name = name of the Scene or Wizard
export const Name = 'travel-scene'

export const Visible = true

// Trigger = text or intent which trigers the Wizard
export const Triggers = ['travel']

// Scene = initialise the Scene object 
export const Scene = new Scenes.BaseScene<Scenes.SceneContext>(Name)

// Set the scene up with a middleware (to catch events coming in and out).
// the only event a middleware doesn't catch is the "enter" scene event

Scene.use(Middleware)

Scene.enter(
    (ctx:any)=>{
        //Middleware(ctx,null)
        ctx.reply('hello welcome to travel')
    }
)
Scene.on('text',(ctx:any)=>{
    console.log('x')
    if (ctx.update?.message.text=='bye') {
        ctx.scene.leave()
    } else if (ctx.update?.message.text=='help') {
        ctx.reply('Type "bye" if you want to leave this scene')
    } else {
        ctx.reply('hmmm')
    }
})

Scene.leave(
    (ctx:any)=>{
        ctx.reply('good-bye')
    }
)