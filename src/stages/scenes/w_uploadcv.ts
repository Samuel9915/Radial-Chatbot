import { Telegraf, Context, Scenes, Markup, session } from 'telegraf'
import { check_ctx_type, kbd_inline,TG_TYPES,CTX_RES, clear_ctx, check_email, get_download_path, set_state, set_state_property, get_state_property } from '../../lib/tg'
import { Middleware } from '../../middleware/default'
import { FWizard, DATATYPE, check_ctx_for } from './factory'

// const {enter, leave} = Scenes.Stage
// Name = name of the Scene or Wizard
export const Name = 'upload-cv-wizard'

export const Visible = true
// Trigger = text or intent which trigers the Wizard
export const Triggers = ['uploadcv']

// Scene = initialise the Scene object 
//export const Scene = new Scenes.BaseScene<Scenes.SceneContext>(`${Name}`)

export const Wizard = new FWizard(Name,
    (ctx:any)=>{
        ctx.reply('welcome to upload CV').then((_:any)=>{
            ctx.wizard.next()
            return ctx.wizard.steps[ctx.wizard.cursor](ctx);
        })
    },
    (ctx:any)=>{
        get_state_property(ctx,'selfie').then((_:any)=>{
            if (_==undefined) {
                check_ctx_for(ctx,DATATYPE.PHOTO,
                    'To register your cv, we need your latest photo. Please take a selfie photo')
                .then((res:any)=>{
                    if (res?.type==DATATYPE.PHOTO) {
                        set_state_property(ctx,'selfie',res.value).then((_:any)=>{
                            ctx.reply('thank you')
                            
                            ctx.wizard.next()
                            return ctx.wizard.steps[ctx.wizard.cursor](ctx);
                        })
                    }
                })
            } else {
                ctx.reply('you already have a selfie, skipping this...').then((_:any)=>{
                    ctx.wizard.next()
                    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
                })
                
            }
        })
        
    },
    (ctx: any)=>{
        get_state_property(ctx,'cvdoc').then((_:any)=>{
            if (_==undefined) {
                check_ctx_for(ctx,DATATYPE.DOCUMENT,
                    'To register your cv, we need your latest CV Document. Please upload the document')
                .then((res:any)=>{
                    if (res?.type==DATATYPE.DOCUMENT) {
                        set_state_property(ctx,'cvdoc',res.value).then((_:any)=>{
                            ctx.reply('thank you')

                            ctx.wizard.next()
                            return ctx.wizard.steps[ctx.wizard.cursor](ctx);
                        })
                    }
                })
            } else {
                ctx.reply('you already have a CV Document, skipping this...').then((_:any)=>{
                    ctx.wizard.next()
                    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
                })
                
            }
        })
    },
    (ctx:any)=>{
        ctx.reply('DONE!').then((_:any)=>{
            return ctx.scene.leave()
        })
    }
)