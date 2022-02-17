
let msgbox = null
$(document).ready((d)=>{
    $: io = io()
    msgbox = document.getElementById('message')
    io.on('server-message',(payload)=>{
        console.log('server-message',payload)
    })
    io.on('server-broadcast',(payload)=>{
        console.log('broadcast',payload)
    })
})

const sendSignal = (msg)=>{
    io.emit('test-signal',msg)
    console.log('emitted')
    
}