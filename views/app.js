const socket = io('/');

const myPeer = new Peer(undefined, {
    host: 'localhost',
    port: 9000,
    path: '/'
  });
const peers={};
const videoContainer = document.querySelector('.video-container');

const myVideo = document.createElement('video');
myVideo.muted=true;

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true

}).then(stream=>{
    addVideoStream(myVideo, stream,"myself")

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })

})

function connectToNewUser(userid,stream){
    const call = myPeer.call(userid,stream);
    const video = document.createElement('video');
    call.on('stream',userstream=>{
        addVideoStream(video,userstream,userid);

    });
    call.on('close',()=>{
        video.remove();
    })
    peers[userid] = call;

}

socket.on('user-disconnected',id=>{
    if(peers[id]){
        console.log(document.getElementById(id));
        const vid = document.getElementById(id);
        vid.remove();
        peers[id].close();
    } 
        
    
})

function addVideoStream(video,camera,id){
    const vwrapper = document.createElement('div');
    vwrapper.classList.add('video-wrapper');
    vwrapper.id = id;
    
    video.srcObject=camera;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
        if(id=="myself"){
            
            document.querySelector(".muteme").addEventListener("click",(event)=>{
                if( video.muted == true){
                    video.muted=false;
                }else{
                    video.muted=true;
                }
            })
        }
    });
    vwrapper.append(video);
    videoContainer.append(vwrapper);
}

myPeer.on('open',(id)=>{
    socket.emit('join-room',ROOM,id);
})



socket.on('user-connected',(user)=>{
    console.log("user-connected: ",user);
})