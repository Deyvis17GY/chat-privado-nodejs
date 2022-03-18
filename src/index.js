const http = require('http');//crear servidor
const path=require('path');
const express = require('express');//requiro Express para app
const socketio=require('socket.io');

const app = express();//instancio express
const server =http.createServer(app);//instancio en una varibale al nuevo sevidor
const io=socketio.listen(server);//finalizo el servidor con tecnologia sockets

const mongoose = require ('mongoose');
require('dotenv').config();

//Conection Alterna


// DB CONNECTION
mongoose
  .connect(process.env.MONGODB_URI_CONNECT, {
    useNewUrlParser: true,
  })
  .then((db) => console.log('db is connect'))
  .catch((err) => console.log(err));
//settings
app.set('port',process.env.PORT || 3000);




//


//Static Files
app.use(express.static(path.join(__dirname, 'public')));

require('./sockets')(io);

//Empezando el servidor
server.listen(app.get('port'),() =>{
    console.log("Server on port", app.get('port'));

});
