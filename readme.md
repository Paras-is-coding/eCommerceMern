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
