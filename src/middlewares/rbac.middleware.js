const CheckPermission = (role)=>{
    return (req,res,next)=>{
        let loggedInUser = req.authUser;

        if(!loggedInUser){
            next({code:401,message:"Unauthenticate"})
        }

        // role can be array if multiple role can access route
        if(typeof role === 'string' && loggedInUser.role === role){
            next()
        }else if(typeof role !== 'string' && role.includes(loggedInUser.role)){
            next()
        }
        else{
            next({code:403,message:"You do not have permission"})
        }
    }
}


module.exports = CheckPermission;