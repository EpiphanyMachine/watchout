//player can go out of bounds, future update should correct this
var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0
};

var axis = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var gameBoard = d3.select('.container').append('svg:svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height);

var move = d3.behavior.drag()
  .on('drag', function (d,i) {
    player.cx.baseVal.valueInSpecifiedUnits += d3.event.dx;
    player.cy.baseVal.valueInSpecifiedUnits += d3.event.dy;
  });

gameBoard.append('circle')
            .attr('id', 'player')
            .attr('cx', 350)
            .attr('cy', 225)
            .attr('r', 10)
            .attr('fill', 'blue')
            .call(move);

var createEnemies = function(){ return _.range(0,gameOptions.nEnemies).map(function (index, value){
  return {id: index, x: Math.random()*100, y: Math.random()*100};
});};

var renderEnemies = function (enemyArray) {
  enemies = gameBoard.selectAll('circle.enemy').data(enemyArray, function(d){return d.id;});
  enemies
    .transition()
      .duration(500)
      .attr('r', 10)
    .transition()
      .duration(2000)
      .tween('custom', tweenWithCollisionDetection);
};

renderEnemies(createEnemies());

enemies.enter()
  .append('circle')
    .attr('class', 'enemy')
    .attr('cx', function(d){return axis.x(d.x);})
    .attr('cy', function(d){return axis.y(d.y);})
    .attr('r', 4);

enemies.exit().remove();

var checkCollision = function (enemy) {
  //may need to throw in an each func when we have multiple players
  var player = d3.select('#player');
  var radiusSum = parseFloat(enemy.attr('r')) + parseFloat(player.attr('r'));
  var xDiff = parseFloat(enemy.attr('cx')) - parseFloat(player.attr('cx'));
  var yDiff = parseFloat(enemy.attr('cy')) - parseFloat(player.attr('cy'));
  var separation = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2));
  if (separation < radiusSum) {
    collidedCallback(player, enemy);
  }
};

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
    checkCollision(enemy);
  };
};

var collidedCallback = function(player, enemy){
  updateBestScore();
  gameStats.score = 0;
  updateScore();
};

var updateScore = function () {
  d3.select('#current-score')
    .text(gameStats.score.toString());
};

var updateBestScore = function(){
  if (gameStats.score > gameStats.bestScore) {
    gameStats.bestScore = gameStats.score;
    d3.select('#best-score').text(gameStats.bestScore.toString());
  }
};

var play = function () {
  var gameTurn = function () {
    renderEnemies(createEnemies());
  };
  var increaseScore = function () {
    gameStats.score += 1;
    updateScore();
  };
  gameTurn();

  setInterval(gameTurn, 2000);
  setInterval(increaseScore, 100);
};

play();
