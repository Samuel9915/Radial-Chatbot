import { Telegraf, Context, Scenes, Markup, session } from 'telegraf'
import { GetSocket } from '../../lib/socket_client_bridge'
import { check_ctx_type, kbd_inline,TG_TYPES,CTX_RES, clear_ctx, check_email, get_download_path, set_state, set_state_property } from '../../lib/tg'
import { Middleware } from '../../middleware/default'
import { FWizard, DATATYPE, check_ctx_for } from './factory'

// const {enter, leave} = Scenes.Stage
// Name = name of the Scene or Wizard
export const Name = 'helpdesk-wizard'

export const Visible = true
// Trigger = text or intent which trigers the Wizard
export const Triggers = ['helpdesk']

let selected:any = []

// Scene = initialise the Scene object 
//export const Scene = new Scenes.BaseScene<Scenes.SceneContext>(`${Name}`)
let socket:any = undefined

export const Wizard = new FWizard(Name,
    (ctx:any)=>{
        let msg = `Welcome`
        if (FWizard.socket) msg = msg + `socket is connected! ${FWizard.socket.id}`
        ctx.reply(msg).then((_:any)=>{
            clear_ctx(ctx)
            FWizard.next(ctx)
        })
        
    },
    (ctx:any)=>{
        check_ctx_for(ctx,DATATYPE.TEXT,'Please type your question (or type \'/bye\' to exit)')
        .then((res:any)=>{
            console.log('res',res)
            if (res.type==DATATYPE.TEXT) {
                if ((res.value as string).toLowerCase().trim() == 'bye') {                   
                    ctx.reply('Thank you, off you go...').then((_:any)=>{
                        return FWizard.leaveWizard(ctx)
                    })
                } else {
                    ctx.reply('>')
                    FWizard.socket.emit('tg-signal',{data:res.value})
                    return
                }
            }
        })
    }
)