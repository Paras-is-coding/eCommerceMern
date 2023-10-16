const http = require('http');
const app = require('./src/config/express.config.js')

// create node server and mounted express app
const server = http.createServer(app);


// listening to server in any port on server
server.listen('3000','localhost',(err)=>{
    if(!err){
        console.log("Server is running in port 3000")
        console.log("Press CTRL+C to disconnect your server")
        console.log("Use http://localhost:3000/ to browse your server")
    }
})




