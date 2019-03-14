


// Especifica lo que se debe pintar al cargar el juego
var startGame = function() {
  var board = new GameBoard();
  board.add (new TitleScreen("", 
                                  "Press space to start",
                                  playGame));
  board.add (new Logo());
  Game.setBoard(0, board);
}



var playGame = function() {

  var board = new GameBoard();
  board.add(new BackGround());
  Game.setBoard(0, board);
  
  var board = new GameBoard();
  board.add(new Water(cars['waters_malas']));
  board.add(new PlayerFrog());
  board.add(new Spawner());
  Game.setBoard(1, board);
  
  
  /*board.add(new PlayerFrog());
  board.add(new Spawner());
  board.add(new Water(cars['waters_malas']));
  Game.setBoard(1, board); */

  //board.add(new BackGround());
  // Añado al board los elementos que necesitara
  

  
 /* board.add(new Car(cars['camion_marron']));
  board.add(new Car(cars['coche_bomberos']));
  board.add(new Car(cars['coche_verde']));
  board.add(new Car(cars['coche_azul']));
  board.add(new Car(cars['coche_amarillo']));*/
 
  /*board.add(new Trunk(objetos_agua['tronco_pequeno']));
  board.add(new Turtle(objetos_agua['tortuga']));*/
  
 

  
  //Agua rana y tronco
 // Game.setBoard(0,board);
}

var winGame = function() {
  Game.setBoard(3,new TitleScreen("You win!", 
                                  "Press fire to play again",
                                  playGame));
};



var loseGame = function() {
  Game.setBoard(3,new TitleScreen("You lose!", 
                                  "Press fire to play again",
                                  playGame));
};


// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});
