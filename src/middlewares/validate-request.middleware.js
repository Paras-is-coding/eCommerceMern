const ValidateRequest = (schema)=>{
    return (req,res,next)=>{
        try{
           
            let payload = req.body;
            // console.log(payload)
            schema.parse(payload);
            next();
        }catch(except){
            console.log(except)
            next(except);
        }
    }
}

module.exports = ValidateRequest