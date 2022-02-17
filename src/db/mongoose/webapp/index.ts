import mVacancy from "./model"


export const get_job = (jobtitle:String)=>{
        
    console.log("I received",jobtitle)
    return new Promise((resolve,reject)=>{
        mVacancy.find({"job_title": new RegExp('\W*' + jobtitle + '\W*','i')}).limit(10)
            .then((d:any)=>{resolve(d)})
            .catch((e:any)=>{reject(e)})
        // mVacancy.find({"job_title":`/\W*(worker)\W*/i`}).limit(10)
        //     .then((d:any)=>{resolve(d)})
        //     .catch((e:any)=>{reject(e)})
    })
}