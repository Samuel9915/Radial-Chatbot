import mongoose, { mongo, Mongoose } from 'mongoose'

let connection:any|null = null
var conn:mongoose.Connection;

const User = new mongoose.Schema({
    id: {type:Number, required:true, unique:true, index:true},
    username: {type:String, required:true},
    name: {type:String},
    date_added: Date,
    raw_obj: Object
})

const UserMessages = new mongoose.Schema({
    id: {type:Number, required:true, unique:true, index:true},
    messages: [Object]
})

const Groups = new mongoose.Schema({
    id: {type:Number,required:true},
    group_id: {type:Number,required:true},
    date_added: Date,
    raw_obj: Object
})

const State = new mongoose.Schema({
    id: {type:Number, required:true},
    scene: {type:String, required:true},
    date_added: Date,
    data: Object
})
State.index({id:1,scene:1},{unique:true})

const mUser = mongoose.model('user',User)
const mUserMessages = mongoose.model('user_messages',UserMessages)
const mGroups = mongoose.model('groups',Groups)
const mState = mongoose.model('state',State)

mUser.createIndexes()
mUserMessages.createIndexes()
mState.createIndexes()  

export const DBConnect = () =>{
    return new Promise((resolve,reject)=>{
        // if(c == null) {
        //     c = mongoose.createConnection(process.env.MONGOSTR_CB as string)  
        
        //     c.on('error', (err) => {
        //         reject(err);
        //     });
        
        //     c.on('open', () => {

        //         const mUser = c.model('user',User)
        //         const mUserMessages = c.model('user_messages',UserMessages)
        //         const mGroups = c.model('groups',Groups)
        //         const mState = c.model('state',State)

        //         mUser.createIndexes()
        //         mUserMessages.createIndexes()
        //         mState.createIndexes()

        //         resolve(c);
        //     });
        // }
        // else{
        //     resolve(c);
        // }
        
        if (connection==null) {
            mongoose.connect(process.env.MONGOSTR_CB as string).then((c:any)=>{
                connection = c
                conn = c
                
                resolve(c)
            }).catch((e:any)=>{
                reject(e)
            })
        } else {
            resolve(connection)
        }
    })
}


export const addUser=(userObj:any)=>{
    return new Promise((resolve,reject)=>{
        let newUser:any = {}
        newUser['id'] = userObj['id']
        newUser['username'] = userObj['username']
        newUser['name'] = userObj['first_name'] + ' ' + userObj['last_name']
        newUser['raw_obj'] = userObj
        newUser['date_added'] = new Date()
        const newData:any = new mUser(newUser)
        mUser.findOneAndUpdate({id:newUser['id']},newUser,{upsert:true}).then((data:any)=>{
            console.log('saved',data)
            resolve(data)
        }).catch((err:any)=>{
            console.log('error',err)
            reject(err)
        })
    })
}
export const addUserMessage=(userid:number,message:any)=>{
    return new Promise((resolve,reject)=>{
        mUserMessages.findOneAndUpdate({id:userid},{'$push':{'messages':message}},{upsert:true})
            .then((data:any)=>{
                resolve(data)
            })
            .catch((err:any)=>{
                reject(err)
            })
    })
    
}

export const save_state = (userid:any,scene:any,data:any)=>{
    return new Promise((resolve,reject)=>{
        data['dt'] = new Date()
        const newData = {
            userid:userid,
            scene:scene,
            date_added: new Date(),
            data: data
        }
        mState.findOneAndUpdate({id:userid,scene:scene},newData, {upsert:true})
            .then((d:any)=>{resolve(d)})
            .catch((e:any)=>{reject(e)})
    })
}
export const get_state = (userid:any,scene:any)=>{
    return new Promise((resolve,reject)=>{
        mState.findOne({id:userid,scene:scene})
            .then((d:any)=>{resolve(d)})
            .catch((e:any)=>{reject(e)})
    })
}

