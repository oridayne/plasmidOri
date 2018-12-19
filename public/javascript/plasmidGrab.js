window.onload = function(){
var tau = 2 * Math.PI;
var w = 500
  , h = 500
  , cx = w/2, cy = h/2
  , strokeColor = "rgba(0,128,0,0.2)" //color of circle and drag

  // variable for arc
  , arcStartAngle = 0
  , arcInnerRadius = w / 2 - 35
  , arcOuterRadius = w / 2 - 10

  // variable for circle
  , circleRadius = 10
  , anglePoint = 0

  // variable for animate arc path
  , fullAngle = Math.PI * 2
  , maxStep = 24 * 60
  , anglePerStep = fullAngle / maxStep
  , currentStep = 0
  , animateDuration = 50
  ;

  // create main svg
var svg = d3.select("#p1").append("svg:svg")
  .attr("width", w)
  .attr("height", h)
  .attr("id", "clock");

// create arc group
var arcGroup = svg.append("svg:g")
  .attr(
    "transform", 
    "translate(" + w / 2 + "," + h / 2 + ")");

// create arc object (not display in svg,
// but use as data of path)
var arc = d3.svg.arc()
  .innerRadius( arcInnerRadius )
  .outerRadius( arcOuterRadius );

// detects passing over 0 tick from left to right
function leftToRight(numTicks, lastTick, tick, dx, dy){
  let buffer = numTicks*.1;
  if(lastTick>(numTicks-buffer)&&tick<buffer &&dx>0){
    return true;
  }
  return false;
}

function rightToLeft(numTicks, lastTick, tick, dx,dy){
  // buffer for tick detection
  let buffer = numTicks*.1;
  if(tick>(numTicks-buffer)&&lastTick<buffer &&dx<0){
    return true;
  }
  return false;
}

var dragstarted = false;
var dragended = false;
var reverse = false;
var stack = [false];
var start = false;
var end = false;
var base = arcGroup.append("path")
  .datum({ endAngle: tau, startAngle:arcStartAngle })
  .style("fill", "rgba(0,128,0,0)")
  .attr("stroke", "black")
  .attr("stroke-width", 0.0)
  .attr("cursor", "crosshair")
  .attr("d", arc)
  .call(d3.behavior.drag()
    .on('drag', function(){
    a = findAngle(d3.event.x, d3.event.y);
    var numTicks = angular.element($("#divider")).scope().seq.length;
    let tick = Math.round(a/360*numTicks);
    var lastTick = stack[stack.length-1];
    var scope = angular.element($("#divider")).scope();
    var dx = d3.event.dx;
    var dy = d3.event.dy;

    if(dragstarted){
      dragstarted = false;
      scope.$apply(function(){scope.start = tick;});
      start = tick;

    }
    // logic to help negative numbers
    if(lastTick!=tick){

      stack.push(tick);
      // left to right, convert start to negative
      if(leftToRight(numTicks, lastTick, tick, dx, dy)){
        scope.start = (scope.start-numTicks)%numTicks;
        start = start-numTicks%numTicks;
      }
      // convert end( current tick) to neg
      else if(rightToLeft(numTicks, lastTick, tick, dx, dy)){
        reverse=true;
        tick = (tick-numTicks)%numTicks;

      }
    }
    // logic to help negative number applicaionts
    if(reverse){
      scope.$apply(function(){scope.end = (tick-numTicks)%numTicks;});
      end = (tick-numTicks)%numTicks;
    }
    else{
      scope.$apply(function(){scope.end = tick;});
      end = tick;
    }

    if(Math.abs(scope.end-scope.start)>=numTicks&&scope.end!=numTicks){
      if(scope.start<0){
        scope.$apply(function(){scope.start = numTicks+scope.start;});
        start = numTicks+scope.start;

      }
      else if(scope.end<0){
        scope.$apply(function(){scope.end = numTicks+ scope.end;});
        end=numTicks+scope.end;
      }
    }
    })
    .on('dragstart', function(){
      dragstarted = true;
      var scope = angular.element($("#divider")).scope();
      scope.$apply(function(){scope.selected="viewer";});
    })
    .on('dragend', function(){
      var scope = angular.element($("#divider")).scope();
      dragend=false;
      stack = [];
      reverse = false;
      // show highlighted dna on end
      scope.$apply(function(){
        let newStart = Math.min(scope.start,scope.end);
        let newEnd = Math.max(scope.start,scope.end);
        scope.title="Sample Frame "+ newStart+"-"+newEnd;
        scope.view = getNewSeqIn(newStart,newEnd);
        deactivateTitle();
        scope.selected="viewer";
        document.getElementById("viewer").classList.add("active");
      })
    }));


function findAngle(x, y) {
  addAngle = x < 0 ? 270 : 90;
  return (Math.atan(y/x) * 180 / Math.PI) + addAngle; 
}
};
// ===
console.log('[done]');