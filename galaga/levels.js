var level1 = [
 // Start,    End, Gap,  Type,   Override
  [ 0,       4000, 500, 'step' ],
  [ 6000,   13000, 800, 'ltr' ],
  [ 12000,  16000, 400, 'circle' ],
  [ 18200,  20000, 500, 'straight', { x: 150 } ],
  [ 18200,  20000, 500, 'straight', { x: 100 } ],
  [ 18400,  20000, 500, 'straight', { x: 200 } ],
  [ 22000,  25000, 400, 'wiggle', { x: 300 }],
  [ 22000,  25000, 400, 'wiggle', { x: 200 }]
];

var Level = function(levelData,callback) {
  this.levelData = [];
  for(var i = 0; i < levelData.length; i++) {
    this.levelData.push(Object.create(levelData[i]));
  }
  this.t = 0;
  this.callback = callback;
}

Level.prototype.draw = function(ctx) { }

Level.prototype.step = function(dt) {
  var idx = 0, remove = [], curShip = null;
 
 // Update the current time offset
  this.t += dt * 1000;

  //  Example levelData 
  //   Start, End,  Gap, Type,   Override
  // [[ 0,     4000, 500, 'step', { x: 100 } ]
  while((curShip = this.levelData[idx]) && 
        (curShip[0] < this.t + 2000)) {
    // Check if past the end time 
    if(this.t > curShip[1]) {
      // If so, remove the entry
      remove.push(curShip);
    } else if(curShip[0] < this.t) {
      // Get the enemy definition blueprint
      var enemy = enemies[curShip[3]],
          override = curShip[4];

      // Add a new enemy with the blueprint and override
      this.board.add(new Enemy(enemy,override));

      // Increment the start time by the gap
      curShip[0] += curShip[2];
    }
    idx++;
  }
  // Remove any objects from the levelData that have passed
  for(var i = 0, len = remove.length; i < len; i++) {
    var idx = this.levelData.indexOf(remove[i]);
    if(idx != -1) this.levelData.splice(idx,1);
  }

  // If there are no more enemies on the board or in 
  // levelData, this level is done
  if(this.levelData.length == 0 && this.board.cnt[OBJECT_ENEMY] == 0) {
    if(this.callback) this.callback();
  }
}