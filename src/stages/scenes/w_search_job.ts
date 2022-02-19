import { Telegraf, Context, Scenes, Markup, session, Telegram } from 'telegraf'
import { check_ctx_type, kbd_inline,TG_TYPES,CTX_RES, clear_ctx, check_email, get_download_path, set_state, set_state_property, get_state_property } from '../../lib/tg'
import { Middleware } from '../../middleware/default'
import { FWizard, DATATYPE, check_ctx_for} from './factory'
import { get_job } from '../../db/mongoose/webapp'
import {ObjectId} from 'mongodb';

// const {enter, leave} = Scenes.Stage
// Name = name of the Scene or Wizard
export const Name = 'search-job'

export const Visible = true
// Trigger = text or intent which trigers the Wizard
export const Triggers = ['searchjob']


export const Wizard = new FWizard(Name,
    (ctx:any)=>{
        check_ctx_for(ctx,DATATYPE.TEXT,
            'Please enter job title or company')
        .then((res:any)=>{
            if (res?.type==DATATYPE.TEXT) {
                let query = (res.value as string).trim()
                get_job(query).then((result:any)=>{

                    if(result.length != 0) {
                        var result_output:any = `*Result:*\n\n`;
                        var kbd_array:any = []
                        Object
                        let request = result.map((e:any) => {
                            return new Promise((resolve) => {
                                setTimeout(() => {               
                                    kbd_array.push({ text:e.job_title, cbvalue:new ObjectId(e._id).toString() })      

                                    result_output += `*` + e.job_title + `* \n` +
                                        e.company_location + `\n` + e.company_name + 
                                        e.work_exp + ` experience` +`\n\n`;

                                    resolve(result_output);
                                }, 200);
                            });
                        })

                        Promise.all(request).then(() => {
                            //ctx.replyWithMarkdown(result_output)  
                            console.log(kbd_array)

                            kbd_array(kbd_array).then((o:any)=>{
                                ctx.replyWithMarkdown(result_output, o )
                            })

                        });
                    }
                    else{
                        ctx.reply('Sorry. No result found.')
                    }

                    ctx.wizard.next()
                    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
                })
            }
        })
    },
    // (ctx:any)=>{
    //     check_ctx_for(ctx,DATATYPE.CB_QUERY,'Welcome to the Bot',
    //     [
    //         {text:'',cbvalue:'register'},
    //         {text:'Next',cbvalue:'next'},
    //     ])
    //     .then((res:any)=>{
    //         if (res != null && res != false) {
    //             switch (true) {
    //                 case (res.value=='register'):
    //                     return ctx.scene.enter('register-user')
    //                 case (res.value=='searchjob'):
    //                     return ctx.scene.enter('search-job')
    //                 case (res.value=='uploadcv'):
    //                     return ctx.scene.enter('upload-cv-wizard')
    //                 case (res.value=='clearcv'):
    //                     return ctx.scene.enter('clear-cv-wizard')
    //                 }
    //             }
    //     })
    // },
    // (ctx:any)=>{
    //     // register user
    //     // ask user for e-mail
    //     // verify e-mail

    //     // check_ctx_type(ctx).then((res:any)=>{
    //     //     //console.log('res',res)
    //     //     if (res==null) {
    //     //         ctx.reply('Enter email')
    //     //         //return
    //     //     } else if (res.type==TG_TYPES.CB_QUERY) {
    //     //         if (res.data=='confirm') {
    //     //             ctx.wizard.state['data']['email'] = ctx.wizard.state['_']
    //     //             ctx.wizard.state['_'] = null
    //     //             ctx.reply('Thank you')
    //     //             set_state(ctx).then((d:any)=>{
    //     //                 ctx.wizard.selectStep(0)
    //     //                 return ctx.wizard.steps[ctx.wizard.cursor](ctx)
    //     //             }).catch((e:any)=>{
    //     //                 console.log('error',e)
    //     //                 return
    //     //             })
                    
    //     //         } else if (res.data=='retry') {
    //     //             ctx.reply('Please try again')
    //     //             return
    //     //         } else {
    //     //             ctx.wizard.selectStep(0)
    //     //             return ctx.wizard.steps[ctx.wizard.cursor](ctx)
    //     //         }
    //     //     } else {
    //     //         if (res.type==TG_TYPES.TEXT) {
    //     //             console.log('data',res.data)
    //     //             check_email(res.data).then((email:any)=>{
    //     //                 if (email == null) {
    //     //                     ctx.reply('This is not a valid e-mail address')
    //     //                 } else {
    //     //                     ctx.wizard.state['_'] = res.data
    //     //                     kbd_inline([
    //     //                         {text:'Confirm',cbvalue:'confirm'},
    //     //                         {text:'Retry',cbvalue:'retry'},
    //     //                         {text:'Cancel',cbvalue:'cancel'}
    //     //                     ],[]).then((kbd:any)=>{
    //     //                         ctx.reply(`Confirm text entry [${res.data}]`, kbd )
    //     //                     })
    //     //                 }
    //     //             })
                    
    //     //         } else {
    //     //             console.log('x')
    //     //         }
    //     //         return 
    //     //     }
            
    //     // })
    // },
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