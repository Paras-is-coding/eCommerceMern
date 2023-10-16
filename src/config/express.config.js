const express = require('express');
const router = require('../router/index.js');

//create express app
const app = express();

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
    const code = error.code ?? 500;
    const message = error.message ?? "Internal server error!";
    const result = error.result ?? null;

    res.status(code).json({
        result:result,
        message:message,
        meta:null
    })

})


//export express app
module.exports = app;