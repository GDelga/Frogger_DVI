


// Especifica lo que se debe pintar al cargar el juego
var startGame = function() {
  Game.setBoard(0,new TitleScreen("Alien Invasion", 
                                  "Press fire to start playing",
                                  playGame));
}



var playGame = function() {

  //Game.setBoard(0,new Backgroundfield());

  var board = new GameBoard();
  // Añado al board los elementos que necesitara
  board.add(new BackGround());
 
  board.add(new Car(cars['camion_marron']));
  board.add(new Car(cars['coche_bomberos']));
  board.add(new Car(cars['coche_verde']));
  board.add(new Car(cars['coche_azul']));
  board.add(new Car(cars['coche_amarillo']));
  board.add(new Trunk(objetos['tronco_pequeno']));
  board.add(new Turtle(objetos['tortuga']));
  board.add(new Water(cars['waters_malas']));
  board.add(new PlayerFrog());
  
  //Agua rana y tronco
  Game.setBoard(0,board);
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
  Game.initialize("game",sprites,playGame);
});
