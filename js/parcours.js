  
function conversion(d){
		    d.task = d.titre;
		    d.type=d.type;
		    d.startTime=d.debut;
		    d.endTime=d.fin;
		    return d;
		}

d3.csv( "https://raw.githubusercontent.com/nabilouhi/DataSelfie/master/data/data.csv",conversion,function(taskArray) {
		  
		   var w = document.getElementById("d3svg").offsetWidth-30;
		  var h = 200;
		  
		  var svg = d3.selectAll(".svg")
		  .attr("width", w)
		  .append("svg")
		  .attr("width", w)
		  .attr("height", h)
		  .attr("class", "svg");

		  var dateFormat = d3.time.format("%m-%Y"); //%Y-%m-%d %H:%M:%S  
		  var timeScale = d3.time.scale().domain([d3.min(taskArray, function(d) {return dateFormat.parse(d.startTime);}),
		                 															d3.max(taskArray, function(d) {return dateFormat.parse(d.endTime);})])
		                 															.range([0,w-130]);
      
		var categories = new Array();
		for (var i = 0; i < taskArray.length; i++){
		    categories.push(taskArray[i].type);
		}
		
		var catsUnfiltered = categories; //for vert labels
		categories = checkUnique(categories);
		makeGant(taskArray, w, h);
		
		var title = svg.append("text")
              .text("Cliquez sur une période pour plus d'information ")
              .attr("x", w/2)
              .attr("y", 25)
              .attr("text-anchor", "middle")
              .attr("font-size", 18)
              .attr("fill", "darkgrey");

function makeGant(tasks, pageWidth, pageHeight){

var barHeight = 40;
var gap = barHeight + 6;
var topPadding = 75;
var sidePadding = 85;

var colorScale = d3.scale.linear()
    .domain([0, categories.length])
    .range(["#00B9FA", "#F95002"])
    .interpolate(d3.interpolateHcl);

makeGrid(sidePadding, topPadding, pageWidth, pageHeight);
drawRects(tasks, gap, topPadding, sidePadding, barHeight, colorScale, pageWidth, pageHeight);
vertLabels(gap, topPadding, sidePadding, barHeight, colorScale);

}


function drawRects(theArray, theGap, theTopPad, theSidePad, theBarHeight, theColorScale, w, h){

var bigRects = svg.append("g")
    .selectAll("rect")
   .data(theArray)
   .enter()
   .append("rect")
   .attr("x", -2)
   .attr("y",function(d){for (var i = 0; i < categories.length; i++){if (d.type == categories[i]){return i*theGap + theTopPad - 2;}}})
   .attr("width", function(d){
      return w-theSidePad/2;
   })
   .attr("height", theGap)
   .attr("stroke", "none")
   .attr("fill", function(d){
    for (var i = 0; i < categories.length; i++){
        if (d.type == categories[i]){
          return d3.rgb(theColorScale(i));
        }
    }
   })
   .attr("opacity", 0.2);


     var rectangles = svg.append('g')
     .attr("class","periode")
     .selectAll("rect")
     .data(theArray)
     .enter();


   var innerRects = rectangles.append("rect")
             .attr("rx", 3)
             .attr("ry", 3)
             .attr("x", function(d){
              return timeScale(dateFormat.parse(d.startTime)) + theSidePad;
              })
              .attr("y",function(d){for (var i = 0; i < categories.length; i++){if (d.type == categories[i]){return i*theGap + theTopPad+1;}}})
             .attr("width", function(d){
                return (timeScale(dateFormat.parse(d.endTime))-timeScale(dateFormat.parse(d.startTime)));
             })
             .attr("height", theBarHeight)
             .attr("stroke", "none")
             .attr("fill", function(d){
              for (var i = 0; i < categories.length; i++){
                  if (d.type == categories[i]){
                    return d3.rgb(theColorScale(i));
                  }
              }
             })
   

         var rectText = rectangles.append("text")
               .text(function(d){
                return d.task;
               })
               .attr("x", function(d){
                return (timeScale(dateFormat.parse(d.endTime))-timeScale(dateFormat.parse(d.startTime)))/2 + timeScale(dateFormat.parse(d.startTime)) + theSidePad;
                })
                .attr("y",function(d){for (var i = 0; i < categories.length; i++){if (d.type == categories[i]){return i*theGap + theTopPad +25;}}})
               .attr("font-size", 12)
               .attr("text-anchor", "middle")
               .attr("text-height", theBarHeight)
               .attr("fill", "black");


innerRects.on('mouseover', function(e) {
         var tag = "";

         if (d3.select(this).data()[0].details != undefined){tag =  "Début: " + d3.select(this).data()[0].endTime + "<br/>" + "Fin: " + d3.select(this).data()[0].details;} 
         else {tag = "Début: " + d3.select(this).data()[0].startTime + "<br/>" + "Fin: " + d3.select(this).data()[0].endTime;}
         
         var output = document.getElementById("tag");
         var x = (this.x.animVal.value + this.width.animVal.value/2) + "px";
         var y = this.y.animVal.value + 25 + "px";
         output.innerHTML = tag;
         output.style.top = y;
         output.style.left = x;
         output.style.display = "block";
})
.on('mouseout', function() {var output = document.getElementById("tag");output.style.display = "none";});
 
 
 
innerRects.on('click', function(e) {
	var TextArea=document.getElementById("Description");
	TextArea.innerHTML="<div class='row' style='padding:4px;'><div class='col-lg-3' style='border-right:2px solid black'><b>"+d3.select(this).data()[0].titre+"</b><br>"+d3.select(this).data()[0].lieu+"</div>"+
												"<div class='col-lg-6' style='word-wrap: break-word;'>"+d3.select(this).data()[0].description+"<br><b style='font-size:11px'>"+d3.select(this).data()[0].techno+"</b></div>"+
												"<div class='col-lg-2' style='background:WhiteSmoke'>"+d3.select(this).data()[0].ville+"<br>Du : "+d3.select(this).data()[0].debut+"<br>au : "+d3.select(this).data()[0].fin+"</div></div>"
	
 });
rectText.on('click', function(e) {
	var TextArea=document.getElementById("Description");
	TextArea.innerHTML="<div class='row' style='padding:4px;'><div class='col-lg-3' style='border-right:2px solid black'><b>"+d3.select(this).data()[0].titre+"</b><br>"+d3.select(this).data()[0].lieu+"</div>"+
												"<div class='col-lg-6' style='word-wrap: break-word;'>"+d3.select(this).data()[0].description+"<br><b style='font-size:11px'>"+d3.select(this).data()[0].techno+"</b></div>"+
												"<div class='col-lg-2' style='background:WhiteSmoke'>"+d3.select(this).data()[0].ville+"<br>Du : "+d3.select(this).data()[0].debut+"<br>au : "+d3.select(this).data()[0].fin+"</div></div>"
	
 });


}


function makeGrid(theSidePad, theTopPad, w, h){

var xAxis = d3.svg.axis()
    .scale(timeScale)
    .orient('top')
    .ticks(d3.time.year, 1)
    .tickSize(h-theTopPad+75, 0, 0)
    .tickFormat(d3.time.format('%Y'));

var grid = svg.append('g')
    .attr('class', 'grid')
    .attr('transform', 'translate(' +theSidePad + ', ' + (h+55 ) + ')')
    .call(xAxis)
    .selectAll("text")  
            .style("text-anchor", "middle")
            .attr("fill", "#000")
            .attr("stroke", "none")
            .attr("font-size", 12)
            .attr("dy", "1em");
}

function vertLabels(theGap, theTopPad, theSidePad, theBarHeight, theColorScale){
  var numOccurances = new Array();
  var prevGap = 0;

  for (var i = 0; i < categories.length; i++){
    numOccurances[i] = [categories[i], getCount(categories[i], catsUnfiltered)];
  }

  var axisText = svg.append("g") //without doing this, impossible to put grid lines behind text
   .selectAll("text")
   .data(numOccurances)
   .enter()
   .append("text")
   .text(function(d){
    return d[0];
   })
   .attr("x", 5)
   .attr("y", function(d, i){
    if (i > 0){
        for (var j = 0; j < i; j++){
          prevGap += numOccurances[i-1][1];
          return i*theGap + theTopPad+25;
        }
    } else{
    return i*theGap + theTopPad+20;
    }
   })
   .attr("font-size", 15)
   .attr("text-anchor", "start")
   .attr("text-height", 14)
   .attr("fill", function(d){
    for (var i = 0; i < categories.length; i++){
        if (d[0] == categories[i]){
        //  console.log("true!");
          return d3.rgb(theColorScale(i)).darker();
        }
    }
   });

}


function checkUnique(arr) {
    var hash = {}, result = [];
    for ( var i = 0, l = arr.length; i < l; ++i ) {
        if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
            hash[ arr[i] ] = true;
            result.push(arr[i]);
        }
    }
    return result;
}
function getCounts(arr) {
    var i = arr.length, // var to loop over
        obj = {}; // obj to store results
    while (i) obj[arr[--i]] = (obj[arr[i]] || 0) + 1; // count occurrences
    return obj;
}

// get specific from everything
function getCount(word, arr) {
    return getCounts(arr)[word] || 0;
}

});
