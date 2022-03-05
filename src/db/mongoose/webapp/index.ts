import mVacancy from "./model"
import {ObjectId} from 'mongodb';

export const get_joblist = (query:String)=>{
        
    console.log("I received",query)
    return new Promise((resolve,reject)=>{

        mVacancy.find({
            $or:
            [
                {
                    "job_title": new RegExp('\W*' + query + '\W*','i')
                },
                {
                    "company_name": new RegExp('\W*' + query + '\W*','i')
                },
                {
                    "job_desc": new RegExp('\W*' + query + '\W*','i')
                },
            ]
        }).limit(10)
            .then((d:any)=>{resolve(d)})
            .catch((e:any)=>{reject(e)})


        


            
        // mVacancy.find({"job_title":`/\W*(worker)\W*/i`}).limit(10)
        //     .then((d:any)=>{resolve(d)})
        //     .catch((e:any)=>{reject(e)})

    })
}

export const get_jobdetails = (oid:String)=>{
        
    console.log("I received",oid)   
    return new Promise((resolve,reject)=>{
        mVacancy.findById(oid)
            .then((d:any)=>{resolve(d)})
            .catch((e:any)=>{reject(e)})
        // mVacancy.find({"job_title":`/\W*(worker)\W*/i`}).limit(10)
        //     .then((d:any)=>{resolve(d)})
        //     .catch((e:any)=>{reject(e)})
    })
}

