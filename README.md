# OccupancyApp
Main Library Occupancy Traffic Light System

Uses [D3](https://github.com/d3/d3) v.4 (not 5!). Designed to be 100px height (ok to change) and will be 90% of width (max 1200px).
There's a cutoff set to 50% (`var cut_off = .5;`)

It expects a `MainLibrary.json` with the structure:
```
{"date":"10/10/2018","time":"17:10","states":[
  {"nr":0,"color":"green","min":null,"max":1610,"selected":true,"level":"decreasing","percent":67},
  {"nr":1,"color":"amber","min":1610,"max":1955},
  {"nr":2,"color":"red","min":1955,"max":2185},
  {"nr":3,"color":"purple","min":2185,"max":null}]
}
```
