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



# using jwt token
- login includes verification & role based access control(RBAC)
> verification
    - '/me/' -> all users access , '/admin' -> only admin
- token sent in:  header > authoriation/x-xsrf-token : Bearer <token>  OR in url query?token=
- middlewares/auth.middleware.js > checkLogin(){//token verify }
    - In checkLogin, firstly we receive the token then we verify using:
    jwt.verify(token,process.env.JWT_SECRETKEY) -> is sync func returns data OR throw exception
    IF used jwt.decode(token) => we can still see data
    - Finally we check if user exist(using payload of data) then call next() otherwise next(err of user not exist)

> role based access control(RBAC)
- If we're loggedIn in admin route get admin features and so on 
- middlewares/rbac.middleware.js > CheckPermission(role){return middleware}
    - add this middleware after checkLogin in route 
- CheckPermission(role){see if req.authUser is set and role matches otherwise set error accordingly}



------------------------------------------------------------------------------------------------------------------
## MONGODB
- mongodb is a NoSOL database, suitable when we don't have to maintain relational structure

# Commands of MongoShell
- mongosh           -> To connect to local server
- use databasename; -> Create database and switch to that db
- show dbs;         -> list databases but only with table in it
- db;               -> show db in which we are
- show tables;      -> show tables/collections

# insertion/CREATE
- db.users.insertOne({json_data}) -> creates users table(if not exist) and insert object to it
- db.users.insertMany([{},{}])    -> multiple documents/rows

# data extraction/READ
- db.users.findOne()              -> gives data of first index of collection
- db.users.find()                 -> gives all rows/document of users table

- filterObj -> first param passed in findOne() and find()  to filter out rows\
    > find({role:"admin"}) -> return row with row admin
    > {key:value,key1:value}                      //eqv to ... where key = value and key1 = value
    > {$or: [{role:"admin"},{role:"customer"}]}   //eqv to ... where cond1 or cond2
    > {$and : [
        {$or:[{},{},{$gte:{age:10}}]},
        {status:"active"}
    ]}
    > mongodb.com _ to see query operators
    
- limitObj -> second param to only fetch certain field only
    > {name:1,email:1,_id:0} -> set one to the field to be fetched
    


# UPDATE data
- db.users.updateOne({filter},{update},{upsert:0/1})
    - upsert means update(if filter condtn true) OR insert 

    eg. db.users.updateOne({token:"jhfjsdhf"},{$set{token:null,status:active}})
    eg. db.users.updateOne({_id: ObjectId("fjsdkfsdjkf)})
-db.users.updateMany()

# DELETE data
- db.users.deleteOne({filter})
- db.users.deleteMany()

    eg. db.users.deleteOne({_id:"uirj894hdfjksd"})


# Mongodb data storing format 
- Cluster > database(s) > collection(table in sql) > document(row in sql)

# aggrigate pipelines
- used as joins 





## Using mongodb

- So far we learned to use from mongoshell and compass
- Now we actually will use through application

# Using mongodb with our app

- Two ways of using mongodb     
    - Core Driver/Raw defined -> Not defining structure of dbase / writing everything from codebase 
        - 'mongodb' package 

    - ORM/ODM /Structured     -> We define models/ structure 
        - 'mongoose' package
- We'll just learn CRUD using Core Driver, We'll learn mongoose in deep



# using mongodb package
- npm i mongodb
- In the file we need to store data to dbase
    - import {MongoClient} from 'mongodb'

    * 1 server connect
    - const client = await MongoClient.connect(<DATABASE_URL>,{<options>}) 
        - for localhost: "mongodb://127.0.0.1:27017"

    * 2 db connect
    - const db = client.db(<dbname>)

    * 3 store/insertion query / returns ack and _id
    - res = await  db.collection(<tablename>).insertOne(<data>)
    // send res as response

- user reg. is done, now we are using mailtrap for verification there we've sent token,
     for now we'll use that token to call 'verify-token' API route.
     - Here also repeat step 1 and 2 

     * 3 fetch/read from dbase / returns userDetails if found/valid token
     - let userdetail = await db.collection('users').findOne({token:token})
     // send userdetail as response


- Since we're repeating conn. code we'll organize it in seperate file
    - services/db.service.js/ class DatabaseService{}   _ class to connect to db 
    
    - moving db call from controller to services
        - extend DatabaseService class to make _ eg AuthService in auth.services.js
        - make functions for db call  _ eg registerUser
        - call them from controller _ eg authSvc.registerUser(payload)   

- similarly other functionalities db operations can be done _ eg setpassword / UPDATE
    - fetch userdetails using token, if exist add password field 


* Note that we are using Core Driver mongodb however we'll use mongoose and learn to create models    


# removing mongodb (Core Driver) setup from app
 - we'll not work with Core Driver mongodb
    - npm uninstall mongodb
    - delete 'services/db.service.js' file
    - modify auth/auth.services.js _ using Model we'll create

# mongoose
 - working with ODM of mongodb > mongoose package
 - We can structure table in DB, keys and their data structure

- Every table is pointed by Model (eg users table ,User model) 
- Each row is instance of Model class

* setup
- install mongoose
 - npm i mongoose
- connect db after creating express app in express.config.js
 - config/db.config.js

 * creating Model _ to define table structure|schema
- Here we are creating User model
 - user/user.model.js 
   - create UserSchema, then UserModel and export UserModel
   - now we'll use UserModel to do operation in 'users' table
   - TODO : modify functions of auth.services.js using UserModel

* handeling mongoose 11000 error
- That's unique error i/e not unique value like already used email
- we have to specially handle this code in error handeling middleware


# seperate transformer logic from controller
* moving the input data mapping(on req data) to different file
    - Say we may need register req. mapping/trans logic in another route, like 'user-controller'

    - So crete file, say auth.request.js 
        - Has a class say AuthRequest, which has
        - vars to copy data from req
        - constructor takes (req) and maps vars to  diff. req.<data>
        - and func(say transformRequestData) that modify and return payload
    - File returns class 

- Now where we need modified payload we do :
    - let payload = (new AuthRequest(req)).transformRequestData();



# DB operations added in login route
- check incomming credentials(email and password) in DB
    - fetch user from DB _ getUserByFilter(filter) 
    - if userDetail exist and if is activated  _ 
        - then compare pass and return jwt
        - else handle error accordingly

- Hey now rememeber jwt and ref are stored by JWT itself.
- So even after logging out if client've saved token and send, JWT will verify it until expire date. To prevent,

- We'll store token and userId in DB, if we want to apply custom logout rules. For that,
    - We create a seperate collection/table
    - auth/personal-access-token.js 
        - Define PATSchema, create PATModel, export PATModel
    - In login route set patData{} and store in that table in DB 
        - make storePAT func. in services file for that 
        - call storePAT(patData)



* modifying Verification process
- we're verifying user in auth.middleware.js 
- there we check IF token we get is there in DB and then send for jwt.verify()
    - getPatByToken(token) _ we make function in auth.services.js, it returns userDetail if exist
    - If we get userDetail mean verified 



# handeling logout route
- When user is logged out we delete jwt token of the user in pats table of DB

- route.post('/logout',CheckLogin, authCtrl.logoutUser)

    - WE'LL work on logoutUser
    - get user = req.authUser(appended in CheckLogin)  || getTokenFromHeader
    - loggedout = await authSvc.deletePatData(user._id)
    - now delete from 'pats' table that user

    * we have multiple delete functions used with Model to delete in different ways
    
* NOTE that deleting user with user._id will delete from all devices
   WHEREAS using token from current only
    - to get token we've to write code as we've written in CheckLogin 
    - FOR EASE : move that code in config/helpers.js/ getTokenFromHeader(req)  
    ...tobecontinued




# forget-password functionality

* route
router.post('/forget-password',ValidateRequest(emailValidationSchema),authCtrl.forgetPassword)

* forgetPassword middleware
- get email from req.body
- get userDetails = await authSvc.getUserByFilter
- if user's active, update userDetalis(resetToken and resetExpiry)
- send resetToken to frontend in mail
    - auth.services / forgetPasswordMesssage(name,token){}


# reset-password 
- after mail is send to user, click will render to set-password url

* reset-passwore API route

* route
router.post('reset-password/:resetToken',ValidateRequest(passwordSchema),authCtrl.resetPassword)

* resetPassword middleware
- get resetToken from req.params
      - get password from req.body

      - fetch user using resetToken DB, check exists & expired
        - DB resetExpiry, string format -> 2023-10-13T09:00:00:000(Z if UTC is set)
        - so extract timestamp = new Date(userDetails.resetEspiry).getTime(); 
        - todaysTime = Date.now();
        - compare! if(todaysTime > timestamp)
          - => user Update, resetToken => null, resetExipry => null   (optional)
          - validation error throw => token Expired 
        - false
          - user update =>password encrypt=> {password:encPass, resetToken:null, resetExpiry=null}
          - success response send  

    


# refresh-token API route
- we get token i.e refreshToken 
- send it to CheckLogin where it,
     gets token > gets patsData by token (modified to get if matches with token or refreshToken) > jwt verify > gets and attach authUser to req
- then authCtrl.refreshToken midd. where it,
    create newToken, get previous refreshToken by authUser._id(authSvc.getPatById created) and update pats data > return newToken and refreshToken





# translation 
- Two types of translation
    - content localizatin eg _ ecommerce nepali/ english content

    - Notification, messages etc translation 
        - i18next and i18next-http-backend > install both > import i18next and HttpApi from them resp.
        -  init , locales/en/en.json/{"msgname":"msg"} and more( look at documentation )



# using sql servers 
- working with mongodb, mongoose is ODM provider
- sometimes we may have to use sql servers (postgres, mysql) so instead of mongoose we've to use ORM providers

- based on language (JS or TS)
    - if using JS > sequelize (ORM provider)
    - if using TS > TypeORM 
    [look documentations for using them when needed]

# auth module completed
- At this point of time auth module is completed and in most of projects it'll be same
- After this we'll work on project specific things 
-------------------------------------------------------------------------------------------------------------------------
* making ER diagrams
- Before coding we always should make ER diagrams after setting datastructure it's easier to implement 
- https://app.diagrams.net/
- https://dbdiagram.io/home


* Firstly we try to complete non related modules like
Banner
    image
    url
    title
    status [active,inactive]
    createdBy 
        -> It is used for dispute resolution later
        -> We'll link foreign key here using mongoose
Pages
Blogs
 these are not related with products, but maybe for marketing, SEO, etc


----------------------------------------------------------------------------------------------------------------------------

 # Starting Banner module
 - app/banner/
    - banner.model.js          * Firstly create BannerModel
        
    - banner.router.js         * Then create bannerRouter and mount to main router
        - ALSO create dirSet middleware before creating routehandeler for fileupload
        - In routehandeler we call various middleware and finally controller middleware 

    - banner.controller.js     * We'll do DB operation here 

    - banner.validator.js      * create bannerSchema for Validator

    - banner.services.js       * Code like transform request comes here from controller



# creating banner/ storing in DB
- banner.services.js/storeBanner(payload), call from controller
    - create banner object using BannerModel(payload) class, insert and return
- send response from controller



# listing (Read)
- .get(CheckLogin, CheckPermission('admin'),bannerCtrl.listAllBanners)
- listAllBanners = (req,res,next)
    - search, sort, paginate(sending data in chunks)  _if required OR send all data
    - list = bannerSvc.listAllData()

* For searching with filter
    - send payload through query params eg_ ?search=one
    - make object filter for searching query with filter, pass it while fetching banners


* pagination _ not returning all data instead in chunks
- we need 3 things :
    - page = 1(default frontend sends it)
    - limit = 15(default)
    - total = bannerSvc.countData(filter)
    - skip
- pass offset(skipvalue) and limit, use respective functions while fetching data



# edit banner

* getBannerById 
- to get banner details
- .get route > checkLogin, CheckPermission("admin"), bannerCtrl.getDataById


* updateBannerById
- to update banner 
- .put/patch route > checkLogin, CheckPermission('admin'),dirSet,uploader.single('image'),Validator(BannerCreateSchema),bannerCtrl.updateById
- controller> getBannerDetail, transformRequest, updateBanner and if delete old image if image exist in payload


# delete banner 

* deleteBannerById
- create delete route, deleteBanner and associated image


# get banners for home page
* home route for getting all banners
- create'/home' route at top of bannerRouter
- in controller get banners with reqired page and all

___________________ Banner module is completed for now ________________________________

# Brand module/component

Brand Modeling :
title, slug, description, image, status, createdBy

* slug -> Apple brand for eg > apple_brand OR apple-brand, should be unique and only alphanumeric characters

* We use package to generate slug -> npm i slugify 
    - payload.slug = slugify(request.body.title,)


# making brand Comp. copypaste and edit banner Comp.
- brand.model.js
    - change banner BY brand & Banner BY Brand  AND add few fields like(slug,description)

- brand.router.js
    - replace banner/Banner with brand/Brand

- brand.validator.js
    - replace, remove url & add description field

- brand.controller.js
    - replace, 
    - brandCreate -> modify req trans func
    - listAllBrands -> remove url filter
    ...
    - listHome(edit to add pagination) -> add filter, page, limit and calculate skip as (listAllBrands) and edit listAllData with respective values

    * add a route
    - router.get("/slug/:slug",brandCtrl.getDetailBySlug) -> to get products acc. to brand slug


- brand.service.js
    - replace, 
    - changes in transformCreateRequest() -> append data.slug using 'slugify' pkg



# making category Comp. copypaste and edit brand Comp.

- in model add 'parentId'
- in router add categoryRouter 
- and make few changes in controller, services and validator

- make checkAcces middleware function to make filter before fetching data for access(optional)


# product component
- create product model at product.model.js
- change category.router.js to product.router.js
    - change single to array for uploading images
- change category.controller.js to product.controller.js
- change category.validator.js to product.validator.js
    - change validation according to product schema
- change category.service.js to product.service.js
    - change transform for multiple images 
    - set category, brand and afterdiscount in transformation
    - samething for updatetransform, make sure not to delete prev imgs

    * Creating product we want to generate different slug even if name is same 
    - In controller, we change slug using checkSlug()
    - we create func. in productSvc


NOTE: 
- Updates on other routes 
1. brand details by slug: also send products 
2. category details by slug: also send products 


# product review 
TODO:
- model: productId, reviewerId, review, rate(1-5), 
- APIS
    - product/:productId/review  -> post to create
        (only loggedIn customer ==> Only ordered by)
    - product/:productId/review  -> put to update
        =>Permission, revieserId = authUser._id


# API Order and Cart
- From e-commerce to e-commerce order management is diff.
1. For cart 
    -- ADD --
    - created add to cart for product
    - personalized cart need login (can also do without logn in frontend)
    - if product exist in cart update is else insert
    -- LIST -- 
    - show full list to admin user and own list to customer user

    -- DELETE --
    - 

    NOTE: Order is never deleted OR updated.
          Computerized bill printing sys, machine to print bill is registered.
2. For order
    * If cart is not personalized in DB do same for order
    --- For this case we've saved cart in DB ---
    - we convert cart to order by passing cart id's of products


# user component 
- get user by role and status routes 




-- server to server request -- 
- same as client to server (using axios , etc)
- sometimes we even dont write CRUD instead call other APIS on certain calls in our application (API gateway)



## MORE FEATURES
- Offers
- Seller 
    * Like storing user can use same or diff table, If same (set fields for other diff type user null) & validate with condn OR If diff store specific data in diff table
- Customer Dashboard(listings , histories ,etc)
- XP Calculations
    - based on Purchase
    - Convert purchase to XP by 0.5%
    - Product Purchase Redeem








# Deploying on Server 
- If we've used Typescript, we have to build then deploy 

- In JS, 
    - It's like we're given folder in some device where we've to clone our code. We use terminal not GUI. 
    

NOTE: # We do not use shared-hosting Servers for Node applicaiton.(do not allow other ports like mongodb using atlas server would be blocked)
    # So we use VPS(Virtual Private Server) (is costlier)
    # Alternative of VPS > We use SQL Servers(MYSQL or Postgress), for that we use sequelize or [Prisma or TypeORM - for Typescript]

# Requirements
- we use pm2 package(for continuous npm start ), So we don't use nodemon in server 
- we've to define engines setup (version of node and npm)
- IN index.js file, 
    * port 3000 is for local(in server its 80 or 443 unless there're custom ports) 
    * no need to pass host ie 'localhost'
- config > If there are statis configurations, read from env

-- Free resources to setup server environment -- 
- replit.com: 
> create repel(Node.js, title OR (Import form github as well)) 
> package.json(copypaste)
> uploadfolder(src,locales(Opt) and index.js) 
> for env(add on Secrets)
> use shell to run 'npm install' for node_modules generation
> open index.js file and run (BUTTON) 
> Now it gives us a URL 
> Now check through postman(change env url), mongodb also should be of live(not local)

- Other servers: Netlify, etc

-- Free Domain setup -- 
- register.com.np








---------------------------------------------------------------------

# What if we want to use some other Database servers
- Like PostgreSQL is used with Node.js Server applications OR MySQL also

- In Shared Hoisting Server MySQL is default and also provide PostgreSQL

## DB server setup and Structure define
---- For MySOL --- 
In Windows:
1. Download MySQL Community Server(run)
2. same



---- For PostgreSOL Server --- 
In Windows:
1. Download it(run)
2. like MongoDBCompass, use DBeaver for accssing DB 
    - Database > SQL > select any > password(entered in installation) and textconnection/finish > now create DB(Schemas>puhlic>Tables-create | use SQL scripts)

** SO WE CAN CREATE TABLES ON SERVER OR FROM MIGRATION FILES

## Connection using sequelize
- for switching DBs we create migration files 
- We use package like Sequelize for DB connection, migration and more
STEPS: 
- install 
- sequelize.config.js
- index.js > require('./sequelize.config.js')

### Creating migration
- npm i sequelize-cli 
- npx sequelize-cli migration:generate --name UserTableCreate
- now write table creation and drop commands in file
- now run migration using 'npx sequelize-cli db:migrate'
    * config/config.json > add configurations here

### Using migrations creating models
- app/sequelize/user.model.js > use 'sequelize' from sequelize.config.js
### Controllers are same, service files
- app/sequelize/user.service.js