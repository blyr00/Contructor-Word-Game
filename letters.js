var Letter = function (character) {
    this.character = character.toUpperCase();
    this.letterGuessedCorrectly = false;
    this.showCharacter = function () {
        if (this.letterGuessedCorrectly) {
            console.log(this.character);
        }
        else {
            console.log ("_");
        }

    }
}

module.exports = Letter