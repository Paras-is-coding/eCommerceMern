# Node.js app and server setup
- npm init 
- use 'http' to create server

# Express app setup
- np i express
- src/config/express.config.js
    - using 'express' create app
    - export and import & mount in index.js node server

# nodemon
- npm i nodemon --save-dev
    - package.json -> "start":"nodemon index.js" for auto server restart

# Routes,Routehandlers and middlewares
- Routing _ defining path for url to perform action
- REST API _ use http methods(GET,POST,PUT,PATCH,DELETE)
- CRUD _ Create(post), Read(get), Update(put/patch) and Delete(delete)
- Routes 
    - Static '/about' , Dynamic '/user/:uid' 
- Route handlers _ app.get/router.get(route,(req,res)=>{})
    - After route parm we can pass any no of middlewares and will exe.in the order they appear
- Middlewares are like route handlers with next parm in callback
- app.use/router.use will take all type of requests

# Response body & status code 
- res.json/text()
- res.status(val).json/send/etc()
- 200 , 400 and 500 status code impt

# Routing level middleware
- src/router/index.js
    - router = require('express').Router()
    - It's different app so mount to express app 
- can use in similar fashion as app level midd. & can also group 
    eg: router.route('/category').get().post().etc

# MANAGING ROUTES
- In auth and authorization component, routes > '/register' , '/verify-token/:token' ,
 '/set-password' , '/login' , '/forget-password' , '/me' , '/logout'

- Here, in auth/auth.router.js  we'll create its own router variable and mount that in 
   main express router as : router.use(authRouter) 

# Managing code
 Modular and Collective approach to manage code
    #  src/
    #     app/                          
    #         auth/
    #             router...
    #             controller...
    #             model...
    #             services...
    #             validator...
    #             transformer...
    #         category/
    #             router...
    #             controller...
    #             model...
    #             services...
    #             validator...
    #             transformer...             
    #     config/
    #     router/


# 404 error handler
- When there is no route handleling middlewares, call goes here 
- we'll return 404 page not found error

# Error Handeling middleware
- written at the end of express.config.js , has one (error ,...) param in middleware
- next(with param) will call this middleware
- used to handle exceptions like _ validation failure, db query failure, fileupload exception,etc


# Receiving data on server 
- For now we'll use postman to send data 
- data received in req.body & url: req.params.id / req.query.q 
- we need to parse different data_format of data on req.body
- Middlewares _ used before sending data to route 
    app.use(express.json())
    app.use(express.urlencoded({extended:true/false}))
    - for form_data we need a third party plugin 'multer'



# Controller
- File we make to shift business logic of route handler
- Includes middlewares(functions or class) if class export obj of class
- we can use that obj anywhere(in router) _ is SINGLETON pattern 


# Form data handeling(file upload)
- we'll use multr middleware
- npm i multer 
- src/middlewares/uploader.js 
- import multer and fs 
- create myStorage = multer.diskStorage({destination: (req,file,cb)=>{}, filename:(req,file,cb)=>{}})
- uploader = multer({storage:myStorage})
# make dirSetup 
    - middleware and use in route handler before using uploader , add req.uploadDir
- use middleware uploader.none/single/array('key_egimage') after route in routerHandler
- req.file/files > to get file/s  

# Validation 
- image/file type and size of file is validated in uploader middleware itself 

# Handeling multer error
- since there is no status in multer error we handle 
- in error handler look if (error instanceof MulterError) then look for the multer and set code accordingly

# Validating other data 
- TWO WAYS :
    - custom validation  -> manually validate each field (validation is done in beginning of controller function) 
    eg if(check invalid condn){ next({code:,message:})}

    -  package based validation -> ZOD(backend),JOI(frontend), YUP(backend), ajv, class-validator  are some popular packages

# ZOD - look documentation
- auth.validator.js
- npm i zod
- import {z} form z
- create mySchema(for expected data)
    EG: const regSchema = z.object({
        username : z.string().min(2).max(50),
        email : z.string().email(),
        role : z.string().regx(/admin|customer|seller/).default('customer')
    })
- Now you can export this schema and use to validate payload
- let validatedData = regSchema.parse(payload) // returns payload or error

- middlewares/validate-request.middleware.js  -> func Validator(schema){returns middleware} , call func in router before heading to controller


# ZOD error handeling 
- same as multer error handeling 
- in error handling middleware check for if(error instanceof ZodError)
- set code = 400, message = "Validation failure!" and result= msg(ie obj of error messages)


# USER VERIFICATION 
- Data + additional fields to dbase > email or OTP to client for verification

- Using mailtrap.io(SMTP server provider)for sending mail
    - SMTP server > Myinbox > showCredientials > integration

- Generate and send token
    - config/helpers.js _ function for random string(token) generation

- npm i nodemailer > import nodemailer > nodemailer.createTranspoter({})
- src/services/mail.service.js _ class MailService > constructor(){this.transporter}|function emailSend(to,sub,message)

- src/auth/auth.services.js _ class AuthServices > function registerEmailMessage(token,name)

- auth.controller.js > call functions
    - let mailMsg = authSvc.registerEmailMessage(payload.name,payload.token);
    - const mailAck = await mailSvc.emailSend(payload.email,"Activate your account",mailMsg)



# .env setup
- we place our private env variables here 
- npm i dotenv 
- On the file where we'll use vaiables >  import dotenv > dotenv.config() 
- process.env.varabble

# Flow
> Register ==> Url FE ==> Activation token ==> Email  , 
> FEURL ==> API(verify-token) ==> Response ACK   ,
> Set Password === Token, Password ===> Activate
user-->email

> login API === username,password ==> login(jwt token)
> loggedin === jwt token ==> Verify ==> Access


# verify-token and set-password 
- registration is done and activation token is send to user 
- Now we'll verify-token from the url send by user and send user acknowledgement

# verify-token 
- set verify-token:token route 
- req.params.token in verifyToken middleware and verify using DB query
- if(valid){res} else{next({set error})


# set-password 
- First validate password (add schema in auth.validator.js)
  - schema validates psw and confirmpsw also compares if they are equal using (.refine(truecond,falsecond)) function
  - export and use before setPassword controller

- Now after validation we'll store psw in db with the help of token(select user),
   additional    fields: status:"active" & token=null
  - for that we need to hash psw, we'll do using 'bcryptjs'
    - npm i bcryptjs > import bcrypt > encPass = bcrypt.hashSync(psw,salt)




# login API
- Here we need to generate JWT token(used for login vefification)
- username,password validate _ loginSchema in auth.validator.js

- Now fetch user from db using provided email
- Then vefify password using bcrypt.compareSync()

- we're logged in now still we need to maintain session so that server will know us
  next time we use personal routes
- create JWT token > npm i jsonwebtoken > import jwt >
     jwt.sign({payload},"JWT_SECRETKEY",{algorithm:"",expires:"1d"})

- create refresh token
(when jwt token expires frontend send req to refresh-token route with this token),
 there the token and refresh token are regenerated and sent again

- Frontend store these tokens on their local storage & every API calls after this are send with this token
