
import * as fs from 'fs'
import path from 'path'
import { Scenes } from 'telegraf'
import { clear_ctx } from '../lib/tg'

export let AllScenes:any = []
export let AllWizards:any = {}

let default_wizard:any = null
let env_default_wizard:any = process.env.DEFAULT_WIZARD
//

let MainStage:any
let AllTriggers:any = {}
let AllWizardTriggers:any = {}

const ONEHOUR = 60*60
const ONEDAY = ONEHOUR*24

/*
Copyright 2021 - Rajang Digital Solutions
Scene and Wizard bootloader
*/
let myBot:any = null 
export const PluginInit=(bot:any)=>{
    myBot = bot
    return new Promise((resolve,reject)=>{
        fs.readdir(path.join(__dirname,'/scenes/'),(err,files)=>{
            /*
            Scan the scenes folder for valid files
            */
            files?.forEach((file)=>{
                if (file=='index.ts') return
                //console.log(file)
                let o = require(path.join(__dirname,'/scenes/',file))
                const exposed_methods = Object.keys(o)
                
                if (exposed_methods.indexOf('Scene') >= 0 && exposed_methods.indexOf('Name')>=0) {
                    const allkeys_AllScenes = Object.keys(AllScenes)
                    //console.log('Found Scene',o['Name'])
                    if (exposed_methods.indexOf('Triggers')>=0) {
                        AllTriggers[o['Name']] = o['Triggers']
                    }
                    if (allkeys_AllScenes.indexOf(o['Name'])<0) {
                        AllScenes[o['Name']] = o['Scene']
                        //console.log(path.join(__dirname,'/scenes/',file),AllScenes[o['Name']])
                    }
                } else if (exposed_methods.indexOf('Wizard') >= 0 && exposed_methods.indexOf('Name')>=0) {
                    const allkeys_AllScenes = Object.keys(AllScenes)
                    //console.log('Found Wizard',o['Name'])
                    if (allkeys_AllScenes.indexOf(o['Name'])<0) {
                        AllScenes[o['Name']] = o['Wizard']
                        if (env_default_wizard==o['Name']) {
                            console.log('setting default_wizard:', o['Name'])
                            default_wizard = o['Name']
                        }
                    }
                    if (exposed_methods.indexOf('Triggers')>=0) {
                        AllTriggers[o['Name']] = o['Triggers']
                    }
                } else {
                    console.log(`Ignored -- ${file}`)
                }
                //console.log('triggers',AllTriggers)
            })
            console.log('Number of Scenes registered:',Object.keys(AllScenes).length)
            
            // all scenes have a maximum ttl of one hour
            resolve(new Scenes.Stage<Scenes.SceneContext>(Object.keys(AllScenes).map((key)=>{return AllScenes[key]}),{default:default_wizard,ttl:(ONEHOUR)}))
            
        })
    })
}

export const GetTriggers = ()=>{
    return AllTriggers
}

export const ProcessTriggers = (bot:any)=>{
    //console.log('>>>>ProcessTriggers')
    Object.keys(AllTriggers).map((name:string)=>{
        let triggers:Array<any> = AllTriggers[name]
        triggers.map((trigger:string)=>{
            console.log('>>Reg Command',name,trigger)
            bot.command(trigger,(_ctx:any)=>{
                console.log('>>Cmd Triggered',name,trigger)
                _ctx.reply(`Starting ${name}`).then((d:any)=>{
                    //console.log(`....${d}`)
                    //console.log(Object.keys(_ctx))
                    console.log(`Starting ${name} with ${trigger}`)
                })
            })
        })
    })
}

