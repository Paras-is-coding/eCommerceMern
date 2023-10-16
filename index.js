const http = require('http');

// create node server we'll mount express app here
const server = http.createServer();


// listening to server in any port or server
server.listen('3000','localhost',(err)=>{
    if(!err){
        console.log("Server is running in port 3000")
        console.log("Press CTRL+C to disconnect your server")
        console.log("Use http://localhost:3000/ to browse your server")
    }
})




