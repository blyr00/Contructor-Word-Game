var Word = require("./Word.js");
var inquirer = require("inquirer");
var clc = require('cli-color');
var figlet = require('figlet');
var isLetter = require('is-letter');

const boxen = require('boxen');

var incorrect = clc.red.bold;
var correct = clc.green.bold;
var gameTextColor = clc.cyanBright;
var userGuessedCorrectly = false;
var wordList = ["telephone", "carrier", "sprint", "cellular", "signal", "frequency", "spectrum", "capacity", "congestion"];

var randomWord;
var someWord;

var wins = 0;
var losses = 0;
var guessesRemaining = 10;

var userGuess = "";

var lettersAlreadyGuessedList = "";
var lettersAlreadyGuessedListArray = [];

var slotsFilledIn = 0;

figlet("Guessing Game", function (err, data) {
    if (err) {
        console.log('What did you just do?...');
        console.dir(err);
        return;
    }
    console.log(data)
    console.log(gameTextColor("Welcome to the Wheel of Fortune - minus the wheel!"));
    console.log(gameTextColor("Theme is... wireless industry terms."));

    var howToPlay =
        "==========================================================================================================" + "\r\n" +
        "How to play" + "\r\n" +
        "==========================================================================================================" + "\r\n" +
        "When prompted to enter a letter, press any letter (a-z) on the keyboard to guess a letter." + "\r\n" +
        "Keep guessing letters. When you guess a letter, your choice is either correct or incorrect." + "\r\n" +
        "If incorrect, the letter you guessed does not appear in the word." + "\r\n" +
        "For every incorrect guess, the number of guesses remaining decrease by 1." + "\r\n" +
        "If correct, the letter you guessed appears in the word." + "\r\n" +
        "If you correctly guess all the letters in the word before the number of guesses remaining reaches 0, you win." + "\r\n" +
        "If you run out of guesses before the entire word is revealed, you lose. Game over." + "\r\n" +
        "===========================================================================================================" + "\r\n" +
        "You can exit the game at any time by pressing Ctrl + C on your keyboard." + "\r\n" +
        "==========================================================================================================="
    console.log(gameTextColor(howToPlay));
    confirmStart();
});

function confirmStart() {
    var readyToStartGame = [
        {
            type: 'text',
            name: 'playerName',
            message: 'What is your name?'
        },
        {
            type: 'confirm',
            name: 'readyToPlay',
            message: 'Are you ready to play?',
            default: true
        }
    ];

    inquirer.prompt(readyToStartGame).then(answers => {
        if (answers.readyToPlay) {
            console.log(gameTextColor("Nice! Welcome, " + answers.playerName + ". Commence word guessing.."));
            startGame();
        }

        else {
            console.log(gameTextColor("Peace Out, " + answers.playerName + "! Come back when you're ready."));
            return;
        }
    });
}

function startGame() {
    guessesRemaining = 10;
    chooseRandomWord();
    lettersAlreadyGuessedList = "";
    lettersAlreadyGuessedListArray = [];
}

function chooseRandomWord() {
    randomWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
    someWord = new Word(randomWord);
    
    console.log(gameTextColor("Your word contains " + randomWord.length + " letters."));
    console.log(gameTextColor("WORD TO GUESS:"));

    someWord.splitWord();
    someWord.generateLetters();
    guessLetter();
}

function guessLetter() {
    if (slotsFilledIn < someWord.letters.length || guessesRemaining > 0) {
        inquirer.prompt([
            {
                name: "letter",
                message: "Guess a letter:",
                validate: function (value) {
                    if (isLetter(value)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        ]).then(function (guess) {
            guess.letter.toUpperCase();
            console.log(gameTextColor("You guessed: " + guess.letter.toUpperCase()));
            userGuessedCorrectly = false;

            if (lettersAlreadyGuessedListArray.indexOf(guess.letter.toUpperCase()) > -1) {
                console.log(gameTextColor("Come on now. Enter another one."));
                console.log(gameTextColor("====================================================================="));
                guessLetter();
            }

            else if (lettersAlreadyGuessedListArray.indexOf(guess.letter.toUpperCase()) === -1) {
                lettersAlreadyGuessedList = lettersAlreadyGuessedList.concat(" " + guess.letter.toUpperCase());
                lettersAlreadyGuessedListArray.push(guess.letter.toUpperCase());
                console.log(boxen(gameTextColor('Letters already guessed: ') + lettersAlreadyGuessedList, { padding: 1 }));

                for (i = 0; i < someWord.letters.length; i++) {
                    if (guess.letter.toUpperCase() === someWord.letters[i].character && someWord.letters[i].letterGuessedCorrectly === false) {
                        someWord.letters[i].letterGuessedCorrectly === true;
                        userGuessedCorrectly = true;
                        someWord.underscores[i] = guess.letter.toUpperCase();
                        slotsFilledIn++
                    }
                }
                console.log(gameTextColor("GO ON AND GUESS THE WORD:"));
                someWord.splitWord();
                someWord.generateLetters();

                if (userGuessedCorrectly) {
                    console.log(correct('GOOD GUESS!'));
                    console.log(gameTextColor("====================================================================="));
                    checkIfUserWon();
                }

                else {
                    console.log(incorrect('WRONG! GUESS AGAIN!'));
                    guessesRemaining--;
                    console.log(gameTextColor("You have " + guessesRemaining + " guesses left."));
                    console.log(gameTextColor("====================================================================="));
                    checkIfUserWon();
                }
            }
        });
    }
}

function checkIfUserWon() {
    if (guessesRemaining === 0) {
        console.log(gameTextColor("====================================================================="));
        console.log(incorrect('YOU WACK. YOU LOSE.'));
        console.log(gameTextColor("The correct word was: " + randomWord));
        losses++;
        console.log(gameTextColor("Victories: " + wins));
        console.log(gameTextColor("Defeats: " + losses));
        console.log(gameTextColor("====================================================================="));
        playAgain();
    }

    else if (slotsFilledIn === someWord.letters.length) {
        console.log(gameTextColor("====================================================================="));
        console.log(correct("YOU WON! Looks like you know your cellphone terminology!"));
        wins++;
        console.log(gameTextColor("Victories: " + wins));
        console.log(gameTextColor("Defeats: " + losses));
        console.log(gameTextColor("====================================================================="));
        playAgain();
    }

    else {
        guessLetter("");
    }

}

function playAgain() {
    var playGameAgain = [
        {
            type: 'confirm',
            name: 'playAgain',
            message: 'Do you want to play again?',
            default: true
        }
    ];

    inquirer.prompt(playGameAgain).then(userWantsTo => {
        if (userWantsTo.playAgain) {
            lettersAlreadyGuessedList = "";
            lettersAlreadyGuessedListArray = [];
            slotsFilledIn = 0;
            console.log(gameTextColor("Great! Welcome back. Let's begin..."));
            startGame();
        }

        else {
            console.log(gameTextColor("Fine then! Get outta here."));
            return;
        }
    });
}