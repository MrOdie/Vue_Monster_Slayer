new Vue({
    el: "#app",
    data: {
        playerHealth: 100,
        monsterHealth: 100,
        isQuitter: false,
        gameIsRunning: false,
        turns: [],
        specAttackLimit: 0,
        healLimit: 0,
        pickDifficulty: false,
        lucky: false
    },
    methods: {
        easy: function () {
            this.specAttackLimit = 10;
            this.healLimit = 10;

            this.pickDifficulty = true;
        },
        medium: function () {
            this.specAttackLimit = 7;
            this.healLimit = 7;

            this.pickDifficulty = true;
        },
        hard: function () {
            this.specAttackLimit = 4;
            this.healLimit = 4;

            this.pickDifficulty = true;
        },
        impossible: function () {
            this.specAttackLimit = 0;
            this.healLimit = 0;

            this.pickDifficulty = true;
        },
        luck: function () {
            var odds = Math.floor(Math.random() * 1000);
            console.log(odds);
            if (odds === 0) {
                this.monsterHealth = 1;
                this.playerHealth = 99;
            } else if (odds === 999) {
                this.playerHealth = 1;
                this.monsterHealth = 99
            } else {
                if (odds % 2 === 0){
                    if (odds > 400 && odds < 500) {
                        this.playerHealth = 100;
                        this.monsterHealth -= 10;
                    } else {
                        this.monsterHealth = 100;
                        this.playerHealth -= 10;
                    }
                } else {
                    if (odds > 600 && odds < 700){
                        this.specAttackLimit += 2;
                        this.healLimit += 2;
                    } else {
                        this.specAttackLimit = 0;
                        this.healLimit = 0;
                    }
                }
            }

            this.lucky = true;

        },
        startGame: function () {
            //this starts the game and resets all values
            this.gameIsRunning = true;
            this.isQuitter = false;
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.lucky = false;
            this.turns = []

        },
        attack: function () {
            // Player attacks first with minimal damage
            var damage = this.calculateDamage(3, 10);
            this.monsterHealth -= damage;

            // logs the players move
            this.turns.unshift({
                isPlayer: true,
                text: 'Player hits Monster for ' + damage + 'HP'
            });

            // checks to see if the player has won
            if (this.checkWin()) {
                return;
            }

            // if the player has not won, then we move to the monster's turn
            this.monsterAttacks();

            // check for winner
            this.checkWin();
        },
        specAttack: function (e) {
            //this is a special, stronger attack
            var damage = this.calculateDamage(10, 20);
            this.monsterHealth -= damage;

            // This logs the players move
            this.turns.unshift({
                isPlayer: true,
                text: 'Player hits Monster hard for ' + damage + 'HP'
            });

            // check for winner
            if (this.checkWin()) {
                return;
            }

            // monster attacks if player does not win
            this.monsterAttacks();

            // check for winner
            this.checkWin();

            // this limits the number of special attacks that a player can launch
            this.specAttackLimit--;
        },
        heal: function (e) {
            // player can heal himself or herself; inclusivity
            var heal;
            if (this.playerHealth === 100) {
                // if player heals at full health, player is an idiot
                // monster gets to attack twice
                this.monsterAttacks();
                // log player's stupidity
                this.turns.unshift({
                    isPlayer: true,
                    text: 'Idiot Player tried to heal at full health'
                });
                // monster is rewarded for player's stupidity
                this.monsterHealth += 20;
                // log monster's reward for player's stupidity
                this.turns.unshift({
                    isPlayer: false,
                    text: 'Monster is strengthened by Idiot Player\'s stupidity Idiot Player can no longer heal'
                });

                this.healLimit = 0;
                return;
            } else if (this.playerHealth >= 90 && this.playerHealth < 100) {
                // if player has bewtween 90 - 100 health, then health is bumped to 100
                this.playerHealth === 100;
                heal = 100 - this.playerHealth;
            } else {
                // if player health is < 90, player gets +10 HP
                this.playerHealth += 10;
                heal = 10;
            }

            // log action
            this.turns.unshift({
                isPlayer: true,
                text: 'Player heals for ' + heal + 'HP'
            });

            //monster attacks
            this.monsterAttacks();

            this.healLimit--;

        },
        wimp: function () {
            // you're quitter
            this.gameIsRunning = false;
            this.isQuitter = true;
        },
        monsterAttacks: function () {
            // monster is stronger than you, you wussy
            var damage = this.calculateDamage(5, 12);
            this.playerHealth -= damage;

            this.turns.unshift({
                isPlayer: false,
                text: 'Monster hits player for: ' + damage + 'HP'
            });

            this.checkWin();

            console.log("you've been attacked")
        },
        calculateDamage: function (min, max) {
            // calculate damage
            return Math.max(Math.floor(Math.random() * max) + 1, min);
        },
        checkWin: function () {
            // check to see if player or monster has won after move
            if (this.monsterHealth <= 0) {
                if (confirm("You won! New Game?")) {
                    this.startGame();
                    this.gameIsRunning = true;
                    this.pickDifficulty = !this.pickDifficulty;
                } else {
                    this.gameIsRunning = false;
                }
                return true;
            } else if (this.playerHealth <= 0) {
                if (confirm("LOSER! Want to lose again?")) {
                    this.startGame();
                    this.gameIsRunning = true;
                    this.pickDifficulty = !this.pickDifficulty;
                } else {
                    this.gameIsRunning = false;
                }
                return true;
            } else {
                return false;
            }
        }
    }
});