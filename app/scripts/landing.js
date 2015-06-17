$(document).ready(function() {
  $('.hero-content h3').click(function(){
    var clicked = false;
    var subText = $(this).text();
     $(this).text(subText + "!");
     $(this).bind("click", function(){ //changes color but doesn't switch back to white...
       if (clicked){
         //clicked = false;
         return $(this).css('color', '#FFFFFF');
       }
       clicked = true;
       return $(this).css('color', '#000000');
     });
  });

 var onHoverAction = function(event) {
   console.log('Hover action triggered.');
   $(this).animate({'margin-top': '10px'});
 };

 var offHoverAction = function(event) {
   console.log('Off-hover action triggered.');
   $(this).animate({'margin-top': '0px'});
 };

$(document).ready(function(){
  $('.point h5').click(function(){
    $(this).css({'font-size': 32})
  })
});

  $('.selling-points .point').hover(onHoverAction, offHoverAction);

$(document).ready(function(){
  $('h1').click(function(){
    $(this).fadeOut('slow', function(){})
  })
 })
});

 var onHoverAction2 = function(){
   $(this).css('color', '#000000');
 }

 var offHoverAction2 = function(){
   $(this).css('color', '#FFFFFF');
 }

//$(".hero-content h3").hover(onHoverAction2, offHoverAction2);
