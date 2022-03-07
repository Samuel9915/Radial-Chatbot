import mVacancy from "./model"
import {ObjectId} from 'mongodb';


export const get_joblist = ()=>{
        
    //console.log("I received",query)
    return new Promise((resolve,reject)=>{
        mVacancy.find()
        .then((d:any)=>{resolve(d)})
        .catch((e:any)=>{reject(e)})
    })
}


export const get_filter_joblist = (f_title?:String,f_company?:String,f_location?:String)=>{
        
    //console.log("I received",query)
    return new Promise((resolve,reject)=>{

        let a = new Array

        if(f_title != undefined){
            a.push({
                "job_title": new RegExp('\W*' + f_title + '\W*','i'),
            })
        }
        if(f_company != undefined){
            a.push({
                "company_name": new RegExp('\W*' + f_company + '\W*','i')
            })
        }
        if(f_location != undefined){
            a.push({
                "company_location": new RegExp('\W*' + f_location + '\W*','i')
            })
        }

        mVacancy.find({
            $and:a
        })
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

