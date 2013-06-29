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

var gameBoard = d3.select('.container').append('svg:svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height);

var createEnemies = function(){ return _.range(0,gameOptions.nEnemies).map(function (index, value){
  return {id: index, x: Math.random()*100, y: Math.random()*100};
});};

var render = function (enemyArray) {
  // enemyArray = enemyArray || createEnemies();
  enemies = gameBoard.selectAll('circle.enemy').data(enemyArray, function(d){return d.id;});
  enemies
    .transition()
      .duration(500)
      .attr('r', 10)
    .transition()
      .duration(2000)
      .tween('custom', tweenWithCollisionDetection);
};

render(createEnemies());

enemies.enter()
  .append('circle')
    .attr('class', 'enemy')
    .attr('cx', function(d){return axis.x(d.x);})
    .attr('cy', function(d){return axis.y(d.y);})
    .attr('r', 4);

enemies.exit().remove();

var tweenWithCollisionDetection = function (endData) {
  var enemy = d3.select(this);
  var startPos = {
    x: parseFloat(enemy.attr('cx')),
    y: parseFloat(enemy.attr('cy'))
  };
  var endPos = {
    x: axis.x(endData.x),
    y: axis.y(endData.y)
  };
  return function (t) {
    var enemyNextPos= {
      x: startPos.x + (endPos.x - startPos.x)*t,
      y: startPos.y + (endPos.y - startPos.y)*t
    };
    enemy.attr('cx', enemyNextPos.x)
      .attr('cy', enemyNextPos.y);
  };
};


var gameTurn = function () {
  console.log('gameturn!');
  render(createEnemies());

};

gameTurn();

setInterval(gameTurn, 2000);


