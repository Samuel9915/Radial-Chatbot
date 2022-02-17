import moment from 'moment'
import { Telegraf, Context, Scenes, Markup, session, Middleware, Telegram } from 'telegraf'
import { SSocket } from '../../lib/socket_client_bridge'
import { kbd_inline } from '../../lib/tg'
export const DATATYPE = {
    'CB_QUERY':'cb_query',
    'CB_QUERY_MULTI':'cb_query_multi',
    'TEXT': 'text',
    'NUMBER': 'number',
    'DATE': 'date',
    'EMAIL': 'email',
    'PHOTO': 'photo',
    'VIDEO': 'video',
    'AUDIO': 'audio',
    'DOCUMENT': 'document',
    'CONFIRMCANCEL':'confirmcancel',
    'LOCATION':'location'
}
interface ResultPayload {
    type:string|null,
    value:any|null
}
export class FWizard extends Scenes.WizardScene<any> {

    static socket:any = undefined
    name:any = undefined

    constructor(name:string,...steps: Array<any>) {
        super(name,...steps)
        let _ = new SSocket()
        FWizard.socket = _.getSocket()
        if (FWizard.socket != undefined && FWizard.socket != null) {
            FWizard.socket.emit('tg-signal',{data:`Wizard Initialized ${name}`})
        }
        this.use(Events)
    }

    static next(ctx:any,step:number|any=null) {
        if (step == null) {
            ctx.wizard.next()
        } else {
            ctx.wizard.selectStep(step)
        }
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    static leaveWizard(ctx:any) {
        FWizard.socket?.emit('tg-signal',{data:`Exiting ${this.name}`})
        ctx.scene.leave()
    }





}

const Events = (ctx:any,next:any)=>{
    console.log('middleware ----------======|')
    console.log(Object.keys(ctx.update))
    return next()
    // bot.on('text',(ctx:any)=>{
    //     console.log('------------>')
    //     next()
    // })
}

export const check_ctx_for =(ctx:any,datatype:string, message:string|any=null,options:any=null,selected_options:any[]|null=null)=>{
    
    return new Promise((resolve,reject)=>{
        let result:ResultPayload = {type:null, value:null}
        let value = null
        new Promise((resolve,reject)=>{
            switch (datatype) {
                case DATATYPE.DATE:
                    //https://github.com/wanasit/chrono
                    if (ctx.update?.message?.text!=undefined && ctx.update?.message?.text!=null) {
                        //message=null
                        value = ctx.update.message.text
                        if ((!isNaN(value.trim())) && !isNaN(parseFloat(value.trim()))) {
                            result.type = DATATYPE.NUMBER
                            result.value = value
                            delete ctx.update.message.text
                            resolve(result)
                        } else {
                            resolve(null)
                        }
                    }
                    break
                case DATATYPE.EMAIL:
                    console.log(':::email')
                    if (ctx.update?.message?.text!=undefined && ctx.update?.message?.text!=null) {
                        //message = null
                        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
                        if (re.test(ctx.update.message.text)) {
                            result.type = DATATYPE.EMAIL
                            result.value = ctx.update.message.text
                            delete ctx.update.message.text
                            resolve(result)
                        } else {
                            resolve(null)
                        }
                    }
                    break
                case DATATYPE.TEXT:

                    if (ctx.update?.message?.text!=undefined && ctx.update?.message?.text!=null) {

                        result.type = DATATYPE.TEXT
                        result.value = ctx.update.message.text
                        delete ctx.update.message.text
                        resolve(result)

                    } else {
                        resolve(null)
                    }
                    break
                case DATATYPE.NUMBER:
                    if (ctx.update?.message?.text!=undefined && ctx.update?.message?.text!=null) {
                        //message = null
                        value = ctx.update.message.text
                        if ((!isNaN(value.trim())) && !isNaN(parseFloat(value.trim()))) {
                            result.type = DATATYPE.NUMBER
                            result.value = value
                            delete ctx.update.message.text
                            resolve(result)
                        } else {
                            resolve(null)
                        }
                    } 
                    
                    //console.log(ctx.update)
                    break
                case DATATYPE.PHOTO:
                    console.log('photo?',ctx.update?.message?.photo)
                    if (ctx.update?.message?.photo!=undefined && ctx.update?.message?.photo!=null) {
                        //message = null
                        let allmedia = ctx.update?.message?.photo
                        value = allmedia[allmedia.length-1]
                        console.log('value',value)
                        if (value?.file_id != undefined) {
                            result.type = DATATYPE.PHOTO
                            result.value = value
                            delete ctx.update.message.photo
                            resolve(result)
                        } else {
                            resolve(null)
                        }
                    } 
                    
                    //console.log(ctx.update)
                    break
                case DATATYPE.AUDIO:
                    console.log('audio?',ctx.update?.message?.voice)
                    if (ctx.update?.message?.voice!=undefined && ctx.update?.message?.voice!=null) {
                        //message = null
                        //let allmedia = ctx.update?.message?.photo
                        value = ctx.update?.message?.voice
                        console.log('value',value)
                        if (value?.file_id != undefined) {
                            result.type = DATATYPE.AUDIO
                            result.value = value
                            delete ctx.update.message.voice
                            resolve(result)
                        } else {
                            resolve(null)
                        }
                    } 
                    
                    //console.log(ctx.update)
                    break
                case DATATYPE.VIDEO:
                    console.log('video?',ctx.update?.message?.video)
                    if (ctx.update?.message?.video!=undefined && ctx.update?.message?.video!=null) {
                        //message = null
                        //let allmedia = ctx.update?.message?.photo
                        value = ctx.update?.message?.video
                        console.log('value',value)
                        if (value?.file_id != undefined) {
                            result.type = DATATYPE.VIDEO
                            result.value = value
                            delete ctx.update.message.video
                            resolve(result)
                        } else {
                            resolve(null)
                        }
                    } 
                    
                    //console.log(ctx.update)
                    break
                case DATATYPE.DOCUMENT:
                    console.log('document?',ctx.update?.message?.document)
                    if (ctx.update?.message?.document!=undefined && ctx.update?.message?.document!=null) {
                        //message = null
                        //let allmedia = ctx.update?.message?.photo
                        value = ctx.update?.message?.document
                        console.log('value',value)
                        if (value?.file_id != undefined) {
                            result.type = DATATYPE.DOCUMENT
                            result.value = value
                            delete ctx.update.message.document
                            resolve(result)
                        } else {
                            resolve(null)
                        }
                    } 
                    
                    //console.log(ctx.update)
                    break
                case DATATYPE.LOCATION:
                    console.log('location?',ctx.update?.message?.location)
                    if (ctx.update?.message?.location!=undefined && ctx.update?.message?.location!=null) {
                        //message = null
                        //let allmedia = ctx.update?.message?.photo
                        value = ctx.update?.message?.location
                        console.log('value',value)
                        if (value?.latitude != undefined) {
                            result.type = DATATYPE.LOCATION
                            result.value = value
                            delete ctx.update.message.location
                            resolve(result)
                        } else {
                            resolve(null)
                        }
                    } 
                    
                    //console.log(ctx.update)
                    break
                case DATATYPE.CB_QUERY:
                    console.log('cb_query',ctx.update?.callback_query?.data)
                    if (ctx.update?.message?.text!=undefined && ctx.update?.message?.text!=null) {
                        // did someone enter a number?
                        value = ctx.update.message.text
                        if ((!isNaN(value.trim())) && !isNaN(parseFloat(value.trim()))) {
                            let answer:number = parseInt(value.trim()) - 1
                            console.log('answer is',answer)
                            if (answer >= 0 && answer < options.length) {
                                value = options[answer]?.cbvalue
                                if (value == undefined) {
                                    value = options[answer]?.url
                                    if (options[answer]?.url) ctx.reply(`Click on this link ${options[answer].url}`)
                                }
                                delete ctx.update.message.text
                                result.type = DATATYPE.CB_QUERY
                                result.value = value
                                resolve(result)
                            }
                        }
                    }
                    if (ctx.update?.callback_query?.data != undefined && ctx.update?.callback_query?.data != null) {
                        ctx.editMessageText('[menu used]',null)
                        value = ctx.update.callback_query.data
                        result.type = DATATYPE.CB_QUERY
                        result.value = ctx.update.callback_query.data
                        delete ctx.update.callback_query.data 
                        resolve(result)
                    } else {
                        resolve(null)
                    }
                    break
                case DATATYPE.CB_QUERY_MULTI:
                    console.log('cb_query_multi',ctx.update?.callback_query?.data)
                    if (ctx.update?.message?.text!=undefined && ctx.update?.message?.text!=null) {
                        // did someone enter a number?
                        value = ctx.update.message.text
                        if ((!isNaN(value.trim())) && !isNaN(parseFloat(value.trim()))) {
                            let answer:number = parseInt(value.trim()) - 1
                            console.log('answer is',answer)
                            if (answer >= 0 && answer < options.length) {
                                value = options[answer]?.cbvalue
                                if (value == undefined) {
                                    value = options[answer]?.url
                                    if (options[answer]?.url) ctx.reply(`Click on this link ${options[answer].url}`)
                                }
                                delete ctx.update.message.text
                                result.type = DATATYPE.CB_QUERY_MULTI
                                result.value = value
                                resolve(result)
                            }
                        }
                    }
                    if (ctx.update?.callback_query?.data != undefined && ctx.update?.callback_query?.data != null) {
                        value = ctx.update.callback_query.data
                        result.type = DATATYPE.CB_QUERY_MULTI
                        result.value = ctx.update.callback_query.data
                        delete ctx.update.callback_query.data 
                        resolve(result)
                    } else {
                        resolve(null)
                    }
                    break
                case DATATYPE.CONFIRMCANCEL:
                    /*
                    resolves boolean (true=confirm, false=cancel, null=unknown)
                    */
                    options = [{text:'Confirm',cbvalue:'confirm'},{text:'Cancel', cbvalue:'cancel'}]
                    if (ctx.update?.message?.text!=undefined && ctx.update?.message?.text!=null) {
                        value = ctx.update.message.text
                        if ((!isNaN(value.trim())) && !isNaN(parseFloat(value.trim()))) {
                            console.log(options.length)
                            let answer:number = parseInt(value.trim()) - 1
                            if (answer >= 0 && answer < options.length) {
                                value = (options[answer]?.cbvalue == 'confirm')
                                delete ctx.update.message.text
                                result.type = DATATYPE.CB_QUERY
                                result.value = value
                                ctx.reply(`(${options[answer]?.text})`)
                                resolve(result)
                            }
                        }
                    }
                    //console.log('confirmcancel',ctx.update?.callback_query?.data)
                    if (ctx.update?.callback_query?.data != undefined && ctx.update?.callback_query?.data != null) {
                        ctx.editMessageText('[menu used]',null)
                        value = (ctx.update.callback_query.data == 'confirm')
                        result.type = DATATYPE.CONFIRMCANCEL
                        result.value = value
                        delete ctx.update.callback_query.data 
                        resolve(result)
                    } else {
                        resolve(null)
                    }
                    break
            }
            resolve(null)
        }).then((res:any)=>{
            if (res==null) {
                //console.log(ctx)
                if (message != null) {
                    console.log('message')
                    if (options != null) {
                        kbd_inline(options,selected_options,1).then((kbd:any)=>{
                            ctx.reply(message,kbd).then((dd:any)=>{
                                resolve(false)
                            })
                        })
                    } else {
                        ctx.reply(message).then((dd:any)=>{
                            console.log('beep')
                            resolve(false)
                        })
                    }
                    
                } else {
                    resolve(false)
                }
            } else {
                resolve(res)
            }
        })
        
        
        
    })
}
