


// Especifica lo que se debe pintar al cargar el juego
var startGame = function() {
  var board = new GameBoard();
  board.add (new TitleScreen("", 
                                  "Press space to start",
                                  playGame));
  board.add (new Logo());
  Game.setBoard(0, board);
  //PONEMOS LAS VIDAS
  var board = new GameBoard();
  board.add(new Lives(5));
  board.add(new Points(0));
  Game.setBoard(2, board);
}


//INICIALIZA EL JUEGO
var playGame = function() {

  var board = new GameBoard();
  board.add(new BackGround());
  Game.setBoard(0, board);
  
  var board = new GameBoard();
  board.add(new Water(cars['waters_malas']));
  board.add(new PlayerFrog());
  board.add(new Spawner());
  board.add(new Time());
  Game.setBoard(1, board);

  Game.setBoard(3, new GameBoard());
}

//CUANDO EL JUGADOR GANA
var winGame = function(points) {
  Game.setBoard(3,new TitleScreen("You win! You have " + (points + 100) + "points now!", 
                                  "Press fire to continue",
                                  playGame));
  //INICIALIZAMOS LAS VIDAS PARA LA SIGUIENTE PARTIDA
  var board = new GameBoard();
  board.add(new Lives(5));
  board.add(new Points(points + 100));
  Game.setBoard(2, board);
};


//CUANDO EL JUGADOR PIERDE UNA PARTIDA ENTERA
var loseGame = function(points) {
  Game.setBoard(3,new TitleScreen("You lose! You have " + points + " points", 
                                  "Press fire to play again",
                                  playGame));
  //INICIALIZAMOS LAS VIDAS PARA LA SIGUIENTE PARTIDA
  var board = new GameBoard();
  board.add(new Lives(5));
  board.add(new Points(0));
  Game.setBoard(2, board);
};

//CUANDO EL JUGADOR PIERDE UNA VIDA
var loseLive = function(live) {
  Game.setBoard(3,new TitleScreen("Now you have " + live + " lives!", 
                                  "Press fire to continue",
                                  playGame));
  Game.setBoard();
};


// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});
