class authController {
    register = (req,res,next) =>{
            const {password,...rest} = req.body;
            res.json(rest);
    }

    verifyToken = (req,res,next)=>{}

    setPassword = (req,res,next)=>{}

    login = (req,res,next)=>{}
}

const authCtrl = new authController();
module.exports = authCtrl;