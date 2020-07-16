const express = require("express")
const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http, {
  transports: ["websocket", "polling"],
})

const names = ["security","propertymgr","admin"];
io.on('connection', client => {
    let filter=[];
    client.on("checkrole", role => {
        console.log('checking role');
        filter = names.filter(name => name === role);
        console.log (filter);
    })
    if(filter.length>0){
        switch(filter[0]) {
        case "security":
            // sockets for Security
            
        case "propertymgr":
            // sockets for Property Mgr.
        case "admin":
            // sockets for Super Admin
        }
    }else
    {
        client.on("disconnect", () => {
            console.log("No valid role found, Socket disconnected");
        })
    }
})