var Letter = require("./Letters");

var Word = function (myWord) {
    this.myWord = myWord;
    this.letters = [];
    this.underscores = [];
    this.splitWord = function () {
        this.letters = this.myWord.split("");
        numberUnderscoresNeeded = this.letters.length;
        console.log(this.underscores.join(" "));
    }

    this.generateLetters = function () {
        for (i = 0; i < this.letters.length; i++) {
            this.letters[i] = new Letter(this.letters[i]);
            this.letters[i].showCharacter();
        }
    }
}

module.exports = Word;
