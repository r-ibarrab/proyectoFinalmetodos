const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4}= require('uuid');
const { PeerServer } = require('peer');


const peerServer = PeerServer({ port: 9000, path: '/' });

app.set("view engine","ejs");
app.use(express.static("./views"));

app.get('/',(req,res)=>{
res.render("index");

});

app.get("/create",(req,res)=>{
    res.redirect(`/${v4()}`);
});
app.get("/:room",(req,res)=>{
    res.render("room",{roomID:req.params.room});
});

io.on('connection',(socket)=>{

    socket.on('join-room',(room,user)=>{
        console.log(room," - ",user);
        socket.join(room);
        socket.to(room).broadcast.emit('user-connected',user);
        socket.on('disconnect',()=>{
            socket.to(room).broadcast.emit('user-disconnected',user);
        })

    })
    

})





server.listen(3000);