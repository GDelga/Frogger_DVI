var sprites = {
  frog: { sx: 0 , sy: 346, w: 37, h: 25, frames: 3 },
  fondo: { sx: 422, sy: 0, w: 550, h: 625, frames: 1 },
  camion_marron: {sx: 148, sy: 62, w: 200, h: 47, frames: 1},
  coche_naranja: {sx: 7, sy: 62, w: 122, h: 47, frames: 1},
  coche_verde: {sx: 102, sy: 0,w: 102, h: 60, frames: 1},
  coche_azul: {sx: 8, sy: 4, w:92 , h: 52 , frames: 1},
  coche_amarillo: {sx: 212 , sy: 2, w: 105 , h: 55, frames: 1}
  /*
  missile: { sx: 0, sy: 42, w: 7, h: 20, frames: 1 },
  enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
  enemy_bee: { sx: 79, sy: 0, w: 37, h: 43, frames: 1 },
  enemy_ship: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
  enemy_circle: { sx: 158, sy: 0, w: 32, h: 33, frames: 1 },
  explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
  */

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

  this.setup('frog', { vx: 0, vy: 0, frame: 0, reloadTime: 0.25, maxVel: 200 });

  this.x = Game.width / 2 - this.w / 2;
  this.y = Game.height - 10 - this.h;

  this.reload = this.reloadTime;


  this.step = function (dt) {
    //Movimiento a izquierda y derecha
    if (Game.keys['left']) { this.vx = -this.maxVel; }
    else if (Game.keys['right']) { this.vx = this.maxVel; }
    else { this.vx = 0; }

    this.x += this.vx * dt;

    if (this.x < 0) { this.x = 0; }
    else if (this.x > Game.width - this.w) {
      this.x = Game.width - this.w
    }
    //Movimiento arriba y abajo
    if (Game.keys['down']) { this.vy = this.maxVel; }
    else if (Game.keys['up']) { this.vy = -this.maxVel; }
    else { this.vy = 0; }

    this.y += this.vy * dt;

    if (this.y < 0) { this.y = 0; }
    else if (this.y > Game.height - this.h) {
      this.y = Game.height - this.h
    }
    //Disparos (No lo quito por si acaso)
    this.reload -= dt;
    if (Game.keys['fire'] && this.reload < 0) {
      Game.keys['fire'] = false;
      this.reload = this.reloadTime;

      this.board.add(new PlayerMissile(this.x, this.y + this.h / 2));
      this.board.add(new PlayerMissile(this.x + this.w, this.y + this.h / 2));
    }

  }

}

PlayerFrog.prototype = new Sprite();
PlayerFrog.prototype.type = OBJECT_PLAYER;

PlayerFrog.prototype.hit = function (damage) {
  if (this.board.remove(this)) {
    loseGame();
  }
}


///// EXPLOSION

var Explosion = function (centerX, centerY) {
  this.setup('explosion', { frame: 0 });
  this.x = centerX - this.w / 2;
  this.y = centerY - this.h / 2;
  this.subFrame = 0;
};

Explosion.prototype = new Sprite();

Explosion.prototype.step = function (dt) {
  this.frame = Math.floor(this.subFrame++ / 3);
  if (this.subFrame >= 36) {
    this.board.remove(this);
  }
};



/// Player Missile


var PlayerMissile = function (x, y) {
  this.setup('missile', { vy: -700, damage: 10 });
  this.x = x - this.w / 2;
  this.y = y - this.h;
};

PlayerMissile.prototype = new Sprite();
PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;


PlayerMissile.prototype.step = function (dt) {
  this.y += this.vy * dt;
  if (this.y < -this.h) { this.board.remove(this); }

  var collision = this.board.collide(this, OBJECT_ENEMY);
  if (collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  } else if (this.y < -this.h) {
    this.board.remove(this);
  }


};



/// ENEMIES

var enemies = {
  straight: {
    x: 0, y: -50, sprite: 'enemy_ship', health: 10,
    E: 100
  },
  ltr: {
    x: 0, y: -100, sprite: 'enemy_purple', health: 10,
    B: 200, C: 1, E: 200
  },
  circle: {
    x: 400, y: -50, sprite: 'enemy_circle', health: 10,
    A: 0, B: -200, C: 1, E: 20, F: 200, G: 1, H: Math.PI / 2
  },
  wiggle: {
    x: 100, y: -50, sprite: 'enemy_bee', health: 20,
    B: 100, C: 4, E: 100
  },
  step: {
    x: 0, y: -50, sprite: 'enemy_circle', health: 10,
    B: 300, C: 1.5, E: 60
  }
};

// Array con todos los vehiculos del juego
var cars = {
  camion_marron:{
    x: 400, y: 527, sprite: 'camion_marron',health: 10, V:-100
  },
  coche_naranja:{
    x: 12, y: 480, sprite: 'coche_naranja',health: 10, V:100
  },
  coche_verde:{
    x: 12, y: 428, sprite: 'coche_verde', health: 20, V:50
  },
  coche_azul: {
  	x:12 , y: 335, sprite: 'coche_azul', health: 5, V:75
  },
  coche_amarillo: {
  	x:12 , y:379 , sprite: 'coche_amarillo', health: 10, V: 250
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

  var collision = this.board.collide(this, OBJECT_PLAYER);
  if (collision) {
    collision.hit(this.damage);
    //this.board.remove(this);
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