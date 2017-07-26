(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();

    $('nav').css("background-color", "transparent");
    $('#nav-divider').css("background-color", "rgba(255,187,10,1)");          
    $(window).scroll(function(){
      if ($(this).scrollTop() > 400) {
      $('nav').css("background-color", "rgba(57,10,13,1)").css("transition","0.3s ease-in-out ");
      $('#nav-divider').css("background-color", "transparent").css("transition","0.3s ease-in-out ");            
      } else if ($(this).scrollTop() > 350) {
      $('nav').css("background-color", "rgba(57,10,13,0.75)").css("transition","0.3s ease-in-out ");
      $('#nav-divider').css("background-color", "rgba(255,187,10,0.35)").css("transition","0.3s ease-in-out ");      
      }else if ($(this).scrollTop() > 250) {
      $('nav').css("background-color", "rgba(57,10,13,0.5)").css("transition","0.3s ease-in-out ");
      $('#nav-divider').css("background-color", "rgba(255,187,10,0.5)").css("transition","0.3s ease-in-out ");      
      } else if ($(this).scrollTop() > 150) {
      $('nav').css("background-color", "rgba(57,10,13,0.35)").css("transition","0.3s ease-in-out ");
      $('#nav-divider').css("background-color", "rgba(255,187,10,0.75)").css("transition","0.3s ease-in-out ");            
      } else {
      $('nav').css("background-color", "transparent").css("transition","0.3s ease-in-out ");
      $('#nav-divider').css("background-color", "rgba(255,187,10,1)").css("transition","0.3s ease-in-out ");            
      }
    });

  }); // end of document ready
})(jQuery); // end of jQuery name space
