import { Telegraf, Context, Scenes, Markup, session, Telegram } from 'telegraf'
import { check_ctx_type, kbd_inline,TG_TYPES,CTX_RES, clear_ctx, check_email, init_state, set_state } from '../../lib/tg'
import { Middleware } from '../../middleware/default'
import { FWizard } from './factory'

// const {enter, leave} = Scenes.Stage
// Name = name of the Scene or Wizard
export const Name = 'register-user'

export const Visible = true
// Trigger = text or intent which trigers the Wizard
export const Triggers = ['register']


export const Wizard = new FWizard(Name,
    (ctx:any)=>{
        
        check_ctx_type(ctx).then((res:any)=>{
            init_state(ctx).then((d:any)=>{
                console.log('state',ctx.wizard.state)
            
                if (res==null) {
                    kbd_inline([
                        {text:'Register E-mail',cbvalue:'register'},
                        {text:'Register IC',cbvalue:'registeric'},
                        {text:'Home',url:'https://rajang.com?'},
                        {text:'Go back',cbvalue:'exit'}
                    ]).then((kbd:any)=>{
                        ctx.reply('Welcome to the wizard, please choose one of the following options', kbd )
                        //console.log(ctx)
                        return
                    })
                } else {
                    console.log('received',ctx.update?.update_id)
                    if (res.type==TG_TYPES.CB_QUERY) {
                        switch (res.data) {
                            case 'exit':
                                ctx.reply('Thank you. See you later.')

                                return ctx.scene.leave()
                            case 'register':
                                clear_ctx(ctx)
                                console.log('registering')
                                ctx.wizard.selectStep(1)
                                return ctx.wizard.steps[ctx.wizard.cursor](ctx)
                            case 'registeric':
                                ctx.scene.enter('register-ic',{'last_scene':Name,'last_step':ctx.wizard.cursor})
                                return
                            default:
                                console.log('unknown answer',res.data,ctx.update.callback_query)
                                // ctx.wizard.selectStep(STEP_THANK_YOU)
                                return
                                //return ctx.wizard.steps[ctx.wizard.cursor](ctx)
                                //return ctx.wizard.steps[0](ctx)
                        }
                    }
                }
            }).catch((e:any)=>{
                console.log(e)
            })

            
        })
    },
    (ctx:any)=>{
        // register user
        // ask user for e-mail
        // verify e-mail
        check_ctx_type(ctx).then((res:any)=>{
            //console.log('res',res)
            if (res==null) {
                ctx.reply('Enter email')
                //return
            } else if (res.type==TG_TYPES.CB_QUERY) {
                if (res.data=='confirm') {
                    ctx.wizard.state['data']['email'] = ctx.wizard.state['_']
                    ctx.wizard.state['_'] = null
                    ctx.reply('Thank you')
                    set_state(ctx).then((d:any)=>{
                        ctx.wizard.selectStep(0)
                        return ctx.wizard.steps[ctx.wizard.cursor](ctx)
                    }).catch((e:any)=>{
                        console.log('error',e)
                        return
                    })
                    
                } else if (res.data=='retry') {
                    ctx.reply('Please try again')
                    return
                } else {
                    ctx.wizard.selectStep(0)
                    return ctx.wizard.steps[ctx.wizard.cursor](ctx)
                }
            } else {
                if (res.type==TG_TYPES.TEXT) {
                    console.log('data',res.data)
                    check_email(res.data).then((email:any)=>{
                        if (email == null) {
                            ctx.reply('This is not a valid e-mail address')
                        } else {
                            ctx.wizard.state['_'] = res.data
                            kbd_inline([
                                {text:'Confirm',cbvalue:'confirm'},
                                {text:'Retry',cbvalue:'retry'},
                                {text:'Cancel',cbvalue:'cancel'}
                            ],[]).then((kbd:any)=>{
                                ctx.reply(`Confirm text entry [${res.data}]`, kbd )
                            })
                        }
                    })
                    
                } else {
                    console.log('x')
                }
                return 
            }
            
        })
    },
    (ctx:any)=>{
        ctx.reply('byeee')
        return ctx.scene.leave()
    }
)


// Set the scene up with a middleware (to catch events coming in and out).
// the only event a middleware doesn't catch is the "enter" scene event

Wizard.on('text',(ctx:any,next:any)=>{
    console.log('text in a wizard captured')
    return next()
})