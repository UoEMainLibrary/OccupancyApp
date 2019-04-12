# OccupancyApp
Main Library Occupancy Traffic Light System

Uses [D3](https://github.com/d3/d3) v.4 (not 5!). Designed to be 100px height (ok to change) and will be 90% of width (max 1200px).
It requires the following parameters being set (default values):

## General
* `var json_file = 'test.json';` - JSON file containing traffic lights
* `var cut_off = .5;` - cutoff set to 50%, meaning the ticker will start at 50%
* `var width = .9';` - width of app, relative. Must be floating point
* `var max_width = 1200;` - maximum width of app, absolute. Must be pixels.
* `var height = 100;` - height of app, absolute. Must be pixels.
* `var tooltip_shift = -50;` - how far south (negative value are north) to shift the tool tip from the pointer
* `var textual = [];` - an array of objects corresponding to the traffic light feed in the `json_file`, with each object having a `tip` property and a `text` property with textual description of the traffic light. This was separated from the traffic light json so as not to mingle data and text.

## Style
* `var font_family = "'Source Sans Pro', sans-serif";` - font used
* `var line_width = 25;` - the height of the traffic light "line"
* `var font_size = 30;` - font size for the main indicator
* `var marker_font_size = 15;` - font size for marker
* `var marker_line_height = 22.5;` - height of tick line
### Main indicator arrow
* `var arrow_width = font_size - 2;` - width of arrow indicating point on axis
* `var arrow_y_shift = 10;` - how far 'south', (negative value are north) to shift said arrow
* `var arrow_slope = line_width/2;` - the slope of the arrow (how pointy?)
* `var arrow_color = 'black';` - background color of all arrows
### Smaller arrows indicating status
* `var small_arrows = 3;` - how many arrows to indicate status
* `var small_arrow_width = line_width/2;` - width of small arrow
* `var small_arrow_height = small_arrow_width/2;` - height of small arrow

It expects a json file set in `json_file` with the structure:
```
{"date":"10/10/2018","time":"17:10","states":[
  {"nr":0,"color":"green","min":null,"max":1610,"selected":true,"level":"decreasing","percent":67},
  {"nr":1,"color":"amber","min":1610,"max":1955},
  {"nr":2,"color":"red","min":1955,"max":2185},
  {"nr":3,"color":"purple","min":2185,"max":2300}]
}
```

# TODO
* Webpack?
