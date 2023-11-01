const { generateRandomString } = require("../../config/helper");

class AuthRequest {
    body;
    file;
    files;
    constructor(req){
        this.body = req.body;
        this.file = req.file;
        this.files = req.files;
    }
    
    transformRequestData = () =>{
        let payload = this.body;
        
        if(this.file){
            payload.image = this.file.filename;
        }
        else if(this.files){
            payload.image = this.files.map((iteam)=>iteam.filename);
        }

        payload.status = 'inactive'
        payload.token = generateRandomString() 

        return payload;
    }
}

module.exports = AuthRequest