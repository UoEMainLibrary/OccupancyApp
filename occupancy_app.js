// Library Occupancy App
// Done by Hrafn Malmquist, Library Digital Development Team

var textual = [
  { 'text': 'Not busy', 'tip': 'You will find a choice of spaces in the library.' },
  { 'text': 'Busy', 'tip':'The library is busy. You will find a space but you may not find your preferred seat.'},
  { 'text': 'Very busy', 'tip': 'The library is very busy. It will be difficult to find a space.'},
  { 'text': 'Packed!', 'tip': 'There are very few spare spaces left within the library and it will take some time to find a seat.'},]

var tool_tip = null;
var svg = null;
var buddy = null;
var width = '90%';
var height = 100;
var cut_off = .5;
var font_family = "'Source Sans Pro', sans-serif";

var line_width = 25;
var font_size = 30;
var marker_font_size = 15;
var marker_line_height = 22.5;
var svg_width;

function getSelected() { // Return selected light
  for(var i = 0; i < traffic_lights.length; i++) {
    if(traffic_lights[i].selected)
      return traffic_lights[i];
  }
}

function showToolTip(id, coords, text) { // Show a tooltip    
  var tip = (id == selected_obj.nr) ? 'The library is at ' + selected_obj.percent + '% of capacity. ' + text: text; // Explain level of busyness
    tool_tip
    .html(tip)
    .style('visibility', 'visible');
  
  var tooltip_height = tool_tip.node().getBoundingClientRect().height;
  var tooltip_width = tool_tip.node().getBoundingClientRect().width;

  var x = Math.max(10, coords[0] - tooltip_width); // Not too far to the left
  var y = Math.max(10, coords[1] - (tooltip_height/2)); // Not too high
  y = Math.min(coords[1] + tooltip_height, height - tooltip_height - 20); // Not too low

  tool_tip
    .style('left', x + 'px')
    .style('top', y + 'px')

}

function init() {
  tool_tip = d3.select('body').append('div')
    .style('position', 'absolute')
    .style('background-color', 'white')
    .style('font-family', font_family)
    .style('font-size', marker_font_size + "px")
    .style('border-radius', '5px')
    .style('padding', '3px')
    .style('border', 'thin solid black')
    .style('opacity', '0.9')
    .style('visibility', 'hidden')
    .style('pointer-events', 'none');

  buddy = d3.select('#buddy');

  svg = buddy.append('svg')
      .attr('width', '100%')
      .attr('height', height);

  createOccupancyApp();
}

function createOccupancyApp() {  
  svg.selectAll('*').remove();

  d3.json('MainLibrary.json', function(obj) {
  traffic_lights = obj.states;
  traffic_lights[traffic_lights.length-1].max = 2300;
  traffic_lights[0].min = traffic_lights[traffic_lights.length-1].max*cut_off;
  var span = traffic_lights[traffic_lights.length-1].max - traffic_lights[0].min;
  selected_obj = getSelected();
  
  // Let's not have it wider than 1200
  svg_width = Math.min(document.body.clientWidth*.9, 1200);
  buddy.style('width', svg_width + 'px');
  tool_tip.style('width', Math.max(svg_width / 3, 200));

  // D3 start entering stuff
  var enter = svg.append('g').selectAll('g')
    .data(traffic_lights).enter();

  var sub_g = enter.append('g')
      .on('mouseover', function(d){ showToolTip(d.nr, [d3.event.pageX, d3.event.pageY], textual[d.nr].tip); })
      .on('mouseout', function(d){ tool_tip.style('visibility', 'hidden'); });

  sub_g.append('line') // Actual colored axis line
      .attr('x1', function(d) { return ((d.min - traffic_lights[0].min)/span)*svg_width; } )
      .attr('y1', height - (line_width/2) - marker_line_height)
      .attr('x2', function(d) { return this.x1.baseVal.value + (((d.max - d.min)/span)*svg_width); })
      .attr('y2', height - (line_width/2) - marker_line_height)
      .attr('stroke-width', line_width)
      .style('cursor', 'help')   
      .style('stroke', function(d) { return (d.color == 'amber') ? '#FFC200': d.color; });
  
  sub_g.append('line') // Axis line
      .attr('x1', function(d) { return ((d.min - traffic_lights[0].min)/span)*svg_width; })
      .attr('y1', height - marker_line_height)
      .attr('x2', function(d) { return this.x1.baseVal.value; })
      .attr('y2', height - (line_width/2) - 2)
      .attr('stroke-width', 2)
      .attr('stroke', 'black');

  sub_g.append('text') // Axis label text
      .text(function(d){ return (d.min/traffic_lights[traffic_lights.length-1].max*100) + "%"; })
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'middle')
      .style('font-family', font_family)
      .style('font-size', marker_font_size)
      .style('font-weight', 'bold')      
      .attr('x', function(d) { return Math.max(((d.min - traffic_lights[0].min)/span)*svg_width, (this.getComputedTextLength()/2)+1); })
      .attr('y', height - (line_width/2) + 5);

  var triangle_height = height - line_width;  
  var triangle_width = font_size - 2;
  var x_base =  ((traffic_lights[traffic_lights.length-1].max * selected_obj.percent/100-traffic_lights[0].min)/span*svg_width);
  var y_shift = 10;
  var y_difference = line_width/2;


  var points = '' + (x_base - triangle_width) + ', ' + (height - (line_width*2) - marker_line_height + y_shift) // Left x, y
  points +=  ', ' + x_base + ', ' + (height - (line_width) - marker_line_height + y_shift) // Middle x, y - bottom
  points +=  ', ' + (x_base + triangle_width) + ', ' + (height - (line_width*2) - marker_line_height + y_shift) // Right x, y
  points +=  ', ' + x_base + ', ' + (height - line_width - marker_line_height - y_difference + y_shift) // Low point x, y

    // Draw the arrow

  if(selected_obj.percent/100 >= cut_off) {

    var arrow = svg.append('g');

    // Triangle part of arrow
    arrow.append('polygon')
      .attr('points', points)
      .attr('fill', 'black')
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'butt');

    // Line part of arrow
    arrow.append('line')
      .attr('x1', x_base )
      .attr('y1', height - (line_width) - marker_line_height - 4 + y_shift)
      .attr('x2', x_base )
      .attr('y2', height - (line_width*2) - marker_line_height + y_shift)
      .attr('stroke', 'black')
      .attr('stroke-width', y_difference/3);
    }

    function calcX()  {
      if(selected_obj.nr == 0)
        return Math.max(x_base, (this.getComputedTextLength()/2)+1);
      else if(selected_obj.nr >= traffic_lights.length-2)
        return Math.min(x_base, svg_width - (this.getComputedTextLength()/2)-1)
      else
        return x_base;
    }


    // Text element with threshold information
    svg.append('text')
      .style('font-size', font_size)
      .text(textual[selected_obj.nr].text)
      .attr('y', height - line_width*2 - marker_line_height - 5)
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'middle')
      .style('font-family', font_family)      
      .attr('fill', 'black')
      .style('text-transform', 'uppercase')
      .attr('x', calcX);

    if(selected_obj.level != 'stable') {
      
     var triangle_width = line_width/2;
     var triangle_height = triangle_width/2;
     var number_of_triangles = 3;

     var x_base = ((selected_obj.min - traffic_lights[0].min)/span)*svg_width;

    if(selected_obj.level == 'increasing')
      x_base += ((selected_obj.max - selected_obj.min)/span)*svg_width - (number_of_triangles*(triangle_width+1));

    if(x_base < 0) // Prevent arrows from overflowing to left
      x_base += (number_of_triangles*(triangle_width+1))/2;
    
    if(x_base + (number_of_triangles*(triangle_width+1)) > svg_width) // Prevent arrows from overflowing to right
      x_base -= (number_of_triangles*(triangle_width+1))/2;

     var y_base = height - line_width/2 - marker_line_height;

      for(var i = 0; i < number_of_triangles; i++)  {
        var x = (x_base + (((selected_obj.level == 'increasing') ? i : i+1)*triangle_width+1));
        points = '' + x + ', ' + (y_base - triangle_height) // Left x, y
        points +=  ', ' + (x + ((selected_obj.level == 'increasing') ? triangle_width : -triangle_width)) + ', ' + y_base // Middle x, y
        points +=  ', ' + x + ', ' + (y_base + triangle_height) // Right x, y
        points +=  ', ' + (x + ((selected_obj.level == 'increasing') ? 2 : -2)) + ', ' + y_base // Middle x, y

        svg.append('polygon')
          .attr('points', points)
          .style('fill', 'black')
          .style('stroke', 'white')
          .style('stroke-width', 1)
          .style('cursor', 'help')
          .on('mouseover', function(d){ showToolTip(-1, [d3.event.pageX, d3.event.pageY], 'The number of visitors is <u>' + selected_obj.level + '</u>.'); })
          .on('mouseout', function(d){ tool_tip.style('visibility', 'hidden'); });
      }

    }

      // Text with updated time
      svg.append('text')
        .text('Updated: ' + obj.time)        
        .attr('y', 16)
        .style('font-family', font_family)
        .style('font-size', '14px')
        .attr('x', function(d) { return (selected_obj.nr == 0) ? svg_width - this.getComputedTextLength(): 0; } )
     
  });
}

  // Redraw based on the new size whenever the browser window is resized.
  window.addEventListener("resize", createOccupancyApp);

  window.onload = init;