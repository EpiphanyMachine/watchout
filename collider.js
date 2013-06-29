var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};

//place gameStats here when they are needed

var axis = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var gameBoard = d3.select('.container').append('svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height);

var createEnemies = _.range(0,gameOptions.nEnemies).map(function (index, value){
  return {id: index, x: Math.random()*100, y: Math.random()*100};
});

var render = function (gameBoard) {
  enemies = gameBoard.selectAll('circle.enemy').data(createEnemies, function(d){return d.id;});
};

render(gameBoard);

  enemies.enter()
    .append('circle')
      .attr('class', 'enemy')
      .attr('cx', function(d){return axis.x(d.x);})
      .attr('cy', function(d){return axis.y(d.y);})
      .attr('r', 4);

  enemies.exit().remove();



