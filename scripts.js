var init = function(){
  var logDiv = document.getElementById('log');
  var draggables = document.querySelectorAll('.draggable')[0];
  var path = {};
  var deltaY = 0;
  var posY = 0;
  var deltaT = 0;
  var kinetic;
  var step = 25; //ms
  var speed = 0;
  var maxY = 0;
  var minY = -$(draggables).outerHeight(true) + $(window).height();
  var headerHeight = $('#must-read').outerHeight(true);
  var stickyThing = document.getElementById('sticky-thing');
  
  
  function doDrag(e) {
    
    path.curr = getTouchPos(e);
    
    deltaY = path.curr.y - path.old.y;
    posY += deltaY;
    logDiv.innerHTML = posY;
    
    draggables.style.webkitTransform = 'translate3d(0, '+posY+'px, 0)';
          
    deltaT = path.curr.t - path.old.t;
    path.old = path.curr;
    
    stick(posY);
  }
  
  function stick(y) {
    if(Math.abs(y) > headerHeight) {
      stickyThing.style.webkitTransform = 'translate3d(0, '+(-y - headerHeight)+'px, 0)';
    }
    else {
      stickyThing.style.webkitTransform = 'translate3d(0, '+0+'px, 0)';
    }
  }
    
  function stopDrag(e) {
    
    if(posY < minY || posY > maxY) {
      if(posY > maxY) {
        posY = maxY;                
      }
      else {
        posY = minY;        
      }
      
      draggables.style.webkitTransform = 'translate3d(0, '+posY+'px, 0)';
      
      stick(posY);
    }
    else {
      speed = deltaY/deltaT;
      kinetic = setInterval(inertiaMove, step);
    }
    
    $(window).unbind('touchmove');
    $(window).unbind('touchend');
  }
  
  function inertiaMove() {
    posY += Math.round(speed * step);
    draggables.style.webkitTransform = 'translate3d(0, '+posY+'px, 0)';
    speed = 0.75 * speed;
    if(Math.abs(speed) < 0.1) {
      clearInterval(kinetic);
      speed = 0;
    }
    
    stick(posY);
  }
  
  function startDrag(e){
    clearInterval(kinetic);
    speed = 0;
    
    path.old = getTouchPos(e);
    e.preventDefault();
    
    $(window).bind('touchmove', doDrag);
    $(window).bind('touchend', stopDrag);
  }
  
  function getTouchPos(e) {
    var touch = e.originalEvent.changedTouches[0] || e.originalEvent.touches[0];
    return {x: touch.pageX, y: touch.pageY, t:new Date().getTime()};
  }
  
  $(window).bind('touchstart', startDrag);
   
};