module.exports = function(io){

  const mongoose = require('mongoose');
  const {Schema}= mongoose;

  const ChatSchema = new Schema({
    nick:String,
    msg:String,
    create_at:{
      type:Date,
      default:Date.now
    }
  });

  const Chat = mongoose.model('Chat',ChatSchema);

  let users={};
  io.on('connection',async socket => {
    console.log('new usuario conectado');

    let messages =await Chat.find({});
    socket.emit('load old msgs',messages);

    socket.on('new user',(data, cb) => {

      if(data in users){
        cb(false);
      }else{
        cb(true);
        socket.nickname = data;
        users[socket.nickname] = socket;
        updateNicknames();
      }

    });

    socket.on('send message',async (data,cb) =>{

      var msg =  data.trim();//elimina espacios

      if(msg.substr(0,3)=== '/W '){//3 primeros caracteres del mensaje
        msg = msg.substr(3);
        const index = msg.indexOf(' ');//determinar espacion en blanco
        if(index!== -1){
           var name = msg.substring(0,index);//obtener desde cero hasta el espacio en blanco
           var msg = msg.substring(index+1);//tomar el mensaje
           if(name in users){
             users[name].emit('wisper',{
               msg:msg,
               nick:socket.nickname
             });
           }else{
             cb('Error: Usuario no conectado!');
           }
         }else{
           cb('Error: Ingresa el mensaje privado');
         }
       }else{
         var newMsg = new Chat({
           msg:msg,
           nick:socket.nickname
         });
        await newMsg.save();
      //envia el mensaje
      io.sockets.emit('new message',{
        msg:data,
        nick:socket.nickname
      });
    }

});

    socket.on('disconnect', data => {
      if(!socket.nickname) return ;
      delete users[socket.nickname];
      updateNicknames();
    });

    function updateNicknames(){
      io.sockets.emit('usernames', Object.keys(users));
    }

  });

}
