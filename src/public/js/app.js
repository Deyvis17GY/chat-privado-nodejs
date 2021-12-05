
$(function (){
  
 const socket = io();

 //Obteniendo elementos del DOM desde la interfaz
 const messageForm= $('#message-form');
 const messageBox= $('#message');
 const chat= $('#chat');
 //Obteniendp elemntos del DOM #nickNameForm
const nickForm =  $('#nickForm');
const nickError =  $('#nickError');
const nickname =  $('#nickName');

const users =$('#usernames');



nickForm.submit( e => {
e.preventDefault();

if(!nickname.val().length>0){
  $('#mensaje').text("Ingrese Usuario").slideDown(1000,function(){
    $('#mensaje').slideUp(1500);
  });

}else{
  socket.emit('new user', nickname.val(),data => {


    if(data){
      $('#nickWrap').hide();
      $('#contentWrap').show();
      $('#nav1').hide();
      $('#nav2').show();

    }else{
      nickError.html(`<div class="alert alert-danger text-center"> Usuario Existe. </div>`);
    }
    nickname.val('');
  });
}
});

 //Eventos Para enviar mensaje
 messageForm.submit(e => {
   e.preventDefault();
  if(!messageBox.val().length>0){
    $('#mensaje').text("Ingrese Mensaje").slideDown(1000,function(){
      $('#mensaje').slideUp(1500);
    });
  }else{
    socket.emit('send message', messageBox.val(),data => {
      chat.append(`<p class="error">' ${data} '</p>`);
    });//socket preparado para enviar mensaje
  }


   messageBox.val('');
 });

//Eventos Para
 socket.on('new message', function(data){//socket preparado para recibir mensaje en todo el servidor
   chat.append('<p class="mensaje"><b class="negrita">' + data.nick + '</b> :' + data.msg + '</p>');
 });

 socket.on('usernames',data =>{
   let html='';
   for(let i=0;i<data.length;i++){
     html+=`<p class="usuariosNombre"><i class="fas fa-user"></i> ${data[i]}</p>`
   }
   users.html(html);
 });

 socket.on('wisper',data => {
     chat.append(`<p class="wisper"><b> ${data.nick} :</b>${data.msg}</p>`);
 });

 socket.on('load old msgs', msgs => {
   for(let i =0;i < msgs.length;i++){
     displayMsg(msgs[i]);
   }
 });

 function displayMsg(data){
   chat.append(`<p class="nuevomsg"><b> ${data.nick} :</b>${data.msg}</p>`);
 }



});
$(document).ready(function(){

irAbajo();
$('#footer').click(function(){
  $('#chat').animate({ scrollTop:$(document).height() }, 'slow'); 
});

function irAbajo(){
  $('#chat').animate({ scrollTop: $(document).height() }, 1500); return false;
}
});

$(function () { 
   $('#chat').animate({ scrollTop: $(document).height() }, 1500); return false;
});

  
  // $('#chat').animate({ scrollTop: $(this).height() }, 'slow'); 
  
