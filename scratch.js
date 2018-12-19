// window.onload = function(){
// var tau = 2 * Math.PI;
// var w = 500
//   , h = 500
//   , cx = w/2, cy = h/2
//   , strokeColor = "rgba(0,128,0,0.2)" //color of circle and drag

//   // variable for arc
//   , arcStartAngle = 0
//   , arcInnerRadius = w / 2 - 20
//   , arcOuterRadius = w / 2 - 10

//   // variable for circle
//   , circleRadius = 10
//   , anglePoint = 0

//   // variable for animate arc path
//   , fullAngle = Math.PI * 2
//   , maxStep = 24 * 60
//   , anglePerStep = fullAngle / maxStep
//   , currentStep = 0
//   , animateDuration = 50
//   ;

//   // create main svg
// var svg = d3.select("body").append("svg:svg")
//   .attr("width", w)
//   .attr("height", h)
//   .attr("id", "clock");

// // create arc group
// var arcGroup = svg.append("svg:g")
//   .attr(
//     "transform", 
//     "translate(" + w / 2 + "," + h / 2 + ")");

// // create arc object (not display in svg,
// // but use as data of path)
// var arc = d3.svg.arc()
//   .innerRadius( arcInnerRadius )
//   .outerRadius( arcOuterRadius );

// var outerRim = d3.svg.arc()
//   .innerRadius(arcInnerRadius)
//   .outerRadius(arcOuterRadius)
//   .startAngle(0)
//   .endAngle(tau);

// var numTicks = 150;
// var start = false;
// var end = false;

// var dragstarted = false;
// var dragended = false;

// var base = arcGroup.append("path")
//   .datum({ endAngle: tau, startAngle:arcStartAngle })
//   .style("fill", "white")
//   .attr("stroke", "black")
//   .attr("stroke-width", .2)
//   .attr("d", arc)
//   .call(d3.behavior.drag()
//     .on('drag', function(){
//     a = findAngle(d3.event.x, d3.event.y);
//     console.log(d3.event);
//     currentStep = angleToStep(a);
   
//     let tick = Math.round(a/360*numTicks);
//     console.log("drag",tick);
//     console.log(start,end);
//     if(dragstarted){
//       dragstarted = false;
//       start = tick;
//     }

//     end = tick;
//     // anglePoint = Math.ceil(d.startAngle / anglePerStep) / 4;
//     })
//     .on('dragstart', function(){
//       console.log("dragstart");
//       dragstarted = true;

//     })
//     .on('dragend', function(){
//       console.log("dragend");
//       dragend=false;

//     }));

// var start = false;
// var end = false;
// // create arc arcPath
// var arcPath = arcGroup.append("path")
//   .datum({ endAngle: arcStartAngle, startAngle:arcStartAngle })
//   .style("fill", strokeColor)
//   .attr("d", arc);

// var circle2 = arcGroup.append("circle")
//   .attr("r", circleRadius)
//   .attr("fill", "red")
//   .attr("stroke", strokeColor)
//   .attr("stroke-width", circleRadius/2 + 2)

//   .attr("cx", 0)
//   .attr("cy", 5 + circleRadius - h/2)
//   .attr("cursor", "move")
//   .call( d3.behavior.drag().on('drag', function(){
//     a = findAngle(d3.event.x, d3.event.y);
    
//     currentStep = angleToStep(a);
//     setAngleStep2(currentStep);
//     // moveCircle(a);
//   }));

// var circle = arcGroup.append("circle")
//   .attr("r", circleRadius)
//   .attr("fill", "#ffffff")
//   .attr("stroke", strokeColor)
//   .attr("stroke-width", circleRadius/2 + 2)

//   .attr("cx", 0)
//   .attr("cy", 5 + circleRadius - h/2)
//   .attr("cursor", "move")
//   .call( d3.behavior.drag().on('drag', function(){
//     a = findAngle(d3.event.x, d3.event.y);
    
//     currentStep = angleToStep(a);
//     setAngleStep(currentStep);
//     // moveCircle(a);
//   }));




// // // init
// // setAngleStep(currentStep);
// // setAngleStep2(currentStep);


// $('.inc').click(function(){
//   // currentStep++;
//   currentStep = currentStep + 60;
//   if( currentStep > maxStep ){
//     currentStep = maxStep;
//     return;
//   }
  
//   setAngleStep(currentStep);
// });

// $('.dec').click(function(){
//   // currentStep--;
//   currentStep = currentStep - 60;
//   if( currentStep < 0 ){
//     currentStep = 0;
//     return;
//   }
  
//   setAngleStep(currentStep);
// });

// // set animate step
// function setAngleStep(step) {
//   if (step > maxStep || step < 0){
//     return;
//   }
//   console.log('step:', step);
  
//   arcPath.transition()
//     .duration(animateDuration)
//     .ease("linear")
//     .call(
//       arcTween,
//       anglePerStep * step, 
//       arc
//     );
// }

// // set animate step
// function setAngleStep2(step) {
//   if (step > maxStep || step < 0){
//     return;
//   }
//   console.log('step:', step);
  
//   arcPath.transition()
//     .duration(animateDuration)
//     .ease("linear")
//     .call(
//       arcTween2,
//       anglePerStep * step, 
//       arc
//     );
// }
// // animate function
// function arcTween2(transition, newAngle, arc) {
//   console.log('newAngle:', newAngle);
//   // arc path transition
//   transition.attrTween("d", function(d) {
//     var interpolate = d3.interpolate(d.startAngle, newAngle);
//     return function(t) {
//       d.startAngle = interpolate(t);
      
//       console.log('start angle:', d.startAngle / anglePerStep / 4);
      
//       // transalte circle
//       anglePoint = Math.ceil(d.startAngle / anglePerStep) / 4;
      
//       moveCircle2(anglePoint);
      
//       return arc(d);
//     };
//   });
// }
// // animate function
// function arcTween(transition, newAngle, arc) {
//   console.log('newAngle:', newAngle);
//   // arc path transition
//   transition.attrTween("d", function(d) {
//     console.log(d.endAngle);
//     console.log(d.startAngle);
//     var interpolate = d3.interpolate(d.endAngle, newAngle);
//     return function(t) {
//       d.endAngle = interpolate(t);
//       console.log('end angle:', d.endAngle / anglePerStep / 4);
      
//       // transalte circle
//       anglePoint = Math.ceil(d.endAngle / anglePerStep) / 4;
      
//       moveCircle(anglePoint);
      
//       return arc(d);
//     };
//   });
// }

// function angleToStep(angle) {
//   return angle * 4;
// }

// function stepToAngle(step) {
//   return;
// }

// function findAngle(x, y) {
//   addAngle = x < 0 ? 270 : 90;
//   return (Math.atan(y/x) * 180 / Math.PI) + addAngle; 
// }

// function moveCircle(angle) {
//   var r = h/2 - 15;
//   var x = r * Math.sin(angle * Math.PI / 180);
//   var y = -r * Math.cos(angle * Math.PI / 180);
  
//   circle
//     .attr("cx", x)
//     .attr("cy", y)
//     ;
// }

// function moveCircle2(angle) {
//   var r = h/2 - 15;
//   var x = r * Math.sin(angle * Math.PI / 180);
//   var y = -r * Math.cos(angle * Math.PI / 180);
  
//   circle2
//     .attr("cx", x)
//     .attr("cy", y)
//     ;
// }

// };
// // ===
// console.log('[done]');
