$(".Menu-btn,.close_icon").on('click', function() {
    $('.main_nav').fadeToggle(1000);
});


function myFunction() { 
  document.getElementById("myVideosrc").src = "../assets/video/video.mp4";
  document.getElementById("myVideo").load();
} 

setTimeout(myFunction, 5600);