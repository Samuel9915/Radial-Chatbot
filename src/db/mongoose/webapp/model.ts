import mongoose, { mongo, Mongoose } from 'mongoose'

//Create connection
const c = mongoose.createConnection(process.env.MONGOSTR_WEB as string)  

//Create schema
const Vacancy = new mongoose.Schema({
    company_name: String,
    company_location: String,
    job_desc: String,
    job_title: String,
    age: String,
    work_exp: String,
    edu_level: String,
    personalities: String,
    daily_budget: String,
    start_date:Date,
    close_date:String,
    owner:String,
    status:Boolean
})

//Create model
const mVacancy = c.model('vacancies',Vacancy)

//Export models
export default mVacancy;




// export const get_job = (jobtitle:String)=>{
        
//     const rajangDB = mongoose.connection.useDb('rajangDB');
//     const mVacancy = rajangDB.model('vacancies',Vacancy)

//     console.log("I received",jobtitle)
//     return new Promise((resolve,reject)=>{
//         mVacancy.find({job_title:jobtitle}).limit(10)
//         .then((d:any)=>{
//             console.log("success!")
//             resolve(d)
//         })
//         .catch((e:any)=>{
//             console.log("error!")
//             reject(e)
//         })
//         // mVacancy.find({"job_title":/\W*(worker)\W*/i}).limit(10)
//         //     .then((d:any)=>{resolve(d)})
//         //     .catch((e:any)=>{reject(e)})
//     })
// }

// const switchtoWebDB = async () => {
//   return new Promise((resolve,reject)=>{
      
//       //createConnection for rajangdb? (hvnt try) 
//       mongoose.connection.useDb('rajangdb')
//       let c = mongoose.createConnection(process.env.MONGOSTR_WEB as string)
//       c.useDb("rajangdb")
//       console.log("Switchtorajangdb")
//       resolve(true)
//   })
//   await new mongoose.Connection().useDb("rajangdb")
//   await console.log("Switchtorajangdb")

// }