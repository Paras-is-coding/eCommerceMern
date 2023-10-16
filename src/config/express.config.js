const express = require('express');
const router = require('../router/index.js');
const { MulterError } = require('multer');

//create express app
const app = express();

// parsing different data_formats
app.use(express.json())
app.use(express.urlencoded({extended:false}))

// mount router to app for using router level middlewares
app.use('/api/v1/',router)

app.use((req,res,next)=>{
    res.status(404).json({
        result:null,
        message: "Page not found!",
        meta:null
    })
})

app.use((error,req,res,next)=>{
    let code = error.code ?? 500;
    let message = error.message ?? "Internal server error!";
    let result = error.result ?? null;

    if(error instanceof MulterError){
        if(error.code === 'LIMIT_FILE_SIZE'){
            code = 400;
            message = error.message;
        }
        // similarly other multer errors are handled here
    }

    res.status(code).json({
        result:result,
        message:message,
        meta:null
    })

})


//export express app
module.exports = app;