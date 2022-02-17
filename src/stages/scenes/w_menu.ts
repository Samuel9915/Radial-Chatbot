import { Telegraf, Context, Scenes, Markup, session } from 'telegraf'
import { check_ctx_type, kbd_inline,TG_TYPES,CTX_RES, clear_ctx, check_email } from '../../lib/tg'
import { Middleware } from '../../middleware/default'
import { FWizard, DATATYPE, check_ctx_for } from './factory'

// const {enter, leave} = Scenes.Stage
// Name = name of the Scene or Wizard
export const Name = 'main-menu'

export const Visible = true
// Trigger = text or intent which trigers the Wizard
export const Triggers = ['mainmenu']

export const Wizard = new FWizard(Name,
    (ctx:any)=>{
        check_ctx_for(ctx,DATATYPE.CB_QUERY,'Welcome to the Bot',[
            {text:'Register User',cbvalue:'register'},
            {text:'Search for jobs',cbvalue:'searchjob'},
            {text:'Register your CV',cbvalue:'uploadcv'},
            {text:'Reset CV',cbvalue:'clearcv'}]  )
        .then((res:any)=>{
            if (res != null && res != false) {
                switch (true) {
                    case (res.value=='register'):
                        return ctx.scene.enter('register-user')
                    case (res.value=='searchjob'):
                        return ctx.scene.enter('search-job')
                    case (res.value=='uploadcv'):
                        return ctx.scene.enter('upload-cv-wizard')
                    case (res.value=='clearcv'):
                        return ctx.scene.enter('clear-cv-wizard')
                    }
                }
        })
    },
    (ctx:any)=>{
        check_ctx_for(ctx, DATATYPE.CONFIRMCANCEL, 'Please pick one')
            .then((res:any)=>{
                console.log(res.data)
            })
    },
    (ctx:any)=>{
        ctx.reply('Bye').then((d:any)=>{
            return ctx.scene.leave()
        })
        
    }
)
