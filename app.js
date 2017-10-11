function getRandomDamage(max, min) {
  min = min || 0;
  var dmg = Math.round(Math.random() * max) + 1;
  return Math.max(min, dmg);
}

// action: Object of shape { type: String, hp: Integer }
// type: string or array of strings
function sumHpFromActions(actions, types) {
  if (!(types instanceof Array)) { types = [types] }

  return actions
    .filter(function(action){ return types.indexOf(action.type) > -1 })
    .reduce(function(sum, action){ return sum + action.hp }, 0);
}

new Vue({
  el: '#app',
  data: {
    gameRunning: false,
    turn: 'player',
    actions: []
  },
  computed: {
    hpPlayer: function() {
      var dmg = sumHpFromActions(this.actions, 'monster-attack');
      var heal = sumHpFromActions(this.actions, 'heal');
      var rawHp = 100 - dmg + heal; // we need to constrain this to <0, 100>
      return Math.max(0, Math.min((rawHp), 100));
    },
    hpMonster: function() {
      var dmg = sumHpFromActions(this.actions, ['attack', 'special-attack']);
      var rawHp = 100 - dmg;
      return Math.max(0, rawHp); // min 0
    },
    actionsLog: function() {
      return this.actions.slice().reverse();
    }
  },
  methods: {
    startGame: function() {
      this.turn = 'player';
      this.actions = [];
      this.gameRunning = true;
    },
    stopGame: function() {
      this.gameRunning = false;
    },
    attack: function() {
      var dmg = getRandomDamage(10);
      this.actions.push({ type: 'attack', hp: dmg });
      this.endTurn();
    },
    specialAttack: function() {
      var dmg = getRandomDamage(15) ;
      this.actions.push({ type: 'special-attack', hp: dmg });
      this.endTurn();
    },
    monsterAttack() {
      var dmg = getRandomDamage(12);
      this.actions.push({ type: 'monster-attack', hp: dmg });
      this.endTurn();
    },
    heal: function() {
      var healedHp = getRandomDamage(14, 7);
      this.actions.push({ type: 'heal', hp: healedHp });
      this.endTurn();
    },
    endTurn: function() {
      this.turn = this.turn === 'player' ? 'monster' : 'player';
    }
  },
  watch: {
    turn: function(val) {
      if (val==='monster') {
        this.monsterAttack();
      }
    },
    hpPlayer: function(val) {
      if (val <= 0) {
        this.stopGame();
        alert("YOU DIED!");
      }
    },
    hpMonster: function(val) {
      if (val <= 0) {
        this.stopGame();
        alert("YOU WON!");
      }
    }
  }
})
