


const waitforme = ()=>{
    return new Promise((resolve:any,reject:any)=>{
        setTimeout(()=>{
            resolve(true)
        },1000)
    })
}
let a = 10
waitforme().then((rval:any)=>{
    console.log('done',rval)
    a = 2
})

console.log(`a is ${a}`)