const ValidateRequest = (schema)=>{
    return (req,res,next)=>{
        try{
            let payload = req.body;
            schema.parse(payload);
            next();
        }catch(except){
            next(except);
        }
    }
}

module.exports = ValidateRequest