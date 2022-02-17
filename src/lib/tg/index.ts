import { Markup, Telegraf } from "telegraf"
import { get_state, save_state } from "../../db/mongoose/chatapp"
import axios from 'axios'

export const TG_TYPES = {
    'CB_QUERY' : 'callback_query',
    'TEXT':'text'
}

export const kbd_reply = (ctx:any,msg:string,options:string[])=>{
    //https://javascript.hotexamples.com/examples/telegraf/Markup/keyboard/javascript-markup-keyboard-method-examples.html
    return ctx.reply('message', Markup.keyboard(options).oneTime())
}

export const kbd_inline = (options:any[],selected_options:any[]|null=null,items_per_row:number=2)=>{
    if (items_per_row<1) items_per_row=1
    return new Promise((resolve,reject)=>{
        let all_buttons = [
            [
                Markup.button.callback('one two three','count'),
                Markup.button.callback('a b c','alphabet')
            ]
        ]
        if (options && options.length>0) {
            all_buttons = []
            let row:Array<any> = []
            let counter = 1
            options.map((o:any)=>{
                //console.log('ooo',o)
                let label = o.text
                if (selected_options?.length) {
                    console.log('selected',selected_options,o.cbvalue)
                    if (selected_options.indexOf(o.cbvalue)>=0) {
                        label = `${label} [T]`
                    }
                }
                switch (true) {
                    case (o.cbvalue != undefined):
                        row.push(Markup.button.callback(`${counter}. ${label}`,o.cbvalue))
                        break;
                    case (o.url != undefined):
                        row.push(Markup.button.url(`${counter}. ${label}`,o.url))
                        break;
                }
                counter++
                if ((row.length >0) && (row.length>=items_per_row)) {
                    all_buttons.push(row)
                    row=[]
                }
            })
            if (row.length>0) {
                all_buttons.push(row)
                row = []
            }
        }
        resolve(Markup.inlineKeyboard(all_buttons))
    })
}

export interface CTX_RES {
    type:string,
    data:any,
    raw?:any
}
export const check_ctx_type = (ctx:any)=>{
    return new Promise((resolve,reject)=>{
        let result:any|null = null
        console.log(Object.keys(ctx.update))
        switch (true) {
            case (ctx.update?.callback_query?.data != undefined):
                //console.log('before flush',ctx)
                console.log(ctx)
                ctx.editMessageText('[menu used]',null)
                console.log('>CALLBACK_QUERY')
                result  = {type:TG_TYPES.CB_QUERY,data:ctx.update.callback_query.data, raw:ctx.update.callback_query}
                clear_ctx(ctx)
                //console.log('flushed',ctx)
                break
            case (ctx.update?.message?.text != undefined):
                console.log('>TEXT')
                result = {type:TG_TYPES.TEXT,data:ctx.update.message.text,raw:ctx.update}
                clear_ctx(ctx)
                
                break
            default:
                //console.log('update',ctx.update)
        }
        console.log('cursor',ctx.wizard.cursor)
        console.log('result',result)
        resolve(result as CTX_RES|null)
    })
}

export const clear_ctx = (ctx:any) =>{
    if (ctx.update?.callback_query?.data) delete ctx.update.callback_query.data
    if (ctx.update?.message?.text) delete ctx.update.message.text
}

export const check_email = (str:any)=>{
    // check text for email
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    return new Promise((resolve,reject)=>{
        if (str != undefined) {
            if (re.test(str)) {
                resolve(str)
            } else {
                resolve(null)
            }
        } else {
            resolve(null)
        }
    })
}

const get_scene_properties = (ctx:any)=>{
    const scene = ctx.session?.__scenes?.current
    let userid = ctx.update.message?.chat?.id
    if (userid==undefined) {
        userid = ctx.update.callback_query?.from?.id
    }
    return {scene:scene,userid:userid}
}

export const init_state = (ctx:any)=>{
    return new Promise((resolve,reject)=>{
        const scene_prop = get_scene_properties(ctx)

        if (scene_prop.scene==undefined || scene_prop.userid == undefined) {
            console.log('CTX',ctx)
            reject(`rejected name:${scene_prop.scene} userid:${scene_prop.userid}`)
        }
        get_state(scene_prop.userid,scene_prop.scene).then((state:any)=>{
            console.log('retrieved state',state)
            if (state?.data!=undefined) {
                ctx.wizard.state.data = state.data
                resolve(state.data)
            } else {
                console.log('scene',scene_prop.scene,'user',scene_prop.userid)
                if (ctx.wizard.state?.data==undefined || ctx.wizard.state?.data==null) ctx.wizard.state['data'] = {}
                set_state(ctx, ctx.wizard.state.data).then((d:any)=>{
                    resolve(d)
                }).catch((e:any)=>{
                    reject(e)
                })
            }
        })
    })
}

export const set_state_property = (ctx:any, property_name:string, value:any)=>{
    const scene_prop = get_scene_properties(ctx)
    return new Promise((resolve,reject)=>{
        get_state(scene_prop.userid,scene_prop.scene).then((sd:any)=>{
            let scene_data = sd?.data
            if (scene_data==undefined) {
                scene_data = {}
            }
            scene_data[property_name] = value

            save_state(scene_prop.userid,scene_prop.scene,scene_data).then((_:any)=>{
                resolve(_)
            }).catch((e:any)=>{
                reject(e)
            })
        })
    })
}

export const get_state_property = (ctx:any, property_name:string) =>{
    const scene_prop = get_scene_properties(ctx)
    return new Promise((resolve,reject)=>{
        get_state(scene_prop.userid,scene_prop.scene).then((sd:any)=>{
            let scene_data = sd?.data
            if (scene_data == undefined) 
                resolve(scene_data)
            else
                resolve(scene_data[`${property_name}`])
        }).catch((err)=>{
            console.log(err)
            reject(null)
        })
    })
}

export const clear_state = (ctx:any, scene_name:string|null = null,property_name:string|null=null) =>{
    const scene_prop = get_scene_properties(ctx)
    if (scene_name != null) scene_prop.scene = scene_name
    return new Promise((resolve,reject)=>{
        get_state(scene_prop.userid,scene_prop.scene).then((sd:any)=>{
            let scene_data = sd?.data
            if (scene_data == undefined || scene_data == null) scene_data = {}
            if (property_name != null && Object.keys(scene_data).indexOf(property_name)>=0) {
                delete scene_data[`${property_name}`]
            } else {
                scene_data = {}
            }
            console.log('before delete',scene_data)
            save_state(scene_prop.userid,scene_prop.scene,scene_data).then((d:any)=>{
                console.log('after delete',d)
                resolve(d)
            }).catch((e:any)=>{
                reject(e)
            })
        })
    })
}

export const set_state = (ctx:any,data:any=null)=>{
    const scene_prop = get_scene_properties(ctx)
    if (data==null) data = ctx.wizard?.state?.data
    return new Promise((resolve,reject)=>{
        if (data==null||data==undefined) {
            console.log('---no data to save---')
            resolve(null)
        }
        save_state(scene_prop.userid,scene_prop.scene,data).then((d:any)=>{
            resolve(d)
        }).catch((e:any)=>{
            reject(e)
        })
    })
    
}

export const get_download_path = (file_id:string)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getfile?file_id=${file_id}`)
        .then((response:any)=>{
            console.log('got',response?.data?.result)
            resolve(response?.data?.result)
        })
        .catch((error:any)=>{
            reject(error)
        })
    })
    
}