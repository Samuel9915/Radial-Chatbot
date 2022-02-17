export const ReverseString=(val:string)=>{
    return val.split('').reverse().join('')
}

export class User {

    private userObj:any

    constructor(_uObj:any) {
        this.userObj = _uObj
    }

    show() {
        console.log('user is', this.userObj)
    }

}