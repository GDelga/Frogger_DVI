var sprites = {
  frog: { sx: 0 , sy: 344, w: 37, h: 38, frames: 1 },
  fondo: { sx: 422, sy: 0, w: 550, h: 625, frames: 1 },
  camion_marron: {sx: 148, sy: 62, w: 200, h: 47, frames: 1},
  coche_bomberos: {sx: 7, sy: 62, w: 122, h: 47, frames: 1},
  coche_verde: {sx: 102, sy: 0,w: 102, h: 60, frames: 1},
  coche_azul: {sx: 8, sy: 4, w:92 , h: 48 , frames: 1},
  coche_amarillo: {sx: 212 , sy: 2, w: 105 , h: 55, frames: 1},
  tronco_mediano: {sx: 10, sy: 123, w:92 , h: 52 , frames: 1},
  tronco_pequeno: {sx: 270, sy: 173, w:130 , h: 50 , frames: 1},
  tronco_grande: {sx: 9, sy: 171, w:92 , h: 60 , frames: 1},
  waters_malas:{sx:247,sy:480,w:550,h:242, frames: 1}
};

var OBJECT_PLAYER = 1,
  OBJECT_PLAYER_PROJECTILE = 2,
  OBJECT_ENEMY = 4,
  OBJECT_ENEMY_PROJECTILE = 8,
  OBJECT_POWERUP = 16,
  OBJECT_BOARD = 32;


/// CLASE PADRE SPRITE
var Sprite = function () { }

Sprite.prototype.setup = function (sprite, props) {
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

var PlayerFrog = function () {

  this.setup('frog', { vx: 0, vy: 0, frame: 0, reloadTime: 0.25, maxVel: 1 });

  this.x = Game.width / 2 -27 - this.w / 2;
  this.y = Game.height - this.h;
  this.onTrunkIndicatorB = false;

  this.reload = this.reloadTime;

  this.onTrunk = function (vt) {
    this.vx = vt;
    console.log(this.vx);
    this.onTrunkIndicatorB = true;
  }

  this.onTrunkIndicator = function(){
    return this.onTrunkIndicatorB;
  }
  this.step = function (dt) {
    //Movimiento a izquierda y derecha
    if(this.onTrunkIndicatorB){
      this.x += this.vx * dt;
      console.log("ahora me debería mover");
      //this.onTrunkIndicatorB = false;
    }
    if(Game.pulsado == false) {
	    if (Game.keys['left']) { this.x -= 40; Game.pulsado = true; }
	    else if (Game.keys['right']) { this.x += 40; Game.pulsado = true;}
	    else { this.x += 0; }
	    if (this.x < 0) { this.x = 0; }
	    else if (this.x > Game.width - this.w) {
	      this.x = Game.width - this.w;
	    }
	    //Movimiento arriba y abajo
	    if (Game.keys['down']) { this.y += 48; Game.pulsado = true; }
	    else if (Game.keys['up']) { this.y -= 48; Game.pulsado = true; }
	    else { this.y += 0; }
	    if (this.y < 0) { this.y = 0; }
	    else if (this.y > Game.height - this.h) {
	      this.y = Game.height - this.h;
	    }
  }
  this.vx = 0;
  this.onTrunkIndicatorB = false;
  }

}

PlayerFrog.prototype = new Sprite();
PlayerFrog.prototype.type = OBJECT_PLAYER;

PlayerFrog.prototype.hit = function (damage) {
  console.log("colision rana");
  
  if (this.board.remove(this)) {
    loseGame();
  }


}

var objetos = {
  tortuga: {
    x: 400, y: 527, sprite: 'tortuga', health: 10, V: -100
  },
  tronco_pequeno: {
    x: 400, y: 248, sprite: 'tronco_pequeno', health: 10, V: -50
  },
  tronco_mediano: {

  },
  tronco_grande: {

  }
};
var Trunk = function (blueprint) {
  console.log("setup");
  this.setup(blueprint.sprite, blueprint);

}
Trunk.prototype = new Sprite();
Trunk.prototype.type = OBJECT_POWERUP;

Trunk.prototype.step = function (dt) {
  this.t += dt;
  this.vx = this.V;
  this.vy = 0;
  //this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
  //this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);
  this.x += this.vx * dt;
  this.y += this.vy * dt;
  if (this.y > Game.height ||
    this.x < -this.w ||
    this.x > Game.width) {
    console.log("remove");
    this.board.remove(this);
  }

  var collision = this.board.collide(this, OBJECT_PLAYER);
  if (collision) {
    //collision.hit(this.damage);
    console.log("colision con tronco");
    collision.onTrunk(-50);

    //this.board.remove(this);
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
    x: 12, y: 428, sprite: 'coche_verde', health: 20, V: 50
  },
  coche_azul: {
    x: 12, y: 335, sprite: 'coche_azul', health: 5, V: 75
  },
  coche_amarillo: {
    x: 12, y: 379, sprite: 'coche_amarillo', health: 10, V: 250
  },
  waters_malas:{
    x: 0, y: 49, sprite: 'waters_malas', health: 10
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
  //this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
  //this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);
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

  // Hace las colisiones de la rana
  var collision = this.board.collide(this, OBJECT_PLAYER);
  if (collision) {
    console.log(collision.onTrunkIndicatorB);
    if(!collision.onTrunkIndicatorB){
      console.log("colision con agua");
      collision.hit(this.damage);
    }
      
  }
}


/*Car.prototype.hit = function (damage) {
  this.health -= damage;
  if (this.health <= 0) {
    if (this.board.remove(this)) {
      this.board.add(new Explosion(this.x + this.w / 2,
        this.y + this.h / 2));
    }
  }

}*/
/*
var Enemy = function (blueprint, override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite, blueprint);
  this.merge(override);
}

Enemy.prototype = new Sprite();
Enemy.prototype.baseParameters = {
  A: 0, B: 0, C: 0, D: 0,
  E: 0, F: 0, G: 0, H: 0,
  t: 0, health: 20, damage: 10
};


Enemy.prototype.type = OBJECT_ENEMY;

Enemy.prototype.step = function (dt) {
  this.t += dt;
  this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
  this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);
  this.x += this.vx * dt;
  this.y += this.vy * dt;
  if (this.y > Game.height ||
    this.x < -this.w ||
    this.x > Game.width) {
    this.board.remove(this);
  }

  var collision = this.board.collide(this, OBJECT_PLAYER);
  if (collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  }

}

Enemy.prototype.hit = function (damage) {
  this.health -= damage;
  if (this.health <= 0) {
    if (this.board.remove(this)) {
      this.board.add(new Explosion(this.x + this.w / 2,
        this.y + this.h / 2));
    }
  }

}
*/
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