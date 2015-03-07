$(document).ready(function() {
  var socket = io.connect('localhost');

  socket.on('connect', function() {

    socket.on('atualizaDados', function(data) {

      var jsonObject = $.parseJSON(data);
      
      $('#temperatura').text(jsonObject.temperatura);
      $('#umidade').text(jsonObject.umidade);

      
    });


  });


});