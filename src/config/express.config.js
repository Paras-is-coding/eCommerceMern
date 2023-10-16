const express = require('express');
const router = require('../router/index.js');

//create express app
const app = express();

// mount router to app for using router level middlewares
app.use(router)



//export express app
module.exports = app;