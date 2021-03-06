var sprites = {
  logo: { sx: 48, sy: 400, w: 304, h: 225, frames: 1},
  frog: { sx: 0 , sy: 346, w: 40, h: 24, frames: 6 },
  fondo: { sx: 422, sy: 0, w: 550, h: 625, frames: 1 },
  camion_marron: {sx: 148, sy: 62, w: 180 , h: 45, frames: 1},
  coche_bomberos: {sx: 7, sy: 62, w: 122, h: 45, frames: 1},
  coche_verde: {sx: 102, sy: 0,w: 100, h: 50, frames: 1},
  coche_azul: {sx: 8, sy: 4, w:92 , h: 50 , frames: 1},
  coche_amarillo: {sx: 212 , sy: 2, w: 105 , h: 50, frames: 1},
  tronco_mediano: {sx: 10, sy: 123, w:190 , h: 40 , frames: 1},
  tronco_pequeno: {sx: 270, sy: 173, w:130 , h: 40 , frames: 1},
  tronco_grande: {sx: 9, sy: 171, w:247 , h: 40 , frames: 1},
  waters_malas:{sx:247,sy:480,w:550,h:242, frames: 1},
  death: {sx:354 , sy:125 , w:52 , h:39, frames:1 },
  turtle:{sx:5,sy:288,w:51,h:43, frames: 7},
  meta:{sx:0,sy:0,w:550,h:50, frames: 1},
  serpiente: {sx: 322, sy: 0, w: 81, h: 57, frames: 1},
  hoja: {sx: 0, sy: 232, w: 52, h: 45, frames: 1},
  mosca: {sx:54, sy:236,w:37,h:37, frames: 1}
};

var OBJECT_PLAYER = 1,
  OBJECT_PLAYER_PROJECTILE = 2,
  OBJECT_ENEMY = 4,
  OBJECT_POWERUP = 8,
  OBJECT_TRANSPORT = 16,
  OBJECT_BOARD = 32,
  OBJECT_FINISH = 64;


/// CLASE PADRE SPRITE
var Sprite = function () { }

Sprite.prototype.setup = function (sprite, props) {
	console.log(sprite);
  this.sprite = sprite;
  this.merge(props);
  this.frame = this.frame || 0;
  this.w = SpriteSheet.map[sprite].w;
  this.h = SpriteSheet.map[sprite].h;
}

Sprite.prototype.merge = function (props) {
  if (props) {
    for (var prop in props) {
      this[prop] = props[prop];
    }
  }
}
Sprite.prototype.draw = function (ctx) {
  SpriteSheet.draw(ctx, this.sprite, this.x, this.y, this.frame);
}

Sprite.prototype.hit = function (damage) {
  this.board.remove(this);
}



// PLAYER

var PlayerFrog = function (winGame) {

  this.setup('frog', { vx: 0, vy: 0, frame: 0, maxVel: 1 });

  this.x = Game.width / 2 -20 - this.w / 2;
  this.y = Game.height - this.h - 12;
  this.onTrunkIndicatorB = false;
  this.onTurtleB = false;
  this.onWaterLilyIndicatorB = false;
  this.subFrame = 0;
  this.jumping = false;
  this.up = false;
  this.down = false;
  this.tiempo = 0;
  PlayerFrog.muerte = false;

  this.onWaterLily = function (vt) {
  	this.vx = vt;
  	console.log(this.vx);
  	this.onWaterLilyIndicatorB = true;
  }

  this.onTrunk = function (vt) {
    this.vx = vt;
    console.log(this.vx);
    this.onTrunkIndicatorB = true;
  }
  this.onTurtle = function (vt){
    this.vx = vt;
    console.log(this.vx);
    this.onTurtleB = true;
  }

  this.step = function (dt) {
    this.tiempo += dt;
    //Si esta saltando hace la animación de saltar
    if(this.jumping){
      //Calcula el tiempo para cada frame y si ya ha terminado la animacion
      if(this.tiempo > 0.02 && this.subFrame < 6){
        this.frame = this.subFrame++;
        this.tiempo = 0;
      }
      //Si ya ha terminado la animación resetea los valores y hace el movimiento
      else if(this.subFrame === 6){
        this.subFrame = 0;
        this.frame = this.subFrame;
        this.jumping = false;
        if(this.up === true) {
        	this.y -= 48;
        	this.up = false;
        	Points.puntos += 10;
        }
        else if(this.down === true) {
        	this.y += 48;
        	this.down = false;
        }
       	else { this.y += 0; }
	    if (this.y < 0) { this.y = 0; }
	    else if (this.y > Game.height - this.h) {
	      this.y = Game.height - this.h;
	    }
      }
    }
    if(this.onTrunkIndicatorB){
      this.x += this.vx * dt;
      console.log("ahora me debería mover");
    }
    if(this.onTurtleB){
      this.x += this.vx * dt;
      console.log("estoy en la tortuga");
    }
    if(this.onWaterLilyIndicatorB){
      this.x += this.vx * dt;
      console.log("estoy en la hoja");
    }
    //Movimiento a izquierda y derecha
    if(Game.pulsado == false && this.jumping == false) {
	    if (Game.keys['left']) { this.x -= 40; Game.pulsado = true; }
	    else if (Game.keys['right']) { this.x += 40; Game.pulsado = true;}
	    else { this.x += 0; }
	    if (this.x < 0) { this.x = 0; }
	    else if (this.x > Game.width - this.w) {
	      this.x = Game.width - this.w;
	    }
	    //Movimiento arriba y abajo
	    if (Game.keys['down']) {  this.down = true; Game.pulsado = true; this.jumping = true; this.frame = this.subFrame++;}
	    else if (Game.keys['up']) { this.up = true; Game.pulsado = true; this.jumping = true; this.frame = this.subFrame++;}
  }
  var collision = this.board.collide(this, OBJECT_ENEMY);
  var objeto = this.board.collide(this,OBJECT_TRANSPORT);
  var win = this.board.collide(this, OBJECT_FINISH);
  var mosca = this.board.collide(this, OBJECT_POWERUP);
  if(win){
    console.log("HAS GANADO");
    winGame(Points.puntos, Lives.vidas);
  }
  else{
    if(collision && !objeto){
      //pierde
      if (this.board.remove(this)) {
        this.board.add(new Death(this.x + this.w/2, 
                                       this.y + this.h/2));
        Lives.muerte = true;
      }
     }
    //Si se ha acabado el tiempo la rana muere
    if(PlayerFrog.muerte === true) {
        this.board.remove(this);
        this.board.add(new Death(this.x + this.w/2, 
                                       this.y + this.h/2));
          Lives.muerte = true;
    }
    this.vx = 0;
    this.onTrunkIndicatorB = false;
    this.onTurtleB = false;
    this.onWaterLilyIndicatorB = false;
    }
  }
}

PlayerFrog.prototype = new Sprite();
PlayerFrog.prototype.type = OBJECT_PLAYER;

//Si hay una colision la rana muere
PlayerFrog.prototype.hit = function (damage) {
  if (this.board.remove(this)) {
  	this.board.add(new Death(this.x + this.w/2, 
                                   this.y + this.h/2));
    Lives.muerte = true;
  }
}


// Objetos del agua, tales como la tortuga, los diferentes tipos de troncos
var objetos_agua = {
  tortuga_uno: {
    x: 250, y: 200, sprite: 'turtle', health: 10, V: 20, frame: 0
  },
  tronco_pequeno: {
    x: 500, y: 248, sprite: 'tronco_pequeno', health: 10, V: -50
  },
  tronco_mediano: {
    x: 500, y: 150, sprite: 'tronco_mediano', health: 10, V: -50
    
  },
  tronco_grande: {
    x: 500, y: 50, sprite: 'tronco_grande', health: 10, V: -50
  },
  tortuga_dos: {
    x: 0, y: 100, sprite: 'turtle', health: 10, V: 20, frame: 0
  },
  hoja: {
  	x:0, y: 200, sprite: 'hoja', health: 10, V: 20
  }
};
var objetos_objetivos = {
  meta:{
    x: 0, y: 0, sprite: 'meta', health: 10, V: 20, frame: 0
  }
}

//Hoja
var WaterLily = function (blueprint) {
  console.log("setup");
  this.setup(blueprint.sprite, blueprint);

}
WaterLily.prototype = new Sprite();
WaterLily.prototype.type =OBJECT_TRANSPORT;

WaterLily.prototype.step = function (dt) {
  this.t += dt;
  this.vx = this.V;
  this.vy = 0;
  this.x += this.vx * dt;
  this.y += this.vy * dt;
  this.tiempo = 0;
  if (this.x > 200) {
    console.log("remove");
    this.board.remove(this);
  }

  var collision = this.board.collide(this, OBJECT_PLAYER);
  if (collision) {
    console.log("colision con hoja");
    collision.onWaterLily(this.V);
  }

}
//Tronco
var Trunk = function (blueprint) {
  console.log("setup");
  this.setup(blueprint.sprite, blueprint);

}
Trunk.prototype = new Sprite();
Trunk.prototype.type =OBJECT_TRANSPORT;

Trunk.prototype.step = function (dt) {
  this.t += dt;
  this.vx = this.V;
  this.vy = 0;
  this.x += this.vx * dt;
  this.y += this.vy * dt;
  this.tiempo = 0;
  if (this.y > Game.height ||
    this.x < -this.w ||
    this.x > Game.width) {
    console.log("remove");
    this.board.remove(this);
  }

  var collision = this.board.collide(this, OBJECT_PLAYER);
  if (collision) {
    console.log("colision con tronco");
    collision.onTrunk(this.V);
  }

}

//Tortuga
var Turtle = function (blueprint) {
  //this.setup('frog', { vx: 0, vy: 0, frame: 0, maxVel: 1 });
  console.log("setup");
  this.setup(blueprint.sprite, blueprint);
  this.subFrame = 0;
  this.tiempo = 0;
  this.buceo = true;
  this.espacioEntreBuceo = false;

}
Turtle.prototype = new Sprite();
Turtle.prototype.type =OBJECT_TRANSPORT;

Turtle.prototype.step = function (dt) {
  //Animacion de la tortuga
  console.log("animacion de la tortuga, frame " + this.frame );
  this.tiempo += dt;
  console.log("tiempo " + this.tiempo + " buceo " + this.buceo );
  if(this.tiempo > 0.2 && !this.espacioEntreBuceo && this.buceo){
    if(this.subFrame === 8) this.espacioEntreBuceo = true; //Si no llega a 8, no se ve la ultima imagen de la tortuga
    else{
      this.frame = this.subFrame++;
      this.tiempo = 0;
    }
  }
  else if(this.espacioEntreBuceo === true && this.tiempo > 0.9) {
  	//Para hacer que la rana muera en este estado
  	this.tiempo = 0;
  	this.buceo = false;
  	this.espacioEntreBuceo = false;
  	this.frame = this.subFrame = 6; //Para que no haya fallos de imagen
  }
  else if(this.tiempo > 0.15 && !this.espacioEntreBuceo && !this.buceo){
    console.log("entro");
    if(this.subFrame === 0) this.buceo = true;
    else{
      console.log("entro");
      this.frame = this.subFrame--;
      this.tiempo = 0;
    }
  }


  this.t += dt;
  this.vx = this.V;
  this.vy = 0;
  this.x += this.vx * dt;
  this.y += this.vy * dt;
  if (this.y > Game.height ||
    this.x < -this.w ||
    this.x > Game.width) {
    console.log("remove turtle");
    this.board.remove(this);
  }

  var collision = this.board.collide(this, OBJECT_PLAYER);
  if (collision && !this.espacioEntreBuceo) {
    console.log("colision con tortuga");
    collision.onTurtle(this.V);
  }
  else if(collision && this.espacioEntreBuceo) { //Si la tortuga esta sin salir del agua, la rana muere
  	collision.hit();
  }

}

// Array con todos los vehiculos del juego
var cars = {
  camion_marron: {
    x: 400, y: 527, sprite: 'camion_marron', health: 10, V: -100
  },
  coche_bomberos:{
    x: 12, y: 480, sprite: 'coche_bomberos',health: 10, V:100
  },
  coche_verde: {
    x: 12, y: 428, sprite: 'coche_verde', health: 20, V: 60
  },
  coche_azul: {
    x: 12, y: 335, sprite: 'coche_azul', health: 5, V: 75
  },
  coche_amarillo: {
    x: 12, y: 379, sprite: 'coche_amarillo', health: 10, V: 150
  },
  // Agua
  waters_malas:{
    x: 0, y: 49, sprite: 'waters_malas', health: 10
  },
  //Serpiente
  serpiente:{
    x: 500, y: 285, sprite: 'serpiente', health: 10, V: -75
  }
};




var Car = function(blueprint){
  console.log("setup");
  this.setup(blueprint.sprite, blueprint);
}
Car.prototype = new Sprite();
Car.prototype.type = OBJECT_ENEMY;

Car.prototype.step = function (dt) {
  this.t += dt;
  this.vx = this.V;
  this.vy = 0;
  this.x += this.vx * dt;
  this.y += this.vy * dt;
  if (this.y > Game.height ||
    this.x < -this.w ||
    this.x > Game.width) {
    console.log("remove");
    this.board.remove(this);
  }

  // Hace las colisiones de la rana
  var collision = this.board.collide(this, OBJECT_PLAYER);
  if (collision) {
    collision.hit(this.damage);
    //this.board.remove(this);
  }
}
//tronco rana y agua
var Water = function(blueprint){
  this.setup(blueprint.sprite, blueprint);

}
Water.prototype = new Sprite();
Water.prototype.type = OBJECT_ENEMY;
Water.prototype.draw = function(){};
Water.prototype.step = function (dt) {

}
//Meta
var Meta = function(blueprint){
  this.setup(blueprint.sprite, blueprint);

}
Meta.prototype = new Sprite();
Meta.prototype.type = OBJECT_FINISH;
Meta.prototype.draw = function(){};
Meta.prototype.step = function (dt) {

}

//Mosca
var Mosca = function (blueprint) {
 console.log(blueprint);
  this.setup(blueprint.sprite, blueprint);
  console.log("Mosca dentro");

}

Mosca.prototype = new Sprite();
Mosca.prototype.type = OBJECT_POWERUP;

Mosca.prototype.step = function (dt) {
  var collision = this.board.collide(this, OBJECT_PLAYER);
  if (collision) {
    this.board.remove(this);
    Points.puntos += 50;
  }

}

///// MUERTE DE LA RANA

var Death = function(centerX,centerY) {
  this.setup('death', { frame: 0 });
  this.x = centerX - this.w/2;
  this.y = centerY - this.h/2;
};

Death.prototype = new Sprite();

Death.prototype.step = function(dt) {
};

//BACKGROUND
var BackGround = function () {

  this.setup('fondo', {
    x: 0,
    y: 0
  });

  this.step = function (dt) {
  }

}

BackGround.prototype = new Sprite();
BackGround.prototype.type = OBJECT_BOARD;

//var nombreCoches = ['camion_marron', 'coche_bomberos', 'coche_amarillo', 'coche_verde', 'coche_azul'];

// Array de todos los objetos del juego
/*
Definicion de atributos de cada patron:
inicio:     Sera el tiempo en el que saldra el objeto
intervalo:  Sera el tiempo que se le sumara al "inicio" y que tendra que esperar el objeto para ser llamado
campo:      Para disntiguir entre los objetos de la carretera y del agua (se podria unificar todos en un mismo array)
tipo:       Para llamar al objeto dentro de su array de objetos
*/
var patrones = [
  // Patrones de los coches
  {inicio: 0, intervalo: 6, campo: 0, tipo: 'camion_marron'},   // Camion marron
  {inicio: 0, intervalo: 5.5, campo: 0, tipo: 'coche_bomberos'},  // Ambulancia
  {inicio: 0, intervalo: 5, campo: 0, tipo: 'coche_amarillo'},  // Coche amarillo
  {inicio: 0, intervalo: 4, campo: 0, tipo: 'coche_verde'},   // Coche verde
  {inicio: 0, intervalo: 5, campo: 0, tipo: 'coche_azul'},      // Coche azul
  // Aqui vienen los patrones del agua
  {inicio: 0, intervalo: 5, campo: 1, tipo: 'tortuga_uno'},         // Tortuga
  {inicio: 0, intervalo: 9, campo: 1, tipo: 'tortuga_dos'},         // Tortuga
  {inicio: 0, intervalo: 4, campo: 1, tipo: 'tronco_pequeno'},   // Tronco pequeño
  {inicio: 0, intervalo: 5, campo: 1, tipo: 'tronco_mediano'},   // Tronco mediano
  {inicio: 0, intervalo: 6, campo: 1, tipo: 'tronco_grande'},   // Tronco grande
  {inicio: 0, intervalo: 4, campo: 1, tipo: 'hoja'},   // Tronco grande
  // Patron de la serpiente
  {inicio: 0, intervalo:7, campo: 0, tipo: 'serpiente'},
  {inicio: 0, intervalo:7, campo: 2, tipo: 'mosca'}
]


// Clase que metera los objetos del juego continuamente en la pantalla
var Spawner = function () {
  console.log("Se mete en Spawner");
  // Inicializo t, que sera la variable que cuenta el tiempo para pintar un objeto y el siguiente
  this.t = 0;
  //Inicializo el inicio de los patrones para que se vuelvan a pintar en el momento adecuado
  for(var i = 0; i < patrones.length; i++) {
  	patrones[i].inicio = 0;
  }
}

Spawner.prototype.step = function (dt) {
  // Le sumo el tiempo transcurrido
  this.t += dt;
  // Me recorro el array de PATRONES 
  for(var i = 0; i < patrones.length; i++){
    // Miro si puedo pintar ese PATRON
    if(this.t > patrones[i].inicio){
      // Le sumo el intervalo que tendra que esperar para volver a ser pintado
      patrones[i].inicio += patrones[i].intervalo;
      var campo = patrones[i].campo;
      // Su campo es la carretera
      if(campo == 0){
        // Lo añado al tablero
        var coche = cars[patrones[i].tipo];
        this.board.add(new Car(coche));
      }
      // Su campo es el agua
      else if (campo == 1){
        // Lo añado al tablero
        if(i === 5 || i === 6) this.board.add(new Turtle(objetos_agua[patrones[i].tipo]));
        else if(i == 10) this.board.add(new WaterLily(objetos_agua[patrones[i].tipo]));
        else this.board.add(new Trunk(objetos_agua[patrones[i].tipo]));
      }
      else if(campo == 2) {
      		var xM = Math.round(Math.random()*(549-10)+parseInt(10));
      		var yM = Math.round(Math.random()*(624-10)+parseInt(10));
      		var moscas = {
  				x: xM, y: yM, sprite: 'mosca', health: 10, V:0
  			};
  			this.board.add(new Mosca(moscas));
      }
      
    }
  }


}
// Para sobre escribir la funcion del padre y que no pinta nada
Spawner.prototype.draw = function () {};

//LOGO
var Logo = function () {

  this.setup('logo', {
    x: Game.width/2 -160,
    y: Game.height/2 - 200,
  });

  this.step = function (dt) {
  }

}

Logo.prototype = new Sprite();
Logo.prototype.type = OBJECT_BOARD;

//TIEMPO DE JUEGO
var Time = function() {

	this.tiempoPartida = 90;
	this.step = function (dt) {
		if (this.tiempoPartida <= 0) {//Quitamos una vida a la rana si se acaba el tiempo
			PlayerFrog.muerte = true;
		}
		else this.tiempoPartida -= dt;
  	}

  	this.draw =  function(ctx){
	    Game.ctx.fillStyle = "#FFFFFF";
	    Game.ctx.textAlign = "left";

	    Game.ctx.font = "bold 16px arial";
	    Game.ctx.fillText("Tiempo: " + Math.round(this.tiempoPartida),1,35);
  }
}

//VIDAS DE LA RANA
var Lives = function(vidas) {

	Lives.vidas = vidas;
	Lives.muerte = false;
	this.step = function (dt) {
		//Si hay una muerte quitamos una vida
		if (Lives.muerte === true) {
			Lives.muerte = false;
			Lives.vidas -= 1;
			if(Lives.vidas == 0) loseGame(Points.puntos); //Si no quedan vidas fin de la partida
			else loseLive(Lives.vidas); //Si quedan vidas reiniciamos el nivel
		}
  	}

  	this.draw =  function(ctx){
  		if(Game.started === true) { //Si el juego ha comenzado pintamos las vidas
		    Game.ctx.fillStyle = "#FFFFFF";
		    Game.ctx.textAlign = "left";

		    Game.ctx.font = "bold 16px arial";
		    Game.ctx.fillText("Vidas: " + Lives.vidas,1,55);
		}
  }
}


//PUNTOS
var Points = function(puntos) {

	Points.puntos = Number(puntos);
	this.step = function (dt) {
  	}

  	this.draw =  function(ctx){
  		if(Game.started === true) { //Si el juego ha comenzado pintamos los puntos
		    Game.ctx.fillStyle = "#FFFFFF";
		    Game.ctx.textAlign = "left";

		    Game.ctx.font = "bold 16px arial";
		    Game.ctx.fillText("Puntos: " + Points.puntos,1,75);
		}
  }
}