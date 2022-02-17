/*
Connects to a socket server

Receives signals (to send messages)
Sends signals (to send events)
*/
//import {io,Socket} from 'socket.io-client'
import {BehaviorSubject} from 'rxjs'
import { io } from 'socket.io-client'
import { SingletonFactory } from './singleton_factory'

let socket:any

export const SocketConnect = (loc:any=undefined)=>{
    return new Promise((resolve,reject)=>{
        let _socket = io(loc)
        _socket.on('connect',()=>{
            socket = _socket
            
            console.log('socket connected',_socket.id)
            resolve(_socket)
        })
    })
}

export const GetSocket = ()=>{
    return socket
}

export class SSocket extends SingletonFactory {

    private static socket:any = undefined
    //member:number|undefined = undefined
    
    constructor(loc:string|any = undefined) {
        super()

        SocketConnect(loc).then((socket:any)=>{
            SSocket.socket = socket
        })
        // SSocket.xsocket = io()
        // ('connect',()=>{
        //     console.log(SSocket.xsocket.id,'----connected')
        //     SSocket.xsocket.emit('tg-signal',{data:'connected'})
        // })
        //this.member = 0;
    }

    whenConnected() {
        const isConnected =  () => { return(SSocket.socket != undefined && SSocket.socket != null)}
        return new Promise((resolve,reject)=>{
            if (!isConnected()) {
                try{
                    while (true) {
                        if (isConnected()) {
                            resolve(SSocket.socket)
                        }
                    }
                } catch(e:any) {
                    reject(e)
                }
                
            } else {
                resolve(SSocket.socket)
            }
        })
    }

    getSocket() {
        return SSocket.socket
    }
}




