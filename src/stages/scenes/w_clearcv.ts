import { Telegraf, Context, Scenes, Markup, session } from 'telegraf'
import { check_ctx_type, kbd_inline,TG_TYPES,CTX_RES, clear_ctx, check_email, get_download_path, set_state, set_state_property, get_state_property, clear_state } from '../../lib/tg'
import { Middleware } from '../../middleware/default'
import { FWizard, DATATYPE, check_ctx_for } from './factory'

// const {enter, leave} = Scenes.Stage
// Name = name of the Scene or Wizard
export const Name = 'clear-cv-wizard'

export const Visible = true
// Trigger = text or intent which trigers the Wizard
export const Triggers = ['clearcv']

// Scene = initialise the Scene object 
//export const Scene = new Scenes.BaseScene<Scenes.SceneContext>(`${Name}`)

export const Wizard = new FWizard(Name,
    (ctx:any)=>{
        clear_state(ctx,'upload-cv-wizard').then((_:any)=>{
            //console.log('>',_)
            ctx.reply('scene cleared').then((_:any)=>{
                return ctx.scene.leave()
            })
        })
    }
)